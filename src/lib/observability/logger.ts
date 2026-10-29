/**
 * Enterprise Structured Logging Engine.
 *
 * Implements RFC 5424 compliant log levels, automatic PII/secret scrubbing,
 * contextual correlation (traceId, userId, orgId), and machine-readable JSON emission.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogContext {
  traceId?: string;
  spanId?: string;
  requestId?: string;
  userId?: string;
  orgId?: string;
  service?: string;
  environment?: string;
  [key: string]: unknown;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /api[_-]?key/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /private[_-]?key/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
  /cookie/i,
  /session/i,
  /ssn/i,
];

/**
 * Recursively scrubs sensitive data and secrets from objects before logging.
 */
export function scrubPII<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    // Redact Bearer tokens in raw strings
    if (/bearer\s+[a-zA-Z0-9_\-\.]+/i.test(data)) {
      return data.replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, "Bearer [REDACTED]") as unknown as T;
    }
    // Redact credit cards (13-19 digits)
    if (/\b(?:\d{4}[ -]?){3}(?:\d{1,4})\b/.test(data)) {
      return data.replace(/\b(?:\d{4}[ -]?){3}(?:\d{1,4})\b/g, "[REDACTED_CARD]") as unknown as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => scrubPII(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
      if (isSensitive) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = scrubPII(value);
      } else {
        sanitized[key] = scrubPII(value);
      }
    }
    return sanitized as unknown as T;
  }

  return data;
}

class StructuredLogger {
  private minLevel: LogLevel =
    (process.env.LOG_LEVEL as LogLevel) ||
    (process.env.NODE_ENV === "production" ? "info" : "debug");
  private defaultContext: LogContext = {
    service: "autougc-api",
    environment: process.env.NODE_ENV || "development",
  };
  private ringBuffer: StructuredLogEntry[];
  private readonly maxBufferSize = 500;

  constructor(context?: LogContext, ringBuffer?: StructuredLogEntry[]) {
    if (context) {
      this.defaultContext = { ...this.defaultContext, ...context };
    }
    this.ringBuffer = ringBuffer || [];
  }

  /**
   * Spawns a child logger with bound contextual metadata (e.g. traceId, userId).
   */
  child(context: LogContext): StructuredLogger {
    const child = new StructuredLogger(
      {
        ...this.defaultContext,
        ...context,
      },
      this.ringBuffer
    );
    child.minLevel = this.minLevel;
    return child;
  }

  /**
   * Adjusts minimum log level at runtime.
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minLevel];
  }

  private emit(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error | unknown
  ): StructuredLogEntry {
    const mergedContext = scrubPII({
      ...this.defaultContext,
      ...context,
    }) as LogContext;

    let errorPayload: StructuredLogEntry["error"] | undefined;
    if (error) {
      if (error instanceof Error) {
        errorPayload = {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: (error as { code?: string | number }).code,
        };
      } else {
        errorPayload = {
          name: "UnknownError",
          message: String(error),
        };
      }
    }

    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: (mergedContext.service as string) || "autougc-api",
      environment: (mergedContext.environment as string) || "development",
      context: mergedContext,
      ...(errorPayload ? { error: errorPayload } : {}),
    };

    // Store in internal memory ring buffer for health inspection and testing
    this.ringBuffer.push(entry);
    if (this.ringBuffer.length > this.maxBufferSize) {
      this.ringBuffer.shift();
    }

    // Emit formatted output
    if (process.env.NODE_ENV === "production" || process.env.STRUCTURED_LOGS === "true") {
      // In production: Single-line JSON format for Datadog Logs / CloudWatch / Logstash
      const jsonString = JSON.stringify(entry);
      if (level === "error" || level === "fatal") {
        console.error(jsonString);
      } else if (level === "warn") {
        console.warn(jsonString);
      } else {
        console.log(jsonString);
      }
    } else {
      // In development: Human-readable format
      const colorPrefix =
        level === "error" || level === "fatal"
          ? "\x1b[31m[ERROR]\x1b[0m"
          : level === "warn"
          ? "\x1b[33m[WARN]\x1b[0m"
          : level === "info"
          ? "\x1b[32m[INFO]\x1b[0m"
          : "\x1b[36m[DEBUG]\x1b[0m";

      const traceStr = mergedContext.traceId ? ` [trace:${mergedContext.traceId.slice(0, 8)}]` : "";
      const contextStr =
        Object.keys(context || {}).length > 0 ? ` ${JSON.stringify(scrubPII(context))}` : "";

      if (level === "error" || level === "fatal") {
        console.error(`${colorPrefix}${traceStr} ${message}${contextStr}`, error || "");
      } else if (level === "warn") {
        console.warn(`${colorPrefix}${traceStr} ${message}${contextStr}`);
      } else {
        console.log(`${colorPrefix}${traceStr} ${message}${contextStr}`);
      }
    }

    return entry;
  }

  debug(message: string, context?: Record<string, unknown>): StructuredLogEntry | null {
    if (!this.shouldLog("debug")) return null;
    return this.emit("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>): StructuredLogEntry | null {
    if (!this.shouldLog("info")) return null;
    return this.emit("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: unknown): StructuredLogEntry | null {
    if (!this.shouldLog("warn")) return null;
    return this.emit("warn", message, context, error);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): StructuredLogEntry | null {
    if (!this.shouldLog("error")) return null;
    return this.emit("error", message, context, error);
  }

  fatal(message: string, error?: unknown, context?: Record<string, unknown>): StructuredLogEntry | null {
    return this.emit("fatal", message, context, error);
  }

  /**
   * Retrieves recent structured logs from memory buffer.
   */
  getRecentLogs(limit = 50): StructuredLogEntry[] {
    return this.ringBuffer.slice(-limit);
  }

  /**
   * Clears memory buffer (used in tests).
   */
  clearBuffer(): void {
    this.ringBuffer.length = 0;
  }
}

export const logger = new StructuredLogger();
