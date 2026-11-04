import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, ShieldCheck, Trash2, FileText } from "lucide-react";

export const metadata = {
  title: "Data Retention Policy | AutoUGC",
  description: "AutoUGC enterprise data retention schedule, statutory tax rules, scratch asset TTL, and cryptographic data deletion protocol.",
};

export default function RetentionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] selection:bg-[#D95D39] selection:text-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F1EA] text-[#D95D39] border border-[#E5E0D8] mb-4 text-xs font-semibold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          Enterprise Data Lifecycle
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-display)] text-[#18181B] mb-3">
          Data Retention Policy
        </h1>
        <p className="text-xs text-[#8E8B85] font-mono mb-8">
          Version 2.2 • Last Revised: October 29, 2026 • Effective Date: January 1, 2026
        </p>

        <div className="bg-white border border-[#E5E0D8]/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-xs text-[#52525B] leading-relaxed">
          {/* Section 1: Philosophy */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D95D39]" aria-hidden="true" />
              1. Data Minimization & Retention Principles
            </h2>
            <p>
              AutoUGC adheres strictly to the principle of <strong>Data Minimization (GDPR Art. 5(1)(c))</strong> and <strong>Storage Limitation (GDPR Art. 5(1)(e))</strong>. We only retain personal and operational data for as long as necessary to fulfill the specific commercial, rendering, and legal purposes for which it was collected.
            </p>
          </section>

          {/* Section 2: Complete Schedule Table */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              2. Data Category Retention Schedule
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-neutral-200 text-xs">
                <thead>
                  <tr className="bg-neutral-50 text-[#18181B] font-semibold border-b border-neutral-200">
                    <th className="p-3">Data Category</th>
                    <th className="p-3">Retention Period</th>
                    <th className="p-3">Legal & Operational Basis</th>
                    <th className="p-3">Disposal Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[#8E8B85]">
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">Scraped Product Caches</td>
                    <td className="p-3 font-mono text-emerald-800 font-semibold">7 Days</td>
                    <td className="p-3">Temporary cache for script generation previews</td>
                    <td className="p-3">Automated TTL purge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">Audio WAV Stems & Scratch Chunks</td>
                    <td className="p-3 font-mono text-emerald-800 font-semibold">48 Hours</td>
                    <td className="p-3">Remotion video timeline compilation scratch</td>
                    <td className="p-3">Automated TTL purge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">Completed 1080p Video Ads</td>
                    <td className="p-3 font-mono text-neutral-800 font-semibold">Active Sub + 30 Days</td>
                    <td className="p-3">Customer access to rendered vault downloads</td>
                    <td className="p-3">S3 bucket lifecycle purge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">Inactive Free-Tier Accounts</td>
                    <td className="p-3 font-mono text-neutral-800 font-semibold">90 Days</td>
                    <td className="p-3">Resource recycling of abandoned test previews</td>
                    <td className="p-3">Notice followed by archival</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">OAuth Social Tokens</td>
                    <td className="p-3 font-mono text-neutral-800 font-semibold">Until Revocation</td>
                    <td className="p-3">Publishing permissions granted by user</td>
                    <td className="p-3">AES key zeroing & purge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">Billing, Invoices & Tax Data</td>
                    <td className="p-3 font-mono text-amber-800 font-semibold">7 Years</td>
                    <td className="p-3">Statutory tax compliance (US IRC / EU VAT)</td>
                    <td className="p-3">Encrypted cold storage purge</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">System Access Logs & Telemetry</td>
                    <td className="p-3 font-mono text-neutral-800 font-semibold">30 Days Hot / 90 Days Cold</td>
                    <td className="p-3">Security monitoring & DDoS investigation</td>
                    <td className="p-3">Log rotation deletion</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#18181B]">Certificates of Erasure</td>
                    <td className="p-3 font-mono text-neutral-800 font-semibold">5 Years</td>
                    <td className="p-3">GDPR Art. 5(2) accountability compliance</td>
                    <td className="p-3">Immutable cryptographic record</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Automated Cleanup Engine */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#D95D39]" aria-hidden="true" />
              3. Automated Retention Enforcement Engine
            </h2>
            <p>
              AutoUGC does not rely on manual deletion procedures. Our platform runs an automated daily retention worker (<code>src/lib/compliance/retentionManager.ts</code>) that scans database tables and object storage buckets:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#8E8B85]">
              <li>Executes time-to-live (TTL) expiration queries against scraped project previews.</li>
              <li>Cleans up temporary synthesized speech stems and rendering frames past 48 hours.</li>
              <li>Performs cryptographic zeroization of revoked OAuth tokens.</li>
              <li>Issues a verified SHA-256 cryptographic retention manifest upon completion.</li>
            </ul>
          </section>

          {/* Section 4: Secure Data Sanitization */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#18181B]">
              4. Data Sanitization Standards
            </h2>
            <p>
              When personal data reaches its retention threshold or when a user exercises their GDPR Art. 17 Right to Erasure, data is sanitized following <strong>NIST Special Publication 800-88 Revision 1 (Guidelines for Media Sanitization)</strong>. Cryptographic keys used for AES-256-GCM token encryption are immediately destroyed, rendering ciphertext permanently unrecoverable.
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
            <Link href="/cookies" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Cookie Policy
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
