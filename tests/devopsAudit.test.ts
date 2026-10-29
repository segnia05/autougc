/**
 * AutoUGC Enterprise DevOps & Deployment Infrastructure Test Suite
 *
 * Verifies:
 * 1. Environment Management (Zod runtime validation, multi-stage envs, production readiness)
 * 2. Containerization Hardening (Dockerfile multi-stage, non-root runner, healthcheck, .dockerignore)
 * 3. Local/Staging Parity (docker-compose, Prometheus scraping)
 * 4. Kubernetes Production Manifests (Zero-downtime RollingUpdate, Probes, HPA, Alerts)
 * 5. CI/CD Matrix Automation (GitHub Actions workflows)
 * 6. Rollback & Canary Engine (Canary evaluation, version history, emergency rollback, SHA-256 audit trail)
 * 7. DevOps Rollback API Route (/api/v1/devops/rollback)
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  validateEnvironment,
  assertProductionReadiness,
  type Environment,
} from "../src/lib/devops/envConfig";
import {
  releaseRegistry,
  evaluateCanaryHealth,
  triggerEmergencyRollback,
} from "../src/lib/devops/rollbackManager";
import { GET as devopsGet, POST as devopsPost } from "../src/app/api/v1/devops/rollback/route";
import { NextRequest } from "next/server";

const PROJECT_ROOT = path.resolve(__dirname, "..");

async function runDevopsAuditSuite() {
  console.log("\n========================================================");
  console.log("   AutoUGC Enterprise DevOps & Deployment Audit Suite   ");
  console.log("========================================================\n");

  let passedTests = 0;

  // ---------------------------------------------------------------------------
  // Test 1: Environment Management & Zod Schema Validation
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 1] Environment Management & Schema Validation...");
  {
    // Valid development environment config
    const devEnv = validateEnvironment({
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://test:test@localhost:5432/autougc_dev",
      PORT: "3000",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
    assert.strictEqual(devEnv.NODE_ENV, "development");
    assert.strictEqual(devEnv.PORT, 3000);
    assert.strictEqual(devEnv.NEXT_PUBLIC_APP_URL, "http://localhost:3000");

    // Rejection of invalid NODE_ENV
    assert.throws(
      () => {
        validateEnvironment({
          NODE_ENV: "invalid_env" as unknown as Environment,
          DATABASE_URL: "postgresql://test:test@localhost:5432/autougc_dev",
        });
      },
      /Invalid environment variables/,
      "Expected Zod to reject non-whitelisted NODE_ENV"
    );

    // Rejection of invalid DATABASE_URL
    assert.throws(
      () => {
        validateEnvironment({
          NODE_ENV: "production",
          DATABASE_URL: "not_a_valid_postgres_url",
        });
      },
      /Invalid environment variables/,
      "Expected Zod to reject malformed DATABASE_URL"
    );

    // Production readiness checks
    const prodEnvValid = {
      NODE_ENV: "production" as const,
      PORT: 3000,
      DATABASE_URL: "postgresql://user:pass@prod-db.neon.tech/prod",
      NEXT_PUBLIC_APP_URL: "https://autougc.com",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_realKey12345678",
      CLERK_SECRET_KEY: "sk_live_realSecretKey12345678",
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_live_realStripeKey1234",
      STRIPE_SECRET_KEY: "sk_live_realStripeSecretKey1234",
      STRIPE_WEBHOOK_SECRET: "whsec_realWebhookSecret1234",
      GEMINI_API_KEY: "AIzaSyRealGeminiKey12345678",
      REDIS_URL: "rediss://default:pass@redis.prod:6379",
      DEVOPS_ROLLBACK_API_KEY: "sec_prod_devops_key_abc123",
      SENTRY_ENVIRONMENT: "production",
      DATADOG_AGENT_HOST: "datadog-agent",
      DATADOG_AGENT_PORT: 8125,
      CI: false,
    };

    const prodCheck = assertProductionReadiness(prodEnvValid);
    assert.strictEqual(prodCheck.isReady, true, "Valid production config should pass readiness check");
    assert.strictEqual(prodCheck.issues.length, 0);

    // Detect placeholder secrets in production
    const prodEnvPlaceholder = {
      ...prodEnvValid,
      CLERK_SECRET_KEY: "sk_live_CHANGE_ME",
      STRIPE_SECRET_KEY: "sk_test_placeholder",
    };
    const prodCheckPlaceholder = assertProductionReadiness(prodEnvPlaceholder);
    assert.strictEqual(prodCheckPlaceholder.isReady, false, "Placeholder secrets must fail production readiness");
    assert(prodCheckPlaceholder.issues.length >= 2, "Expected multiple issues flagged for placeholder secrets");

    passedTests++;
    console.log("  ✔ Environment validation & production readiness assertions passed.");
  }

  // ---------------------------------------------------------------------------
  // Test 2: Production Dockerfile & Container Hardening
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 2] Containerization Hardening (Dockerfile & .dockerignore)...");
  {
    const dockerfilePath = path.join(PROJECT_ROOT, "Dockerfile");
    const dockerignorePath = path.join(PROJECT_ROOT, ".dockerignore");

    assert(fs.existsSync(dockerfilePath), "Dockerfile must exist at repository root");
    assert(fs.existsSync(dockerignorePath), ".dockerignore must exist at repository root");

    const dockerfileContent = fs.readFileSync(dockerfilePath, "utf-8");
    const dockerignoreContent = fs.readFileSync(dockerignorePath, "utf-8");

    // Multi-stage verification
    assert(dockerfileContent.includes("FROM node:20-alpine AS base"), "Dockerfile must use node:20-alpine base");
    assert(dockerfileContent.includes("FROM base AS deps"), "Dockerfile must include deps stage");
    assert(dockerfileContent.includes("FROM base AS builder"), "Dockerfile must include builder stage");
    assert(dockerfileContent.includes("FROM base AS runner"), "Dockerfile must include runner stage");

    // Non-root security verification
    assert(dockerfileContent.includes("USER nextjs"), "Dockerfile runner must run as non-root 'USER nextjs'");
    assert(dockerfileContent.includes("addgroup --system --gid 1001 nodejs"), "Dockerfile must create nodejs group (1001)");
    assert(dockerfileContent.includes("adduser --system --uid 1001 nextjs"), "Dockerfile must create nextjs user (1001)");

    // Native container healthcheck verification
    assert(dockerfileContent.includes("HEALTHCHECK"), "Dockerfile must specify native HEALTHCHECK instruction");
    assert(dockerfileContent.includes("/api/health?probe=liveness"), "Dockerfile HEALTHCHECK must probe liveness endpoint");

    // .dockerignore exclusions
    assert(dockerignoreContent.includes("node_modules"), ".dockerignore must ignore node_modules");
    assert(dockerignoreContent.includes(".next"), ".dockerignore must ignore .next build directory");
    assert(dockerignoreContent.includes(".env*"), ".dockerignore must ignore local environment secrets");
    assert(dockerignoreContent.includes("tests"), ".dockerignore must ignore test directory");

    passedTests++;
    console.log("  ✔ Multi-stage Dockerfile, non-root security context, and .dockerignore verified.");
  }

  // ---------------------------------------------------------------------------
  // Test 3: Local & Staging Parity (docker-compose & prometheus.yml)
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 3] Local & Staging Parity (docker-compose.yml & prometheus.yml)...");
  {
    const composePath = path.join(PROJECT_ROOT, "docker-compose.yml");
    const promPath = path.join(PROJECT_ROOT, "prometheus.yml");

    assert(fs.existsSync(composePath), "docker-compose.yml must exist at repository root");
    assert(fs.existsSync(promPath), "prometheus.yml must exist at repository root");

    const composeContent = fs.readFileSync(composePath, "utf-8");
    const promContent = fs.readFileSync(promPath, "utf-8");

    // Services check
    assert(composeContent.includes("app:"), "Compose must define 'app' service");
    assert(composeContent.includes("postgres:"), "Compose must define 'postgres' service");
    assert(composeContent.includes("redis:"), "Compose must define 'redis' service");
    assert(composeContent.includes("prometheus:"), "Compose must define 'prometheus' service");

    // Healthcheck dependency gating
    assert(composeContent.includes("condition: service_healthy"), "App service must wait for dependencies to be healthy");

    // Prometheus scraping configuration
    assert(promContent.includes("/api/metrics"), "Prometheus must scrape '/api/metrics'");
    assert(promContent.includes("autougc-saas"), "Prometheus job must be named autougc-saas");

    passedTests++;
    console.log("  ✔ docker-compose and Prometheus scrape manifests verified.");
  }

  // ---------------------------------------------------------------------------
  // Test 4: Kubernetes Production Manifests
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 4] Kubernetes Manifests (RollingUpdate, Probes, HPA, Alerts)...");
  {
    const k8sDir = path.join(PROJECT_ROOT, "k8s");
    assert(fs.existsSync(k8sDir), "k8s manifest directory must exist");

    const deployment = fs.readFileSync(path.join(k8sDir, "deployment.yaml"), "utf-8");
    const service = fs.readFileSync(path.join(k8sDir, "service.yaml"), "utf-8");
    const ingress = fs.readFileSync(path.join(k8sDir, "ingress.yaml"), "utf-8");
    const hpa = fs.readFileSync(path.join(k8sDir, "hpa.yaml"), "utf-8");
    const alerts = fs.readFileSync(path.join(k8sDir, "prometheus-alerts.yaml"), "utf-8");

    // Deployment: Zero-downtime rolling update check
    assert(deployment.includes("type: RollingUpdate"), "Deployment must use RollingUpdate strategy");
    assert(deployment.includes("maxUnavailable: 0"), "RollingUpdate must guarantee zero unavailability (maxUnavailable: 0)");
    assert(deployment.includes("maxSurge: 25%"), "RollingUpdate must allow surge pods during transition");

    // Deployment: Hardened securityContext
    assert(deployment.includes("runAsNonRoot: true"), "Deployment must enforce runAsNonRoot");
    assert(deployment.includes("readOnlyRootFilesystem: true"), "Deployment must enforce readOnlyRootFilesystem");
    assert(deployment.includes("allowPrivilegeEscalation: false"), "Deployment must prevent privilege escalation");

    // Deployment: Probes
    assert(deployment.includes("livenessProbe:"), "Deployment must configure livenessProbe");
    assert(deployment.includes("readinessProbe:"), "Deployment must configure readinessProbe");
    assert(deployment.includes("path: /api/health?probe=liveness"), "Liveness probe must target /api/health?probe=liveness");

    // Service & Ingress
    assert(service.includes("kind: Service"), "Service manifest must be defined");
    assert(ingress.includes("kind: Ingress"), "Ingress manifest must be defined");
    assert(ingress.includes("cert-manager.io/cluster-issuer"), "Ingress must use cert-manager TLS");

    // HPA: Autoscaling bounds
    assert(hpa.includes("minReplicas: 3"), "HPA must define minReplicas >= 3 for high availability");
    assert(hpa.includes("maxReplicas: 30"), "HPA must define maxReplicas: 30");

    // Prometheus alerts
    assert(alerts.includes("AutoUGCHighErrorRate"), "PrometheusRule must define AutoUGCHighErrorRate");
    assert(alerts.includes("AutoUGCP99LatencyCritical"), "PrometheusRule must define AutoUGCP99LatencyCritical");
    assert(alerts.includes("AutoUGCPodCrashLooping"), "PrometheusRule must define AutoUGCPodCrashLooping");

    passedTests++;
    console.log("  ✔ Kubernetes manifests (RollingUpdate, securityContext, probes, HPA, PrometheusRule) verified.");
  }

  // ---------------------------------------------------------------------------
  // Test 5: CI/CD GitHub Actions Workflows
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 5] GitHub Actions CI/CD Pipelines...");
  {
    const ciPath = path.join(PROJECT_ROOT, ".github", "workflows", "ci.yml");
    const cdPath = path.join(PROJECT_ROOT, ".github", "workflows", "deploy.yml");

    assert(fs.existsSync(ciPath), "ci.yml must exist in .github/workflows/");
    assert(fs.existsSync(cdPath), "deploy.yml must exist in .github/workflows/");

    const ciContent = fs.readFileSync(ciPath, "utf-8");
    const cdContent = fs.readFileSync(cdPath, "utf-8");

    // CI jobs
    assert(ciContent.includes("lint-and-typecheck:"), "CI workflow must have lint-and-typecheck job");
    assert(ciContent.includes("security-audit:"), "CI workflow must have security-audit job");
    assert(ciContent.includes("test-suites:"), "CI workflow must have test-suites job");
    assert(ciContent.includes("container-build-verification:"), "CI workflow must verify Docker build");

    // CD stages
    assert(cdContent.includes("deploy-staging:"), "CD workflow must define staging deployment");
    assert(cdContent.includes("deploy-production-canary:"), "CD workflow must define canary deployment");
    assert(cdContent.includes("emergency-rollback:"), "CD workflow must define automated emergency rollback step");

    passedTests++;
    console.log("  ✔ CI/CD matrix workflows (.github/workflows/ci.yml and deploy.yml) verified.");
  }

  // ---------------------------------------------------------------------------
  // Test 6: Rollback & Canary Engine (rollbackManager.ts)
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 6] Rollback & Canary Engine Operations...");
  {
    releaseRegistry.resetToBaseline();

    // 1. Canary Health Evaluation
    const healthyMetrics = {
      errorRatePercent: 0.15,
      p99LatencyMs: 420,
      healthyPodsRatio: 1.0,
      syntheticProbePassed: true,
    };
    const healthResult = evaluateCanaryHealth(healthyMetrics);
    assert.strictEqual(healthResult.isHealthy, true, "Healthy canary metrics must pass");
    assert.strictEqual(healthResult.failureReasons.length, 0);

    const degradedMetrics = {
      errorRatePercent: 2.45, // > 1.0%
      p99LatencyMs: 1450,    // > 1200ms
      healthyPodsRatio: 0.8,  // < 100%
      syntheticProbePassed: false,
    };
    const degradedResult = evaluateCanaryHealth(degradedMetrics);
    assert.strictEqual(degradedResult.isHealthy, false, "Degraded canary must fail evaluation");
    assert.strictEqual(degradedResult.failureReasons.length, 4, "All 4 degraded conditions must be detected");

    // 2. Register New Release
    const newRelease = releaseRegistry.registerRelease({
      version: "v0.2.0-canary",
      commitSha: "11223344556677889900aabbccddeeff11223344",
      environment: "production",
      deployedBy: "ci-cd-bot",
      canaryMetrics: healthyMetrics,
    });
    assert.strictEqual(newRelease.version, "v0.2.0-canary");
    assert.strictEqual(newRelease.status, "active");

    const activeRelease = releaseRegistry.getActiveRelease("production");
    assert.strictEqual(activeRelease?.id, newRelease.id);

    // 3. Trigger Emergency Rollback
    const rollback = triggerEmergencyRollback("production", "Canary error rate spike detected", "sentry-alert-webhook");
    assert.strictEqual(rollback.success, true);
    assert.strictEqual(rollback.previousReleaseId, newRelease.id);
    assert.strictEqual(rollback.targetVersion, "v0.1.0", "Should roll back to baseline v0.1.0");
    assert(rollback.auditSignature.length === 64, "Rollback must produce a valid 64-char SHA-256 signature");

    // Verify state post-rollback
    const currentActiveAfterRollback = releaseRegistry.getActiveRelease("production");
    assert.strictEqual(currentActiveAfterRollback?.version, "v0.1.0");
    assert.strictEqual(currentActiveAfterRollback?.status, "active");

    passedTests++;
    console.log("  ✔ Canary evaluation, deployment registry, and emergency rollback mechanics verified.");
  }

  // ---------------------------------------------------------------------------
  // Test 7: DevOps Rollback API Route
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 7] DevOps Rollback API Endpoint (/api/v1/devops/rollback)...");
  {
    // GET endpoint: fetch history
    const getReq = new NextRequest("http://localhost:3000/api/v1/devops/rollback?env=production", {
      headers: { Authorization: "Bearer sec_devops_CHANGE_ME_KEY" },
    });
    const getRes = await devopsGet(getReq);
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.environment, "production");
    assert(getData.historyCount >= 2);
    assert.strictEqual(getData.activeRelease.version, "v0.1.0");

    // POST endpoint: evaluate canary
    const canaryReq = new NextRequest("http://localhost:3000/api/v1/devops/rollback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sec_devops_CHANGE_ME_KEY",
      },
      body: JSON.stringify({
        action: "evaluate_canary",
        environment: "production",
        canaryMetrics: {
          errorRatePercent: 0.05,
          p99LatencyMs: 310,
          healthyPodsRatio: 1.0,
          syntheticProbePassed: true,
        },
      }),
    });
    const canaryRes = await devopsPost(canaryReq);
    assert.strictEqual(canaryRes.status, 200);
    const canaryData = await canaryRes.json();
    assert.strictEqual(canaryData.evaluation.isHealthy, true);

    // POST endpoint: register new version & rollback
    const registerReq = new NextRequest("http://localhost:3000/api/v1/devops/rollback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sec_devops_CHANGE_ME_KEY",
      },
      body: JSON.stringify({
        action: "register",
        environment: "staging",
        version: "v0.3.0-rc1",
        commitSha: "aabbccddeeff00112233445566778899aabbccdd",
        deployedBy: "devops-lead",
      }),
    });
    const registerRes = await devopsPost(registerReq);
    assert.strictEqual(registerRes.status, 200);
    const registerData = await registerRes.json();
    assert.strictEqual(registerData.release.version, "v0.3.0-rc1");

    // Trigger rollback in staging
    const rollbackReq = new NextRequest("http://localhost:3000/api/v1/devops/rollback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sec_devops_CHANGE_ME_KEY",
      },
      body: JSON.stringify({
        action: "rollback",
        environment: "staging",
        reason: "Staging integration test failure",
        triggeredBy: "github-actions-cd",
      }),
    });
    const rollbackRes = await devopsPost(rollbackReq);
    assert.strictEqual(rollbackRes.status, 200);
    const rollbackData = await rollbackRes.json();
    assert.strictEqual(rollbackData.success, true);
    assert.strictEqual(rollbackData.rollback.targetVersion, "v0.1.0");

    passedTests++;
    console.log("  ✔ DevOps API route (GET history, POST canary eval, POST register, POST rollback) verified.");
  }

  // ---------------------------------------------------------------------------
  // Test 8: Shell Deployment & Rollback Scripts Verification
  // ---------------------------------------------------------------------------
  console.log("▶ [Test 8] Shell Deployment & Rollback Scripts...");
  {
    const deployScriptPath = path.join(PROJECT_ROOT, "scripts", "deploy.sh");
    const rollbackScriptPath = path.join(PROJECT_ROOT, "scripts", "rollback.sh");

    assert(fs.existsSync(deployScriptPath), "scripts/deploy.sh must exist");
    assert(fs.existsSync(rollbackScriptPath), "scripts/rollback.sh must exist");

    const deployScript = fs.readFileSync(deployScriptPath, "utf-8");
    const rollbackScript = fs.readFileSync(rollbackScriptPath, "utf-8");

    assert(deployScript.includes("kubectl rollout status"), "deploy.sh must monitor rollout status");
    assert(deployScript.includes("rollback.sh"), "deploy.sh must trigger rollback on failure");

    assert(rollbackScript.includes("kubectl rollout undo"), "rollback.sh must call kubectl rollout undo");
    assert(rollbackScript.includes("/api/v1/devops/rollback"), "rollback.sh must record audit certificate");

    passedTests++;
    console.log("  ✔ Deployment and rollback shell scripts verified.");
  }

  console.log("\n========================================================");
  console.log(`   ALL ${passedTests} DEVOPS AUDIT TEST SUITES PASSED CLEANLY!  `);
  console.log("========================================================\n");
}

runDevopsAuditSuite().catch((err) => {
  console.error("❌ DevOps Audit Suite failed:", err);
  process.exit(1);
});
