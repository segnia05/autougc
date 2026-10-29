/**
 * Enterprise Sentry Error Tracking & Performance Monitoring Engine.
 *
 * Implements Sentry exception capture, breadcrumbs accumulation, user/organization
 * context binding, distributed transaction spans, and Sentry Envelope protocol dispatch.
 */

import { logger } from "./logger";

export interface SentryUser {
  id?: string;
  email?: string;
  username?: string;
  orgId?: string;
  planTier?: string;
  ipAddress?: string;
}

export interface SentryBreadcrumb {
  category?: string;
  message: string;
  level?: "info" | "warning" | "error" | "debug";
  timestamp?: number;
  data?: Record<string, unknown>;
  type?: "default" | "http" | "navigation" | "user" | "query";
}

export interface SentryEvent {
  event_id: string;
  timestamp: string;
  platform: string;
  level: "fatal" | "error" | "warning" | "info" | "debug";
  logger?: string;
  transaction?: string;
  server_name?: string;
  release: string;
  environment: string;
  user?: SentryUser;
  tags: Record<string, string>;
  extra: Record<string, unknown>;
  breadcrumbs: SentryBreadcrumb[];
  exception?: {
    values: Array<{
      type: string;
      value: string;
      stacktrace?: {
        frames: Array<{
          filename?: string;
          function?: string;
          lineno?: number;
          colno?: number;
        }>;
      };
    }>;
  };
  message?: string;
}

export interface CaptureContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: SentryUser;
  level?: SentryEvent["level"];
  fingerprint?: string[];
}

class SentryClient {
  private dsn: string | undefined;
  private environment: string;
  private release: string;
  private globalUser: SentryUser | null = null;
  private globalTags: Record<string, string> = {};
  private globalExtra: Record<string, unknown> = {};
  private breadcrumbs: SentryBreadcrumb[] = [];
  private readonly maxBreadcrumbs = 100;
  private capturedEvents: SentryEvent[] = [];

  constructor() {
    this.dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
    this.environment = process.env.NODE_ENV || "development";
    this.release = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";
    this.globalTags = {
      runtime: typeof window === "undefined" ? "nodejs" : "browser",
      framework: "nextjs",
    };
  }

  /**
   * Initializes or updates Sentry configuration.
   */
  init(options: { dsn?: string; environment?: string; release?: string }): void {
    if (options.dsn) this.dsn = options.dsn;
    if (options.environment) this.environment = options.environment;
    if (options.release) this.release = options.release;
  }

  /**
   * Attaches the authenticated user / organization identity to future error reports.
   */
  setUser(user: SentryUser | null): void {
    this.globalUser = user;
    if (user?.id) {
      this.setTag("user_id", user.id);
    }
    if (user?.orgId) {
      this.setTag("organization_id", user.orgId);
    }
    if (user?.planTier) {
      this.setTag("plan_tier", user.planTier);
    }
  }

  /**
   * Sets a persistent diagnostic tag across all future captured events.
   */
  setTag(key: string, value: string): void {
    this.globalTags[key] = value;
  }

  /**
   * Sets extra debugging metadata.
   */
  setExtra(key: string, value: unknown): void {
    this.globalExtra[key] = value;
  }

