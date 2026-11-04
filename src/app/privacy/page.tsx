import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex flex-col font-sans selection:bg-[#D95D39] selection:text-white">
      <Navbar />

      <main id="main-content" className="flex-1 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4 mb-12 border-b border-[#E5E0D8]/60 pb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D95D39] bg-[#D95D39]/10 px-3 py-1 rounded-full">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181B] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#8E8B85]">
            Effective Date: January 1, 2026 &bull; Last Updated: November 1, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#52525B] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              1. Information We Collect
            </h2>
            <p>
              AutoUGC (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates an autonomous video ad generation platform. When you interact with our website and application, we collect information you provide directly to us:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#8E8B85]">
              <li>Product URLs submitted for autonomous parsing and script generation.</li>
              <li>Account registration details (email address, brand name).</li>
              <li>OAuth authorization tokens for scheduling to TikTok, Instagram Reels, and YouTube Shorts.</li>
              <li>Payment and billing information processed securely via our Merchant of Record partners (Polar.sh / Paddle.com). We do not store raw credit card numbers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              2. How We Use Your Data
            </h2>
            <p>
              We process product details and submitted media strictly to render vertical video advertisements requested by your account. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#8E8B85]">
              <li>Extracting product images, titles, and review snippets to synthesize scripts.</li>
              <li>Generating voiceovers and kinetic subtitle timing tracks via neural synthesis.</li>
              <li>Publishing rendered video MP4 assets directly to your connected social channels when explicitly scheduled.</li>
              <li>We do not sell, rent, or monetize your brand assets or customer data to third-party ad networks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              3. Social Network APIs & Permissions
            </h2>
            <p>
              AutoUGC utilizes official developer APIs for TikTok, Meta (Instagram Graph API), and Google (YouTube Data API). Our access is limited strictly to video upload and scheduling permissions authorized during OAuth connection. You can revoke access at any time via your connected platform security settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              4. Data Retention & Security
            </h2>
            <p>
              Rendered video compositions and temporary audio synthesis stems are retained in encrypted cloud storage for 30 days to facilitate re-downloading and editing, after which they are permanently purged. All data in transit is encrypted using TLS 1.3.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              5. Enterprise Sub-Processor Directory
            </h2>
            <p>
              Under GDPR Article 28, AutoUGC engages vetted third-party data sub-processors under strict Data Processing Agreements (DPAs):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#8E8B85]">
              <li><strong>Clerk Inc.</strong> — Identity verification, multi-tenant session authentication, and MFA.</li>
              <li><strong>Polar.sh / Paddle.com / Stripe Inc.</strong> — PCI-DSS Level 1 compliant Merchant of Record (MoR) billing platforms and worldwide sales tax/VAT remittance.</li>
              <li><strong>Neon Inc.</strong> — Serverless multi-region PostgreSQL primary relational database.</li>
              <li><strong>Google LLC</strong> — Gemini AI infrastructure for automated script and video creative synthesis.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              6. Data Protection Officer (DPO) & Contact
            </h2>
            <p>
              For GDPR Article 15–22 inquiries, data access/erasure requests, or to contact our appointed Data Protection Officer, please email:{" "}
              <a href="mailto:dpo@autougc.ai" className="text-[#D95D39] font-semibold hover:underline">
                dpo@autougc.ai
              </a>{" "}
              or our legal compliance team at{" "}
              <a href="mailto:privacy@autougc.ai" className="text-[#D95D39] font-semibold hover:underline">
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
