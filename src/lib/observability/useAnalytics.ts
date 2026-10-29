"use client";

import { usePostHog } from "@/components/observability/PostHogProvider";
import { sentry } from "./sentry";
import { datadog } from "./datadog";

/**
 * Universal Analytics & Observability React Hook.
 *
 * Provides a clean interface for client components to track user conversions,
 * feature engagements, and errors across PostHog, Datadog, and Sentry.
 */
export function useAnalytics() {
  const { track, identify, group } = usePostHog();

  const trackEvent = (eventName: string, properties: Record<string, unknown> = {}) => {
    track(eventName, properties);
  };

  const trackConversion = (
    flowName: string,
    step: string | number,
    properties: Record<string, unknown> = {}
  ) => {
    track("funnel_step_completed", {
      flow: flowName,
      step,
      ...properties,
    });
    datadog.increment("funnel.conversion", 1, { flow: flowName, step: String(step) });
  };

  const captureUserError = (error: unknown, context?: Record<string, unknown>) => {
    return sentry.captureException(error, {
      extra: context,
      tags: { source: "client_hook" },
    });
  };

  return {
    track: trackEvent,
    trackConversion,
    identify,
    group,
    captureError: captureUserError,
    addBreadcrumb: (message: string, data?: Record<string, unknown>) =>
      sentry.addBreadcrumb({ message, data, level: "info" }),
  };
}

export default useAnalytics;
