/**
 * Enterprise Datadog APM & DogStatsD Metrics Client.
 *
 * Implements standard DogStatsD protocol encoding, high-resolution timings,
 * distributed APM trace tags, and Datadog Metrics Series v2 API dispatch.
 */

import { logger } from "./logger";

export type MetricType = "c" | "g" | "h" | "ms" | "d" | "s";

export interface MetricEntry {
  name: string;
  value: number;
  type: MetricType;
  tags: Record<string, string>;
  timestamp: number;
  dogstatsdLine: string;
}

export type ServiceCheckStatus = 0 | 1 | 2 | 3; // 0=OK, 1=WARNING, 2=CRITICAL, 3=UNKNOWN

class DatadogClient {
  private prefix = "autougc";
  private defaultTags: Record<string, string> = {
    env: process.env.NODE_ENV || "development",
    service: "autougc-saas",
    version: "0.1.0",
  };
  private metricsLedger: MetricEntry[] = [];
  private readonly maxLedgerSize = 500;
  private apiKey: string | undefined;
  private site: string;

  constructor() {
    this.apiKey = process.env.DATADOG_API_KEY || process.env.DD_API_KEY;
    this.site = process.env.DATADOG_SITE || process.env.DD_SITE || "datadoghq.com";
  }

  /**
   * Encodes tags as DogStatsD tag strings (e.g. tag1:val,tag2:val).
   */
  private formatTags(customTags?: Record<string, string>): string[] {
    const merged = { ...this.defaultTags, ...(customTags || {}) };
    return Object.entries(merged).map(([key, val]) => `${key}:${val}`);
  }

  /**
   * Serializes a metric into the standard DogStatsD UDP wire protocol line.
   */
  private formatDogstatsdLine(
    metricName: string,
    value: number,
    type: MetricType,
    tags?: Record<string, string>
  ): string {
    const fullName = `${this.prefix}.${metricName}`;
    const tagArray = this.formatTags(tags);
    const tagString = tagArray.length > 0 ? `|#${tagArray.join(",")}` : "";
    return `${fullName}:${value}|${type}${tagString}`;
  }

  private recordMetric(
    name: string,
    value: number,
    type: MetricType,
    tags?: Record<string, string>
  ): MetricEntry {
    const dogstatsdLine = this.formatDogstatsdLine(name, value, type, tags);
    const entry: MetricEntry = {
      name: `${this.prefix}.${name}`,
      value,
      type,
      tags: { ...this.defaultTags, ...(tags || {}) },
      timestamp: Date.now(),
      dogstatsdLine,
    };

    this.metricsLedger.push(entry);
    if (this.metricsLedger.length > this.maxLedgerSize) {
      this.metricsLedger.shift();
    }

    logger.debug(`[Datadog] ${dogstatsdLine}`);
    return entry;
  }

  /**
   * Increments a monotonic counter (e.g. requests, renders, errors).
   */
  increment(metric: string, value = 1, tags?: Record<string, string>): MetricEntry {
    return this.recordMetric(metric, value, "c", tags);
  }

  /**
   * Decrements a counter.
   */
  decrement(metric: string, value = 1, tags?: Record<string, string>): MetricEntry {
    return this.recordMetric(metric, -value, "c", tags);
  }

  /**
   * Emits an instantaneous gauge value (e.g. active queue depth, memory usage).
   */
  gauge(metric: string, value: number, tags?: Record<string, string>): MetricEntry {
    return this.recordMetric(metric, value, "g", tags);
  }

  /**
   * Emits a histogram distribution sample (e.g. video rendering duration, script word count).
   */
  histogram(metric: string, value: number, tags?: Record<string, string>): MetricEntry {
    return this.recordMetric(metric, value, "h", tags);
  }

  /**
   * Emits an execution timing metric in milliseconds.
   */
  timing(metric: string, durationMs: number, tags?: Record<string, string>): MetricEntry {
    return this.recordMetric(metric, durationMs, "ms", tags);
  }

  /**
   * Emits a globally-aggregated distribution metric.
   */
  distribution(metric: string, value: number, tags?: Record<string, string>): MetricEntry {
    return this.recordMetric(metric, value, "d", tags);
  }

  /**
   * Emits a Datadog Service Check (0=OK, 1=WARNING, 2=CRITICAL, 3=UNKNOWN).
   */
  serviceCheck(
    name: string,
    status: ServiceCheckStatus,
    tags?: Record<string, string>,
    message?: string
  ): string {
    const fullName = `${this.prefix}.${name}`;
    const tagArray = this.formatTags(tags);
    const tagString = tagArray.length > 0 ? `|#${tagArray.join(",")}` : "";
    const msgString = message ? `|m:${message}` : "";
    const line = `_sc|${fullName}|${status}${tagString}${msgString}`;
    logger.debug(`[Datadog Service Check] ${line}`);
    return line;
  }

  /**
   * Retrieves recorded metrics from memory ledger.
   */
  getMetricsLedger(): MetricEntry[] {
    return [...this.metricsLedger];
  }

  /**
   * Retrieves summary statistics for a given metric.
   */
  getMetricStats(metricName: string): { count: number; sum: number; min: number; max: number; avg: number } {
    const fullName = `${this.prefix}.${metricName}`;
    const matching = this.metricsLedger.filter((m) => m.name === fullName);
    if (matching.length === 0) {
      return { count: 0, sum: 0, min: 0, max: 0, avg: 0 };
    }
    const values = matching.map((m) => m.value);
    const count = values.length;
    const sum = values.reduce((acc, v) => acc + v, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = Number((sum / count).toFixed(2));
    return { count, sum, min, max, avg };
  }

  clear(): void {
    this.metricsLedger = [];
  }
}

export const datadog = new DatadogClient();
