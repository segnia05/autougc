export type AnalyticsEvent =
  | "url_entered"
  | "scrape_completed"
  | "hook_selected"
  | "voice_changed"
  | "preview_played"
  | "export_clicked"
  | "schedule_submitted"
  | "checkout_started"
  | "subscription_activated";

export interface EventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * High-performance telemetry dispatcher for conversion funnels and user actions.
 * Zero render blocking, non-intrusive error handling.
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
): void {
  // If running on server or in SSR pass, return early
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        path: window.location.pathname,
        referrer: document.referrer || undefined,
      },
    };

    // If PostHog is loaded on the window object:
    if ((window as any).posthog && typeof (window as any).posthog.capture === "function") {
      (window as any).posthog.capture(event, payload.properties);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[Telemetry] ${event}:`, payload.properties);
    }
  } catch (err) {
    // Non-blocking catch to ensure telemetry never disrupts user experience
    console.debug("Telemetry dispatch skipped:", err);
  }
}
