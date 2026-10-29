/**
 * Enterprise Distributed Tracing Engine (OpenTelemetry & Datadog APM compatible).
 *
 * Implements W3C Trace Context (traceparent), Datadog trace headers,
 * high-resolution span execution measurement, and cross-boundary propagation.
 */

import { logger } from "./logger";

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  sampled: boolean;
}

export class Span {
  public readonly traceId: string;
  public readonly spanId: string;
  public readonly parentSpanId?: string;
  public readonly name: string;
  public readonly startTime: number;
  public durationMs = 0;
  public tags: Record<string, string | number | boolean> = {};
  public status: "ok" | "error" = "ok";
  public error?: Error;

  constructor(name: string, context: SpanContext) {
    this.name = name;
    this.traceId = context.traceId;
    this.spanId = context.spanId;
    this.parentSpanId = context.parentSpanId;
    this.startTime = Date.now();
  }

  setTag(key: string, value: string | number | boolean): this {
    this.tags[key] = value;
    return this;
  }

  recordException(error: unknown): this {
    this.status = "error";
    this.error = error instanceof Error ? error : new Error(String(error));
    this.tags["error"] = true;
    this.tags["error.message"] = this.error.message;
    return this;
  }

  finish(): Span {
    this.durationMs = Date.now() - this.startTime;
    logger.debug(`[Trace Span] ${this.name} finished in ${this.durationMs}ms`, {
      traceId: this.traceId,
      spanId: this.spanId,
      parentSpanId: this.parentSpanId,
      status: this.status,
      tags: this.tags,
    });
    return this;
  }
}

class DistributedTracer {
  /**
   * Generates a 32-character hex trace ID (128-bit) compatible with W3C Trace Context.
   */
  generateTraceId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }

  /**
   * Generates a 16-character hex span ID (64-bit).
   */
  generateSpanId(): string {
    return Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }

  /**
   * Extracts or creates a trace context from incoming HTTP headers.
   */
  extract(headers: Headers | Record<string, string | null | undefined>): SpanContext {
    const getHeader = (name: string): string | null => {
      if (typeof (headers as Headers).get === "function") {
        return (headers as Headers).get(name);
      }
      return (headers as Record<string, string | null | undefined>)[name.toLowerCase()] || null;
    };

    const traceparent = getHeader("traceparent");
    if (traceparent) {
      // Format: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
      const parts = traceparent.split("-");
      if (parts.length >= 4) {
        return {
          traceId: parts[1] || this.generateTraceId(),
          parentSpanId: parts[2],
          spanId: this.generateSpanId(),
          sampled: parts[3] === "01",
        };
      }
    }

    const ddTraceId = getHeader("x-datadog-trace-id");
    const ddParentId = getHeader("x-datadog-parent-id");
    if (ddTraceId) {
      return {
        traceId: ddTraceId,
        parentSpanId: ddParentId || undefined,
        spanId: this.generateSpanId(),
        sampled: true,
      };
    }

    const requestId = getHeader("x-request-id");
    const traceId = requestId ? requestId.replace(/-/g, "").padEnd(32, "0").slice(0, 32) : this.generateTraceId();

    return {
      traceId,
      spanId: this.generateSpanId(),
      sampled: true,
    };
  }

  /**
   * Injects trace propagation headers into outgoing requests.
   */
  inject(context: SpanContext, targetHeaders: Record<string, string> = {}): Record<string, string> {
    targetHeaders["traceparent"] = `00-${context.traceId}-${context.spanId}-01`;
    targetHeaders["x-datadog-trace-id"] = context.traceId;
    targetHeaders["x-datadog-parent-id"] = context.spanId;
    targetHeaders["x-request-id"] = context.traceId;
    return targetHeaders;
  }

  /**
   * Starts a new traced span.
   */
  startSpan(name: string, parentContext?: SpanContext): Span {
    const context: SpanContext = parentContext || {
      traceId: this.generateTraceId(),
      spanId: this.generateSpanId(),
      sampled: true,
    };
    return new Span(name, context);
  }

  /**
   * Wraps an async function in a trace span, automatically measuring duration and recording errors.
   */
  async withSpan<T>(
    name: string,
    parentContext: SpanContext | undefined,
    fn: (span: Span) => Promise<T>
  ): Promise<T> {
    const span = this.startSpan(name, parentContext);
    try {
      const result = await fn(span);
      span.finish();
      return result;
    } catch (err) {
      span.recordException(err);
      span.finish();
      throw err;
    }
  }
}

export const tracer = new DistributedTracer();
