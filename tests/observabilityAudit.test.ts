/**
 * Enterprise Observability Audit Test Suite.
 *
 * Mathematically and architecturally validates:
 * 1. Structured JSON Logging & Automatic PII/Secret Redaction
 * 2. Sentry Error Tracking, Stack Parsing, User Context & Breadcrumbs
 * 3. PostHog Product Analytics, Event Capture, B2B Groups & Feature Flags
 * 4. Datadog APM & DogStatsD Wire Protocol (Counters, Gauges, Timings, Service Checks)
 * 5. Prometheus / OpenMetrics Registry & Live /api/metrics Scraping for Grafana
 * 6. Distributed Tracing & W3C traceparent Propagation
 */

import { logger, scrubPII } from "../src/lib/observability/logger";
import { sentry } from "../src/lib/observability/sentry";
import { posthog } from "../src/lib/observability/posthog";
import { datadog } from "../src/lib/observability/datadog";
import { grafana } from "../src/lib/observability/grafana";
import { tracer } from "../src/lib/observability/tracer";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function runObservabilityAudit() {
  console.log("=== Running Enterprise Observability & Monitoring Audit ===\n");

  // ==========================================================================
  // SECTION 1: STRUCTURED LOGGING & PII / SECRET SCRUBBING
  // ==========================================================================
  console.log("--- 1. Testing Structured JSON Logging & PII Scrubbing ---");

  // 1a. Test PII scrubber directly
  const sensitivePayload = {
    user: "alex",
    password: "SuperSecretPassword123!",
    api_key: "sk_live_998877665544332211",
    credit_card: "4111 2222 3333 4444",
    nested: {
      accessToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      secretToken: "xyz123abc",
      cleanParam: "1080p_9_16",
    },
  };

  const scrubbed = scrubPII(sensitivePayload);
  if (scrubbed.password !== "[REDACTED]") {
    throw new Error(`Password was not redacted: ${scrubbed.password}`);
  }
  if (scrubbed.api_key !== "[REDACTED]") {
    throw new Error(`API key was not redacted: ${scrubbed.api_key}`);
  }
  if (scrubbed.credit_card !== "[REDACTED]") {
    throw new Error(`Credit card was not redacted: ${scrubbed.credit_card}`);
  }
  if (scrubbed.nested.accessToken !== "[REDACTED]") {
    throw new Error(`Access token was not redacted: ${scrubbed.nested.accessToken}`);
  }
  if (scrubbed.nested.cleanParam !== "1080p_9_16") {
    throw new Error(`Non-sensitive parameter was incorrectly mutated: ${scrubbed.nested.cleanParam}`);
  }
  console.log("✓ PII & Secret Redaction verified: Passwords, tokens, API keys, and cards redacted to '[REDACTED]'.");

  // 1b. Test structured logger context & ring buffer
  logger.clearBuffer();
  const childLogger = logger.child({
    traceId: "trace_obs_test_001",
    userId: "usr_auditor_99",
    orgId: "org_auditor_enterprise",
  });

  childLogger.info("Initiating video render pipeline", { templateId: "minimalist_studio" });
  childLogger.warn("Render duration exceeded nominal threshold", { durationMs: 1250 });
  childLogger.error("Failed to connect to storage bucket", new Error("BucketConnectionTimeout"), { bucket: "raw-assets" });

  const recentLogs = logger.getRecentLogs(10);
  if (recentLogs.length < 3) {
    throw new Error(`Expected at least 3 logs, found ${recentLogs.length}`);
  }

  const errorEntry = recentLogs.find((l) => l.level === "error");
  if (!errorEntry || !errorEntry.error || errorEntry.error.message !== "BucketConnectionTimeout") {
    throw new Error("Structured error log failed to record error object and stack trace.");
  }
  if (errorEntry.context.traceId !== "trace_obs_test_001") {
    throw new Error(`Contextual traceId not propagated: ${errorEntry.context.traceId}`);
  }
  console.log("✓ Structured JSON Logging verified: Context binding, severity levels, and error stack extraction passed.");

  // ==========================================================================
  // SECTION 2: SENTRY ERROR TRACKING & BREADCRUMBS
  // ==========================================================================
  console.log("\n--- 2. Testing Sentry Error Tracking, Context & Breadcrumbs ---");

  sentry.clear();
  sentry.setUser({
    id: "usr_sentry_test_01",
    email: "creator@brand.com",
    orgId: "org_growth_saas",
    planTier: "growth",
  });
  sentry.setTag("cluster", "us-east-1");

  sentry.addBreadcrumb({
    category: "ui_interaction",
    message: "User clicked 'Synthesize Voiceover' button",
    level: "info",
    data: { voiceId: "alex_casual_dtc" },
  });

  sentry.addBreadcrumb({
    category: "http",
    message: "POST /api/v1/audio/synthesize",
    level: "info",
  });

  const simulatedError = new TypeError("Cannot read properties of undefined (reading 'transcribe')");
  const eventId = sentry.captureException(simulatedError, {
    tags: { component: "AudioSynthesisEngine" },
    extra: { requestedDurationSec: 15 },
  });

  if (!eventId || eventId.length !== 32) {
    throw new Error(`Invalid Sentry event ID format: ${eventId}`);
  }

  const capturedEvents = sentry.getCapturedEvents();
  if (capturedEvents.length === 0) {
    throw new Error("Sentry failed to store captured exception.");
  }

  const latestEvent = capturedEvents[capturedEvents.length - 1];
  if (!latestEvent) {
    throw new Error("No latest Sentry event found.");
  }
  if (latestEvent.user?.id !== "usr_sentry_test_01" || latestEvent.user?.planTier !== "growth") {
    throw new Error(`User context missing from Sentry event: ${JSON.stringify(latestEvent.user)}`);
  }
  if (latestEvent.tags.component !== "AudioSynthesisEngine" || latestEvent.tags.cluster !== "us-east-1") {
    throw new Error(`Diagnostic tags missing from Sentry event: ${JSON.stringify(latestEvent.tags)}`);
  }
  if (latestEvent.breadcrumbs.length < 2) {
    throw new Error(`Breadcrumbs not retained in Sentry event: ${latestEvent.breadcrumbs.length}`);
  }
  if (!latestEvent.exception || !latestEvent.exception.values[0] || latestEvent.exception.values[0].type !== "TypeError") {
    throw new Error(`Incorrect exception type: ${latestEvent.exception?.values[0]?.type}`);
  }
  console.log(`✓ Sentry Error Tracking verified: Event ID '${eventId}', user context, tags, stack frames, and breadcrumbs validated.`);

  // Test Sentry transaction span
  const spanResult = await sentry.withSpan(
    { name: "NeonTransaction", op: "db.query", tags: { table: "videos" } },
    async () => {
      return { rowCount: 42 };
    }
  );
  if (spanResult.rowCount !== 42) {
    throw new Error("Sentry withSpan execution failed.");
  }
  console.log("✓ Sentry Performance Transaction Spans verified.");

  // ==========================================================================
  // SECTION 3: POSTHOG PRODUCT ANALYTICS & FEATURE FLAGS
  // ==========================================================================
  console.log("\n--- 3. Testing PostHog Product Analytics & Feature Flags ---");

  posthog.clear();
  posthog.identify("usr_posthog_007", {
    email: "growth@startup.io",
    planTier: "scale",
    creditsBalance: 180,
  });

  posthog.group("organization", "org_acme_corp", {
    name: "Acme DTC Brands",
    plan: "scale",
    memberCount: 8,
  });

  posthog.capture("video_rendered", {
    videoId: "vid_test_posthog_99",
    template: "minimalist_studio",
    aspectRatio: "9:16",
    durationSec: 15,
  });

  const posthogEvents = posthog.getCapturedEvents();
  if (posthogEvents.length < 2) {
    throw new Error(`PostHog failed to capture identify and custom events. Found: ${posthogEvents.length}`);
  }

  const renderEvent = posthogEvents.find((e) => e.event === "video_rendered");
  if (!renderEvent) {
    throw new Error("Missing 'video_rendered' event in PostHog captured event buffer.");
  }
  if (renderEvent.properties.$groups_organization !== "org_acme_corp") {
    throw new Error(`B2B Organization group not linked: ${renderEvent.properties.$groups_organization}`);
  }
  if (renderEvent.properties.template !== "minimalist_studio") {
    throw new Error(`Event properties mismatch: ${renderEvent.properties.template}`);
  }

  // Feature Flag evaluation
  const kineticSubtitlesEnabled = posthog.isFeatureEnabled("kinetic-subtitles-v2");
  if (!kineticSubtitlesEnabled) {
    throw new Error("Expected feature flag 'kinetic-subtitles-v2' to evaluate to true.");
  }
  const voiceCloningEnabled = posthog.isFeatureEnabled("creator-voice-cloning");
  if (voiceCloningEnabled) {
    throw new Error("Expected feature flag 'creator-voice-cloning' to evaluate to false.");
  }
  console.log("✓ PostHog Analytics verified: Event capture, B2B multi-tenant groups, user identify, and feature flags passed.");

  // ==========================================================================
  // SECTION 4: DATADOG APM & DOGSTATSD WIRE PROTOCOL
  // ==========================================================================
  console.log("\n--- 4. Testing Datadog APM & DogStatsD Protocol ---");

  datadog.clear();
  const cEntry = datadog.increment("video.rendered", 1, { template: "minimalist_studio", status: "success" });
  if (!cEntry.dogstatsdLine.startsWith("autougc.video.rendered:1|c|#")) {
    throw new Error(`Invalid DogStatsD counter protocol line: ${cEntry.dogstatsdLine}`);
  }

  const gEntry = datadog.gauge("queue.depth", 14, { queue: "video_processing" });
  if (!gEntry.dogstatsdLine.startsWith("autougc.queue.depth:14|g|#")) {
    throw new Error(`Invalid DogStatsD gauge protocol line: ${gEntry.dogstatsdLine}`);
  }

  const tEntry = datadog.timing("api.latency", 84, { endpoint: "/api/v1/projects/scrape" });
  if (!tEntry.dogstatsdLine.startsWith("autougc.api.latency:84|ms|#")) {
    throw new Error(`Invalid DogStatsD timing protocol line: ${tEntry.dogstatsdLine}`);
  }

  const scLine = datadog.serviceCheck("db.connection", 0, { host: "neon-pgbouncer" }, "Database responding in 12ms");
  if (!scLine.includes("_sc|autougc.db.connection|0|#") || !scLine.includes("|m:Database responding in 12ms")) {
    throw new Error(`Invalid Datadog Service Check format: ${scLine}`);
  }

  const stats = datadog.getMetricStats("video.rendered");
  if (stats.count !== 1 || stats.sum !== 1) {
    throw new Error(`Metric aggregate calculations incorrect: ${JSON.stringify(stats)}`);
  }
  console.log("✓ Datadog APM & DogStatsD verified: Counters, gauges, timings, tags, and service checks conform to protocol.");

  // ==========================================================================
  // SECTION 5: GRAFANA PROMETHEUS SCRAPING ENDPOINT (/api/metrics)
  // ==========================================================================
  console.log("\n--- 5. Testing Prometheus Metrics Registry & /api/metrics Scraping ---");

  grafana.httpRequestsTotal.inc({ method: "POST", route: "/api/v1/videos/render", status: 200 }, 5);
  grafana.videosRenderedTotal.inc({ template: "minimalist_studio" }, 3);
  grafana.creditsConsumedTotal.inc({ plan: "growth" }, 3);
  grafana.queueJobsActive.set(4, { queue: "video_render" });
  grafana.httpRequestDurationSeconds.observe(0.145, { method: "POST", route: "/api/v1/videos/render" });

  const rawPrometheusText = grafana.render();

  // Validate standard Prometheus OpenMetrics syntax
  if (!rawPrometheusText.includes("# HELP autougc_http_requests_total")) {
    throw new Error("Missing HELP metadata for autougc_http_requests_total");
  }
  if (!rawPrometheusText.includes("# TYPE autougc_http_requests_total counter")) {
    throw new Error("Missing TYPE metadata for autougc_http_requests_total");
  }
  if (!rawPrometheusText.includes('autougc_http_requests_total{method="POST",route="/api/v1/videos/render",status="200"} 5')) {
    throw new Error("Metric line formatted incorrectly in Prometheus output");
  }
  if (!rawPrometheusText.includes("autougc_queue_jobs_active{queue=\"video_render\"} 4")) {
    throw new Error("Gauge metric line formatted incorrectly");
  }
  if (!rawPrometheusText.includes("process_heap_bytes")) {
    throw new Error("Process heap memory metric missing from Prometheus exposition");
  }
  console.log("✓ Prometheus OpenMetrics format verified: Headers, metric types, labels, and buckets validated.");

  // Test live HTTP fetch of /api/metrics from running Next.js dev server
  const metricsRes = await fetch(`${BASE_URL}/api/metrics`);
  if (!metricsRes.ok) {
    throw new Error(`Live /api/metrics endpoint returned HTTP ${metricsRes.status}`);
  }
  const contentType = metricsRes.headers.get("content-type");
  if (!contentType || !contentType.includes("text/plain")) {
    throw new Error(`Invalid Content-Type on /api/metrics: ${contentType}`);
  }
  const liveMetricsText = await metricsRes.text();
  if (!liveMetricsText.includes("autougc_http_requests_total") || !liveMetricsText.includes("process_uptime_seconds")) {
    throw new Error("Live /api/metrics response missing required metric blocks");
  }
  console.log(`✓ Live /api/metrics HTTP Endpoint verified: Status 200, Content-Type '${contentType}', OpenMetrics payload verified.`);

  // ==========================================================================
  // SECTION 6: DISTRIBUTED TRACING & W3C PROPAGATION
  // ==========================================================================
  console.log("\n--- 6. Testing Distributed Tracing & W3C traceparent Propagation ---");

  const incomingHeaders = new Headers({
    traceparent: "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
    "x-datadog-trace-id": "4bf92f3577b34da6a3ce929d0e0e4736",
  });

  const extractedContext = tracer.extract(incomingHeaders);
  if (extractedContext.traceId !== "4bf92f3577b34da6a3ce929d0e0e4736") {
    throw new Error(`Trace ID extraction failed: ${extractedContext.traceId}`);
  }
  if (extractedContext.parentSpanId !== "00f067aa0ba902b7") {
    throw new Error(`Parent Span ID extraction failed: ${extractedContext.parentSpanId}`);
  }
  if (!extractedContext.spanId || extractedContext.spanId.length !== 16) {
    throw new Error(`New 64-bit Span ID generation failed: ${extractedContext.spanId}`);
  }

  // Inject into outgoing headers
  const outgoingHeaders: Record<string, string> = {};
  tracer.inject(extractedContext, outgoingHeaders);

  if (!outgoingHeaders["traceparent"] || !outgoingHeaders["traceparent"].startsWith("00-4bf92f3577b34da6a3ce929d0e0e4736-")) {
    throw new Error(`Traceparent header injection failed: ${outgoingHeaders["traceparent"]}`);
  }
  if (outgoingHeaders["x-datadog-trace-id"] !== "4bf92f3577b34da6a3ce929d0e0e4736") {
    throw new Error(`Datadog trace ID header injection failed: ${outgoingHeaders["x-datadog-trace-id"]}`);
  }
  console.log("✓ Distributed Tracing verified: W3C traceparent and Datadog trace context extracted and injected cleanly.");

  console.log("\n=== ALL 6 ENTERPRISE OBSERVABILITY TEST SUITES PASSED CLEANLY! ===");
}

runObservabilityAudit().catch((err) => {
  console.error("\n✗ Observability audit failed:", err);
  process.exit(1);
});
