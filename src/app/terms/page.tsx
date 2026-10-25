import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Terms of Service | AutoUGC",
  description: "AutoUGC commercial terms of service, commercial video rights, and subscription rules.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <Badge variant="neutral" size="sm" className="mb-4 font-mono">
          LEGAL & COMPLIANCE
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-display)] mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-mono mb-10">
          Last updated: October 2026 • Effective Date: January 1, 2026
        </p>

        <div className="space-y-8 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-subtle pt-8">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using AutoUGC (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, you may not access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              2. Commercial Rights & Video Ownership
            </h2>
            <p>
              Upon rendering and exporting video content generated using active paid subscription credits or free promotional allowances, you are granted an irrevocable, perpetual, worldwide, royalty-free commercial license to deploy, distribute, monetize, and run paid advertisements using the rendered video files.
            </p>
            <p>
              You warrant that you own or possess necessary authorization to utilize any product URLs, trademarks, and brand assets submitted to the Service for parsing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              3. Subscription Billing & Cancellation
            </h2>
            <p>
              Paid subscription plans are billed on a recurring monthly or annual basis in accordance with the tier selected at checkout. You may cancel your subscription at any time via the billing management portal. Cancellations take effect at the end of the current billing cycle, with full access preserved until that date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              4. Prohibited Uses
            </h2>
            <p>
              You agree not to use the Service to generate misleading, fraudulent, defamatory, or unlawful video advertising content, nor to violate any advertising policies established by third-party distribution platforms including TikTok, Meta, and Google.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
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
