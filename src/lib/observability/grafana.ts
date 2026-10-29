/**
 * Enterprise Prometheus & OpenMetrics Registry for Grafana.
 *
 * Implements standard OpenMetrics / Prometheus exposition format,
 * custom collectors for HTTP latency, queue depth, cache hit ratio,
 * and high-cardinality SaaS business metrics.
 */

export interface MetricLabels {
  [key: string]: string | number;
}

function formatLabels(labels?: MetricLabels): string {
  if (!labels || Object.keys(labels).length === 0) return "";
  const pairs = Object.entries(labels).map(
    ([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`
  );
  return `{${pairs.join(",")}}`;
}

export class PrometheusCounter {
  public readonly name: string;
  public readonly help: string;
  private values = new Map<string, number>();

  constructor(name: string, help: string) {
    this.name = name;
    this.help = help;
  }

  inc(labels: MetricLabels = {}, amount = 1): void {
    const key = formatLabels(labels);
    const current = this.values.get(key) || 0;
    this.values.set(key, current + amount);
  }

  get(labels: MetricLabels = {}): number {
    const key = formatLabels(labels);
    return this.values.get(key) || 0;
  }

  render(): string {
    const lines: string[] = [
      `# HELP ${this.name} ${this.help}`,
      `# TYPE ${this.name} counter`,
    ];
    if (this.values.size === 0) {
      lines.push(`${this.name} 0`);
    } else {
      for (const [key, val] of this.values.entries()) {
        lines.push(`${this.name}${key} ${val}`);
      }
    }
    return lines.join("\n");
  }

  reset(): void {
    this.values.clear();
  }
}

export class PrometheusGauge {
  public readonly name: string;
  public readonly help: string;
  private values = new Map<string, number>();

  constructor(name: string, help: string) {
    this.name = name;
    this.help = help;
  }

  set(value: number, labels: MetricLabels = {}): void {
    const key = formatLabels(labels);
    this.values.set(key, value);
  }

  inc(labels: MetricLabels = {}, amount = 1): void {
    const key = formatLabels(labels);
    const current = this.values.get(key) || 0;
    this.values.set(key, current + amount);
  }

  dec(labels: MetricLabels = {}, amount = 1): void {
    const key = formatLabels(labels);
    const current = this.values.get(key) || 0;
    this.values.set(key, current - amount);
  }

  get(labels: MetricLabels = {}): number {
    const key = formatLabels(labels);
    return this.values.get(key) || 0;
  }

  render(): string {
    const lines: string[] = [
      `# HELP ${this.name} ${this.help}`,
      `# TYPE ${this.name} gauge`,
    ];
    if (this.values.size === 0) {
      lines.push(`${this.name} 0`);
    } else {
      for (const [key, val] of this.values.entries()) {
        lines.push(`${this.name}${key} ${val}`);
      }
    }
    return lines.join("\n");
  }

  reset(): void {
    this.values.clear();
  }
}

export class PrometheusHistogram {
  public readonly name: string;
  public readonly help: string;
  public readonly buckets: number[];
  private bucketCounts = new Map<string, Map<number, number>>();
  private sums = new Map<string, number>();
  private counts = new Map<string, number>();

  constructor(
    name: string,
    help: string,
    buckets: number[] = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  ) {
    this.name = name;
    this.help = help;
    this.buckets = [...buckets].sort((a, b) => a - b);
  }

  observe(value: number, labels: MetricLabels = {}): void {
    const key = formatLabels(labels);

    // Sum and count
    this.sums.set(key, (this.sums.get(key) || 0) + value);
    this.counts.set(key, (this.counts.get(key) || 0) + 1);

    // Buckets
    if (!this.bucketCounts.has(key)) {
      this.bucketCounts.set(key, new Map());
    }
    const bMap = this.bucketCounts.get(key)!;
    for (const b of this.buckets) {
      if (value <= b) {
        bMap.set(b, (bMap.get(b) || 0) + 1);
      }
    }
  }

  render(): string {
    const lines: string[] = [
      `# HELP ${this.name} ${this.help}`,
      `# TYPE ${this.name} histogram`,
    ];

    if (this.counts.size === 0) {
      lines.push(`${this.name}_count 0`);
      lines.push(`${this.name}_sum 0`);
      return lines.join("\n");
    }

    for (const [key, totalCount] of this.counts.entries()) {
      const bMap = this.bucketCounts.get(key) || new Map();
      const rawLabels = key ? key.slice(1, -1) : ""; // strip { and }

      let cumulative = 0;
      for (const b of this.buckets) {
        const inBucket = bMap.get(b) || 0;
        cumulative += inBucket;
        const bucketLabels = rawLabels
          ? `{${rawLabels},le="${b}"}`
          : `{le="${b}"}`;
        lines.push(`${this.name}_bucket${bucketLabels} ${cumulative}`);
      }

      const infLabels = rawLabels ? `{${rawLabels},le="+Inf"}` : `{le="+Inf"}`;
      lines.push(`${this.name}_bucket${infLabels} ${totalCount}`);
      lines.push(`${this.name}_sum${key} ${Number((this.sums.get(key) || 0).toFixed(4))}`);
      lines.push(`${this.name}_count${key} ${totalCount}`);
    }

    return lines.join("\n");
  }

  reset(): void {
    this.bucketCounts.clear();
    this.sums.clear();
    this.counts.clear();
  }
}

class PrometheusRegistry {
  public httpRequestsTotal = new PrometheusCounter(
    "autougc_http_requests_total",
    "Total HTTP requests handled by AutoUGC"
  );
  public httpRequestDurationSeconds = new PrometheusHistogram(
    "autougc_http_request_duration_seconds",
    "HTTP request latency in seconds",
    [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  );
  public queueJobsActive = new PrometheusGauge(
    "autougc_queue_jobs_active",
    "Current active jobs in asynchronous queue"
  );
  public queueJobsTotal = new PrometheusCounter(
    "autougc_queue_jobs_total",
    "Cumulative asynchronous jobs processed by queue"
  );
  public creditsConsumedTotal = new PrometheusCounter(
    "autougc_credits_consumed_total",
    "Total AI and video rendering credits deducted"
  );
  public videosRenderedTotal = new PrometheusCounter(
    "autougc_videos_rendered_total",
    "Total 1080p MP4 UGC video ads produced"
  );
  public scriptsGeneratedTotal = new PrometheusCounter(
    "autougc_scripts_generated_total",
    "Total AI hooks and viral scripts generated"
  );
  public audioSynthesizedSecondsTotal = new PrometheusCounter(
    "autougc_audio_synthesized_seconds_total",
    "Total duration of neural audio synthesized in seconds"
  );
  public cacheHitsTotal = new PrometheusCounter(
    "autougc_cache_hits_total",
    "Total high-throughput cache hits"
  );
  public cacheMissesTotal = new PrometheusCounter(
    "autougc_cache_misses_total",
    "Total cache misses"
  );
  public activeSubscribers = new PrometheusGauge(
    "autougc_active_subscribers",
    "Active paying subscribers across billing tiers"
  );

  /**
   * Serializes all registered metrics into standard Prometheus OpenMetrics text format.
   */
  render(): string {
    // Dynamic runtime metrics
    const memUsage =
      typeof process !== "undefined" && typeof process.memoryUsage === "function"
        ? process.memoryUsage()
        : null;
    const uptimeSec =
      typeof process !== "undefined" && typeof process.uptime === "function"
        ? Math.floor(process.uptime())
        : 0;

    const runtimeBlocks: string[] = [
      `# HELP process_heap_bytes Process heap memory usage in bytes`,
      `# TYPE process_heap_bytes gauge`,
      `process_heap_bytes ${memUsage ? memUsage.heapUsed : 0}`,
      `# HELP process_rss_bytes Process resident set size in bytes`,
      `# TYPE process_rss_bytes gauge`,
      `process_rss_bytes ${memUsage ? memUsage.rss : 0}`,
      `# HELP process_uptime_seconds Process uptime in seconds`,
      `# TYPE process_uptime_seconds gauge`,
      `process_uptime_seconds ${uptimeSec}`,
    ];

    const metricBlocks = [
      this.httpRequestsTotal.render(),
      this.httpRequestDurationSeconds.render(),
      this.queueJobsActive.render(),
      this.queueJobsTotal.render(),
      this.creditsConsumedTotal.render(),
      this.videosRenderedTotal.render(),
      this.scriptsGeneratedTotal.render(),
      this.audioSynthesizedSecondsTotal.render(),
      this.cacheHitsTotal.render(),
      this.cacheMissesTotal.render(),
      this.activeSubscribers.render(),
      ...runtimeBlocks,
    ];

    return metricBlocks.join("\n\n") + "\n";
  }

  reset(): void {
    this.httpRequestsTotal.reset();
    this.httpRequestDurationSeconds.reset();
    this.queueJobsActive.reset();
    this.queueJobsTotal.reset();
    this.creditsConsumedTotal.reset();
    this.videosRenderedTotal.reset();
    this.scriptsGeneratedTotal.reset();
    this.audioSynthesizedSecondsTotal.reset();
    this.cacheHitsTotal.reset();
    this.cacheMissesTotal.reset();
    this.activeSubscribers.reset();
  }
}

export const grafana = new PrometheusRegistry();
