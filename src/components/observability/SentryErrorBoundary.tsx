"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { sentry } from "@/lib/observability/sentry";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  eventId: string | null;
  error: Error | null;
}

/**
 * Enterprise Sentry React Error Boundary.
 *
 * Catches unhandled client component exceptions, records stack traces
 * and breadcrumbs to Sentry, and presents an accessible recovery UI.
 */
export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      eventId: null,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      eventId: null,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const eventId = sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
      tags: {
        boundary: "SentryErrorBoundary",
      },
    });

    this.setState({ eventId });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      eventId: null,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[400px] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-[#1B231B] mb-2">
              Something went wrong
            </h2>

            <p className="text-sm text-[#4A544A] mb-6 leading-relaxed">
              An unexpected application error occurred. An incident diagnostic report has
              been logged to Sentry for our engineering team.
            </p>

            {this.state.eventId && (
              <p className="text-xs font-mono text-neutral-400 bg-neutral-50 py-1.5 px-3 rounded-lg border border-neutral-200 mb-6">
                Incident ID: {this.state.eventId}
              </p>
            )}

            <Button
              variant="primary"
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;
