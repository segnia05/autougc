/**
 * Enterprise PostHog Product Analytics & Feature Flag Engine.
 *
 * Implements user behavioral event tracking, B2B multi-tenant organization groups,
 * user identification profiles, and progressive rollout feature flags.
 */

import { logger } from "./logger";

export interface PostHogEvent {
  event: string;
  properties: Record<string, unknown>;
  distinct_id: string;
  timestamp: string;
}

export interface PostHogGroupProperties {
  name?: string;
  plan?: string;
  memberCount?: number;
  monthlyRenderQuota?: number;
  [key: string]: unknown;
}

export interface PostHogUserProperties {
  email?: string;
  name?: string;
  organizationId?: string;
  planTier?: string;
  creditsBalance?: number;
  [key: string]: unknown;
}

class PostHogClient {
  private apiKey: string | undefined;
  private host: string;
  private distinctId = "anonymous_visitor";
  private userProperties: PostHogUserProperties = {};
  private groups: Record<string, { key: string; properties?: PostHogGroupProperties }> = {};
  private featureFlags: Record<string, boolean> = {
    "kinetic-subtitles-v2": true,
    "multi-channel-blitz": true,
    "creator-voice-cloning": false,
    "instant-stripe-checkout": true,
  };
  private capturedEvents: PostHogEvent[] = [];
  private readonly maxCapturedEvents = 100;

  constructor() {
    this.apiKey =
      process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      process.env.POSTHOG_API_KEY ||
      process.env.POSTHOG_PROJECT_API_KEY;
    this.host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST ||
      process.env.POSTHOG_HOST ||
      "https://us.i.posthog.com";
  }

  /**
   * Initializes or updates PostHog API credentials.
   */
  init(options: { apiKey?: string; host?: string }): void {
    if (options.apiKey) this.apiKey = options.apiKey;
    if (options.host) this.host = options.host;
  }

  /**
   * Identifies the active user and associates persistent traits to their PostHog profile.
   */
  identify(distinctId: string, properties?: PostHogUserProperties): void {
    this.distinctId = distinctId;
    if (properties) {
      this.userProperties = { ...this.userProperties, ...properties };
    }

    this.capture("$identify", {
      $set: this.userProperties,
      distinct_id: distinctId,
    }, distinctId);

    logger.debug(`[PostHog] Identified user '${distinctId}'`, { properties });
  }

  /**
   * Associates the current session with a B2B group (e.g. Workspace / Organization).
   */
  group(groupType: string, groupKey: string, properties?: PostHogGroupProperties): void {
    this.groups[groupType] = { key: groupKey, properties };

    this.capture("$groupidentify", {
      $group_type: groupType,
      $group_key: groupKey,
      $group_set: properties || {},
    });

    logger.debug(`[PostHog] Associated group '${groupType}:${groupKey}'`, { properties });
  }

  /**
   * Tracks a custom business or product analytics event.
   */
  capture(
    eventName: string,
    properties: Record<string, unknown> = {},
    customDistinctId?: string
  ): PostHogEvent {
    const id = customDistinctId || this.distinctId;
    const timestamp = new Date().toISOString();

    const groupPayload: Record<string, string> = {};
    for (const [type, data] of Object.entries(this.groups)) {
      groupPayload[`$groups_${type}`] = data.key;
    }

    const payload: PostHogEvent = {
      event: eventName,
      distinct_id: id,
      timestamp,
      properties: {
        $lib: "autougc-nextjs",
        $lib_version: "0.1.0",
        $current_url: typeof window !== "undefined" ? window.location.href : undefined,
        environment: process.env.NODE_ENV || "development",
        ...this.userProperties,
        ...groupPayload,
        ...properties,
      },
    };

    this.capturedEvents.push(payload);
    if (this.capturedEvents.length > this.maxCapturedEvents) {
      this.capturedEvents.shift();
    }

    logger.info(`[PostHog] Captured event: ${eventName}`, {
      distinctId: id,
      event: eventName,
    });

    this.dispatchToPostHog(payload);
    return payload;
  }

  /**
   * Evaluates if a feature flag is enabled for the current distinct ID.
   */
  isFeatureEnabled(flagKey: string, defaultValue = false): boolean {
    if (flagKey in this.featureFlags) {
      return this.featureFlags[flagKey] ?? defaultValue;
    }
    return defaultValue;
  }

  /**
   * Sets a feature flag value (used in A/B testing or overrides).
   */
  setFeatureFlag(flagKey: string, enabled: boolean): void {
    this.featureFlags[flagKey] = enabled;
  }

  /**
   * Dispatches the event payload to PostHog Ingest API.
   */
  private async dispatchToPostHog(event: PostHogEvent): Promise<void> {
    if (!this.apiKey) return;

    try {
      if (typeof fetch !== "undefined") {
        await fetch(`${this.host}/capture/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: this.apiKey,
            batch: [event],
          }),
        }).catch(() => {
          // Fail silently without interrupting user flow
        });
      }
    } catch {
      // Fail safely
    }
  }

  getCapturedEvents(): PostHogEvent[] {
    return [...this.capturedEvents];
  }

  clear(): void {
    this.capturedEvents = [];
    this.groups = {};
    this.userProperties = {};
  }
}

export const posthog = new PostHogClient();
