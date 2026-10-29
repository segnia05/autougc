import { NextResponse } from "next/server";
import { grafana } from "@/lib/observability/grafana";

/**
 * Enterprise Prometheus & Grafana Metrics Exposition Endpoint.
 *
 * Scraped by Prometheus, Grafana Agent, or OpenTelemetry Collector.
 * Conforms strictly to OpenMetrics text format specification.
 */
export async function GET() {
  const metricsText = grafana.render();

  return new NextResponse(metricsText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
