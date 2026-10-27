import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | AutoUGC",
  description: "AutoUGC commercial terms of service, commercial video rights, and subscription rules.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-4 text-xs font-semibold uppercase tracking-wider">
          Legal & Compliance
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-3">
          Terms of Service
        </h1>
        <p className="text-xs text-[#717E6C] font-mono mb-8">
          Last updated: October 2026 • Effective Date: January 1, 2026
        </p>

        <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-xs text-[#4A544A] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using AutoUGC (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, you may not access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              2. Commercial Rights & Video Ownership
            </h2>
            <p>
              Upon rendering and exporting video content generated using active paid subscription credits, you are granted an irrevocable, perpetual, worldwide, royalty-free commercial license to deploy, distribute, monetize, and run paid advertisements using the rendered video files.
            </p>
            <p>
              You warrant that you own or possess necessary authorization to utilize any product URLs, trademarks, and brand assets submitted to the Service for parsing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              3. Subscription Billing & Cancellation
            </h2>
            <p>
              Paid subscription plans are billed on a recurring monthly or annual basis in accordance with the tier selected at checkout. You may cancel your subscription at any time via the billing management portal. Cancellations take effect at the end of the current billing cycle, with full access preserved until that date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              4. Prohibited Uses
            </h2>
            <p>
              You agree not to use the Service to generate misleading, fraudulent, defamatory, or unlawful video advertising content, nor to violate any advertising policies established by third-party distribution platforms including TikTok, Meta, and Google.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              5. Limitation of Liability
            </h2>
            <p>
              AutoUGC provides the Service on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. In no event shall AutoUGC be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the Service.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
