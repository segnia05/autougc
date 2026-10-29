"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check, ShieldCheck, Sliders } from "lucide-react";
import Button from "@/components/ui/Button";

export interface CookieConsentPreferences {
  strictlyNecessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = "autougc_cookie_consent";

export function getStoredCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(preferences: CookieConsentPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    // Write cookie for server-side / edge inspection
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(
      JSON.stringify(preferences)
    )}; path=/; max-age=31536000; SameSite=Lax`;

    window.dispatchEvent(
      new CustomEvent("cookie_consent_updated", { detail: preferences })
    );
  } catch {
    // Fail safely
  }
}

export default function CookieConsentBanner() {
  const [hasChecked, setHasChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Preference state
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = getStoredCookieConsent();
      if (!stored) {
        setIsVisible(true);
      } else {
        setAnalyticsAllowed(stored.analytics);
        setMarketingAllowed(stored.marketing);
      }
      setHasChecked(true);
    }, 0);

    const handleOpenModal = () => {
      setIsPreferencesOpen(true);
    };

    window.addEventListener("open_cookie_preferences", handleOpenModal);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("open_cookie_preferences", handleOpenModal);
    };
  }, []);

  const handleAcceptAll = () => {
    const preferences: CookieConsentPreferences = {
      strictlyNecessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    saveCookieConsent(preferences);
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleRejectNonEssential = () => {
    const preferences: CookieConsentPreferences = {
      strictlyNecessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    saveCookieConsent(preferences);
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  const handleSaveCustom = () => {
    const preferences: CookieConsentPreferences = {
      strictlyNecessary: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
      timestamp: new Date().toISOString(),
    };
    saveCookieConsent(preferences);
    setIsVisible(false);
    setIsPreferencesOpen(false);
  };

  if (!hasChecked) return null;

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {isVisible && !isPreferencesOpen && (
        <section
          role="region"
          aria-label="Cookie and Privacy Consent Banner"
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-white/95 backdrop-blur-md border border-[#CBD5C4] rounded-2xl p-5 shadow-2xl text-[#1B231B] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 text-xs leading-relaxed text-[#4A544A]">
                <h3 className="text-sm font-bold text-[#1B231B] mb-1">
                  We respect your privacy
                </h3>
                <p>
                  AutoUGC uses strictly necessary cookies for authentication and optional analytics cookies to measure video generation speed. See our{" "}
                  <Link href="/cookies" className="text-[#1F3824] underline font-medium hover:text-black">
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#1F3824] underline font-medium hover:text-black">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                variant="primary"
                onClick={handleAcceptAll}
                className="text-xs px-4 py-2 flex items-center gap-1.5 font-bold"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Accept All
              </Button>

              <Button
                variant="secondary"
                onClick={handleRejectNonEssential}
                className="text-xs px-4 py-2 font-medium"
              >
                Reject Non-Essential
              </Button>

              <Button
                variant="ghost"
                onClick={() => setIsPreferencesOpen(true)}
                className="text-xs px-3 py-2 text-[#4A544A] hover:text-[#1B231B] flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
                Customize
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Modal: Customize Cookie Preferences */}
      {isPreferencesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsPreferencesOpen(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-neutral-200 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1F3824]" aria-hidden="true" />
                <h2 id="cookie-modal-title" className="text-lg font-bold text-[#1B231B]">
                  Cookie Consent Preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(false)}
                aria-label="Close cookie preferences modal"
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-[#4A544A] leading-relaxed">
              Customize which categories of cookies you permit AutoUGC to store on your device in accordance with GDPR and the ePrivacy Directive.
            </p>

            <div className="space-y-4">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1B231B]">Strictly Necessary</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 font-semibold">
                      Always Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717E6C] leading-relaxed">
                    Essential for authentication, CSRF origin verification, and system security. Cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Strictly Necessary Cookies (Always Active)"
                  className="mt-1 h-4 w-4 rounded accent-[#1F3824] cursor-not-allowed opacity-70"
                />
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1B231B]">Analytics & Performance</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Optional
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717E6C] leading-relaxed">
                    Enables PostHog and Datadog to gather anonymized telemetry regarding video render latencies and app stability.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="toggle-analytics"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  aria-label="Allow Analytics & Performance Cookies"
                  className="mt-1 h-4 w-4 rounded accent-[#1F3824] cursor-pointer"
                />
              </div>

              {/* Category 3: Marketing & Attribution */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1B231B]">Marketing & Attribution</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Optional
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717E6C] leading-relaxed">
                    Tracks referral campaign performance and partnership attribution.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="toggle-marketing"
                  checked={marketingAllowed}
                  onChange={(e) => setMarketingAllowed(e.target.checked)}
                  aria-label="Allow Marketing & Attribution Cookies"
                  className="mt-1 h-4 w-4 rounded accent-[#1F3824] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button
                variant="outline"
                onClick={handleRejectNonEssential}
                className="text-xs px-4 py-2"
              >
                Reject Non-Essential
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveCustom}
                className="text-xs px-5 py-2 font-bold"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
