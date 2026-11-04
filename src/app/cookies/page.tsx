import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Cookie, Settings, CheckCircle2, FileText } from "lucide-react";
import CookiePreferencesTrigger from "@/components/compliance/CookiePreferencesTrigger";

export const metadata = {
  title: "Cookie Policy | AutoUGC",
  description: "AutoUGC cookie policy, ePrivacy directive compliance, cookie categorization, and consent preference management.",
};

export default function CookiePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] selection:bg-[#D95D39] selection:text-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F1EA] text-[#D95D39] border border-[#E5E0D8] mb-4 text-xs font-semibold uppercase tracking-wider">
          <Cookie className="w-3.5 h-3.5" aria-hidden="true" />
          ePrivacy & GDPR Consent
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-display)] text-[#18181B] mb-3">
          Cookie Policy
        </h1>
        <p className="text-xs text-[#8E8B85] font-mono mb-8">
          Version 2.0 • Last Revised: October 29, 2026 • Effective Date: January 1, 2026
        </p>

        <div className="bg-white border border-[#E5E0D8]/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-xs text-[#52525B] leading-relaxed">
          {/* Section 1: Intro */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are compact text files placed on your device by websites you visit. They are widely used to ensure websites function securely, remember your user preferences, authenticate sessions, and provide anonymized performance telemetry.
            </p>
            <p>
              Under the <strong>EU ePrivacy Directive (Directive 2002/58/EC)</strong> and GDPR, non-essential cookies require prior, freely given, explicit consent before being set on your browser.
            </p>
          </section>

          {/* Interactive Trigger Banner */}
          <div className="p-6 rounded-2xl bg-[#F4F1EA]/60 border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#D95D39] text-sm mb-1">
                Your Privacy, Your Choice
              </h3>
              <p className="text-xs text-[#52525B]">
                You can review, modify, or withdraw your cookie consent preferences at any time.
              </p>
            </div>
            <CookiePreferencesTrigger />
          </div>

          {/* Cookie Categories */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-[#18181B]">
              2. Cookie Categories We Use
            </h2>

            <div className="space-y-4">
              {/* Category 1 */}
              <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAF8F5]/40">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#18181B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D95D39]" aria-hidden="true" />
                    Strictly Necessary Cookies
                  </h3>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                    Always Active
                  </span>
                </div>
                <p className="text-[#8E8B85] mb-3">
                  These cookies are essential for website security, Clerk multi-tenant authentication, CSRF origin verification, and load balancing. The website cannot function without these cookies.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-neutral-200 bg-white">
                    <thead className="bg-neutral-50 text-[#18181B]">
                      <tr>
                        <th className="p-2 border-b border-neutral-200">Name</th>
                        <th className="p-2 border-b border-neutral-200">Provider</th>
                        <th className="p-2 border-b border-neutral-200">Duration</th>
                        <th className="p-2 border-b border-neutral-200">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-[#8E8B85]">
                      <tr>
                        <td className="p-2 font-mono">__session</td>
                        <td className="p-2">Clerk</td>
                        <td className="p-2">Session</td>
                        <td className="p-2">JWT auth token for signed-in dashboard users</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono">autougc_cookie_consent</td>
                        <td className="p-2">AutoUGC</td>
                        <td className="p-2">1 Year</td>
                        <td className="p-2">Stores your cookie consent preferences</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category 2 */}
              <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAF8F5]/40">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#18181B] flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    Analytics & Performance Cookies
                  </h3>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Consent Required
                  </span>
                </div>
                <p className="text-[#8E8B85] mb-3">
                  Help us understand how creators navigate AutoUGC, measure video generation latency, and identify UI errors via PostHog and Datadog. All data is aggregated and anonymized.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-neutral-200 bg-white">
                    <thead className="bg-neutral-50 text-[#18181B]">
                      <tr>
                        <th className="p-2 border-b border-neutral-200">Name</th>
                        <th className="p-2 border-b border-neutral-200">Provider</th>
                        <th className="p-2 border-b border-neutral-200">Duration</th>
                        <th className="p-2 border-b border-neutral-200">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-[#8E8B85]">
                      <tr>
                        <td className="p-2 font-mono">ph_*_posthog</td>
                        <td className="p-2">PostHog</td>
                        <td className="p-2">1 Year</td>
                        <td className="p-2">Funnel conversion telemetry and feature flags</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono">_dd_s</td>
                        <td className="p-2">Datadog</td>
                        <td className="p-2">4 Hours</td>
                        <td className="p-2">Browser performance & Core Web Vitals telemetry</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Browser Controls */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              3. Managing Cookies in Your Browser
            </h2>
            <p>
              Most modern web browsers allow you to manage cookie preferences directly in browser settings (Chrome, Safari, Firefox, Edge). Please note that disabling Strictly Necessary cookies may prevent you from logging in or using the video rendering studio.
            </p>
          </section>

          {/* Cross Links */}
          <section className="pt-6 border-t border-neutral-200 flex flex-wrap gap-4 text-xs font-semibold text-[#D95D39]">
            <Link href="/privacy" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Terms of Service
            </Link>
            <Link href="/retention" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Data Retention Schedule
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
