/**
 * AutoUGC Enterprise DevOps Rollback & Canary Release Engine
 *
 * Implements:
 * - Versioned immutable release registry
 * - Automated canary health metrics evaluation
 * - Zero-downtime emergency rollback triggering
 * - Cryptographic SHA-256 rollback verification audit trail
 */

import crypto from "crypto";

export type DeploymentEnvironment = "development" | "staging" | "production" | "test";

export type ReleaseStatus = "active" | "canary" | "superseded" | "rolled_back" | "failed";

export interface CanaryMetrics {
  errorRatePercent: number; // Max allowed: 1.0%
  p99LatencyMs: number;     // Max allowed: 1200ms
  healthyPodsRatio: number; // Min required: 1.0 (100%)
  syntheticProbePassed: boolean;
}

export interface ReleaseRecord {
  id: string;
  version: string;
  commitSha: string;
  environment: DeploymentEnvironment;
  deployedAt: string;
  status: ReleaseStatus;
  deployedBy: string;
  canaryMetrics?: CanaryMetrics;
  rollbackMetadata?: {
    rolledBackAt: string;
    targetReleaseId: string;
    reason: string;
    triggeredBy: string;
    auditSignature: string;
  };
}

export interface RollbackResult {
  success: boolean;
  rollbackId: string;
  previousReleaseId: string;
  targetReleaseId: string;
  targetVersion: string;
  targetCommitSha: string;
  reason: string;
  auditSignature: string;
  timestamp: string;
}

// In-memory persistent release registry with stable production baseline
class ReleaseRegistry {
  private static instance: ReleaseRegistry;
  private releases: ReleaseRecord[] = [];

  private constructor() {
    this.seedInitialStableReleases();
  }

  public static getInstance(): ReleaseRegistry {
    if (!ReleaseRegistry.instance) {
      ReleaseRegistry.instance = new ReleaseRegistry();
    }
    return ReleaseRegistry.instance;
  }

  private seedInitialStableReleases(): void {
    const baselineProduction: ReleaseRecord = {
      id: "rel_prod_stable_baseline_01",
      version: "v0.1.0",
      commitSha: "8f7e2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
      environment: "production",
      deployedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "active",
      deployedBy: "ci-cd-pipeline",
      canaryMetrics: {
        errorRatePercent: 0.08,
        p99LatencyMs: 340,
        healthyPodsRatio: 1.0,
        syntheticProbePassed: true,
      },
    };

    const baselineStaging: ReleaseRecord = {
      id: "rel_staging_stable_baseline_01",
      version: "v0.1.0",
      commitSha: "8f7e2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
      environment: "staging",
      deployedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: "active",
      deployedBy: "ci-cd-pipeline",
      canaryMetrics: {
        errorRatePercent: 0.12,
        p99LatencyMs: 290,
        healthyPodsRatio: 1.0,
        syntheticProbePassed: true,
      },
    };

    this.releases.push(baselineProduction, baselineStaging);
  }

  public getHistory(environment: DeploymentEnvironment = "production"): ReleaseRecord[] {
    return this.releases
      .filter((r) => r.environment === environment)
      .sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());
  }

  public getActiveRelease(environment: DeploymentEnvironment = "production"): ReleaseRecord | null {
    return this.releases.find((r) => r.environment === environment && r.status === "active") || null;
  }

  public registerRelease(params: {
    version: string;
    commitSha: string;
    environment: DeploymentEnvironment;
    deployedBy: string;
    canaryMetrics?: CanaryMetrics;
  }): ReleaseRecord {
    const id = `rel_${params.environment}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;

    // Mark previous active release as superseded
    const active = this.getActiveRelease(params.environment);
    if (active) {
      active.status = "superseded";
    }

    const newRelease: ReleaseRecord = {
      id,
      version: params.version,
      commitSha: params.commitSha,
      environment: params.environment,
      deployedAt: new Date().toISOString(),
      status: "active",
      deployedBy: params.deployedBy,
      canaryMetrics: params.canaryMetrics,
    };

    this.releases.unshift(newRelease);
    return newRelease;
  }

  public executeRollback(params: {
    environment: DeploymentEnvironment;
    targetReleaseId?: string;
    reason: string;
    triggeredBy: string;
  }): RollbackResult {
    const envHistory = this.getHistory(params.environment);
    const currentActive = this.getActiveRelease(params.environment);

    if (!currentActive) {
      throw new Error(`No active release found for environment: ${params.environment}`);
    }

    let targetRelease: ReleaseRecord | undefined;

    if (params.targetReleaseId) {
      targetRelease = envHistory.find((r) => r.id === params.targetReleaseId);
      if (!targetRelease) {
        throw new Error(`Target release not found: ${params.targetReleaseId}`);
      }
    } else {
      // Find the most recent superseded or previously stable release
      targetRelease = envHistory.find(
        (r) => r.id !== currentActive.id && (r.status === "superseded" || r.status === "active")
      );
    }

    if (!targetRelease) {
      throw new Error(`No viable historical release found to rollback to in ${params.environment}`);
    }

    // Generate cryptographic audit signature
    const auditPayload = `${currentActive.id}:${targetRelease.id}:${params.reason}:${Date.now()}`;
    const auditSignature = crypto.createHash("sha256").update(auditPayload).digest("hex");

    // Update statuses
    currentActive.status = "rolled_back";
    currentActive.rollbackMetadata = {
      rolledBackAt: new Date().toISOString(),
      targetReleaseId: targetRelease.id,
      reason: params.reason,
      triggeredBy: params.triggeredBy,
      auditSignature,
    };

    targetRelease.status = "active";

    const rollbackId = `rb_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    return {
      success: true,
      rollbackId,
      previousReleaseId: currentActive.id,
      targetReleaseId: targetRelease.id,
      targetVersion: targetRelease.version,
      targetCommitSha: targetRelease.commitSha,
      reason: params.reason,
      auditSignature,
      timestamp: new Date().toISOString(),
    };
  }

  public resetToBaseline(): void {
    this.releases = [];
    this.seedInitialStableReleases();
  }
}

export const releaseRegistry = ReleaseRegistry.getInstance();

/**
 * Canary Health Evaluation Logic
 * Evaluates real-time telemetry from canary pods to determine safety of full rollout.
 */
export function evaluateCanaryHealth(metrics: CanaryMetrics): {
  isHealthy: boolean;
  failureReasons: string[];
} {
  const failureReasons: string[] = [];

  if (metrics.errorRatePercent > 1.0) {
    failureReasons.push(`Error rate (${metrics.errorRatePercent.toFixed(2)}%) exceeds threshold (1.00%)`);
  }

  if (metrics.p99LatencyMs > 1200) {
    failureReasons.push(`P99 latency (${metrics.p99LatencyMs}ms) exceeds threshold (1200ms)`);
  }

  if (metrics.healthyPodsRatio < 1.0) {
    failureReasons.push(`Healthy pod ratio (${(metrics.healthyPodsRatio * 100).toFixed(0)}%) is under 100%`);
  }

  if (!metrics.syntheticProbePassed) {
    failureReasons.push("Synthetic healthcheck probe failed against canary endpoint");
  }

  return {
    isHealthy: failureReasons.length === 0,
    failureReasons,
  };
}

/**
 * Helper to trigger emergency rollback via programmatic control
 */
export function triggerEmergencyRollback(
  environment: DeploymentEnvironment = "production",
  reason: string = "Automated canary health violation",
  triggeredBy: string = "canary-daemon"
): RollbackResult {
  return releaseRegistry.executeRollback({
    environment,
    reason,
    triggeredBy,
  });
}
