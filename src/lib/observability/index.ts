/**
 * Enterprise Observability Suite.
 *
 * Unifies:
 * - Logs: RFC 5424 structured JSON logging with PII scrubbing (logger)
 * - Error Tracking: Sentry exception capture, breadcrumbs, and span telemetry (sentry)
 * - Analytics: PostHog product analytics, event capture, user traits, feature flags (posthog)
 * - Metrics (APM): Datadog DogStatsD protocol, request latencies, and service checks (datadog)
 * - Dashboards: Prometheus & OpenMetrics registry for Grafana scraping at /api/metrics (grafana)
 * - Distributed Tracing: W3C Trace Context & Datadog trace propagation (tracer)
 */

export * from "./logger";
export * from "./sentry";
export * from "./posthog";
export * from "./datadog";
export * from "./grafana";
export * from "./tracer";

import { logger } from "./logger";
import { sentry } from "./sentry";
import { posthog } from "./posthog";
import { datadog } from "./datadog";
import { grafana } from "./grafana";
import { tracer } from "./tracer";

export const observability = {
  logger,
  sentry,
  posthog,
  datadog,
  grafana,
  tracer,
};

export default observability;
