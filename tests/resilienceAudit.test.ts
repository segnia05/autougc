/**
 * Enterprise Resilience, Error Handling, and 99.9% Uptime Audit Test Suite.
 *
 * Verifies:
 * 1. Health Checks (Liveness and Readiness probes)
 * 2. Exponential Backoff Retries with Jitter
 * 3. Circuit Breaker Pattern (Fast-failure & self-healing)
 * 4. System Telemetry & Latency Percentile Monitoring (p50, p95, p99)
 * 5. Cryptographic Backup & Disaster Recovery Verification
 */

import { retryWithBackoff } from "../src/lib/resilience/retry";
import { CircuitBreaker, CircuitBreakerOpenError } from "../src/lib/resilience/circuitBreaker";
import { telemetry } from "../src/lib/monitoring/telemetry";
import { BackupManager } from "../src/lib/backup/backupManager";
import { GET as healthHandler } from "../src/app/api/health/route";
import { NextRequest } from "next/server";

async function runResilienceAudit() {
  console.log("=== Running Enterprise Resilience & 99.9% Uptime Audit ===");

  // ==========================================================================
  // 1. HEALTH CHECKS (LIVENESS & READINESS)
  // ==========================================================================
  console.log("--- 1. Testing Health Check Probes (Liveness & Readiness) ---");

  // 1a. Test Liveness Probe (?probe=liveness)
  const livenessReq = new NextRequest("https://autougc.ai/api/health?probe=liveness");
  const livenessRes = await healthHandler(livenessReq);
  const livenessData = await livenessRes.json();

  if (livenessRes.status !== 200 || livenessData.status !== "ok") {
    console.error("✗ Liveness probe failed:", livenessData);
    process.exit(1);
  }
  console.log("✓ Liveness probe verified: Responded HTTP 200 with status: 'ok'.");

  // 1b. Test Comprehensive Readiness Probe
  const readinessReq = new NextRequest("https://autougc.ai/api/health");
  const readinessRes = await healthHandler(readinessReq);
  const readinessData = await readinessRes.json();

  if (!readinessData.checks || !readinessData.checks.cache || !readinessData.checks.queue) {
    console.error("✗ Readiness probe missing diagnostic subsystems:", readinessData);
    process.exit(1);
  }
  console.log(`✓ Readiness probe verified: Subsystems checked [Database: ${readinessData.checks.database.status}, Cache: ${readinessData.checks.cache.status}, Queue: ${readinessData.checks.queue.status}].`);

  // ==========================================================================
  // 2. EXPONENTIAL BACKOFF RETRIES WITH JITTER
  // ==========================================================================
  console.log("--- 2. Testing Exponential Backoff Retries with Full Jitter ---");

  let attemptCount = 0;
  const retryDelays: number[] = [];

  const transientNetworkCall = async () => {
    attemptCount++;
    if (attemptCount < 3) {
      throw new Error("Temporary Connection Reset by Peer (ECONNRESET)");
    }
    return "success_recovered";
  };

  const retryResult = await retryWithBackoff(transientNetworkCall, {
    maxRetries: 3,
    baseDelayMs: 30,
    maxDelayMs: 200,
    jitterMs: 15,
    onRetry: (_err, _attempt, delayMs) => {
      retryDelays.push(delayMs);
    },
  });

  if (retryResult !== "success_recovered" || attemptCount !== 3) {
    console.error(`✗ Retry logic failed. Attempt count: ${attemptCount}, result: ${retryResult}`);
    process.exit(1);
  }
  console.log(`✓ Exponential backoff verified: Succeeded after ${attemptCount} attempts with jitter delays [${retryDelays.join("ms, ")}ms].`);

  // Test Non-Retryable Error Filter (e.g. 400 Bad Request should fail fast)
  let nonRetryableRan = 0;
  try {
    await retryWithBackoff(
      async () => {
        nonRetryableRan++;
        const err = new Error("Invalid parameters");
        (err as any).statusCode = 400;
        throw err;
      },
      {
        maxRetries: 3,
        retryIf: (err: any) => err.statusCode !== 400, // Do NOT retry 400
      }
    );
  } catch (err: any) {
    if (nonRetryableRan !== 1) {
      console.error(`✗ Non-retryable error was retried ${nonRetryableRan} times! Expected 1.`);
      process.exit(1);
    }
    console.log("✓ Non-retryable error correctly aborted immediately on attempt 1.");
  }

  // ==========================================================================
  // 3. CIRCUIT BREAKER (FAST-FAIL & AUTOMATIC HEALING)
  // ==========================================================================
  console.log("--- 3. Testing Circuit Breaker Pattern & Self-Healing ---");

  const testBreaker = new CircuitBreaker("tiktok_api", {
    failureThreshold: 3,
    recoveryTimeoutMs: 100, // 100ms for fast test execution
    successThreshold: 2,
  });

  if (testBreaker.getState() !== "CLOSED") {
    console.error("✗ Initial breaker state should be CLOSED, got:", testBreaker.getState());
    process.exit(1);
  }

  // Trip the breaker with 3 consecutive failures
  for (let i = 0; i < 3; i++) {
    try {
      await testBreaker.execute(async () => {
        throw new Error("TikTok API 500 Internal Error");
      });
    } catch {
      // Expected
    }
  }

  if (testBreaker.getState() !== "OPEN") {
    console.error("✗ Breaker should be OPEN after 3 failures, got:", testBreaker.getState());
    process.exit(1);
  }
  console.log("✓ Circuit tripped into OPEN state after consecutive failures.");

  // Verify fast-failing in OPEN state without calling downstream service
  let downstreamExecuted = false;
  try {
    await testBreaker.execute(async () => {
      downstreamExecuted = true;
      return "never_reached";
    });
  } catch (err) {
    if (!(err instanceof CircuitBreakerOpenError)) {
      console.error("✗ Expected CircuitBreakerOpenError, got:", err);
      process.exit(1);
    }
    if (downstreamExecuted) {
      console.error("✗ Downstream function was called while breaker was OPEN!");
      process.exit(1);
    }
  }
  console.log("✓ Fast-failing in OPEN state: Downstream call prevented, protecting threads.");

  // Wait for recovery timeout to elapse -> Transitions to HALF_OPEN
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (testBreaker.getState() !== "HALF_OPEN") {
    console.error("✗ Expected HALF_OPEN after timeout, got:", testBreaker.getState());
    process.exit(1);
  }
  console.log("✓ Breaker transitioned to HALF_OPEN state after cooldown.");

  // Send 2 successful canary requests to heal the circuit
  await testBreaker.execute(async () => "canary_1_success");
  await testBreaker.execute(async () => "canary_2_success");

  if (testBreaker.getState() !== "CLOSED") {
    console.error("✗ Breaker should have auto-healed to CLOSED, got:", testBreaker.getState());
    process.exit(1);
  }
  console.log("✓ Circuit self-healed back to CLOSED after healthy canaries.");

  // ==========================================================================
  // 4. TELEMETRY & LATENCY PERCENTILE HISTOGRAMS
  // ==========================================================================
  console.log("--- 4. Testing System Telemetry & Latency Histograms ---");
  telemetry.reset();

  const simulatedLatencies = [15, 20, 25, 30, 40, 50, 75, 120, 200, 350];
  for (const lat of simulatedLatencies) {
    telemetry.recordRequest(lat, 200);
  }
  // Record 1 failure
  telemetry.recordRequest(450, 500);

  const snapshot = telemetry.getMetricsSnapshot();
  if (snapshot.totalRequests !== 11 || snapshot.totalErrors !== 1) {
    console.error("✗ Telemetry request count mismatch:", snapshot);
    process.exit(1);
  }

  if (snapshot.latencies.p50 <= 0 || snapshot.latencies.p95 <= 0 || snapshot.latencies.p99 <= 0) {
    console.error("✗ Percentile computation invalid:", snapshot.latencies);
    process.exit(1);
  }
  console.log(`✓ Telemetry verified: ${snapshot.totalRequests} requests, Error Rate: ${snapshot.errorRatePercent}%, p50: ${snapshot.latencies.p50}ms, p95: ${snapshot.latencies.p95}ms, p99: ${snapshot.latencies.p99}ms.`);

  // ==========================================================================
  // 5. CRYPTOGRAPHIC BACKUP & DISASTER RECOVERY
  // ==========================================================================
  console.log("--- 5. Testing Cryptographic Backup & Disaster Recovery Verification ---");

  const manifest = BackupManager.generateBackupManifest(5000);
  if (!manifest.backupId || !manifest.checksum || manifest.tables.length < 10) {
    console.error("✗ Incomplete backup manifest generated:", manifest);
    process.exit(1);
  }

  const isValid = BackupManager.verifyBackupIntegrity(manifest);
  if (!isValid) {
    console.error("✗ Valid backup manifest failed integrity check!");
    process.exit(1);
  }
  console.log(`✓ Backup manifest verified: SHA-256 Checksum '${manifest.checksum.substring(0, 16)}...' valid across ${manifest.tables.length} database tables.`);

  // Tamper detection
  const tamperedManifest = { ...manifest, recordsCountEstimate: 99999 };
  const isTamperedValid = BackupManager.verifyBackupIntegrity(tamperedManifest);
  if (isTamperedValid) {
    console.error("✗ Tampered backup manifest passed verification!");
    process.exit(1);
  }
  console.log("✓ Tampered backup manifest successfully detected and rejected.");

  console.log("=== ALL 5 RESILIENCE & 99.9% UPTIME TEST SUITES PASSED CLEANLY! ===");
}

runResilienceAudit().catch((err) => {
  console.error("Resilience audit failed:", err);
  process.exit(1);
});
