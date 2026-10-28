/**
 * Enterprise System Monitoring & Telemetry Engine.
 *
 * Tracks system health metrics, request latency histograms (p50, p95, p99),
 * error budgets, and resource consumption to ensure 99.9% uptime compliance.
 */

export interface LatencyPercentiles {
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  avg: number;
}

export interface SystemMetricsSnapshot {
  uptimeSeconds: number;
  totalRequests: number;
  totalErrors: number;
  errorRatePercent: number;
  latencies: LatencyPercentiles;
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  timestamp: string;
}

class TelemetryMonitor {
  private startTime = Date.now();
  private totalRequests = 0;
  private totalErrors = 0;
  private latencySamples: number[] = [];
  private maxSamples = 2000;

  /**
   * Records an API request execution.
   */
  recordRequest(durationMs: number, statusCode: number): void {
    this.totalRequests++;

    if (statusCode >= 500) {
      this.totalErrors++;
    }

    if (this.latencySamples.length >= this.maxSamples) {
      this.latencySamples.shift();
    }
    this.latencySamples.push(durationMs);
  }

  /**
   * Records an operational exception.
   */
  recordError(context: string, error: unknown): void {
    this.totalErrors++;
    if (process.env.NODE_ENV === "development") {
      console.warn(`[TELEMETRY_ERROR] Context: ${context} | Details:`, error);
    }
  }

  /**
   * Calculates latency percentiles (p50, p95, p99).
   */
  private calculatePercentiles(): LatencyPercentiles {
    if (this.latencySamples.length === 0) {
      return { p50: 0, p95: 0, p99: 0, min: 0, max: 0, avg: 0 };
    }

    const sorted = [...this.latencySamples].sort((a, b) => a - b);
    const count = sorted.length;

    const p50 = sorted[Math.floor(count * 0.5)] || 0;
    const p95 = sorted[Math.floor(count * 0.95)] || 0;
    const p99 = sorted[Math.floor(count * 0.99)] || 0;
    const min = sorted[0] || 0;
    const max = sorted[count - 1] || 0;
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const avg = Number((sum / count).toFixed(2));

    return { p50, p95, p99, min, max, avg };
  }

  /**
   * Generates a comprehensive real-time system metrics snapshot.
   */
  getMetricsSnapshot(): SystemMetricsSnapshot {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const errorRatePercent =
      this.totalRequests === 0
        ? 0
        : Number(((this.totalErrors / this.totalRequests) * 100).toFixed(2));

    let heapUsedMb = 0;
    let heapTotalMb = 0;
    let rssMb = 0;

    if (typeof process !== "undefined" && process.memoryUsage) {
      const mem = process.memoryUsage();
      heapUsedMb = Number((mem.heapUsed / 1024 / 1024).toFixed(2));
      heapTotalMb = Number((mem.heapTotal / 1024 / 1024).toFixed(2));
      rssMb = Number((mem.rss / 1024 / 1024).toFixed(2));
    }

    return {
      uptimeSeconds,
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRatePercent,
      latencies: this.calculatePercentiles(),
      memory: {
        heapUsedMb,
        heapTotalMb,
        rssMb,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Resets metrics (for testing isolation).
   */
  reset(): void {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.latencySamples = [];
  }
}

export const telemetry = new TelemetryMonitor();
