import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, FileText, Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service | AutoUGC",
  description: "AutoUGC commercial SaaS terms, video ad commercial ownership, acceptable use policy, and 99.9% uptime SLA.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-4 text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" aria-hidden="true" />
          Commercial SaaS Agreement
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-3">
          Terms of Service
        </h1>
        <p className="text-xs text-[#717E6C] font-mono mb-8">
          Version 3.1 • Last Revised: October 29, 2026 • Effective Date: January 1, 2026
        </p>

        <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-xs text-[#4A544A] leading-relaxed">
          {/* Section 1: Agreement */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              1. Acceptance & Scope of Agreement
            </h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;Customer&rdquo;, &ldquo;you&rdquo;) and AutoUGC Inc. (&ldquo;AutoUGC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing the AutoUGC website, Studio canvas, API, or automated publishing engine, you agree to comply with and be bound by these Terms.
            </p>
          </section>

          {/* Section 2: Commercial License */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              2. Commercial Rights & Video Ad Ownership
            </h2>
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <h3 className="font-bold text-[#1B231B] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                100% Commercial Usage Rights
              </h3>
              <p className="text-[#4A544A]">
                Upon rendering any vertical video creative using paid account credits, Customer is granted an irrevocable, perpetual, worldwide, fully paid-up commercial license to utilize, modify, display, monetize, and deploy the rendered MP4 video ads across paid ad platforms (TikTok Ads, Meta Ads Manager, YouTube Shorts) and organic channels.
              </p>
            </div>
            <p>
              Customer retains all intellectual property rights in and to all brand assets, logos, and target product URLs submitted to the Service. AutoUGC does not claim ownership over customer inputs or final generated creatives.
            </p>
          </section>

          {/* Section 3: Subscription & Billing */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              3. Subscription Plans, Credits & Refund Guarantee
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#717E6C]">
              <li>
                <strong className="text-[#1B231B]">Pricing Tiers:</strong> Subscriptions are billed on a recurring monthly or annual basis: Starter ($49/mo, 20 videos, 1 connected account), Growth ($89/mo, 60 videos, 5 accounts), and Scale ($199/mo, 180 videos, 15 accounts).
              </li>
              <li>
                <strong className="text-[#1B231B]">Atomic Credit Ledger:</strong> Credits are deducted atomically upon successful video export. Unused monthly video credits roll over for 30 days while a subscription remains active.
              </li>
              <li>
                <strong className="text-[#1B231B]">14-Day Money-Back Guarantee:</strong> New subscribers may request a full 100% refund within 14 calendar days of initial subscription signup by emailing <code>billing@autougc.ai</code>, provided fewer than 5 credits have been consumed.
              </li>
              <li>
                <strong className="text-[#1B231B]">Self-Service Cancellation:</strong> Customers may cancel their subscription at any time via the Stripe Customer Portal. Access continues uninterrupted through the end of the current paid billing period.
              </li>
            </ul>
          </section>

          {/* Section 4: Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              4. Acceptable Use Policy (AUP)
            </h2>
            <p>
              Customer agrees not to submit content or configure video campaigns that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#717E6C]">
              <li>Promote counterfeit goods, illegal narcotics, weapons, or fraudulent financial schemes.</li>
              <li>Generate deceptive or non-consensual deepfakes of real individuals without certified persona rights.</li>
              <li>Violate the Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising.</li>
              <li>Circumvent or abuse our sliding-window rate limits or multi-tenant database isolation boundaries.</li>
            </ul>
          </section>

          {/* Section 5: Service Level Agreement */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              5. Service Level Agreement (99.9% Uptime SLA)
            </h2>
            <p>
              AutoUGC targets a minimum 99.9% monthly uptime availability for video rendering and scheduled social dispatch. In the event of confirmed service outages exceeding SLA thresholds (excluding scheduled maintenance), paid accounts are eligible for credit remedies applied to subsequent billing cycles.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" aria-hidden="true" />
              6. Limitation of Liability
            </h2>
            <p className="text-[#717E6C]">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AUTOUGC INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS REPUTATION. AUTOUGC&rsquo;S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE AMOUNT ACTUALLY PAID BY CUSTOMER TO AUTOUGC IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* Section 7: Governing Law */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              7. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. Any dispute arising under these Terms shall be resolved via binding confidential arbitration administered by the American Arbitration Association (AAA).
            </p>
          </section>

          {/* Cross Links */}
          <section className="pt-6 border-t border-neutral-200 flex flex-wrap gap-4 text-xs font-semibold text-[#1F3824]">
            <Link href="/privacy" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Privacy Policy
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
