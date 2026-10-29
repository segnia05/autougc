import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | AutoUGC",
  description: "AutoUGC enterprise privacy policy, GDPR Art. 13/14 disclosures, CCPA rights, and sub-processor directory.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-4 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" aria-hidden="true" />
          GDPR & CCPA Compliant
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#717E6C] font-mono mb-8">
          Version 2.4 • Last Revised: October 29, 2026 • Effective Date: January 1, 2026
        </p>

        <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-xs text-[#4A544A] leading-relaxed">
          {/* Executive Overview */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1F3824]" aria-hidden="true" />
              1. Data Controller & Scope
            </h2>
            <p>
              AutoUGC Inc. (&ldquo;AutoUGC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provides an autonomous vertical video ad generation and social distribution SaaS platform. This Privacy Policy governs our processing of personal data collected via our website, API, creative studio, and social dispatch pipelines in accordance with the <strong>EU General Data Protection Regulation (GDPR)</strong>, the <strong>UK Data Protection Act 2018 (UK-GDPR)</strong>, and the <strong>California Consumer Privacy Act (CCPA/CPRA)</strong>.
            </p>
            <p>
              Our appointed Data Protection Officer (DPO) may be contacted directly at{" "}
              <a href="mailto:dpo@autougc.ai" className="text-[#1F3824] font-semibold hover:underline">
                dpo@autougc.ai
              </a>.
            </p>
          </section>

          {/* Data We Collect */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-[#1B231B]">
              2. Categories of Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#F6F7F2]/50">
                <h3 className="font-bold text-[#1B231B] mb-1">Account & Identity</h3>
                <p className="text-[#717E6C]">
                  Full name, work email address, organization name, role (owner, admin, member), and Clerk authentication tokens.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#F6F7F2]/50">
                <h3 className="font-bold text-[#1B231B] mb-1">Brand Assets & Product URLs</h3>
                <p className="text-[#717E6C]">
                  Scraped e-commerce URLs, product titles, images, customer reviews, brand color hex codes, and logos.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#F6F7F2]/50">
                <h3 className="font-bold text-[#1B231B] mb-1">OAuth Social Tokens</h3>
                <p className="text-[#717E6C]">
                  OAuth access and refresh tokens for TikTok, Instagram Reels, and YouTube Shorts. Stored encrypted at rest via AES-256-GCM.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#F6F7F2]/50">
                <h3 className="font-bold text-[#1B231B] mb-1">Billing & Transactions</h3>
                <p className="text-[#717E6C]">
                  Payment tokens, subscription history, invoices, and credit balance ledger processed by Stripe. We never store raw card numbers.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Basis for Processing */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              3. Lawful Basis for Processing (GDPR Art. 6)
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#717E6C]">
              <li>
                <strong className="text-[#1B231B]">Performance of a Contract (Art. 6(1)(b)):</strong> Rendering video creatives, synthesizing voiceovers, generating scripts, and dispatching scheduled posts on behalf of your active subscription.
              </li>
              <li>
                <strong className="text-[#1B231B]">Legitimate Interests (Art. 6(1)(f)):</strong> System security, sliding-window rate limiting, DDoS mitigation, fraud prevention, and system health telemetry.
              </li>
              <li>
                <strong className="text-[#1B231B]">Consent (Art. 6(1)(a)):</strong> Non-essential analytics (PostHog) and marketing cookies collected via our Cookie Consent Manager.
              </li>
              <li>
                <strong className="text-[#1B231B]">Legal Obligation (Art. 6(1)(c)):</strong> Retaining fiscal transaction records and invoices for tax reporting.
              </li>
            </ul>
          </section>

          {/* Sub-Processor Directory */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              4. Authorized Sub-Processors
            </h2>
            <p>
              We partner with certified enterprise sub-processors under strict Data Processing Agreements (DPAs) incorporating standard contractual clauses (SCCs):
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-neutral-200 text-xs">
                <thead>
                  <tr className="bg-neutral-50 text-[#1B231B] font-semibold border-b border-neutral-200">
                    <th className="p-2.5">Sub-Processor</th>
                    <th className="p-2.5">Purpose</th>
                    <th className="p-2.5">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[#717E6C]">
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">Clerk Inc.</td>
                    <td className="p-2.5">Authentication & Multi-Tenant Session Management</td>
                    <td className="p-2.5">United States (SOC 2 Type II)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">Stripe Inc.</td>
                    <td className="p-2.5">Payment Processing & Subscription Billing</td>
                    <td className="p-2.5">United States / EU (PCI-DSS Level 1)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">Neon Inc.</td>
                    <td className="p-2.5">Serverless Managed PostgreSQL Database</td>
                    <td className="p-2.5">US-East / AWS</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">Google Cloud / Gemini</td>
                    <td className="p-2.5">AI Hook & Script Generation (Zero Data Retention)</td>
                    <td className="p-2.5">United States</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">PostHog Inc.</td>
                    <td className="p-2.5">Product Analytics & Feature Flags (Consent-gated)</td>
                    <td className="p-2.5">United States / EU Cloud</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">Functional Software (Sentry)</td>
                    <td className="p-2.5">Error Tracking & Exception Capture</td>
                    <td className="p-2.5">United States</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-[#1B231B]">Datadog Inc.</td>
                    <td className="p-2.5">APM Metrics & Infrastructure Monitoring</td>
                    <td className="p-2.5">United States</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Data Subject Rights */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              5. Your GDPR & CCPA Data Subject Rights
            </h2>
            <p>
              Regardless of your geographic location, AutoUGC provides all verified account holders with full self-service Data Subject Rights:
            </p>
            <ul className="space-y-2 text-[#717E6C]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3824] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Right to Access & Portability (Art. 15 & 20):</strong> Export your complete account dossier, projects, scripts, and video history via our machine-readable JSON endpoint at <code>/api/v1/compliance/export</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3824] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Right to Erasure / &ldquo;Right to be Forgotten&rdquo; (Art. 17):</strong> Request permanent account deletion via <code>/api/v1/compliance/erasure</code>, permanently removing personal data and revoking all social tokens with a cryptographic certificate.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3824] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Right to Rectification (Art. 16):</strong> Update or correct your brand details, organization name, and connected accounts anytime inside the Command Center.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3824] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>California &ldquo;Do Not Sell or Share My Info&rdquo;:</strong> AutoUGC does not sell personal information or share customer data for cross-context behavioral advertising.
                </span>
              </li>
            </ul>
          </section>

          {/* Cross Links */}
          <section className="pt-6 border-t border-neutral-200 flex flex-wrap gap-4 text-xs font-semibold text-[#1F3824]">
            <Link href="/terms" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Cookie Policy
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
