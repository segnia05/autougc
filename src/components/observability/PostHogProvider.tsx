"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { posthog } from "@/lib/observability/posthog";
import { datadog } from "@/lib/observability/datadog";
import { sentry } from "@/lib/observability/sentry";

interface PostHogContextType {
  track: (event: string, properties?: Record<string, unknown>) => void;
  identify: (distinctId: string, properties?: Record<string, unknown>) => void;
  group: (groupType: string, groupKey: string, properties?: Record<string, unknown>) => void;
}

const PostHogContext = createContext<PostHogContextType>({
  track: (event, properties) => posthog.capture(event, properties),
  identify: (distinctId, properties) => posthog.identify(distinctId, properties),
  group: (groupType, groupKey, properties) => posthog.group(groupType, groupKey, properties),
});

export function usePostHog(): PostHogContextType {
  return useContext(PostHogContext);
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views automatically on route transition
  useEffect(() => {
    if (pathname) {
      const fullUrl = window.location.href;
      posthog.capture("$pageview", {
        path: pathname,
        url: fullUrl,
        referrer: document.referrer || undefined,
      });

      sentry.addBreadcrumb({
        category: "navigation",
        message: `Navigated to ${pathname}`,
        level: "info",
        type: "navigation",
        data: { path: pathname },
      });

      datadog.increment("web.pageviews", 1, { path: pathname });
    }
  }, [pathname, searchParams]);

  const contextValue: PostHogContextType = {
    track: (event, properties) => {
      posthog.capture(event, properties);
      datadog.increment(`analytics.${event.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`, 1);
      sentry.addBreadcrumb({
        category: "user_action",
        message: `Event: ${event}`,
        level: "info",
        data: properties,
      });
    },
    identify: (distinctId, properties) => {
      posthog.identify(distinctId, properties);
      sentry.setUser({ id: distinctId, ...properties });
    },
    group: (groupType, groupKey, properties) => {
      posthog.group(groupType, groupKey, properties);
      sentry.setTag(groupType, groupKey);
    },
  };

  return (
    <PostHogContext.Provider value={contextValue}>
      {children}
    </PostHogContext.Provider>
  );
}

export default PostHogProvider;