  /**
   * Appends a user/system action breadcrumb to reconstruct actions before a crash.
   */
  addBreadcrumb(breadcrumb: SentryBreadcrumb): void {
    const entry: SentryBreadcrumb = {
      timestamp: breadcrumb.timestamp || Date.now(),
      level: breadcrumb.level || "info",
      type: breadcrumb.type || "default",
      ...breadcrumb,
    };

    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  /**
   * Captures an unexpected exception and transmits it to Sentry.
   */
  captureException(error: unknown, context?: CaptureContext): string {
    const eventId = this.generateUuid();
    const err = error instanceof Error ? error : new Error(String(error));

    const frames = this.parseStackTrace(err.stack);

    const event: SentryEvent = {
      event_id: eventId,
      timestamp: new Date().toISOString(),
      platform: "javascript",
      level: context?.level || "error",
      release: this.release,
      environment: this.environment,
      user: context?.user || this.globalUser || undefined,
      tags: {
        ...this.globalTags,
        ...(context?.tags || {}),
        error_name: err.name,
      },
      extra: {
        ...this.globalExtra,
        ...(context?.extra || {}),
      },
      breadcrumbs: [...this.breadcrumbs],
      exception: {
        values: [
          {
            type: err.name,
            value: err.message,
            stacktrace: { frames },
          },
        ],
      },
    };

    this.recordEvent(event);
    logger.error(`[Sentry] Captured ${err.name}: ${err.message}`, err, {
      sentryEventId: eventId,
      ...event.tags,
    });

    this.dispatchToSentry(event);
    return eventId;
  }

  /**
   * Captures an informational or warning message to Sentry.
   */
  captureMessage(
    message: string,
    level: SentryEvent["level"] = "info",
    context?: CaptureContext
  ): string {
    const eventId = this.generateUuid();

    const event: SentryEvent = {
      event_id: eventId,
      timestamp: new Date().toISOString(),
      platform: "javascript",
      level,
      message,
      release: this.release,
      environment: this.environment,
      user: context?.user || this.globalUser || undefined,
      tags: {
        ...this.globalTags,
        ...(context?.tags || {}),
      },
      extra: {
        ...this.globalExtra,
        ...(context?.extra || {}),
      },
      breadcrumbs: [...this.breadcrumbs],
    };

    this.recordEvent(event);
    if (level === "warning" || level === "error" || level === "fatal") {
      logger.warn(`[Sentry] Message (${level}): ${message}`, {
        sentryEventId: eventId,
        ...event.tags,
      });
    }

    this.dispatchToSentry(event);
    return eventId;
  }

  /**
   * Measures a performance transaction span.
   */
  async withSpan<T>(
    spanConfig: { name: string; op: string; tags?: Record<string, string> },
    operation: () => Promise<T> | T
  ): Promise<T> {
    const start = Date.now();
    this.addBreadcrumb({
      category: "span",
      message: `Start span: ${spanConfig.op} - ${spanConfig.name}`,
      level: "info",
      data: spanConfig.tags,
    });

    try {
      const result = await operation();
      const durationMs = Date.now() - start;
      this.addBreadcrumb({
        category: "span",
        message: `Finished span: ${spanConfig.op} - ${spanConfig.name} (${durationMs}ms)`,
        level: "info",
      });
      return result;
    } catch (err) {
      const durationMs = Date.now() - start;
      this.addBreadcrumb({
        category: "span",
        message: `Failed span: ${spanConfig.op} - ${spanConfig.name} (${durationMs}ms)`,
        level: "error",
      });
      this.captureException(err, {
        tags: {
          span_op: spanConfig.op,
          span_name: spanConfig.name,
          ...(spanConfig.tags || {}),
        },
      });
      throw err;
    }
  }

  private recordEvent(event: SentryEvent): void {
    this.capturedEvents.push(event);
    if (this.capturedEvents.length > 50) {
      this.capturedEvents.shift();
    }
  }

  /**
   * Asynchronously transmits the Sentry envelope via HTTPS if DSN is configured.
   */
  private async dispatchToSentry(event: SentryEvent): Promise<void> {
    if (!this.dsn) return;

    try {
      // Parse DSN format: https://<publicKey>@<host>/<projectId>
      const url = new URL(this.dsn);
      const publicKey = url.username;
      const host = url.host;
      const projectId = url.pathname.replace(/^\//, "");

      if (!publicKey || !projectId) return;

      const envelopeHeader = JSON.stringify({
        event_id: event.event_id,
        sent_at: new Date().toISOString(),
        dsn: this.dsn,
      });

      const itemHeader = JSON.stringify({
        type: "event",
        content_type: "application/json",
      });

      const itemPayload = JSON.stringify(event);
      const envelopeBody = `${envelopeHeader}\n${itemHeader}\n${itemPayload}\n`;

      if (typeof fetch !== "undefined") {
        await fetch(`https://${host}/api/${projectId}/envelope/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-sentry-envelope",
            "X-Sentry-Auth": `Sentry sentry_version=7, sentry_client=autougc-sentry/0.1.0, sentry_key=${publicKey}`,
          },
          body: envelopeBody,
        }).catch(() => {
          // Swallow network delivery errors so the application remains unaffected
        });
      }
    } catch {
      // Fail safely without affecting host process
    }
  }

  private parseStackTrace(
    stack?: string
  ): Array<{ filename?: string; function?: string; lineno?: number; colno?: number }> {
    if (!stack) return [];
    const lines = stack.split("\n").slice(1);
    return lines.map((line) => {
      const match = line.match(/^\s*at\s+(?:([^\s(]+)\s+\((.+):(\d+):(\d+)\)|(.+):(\d+):(\d+))/);
      if (match) {
        return {
          function: match[1] || "<anonymous>",
          filename: match[2] || match[5],
          lineno: parseInt(match[3] || match[6] || "0", 10),
          colno: parseInt(match[4] || match[7] || "0", 10),
        };
      }
      return { function: line.trim() };
    });
  }

  private generateUuid(): string {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  getCapturedEvents(): SentryEvent[] {
    return [...this.capturedEvents];
  }

  getBreadcrumbs(): SentryBreadcrumb[] {
    return [...this.breadcrumbs];
  }

  clear(): void {
    this.capturedEvents = [];
    this.breadcrumbs = [];
  }
}

export const sentry = new SentryClient();
