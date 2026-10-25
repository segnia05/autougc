import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Privacy Policy | AutoUGC",
  description: "AutoUGC privacy policy, data security practices, and GDPR compliance.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <Badge variant="neutral" size="sm" className="mb-4 font-mono">
          LEGAL & COMPLIANCE
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-display)] mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-mono mb-10">
          Last updated: October 2026 • Effective Date: January 1, 2026
        </p>

        <div className="space-y-8 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-subtle pt-8">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              1. Information We Collect
            </h2>
            <p>
              AutoUGC (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates an autonomous video ad generation platform. When you interact with our website and application, we collect information you provide directly to us:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[var(--text-muted)]">
              <li>Product URLs submitted for autonomous parsing and script generation.</li>
              <li>Account registration details (email address, brand name).</li>
              <li>OAuth authorization tokens for scheduling to TikTok, Instagram Reels, and YouTube Shorts.</li>
              <li>Payment and billing information processed securely via Stripe (we do not store raw credit card numbers).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              2. How We Use Your Data
            </h2>
            <p>
              We process product details and submitted media strictly to render vertical video advertisements requested by your account. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[var(--text-muted)]">
              <li>Extracting product images, titles, and review snippets to synthesize scripts.</li>
              <li>Generating voiceovers and kinetic subtitle timing tracks via neural synthesis.</li>
              <li>Publishing rendered video MP4 assets directly to your connected social channels when explicitly scheduled.</li>
              <li>We do not sell, rent, or monetize your brand assets or customer data to third-party ad networks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              3. Social Network APIs & Permissions
            </h2>
            <p>
              AutoUGC utilizes official developer APIs for TikTok, Meta (Instagram Graph API), and Google (YouTube Data API). Our access is limited strictly to video upload and scheduling permissions authorized during OAuth connection. You can revoke access at any time via your connected platform security settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              4. Data Retention & Security
            </h2>
            <p>
              Rendered video compositions and temporary audio synthesis stems are retained in encrypted cloud storage for 30 days to facilitate re-downloading and editing, after which they are permanently purged. All data in transit is encrypted using TLS 1.3.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              5. Contact Us
            </h2>
            <p>
              If you have any questions or data deletion requests regarding this Privacy Policy, please contact our team at{" "}
              <a href="mailto:privacy@autougc.ai" className="text-[var(--accent-primary)] hover:underline">
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
