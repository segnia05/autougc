import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | AutoUGC",
  description: "AutoUGC privacy policy, data security practices, and GDPR compliance.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-4 text-xs font-semibold uppercase tracking-wider">
          Legal & Compliance
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#717E6C] font-mono mb-8">
          Last updated: October 2026 • Effective Date: January 1, 2026
        </p>

        <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-xs text-[#4A544A] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              1. Information We Collect
            </h2>
            <p>
              AutoUGC (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates an autonomous video ad generation platform. When you interact with our website and application, we collect information you provide directly to us:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#717E6C]">
              <li>Product URLs submitted for autonomous parsing and script generation.</li>
              <li>Account registration details (email address, brand name).</li>
              <li>OAuth authorization tokens for scheduling to TikTok, Instagram Reels, and YouTube Shorts.</li>
              <li>Payment and billing information processed securely via Stripe (we do not store raw credit card numbers).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              2. How We Use Your Data
            </h2>
            <p>
              We process product details and submitted media strictly to render vertical video advertisements requested by your account. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#717E6C]">
              <li>Extracting product images, titles, and review snippets to synthesize scripts.</li>
              <li>Generating voiceovers and kinetic subtitle timing tracks via neural synthesis.</li>
              <li>Publishing rendered video MP4 assets directly to your connected social channels when explicitly scheduled.</li>
              <li>We do not sell, rent, or monetize your brand assets or customer data to third-party ad networks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              3. Social Network APIs & Permissions
            </h2>
            <p>
              AutoUGC utilizes official developer APIs for TikTok, Meta (Instagram Graph API), and Google (YouTube Data API). Our access is limited strictly to video upload and scheduling permissions authorized during OAuth connection. You can revoke access at any time via your connected platform security settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              4. Data Retention & Security
            </h2>
            <p>
              Rendered video compositions and temporary audio synthesis stems are retained in encrypted cloud storage for 30 days to facilitate re-downloading and editing, after which they are permanently purged. All data in transit is encrypted using TLS 1.3.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              5. Enterprise Sub-Processor Directory
            </h2>
            <p>
              Under GDPR Article 28, AutoUGC engages vetted third-party data sub-processors under strict Data Processing Agreements (DPAs):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#717E6C]">
              <li><strong>Clerk Inc.</strong> — Identity verification, multi-tenant session authentication, and MFA.</li>
              <li><strong>Stripe Inc.</strong> — PCI-DSS Level 1 compliant subscription billing and payment processing.</li>
              <li><strong>Neon Inc.</strong> — Serverless multi-region PostgreSQL primary relational database.</li>
              <li><strong>Google LLC</strong> — Gemini AI infrastructure for automated script and video creative synthesis.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#1B231B]">
              6. Data Protection Officer (DPO) & Contact
            </h2>
            <p>
              For GDPR Article 15–22 inquiries, data access/erasure requests, or to contact our appointed Data Protection Officer, please email:{" "}
              <a href="mailto:dpo@autougc.ai" className="text-[#1F3824] font-semibold hover:underline">
                dpo@autougc.ai
              </a>{" "}
              or our legal compliance team at{" "}
              <a href="mailto:privacy@autougc.ai" className="text-[#1F3824] font-semibold hover:underline">
                privacy@autougc.ai
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
