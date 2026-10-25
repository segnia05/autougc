import React from "react";
import Link from "next/link";
import { Video, ShieldCheck, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-subtle bg-[var(--bg-surface)] text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info (2 cols on large) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-amber">
                <Video className="h-4 w-4 text-black" />
              </div>
              <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                Auto<span className="text-[var(--accent-primary)]">UGC</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-[var(--text-secondary)]">
              Autonomous AI vertical video generator & multi-platform social distribution engine. Turn any product URL into tested, high-retention 9:16 ads in 60 seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono mt-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
              <span>All Systems Operational (99.98% SLA)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                <span>Stripe Verified</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" />
                <span>Commercial Rights Included</span>
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
              Product
            </span>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/studio" className="hover:text-[var(--text-primary)] transition-colors">
                  Creative Studio
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[var(--text-primary)] transition-colors">
                  Template Library
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--text-primary)] transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[var(--text-primary)] transition-colors">
                  Social Auto-Scheduler
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Growth Tools */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
              Free Growth Tools
            </span>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/tools/tiktok-hook-generator" className="hover:text-[var(--text-primary)] transition-colors">
                  TikTok Hook Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/instagram-reels-script-generator" className="hover:text-[var(--text-primary)] transition-colors">
                  Reels Script Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/ugc-video-cost-calculator" className="hover:text-[var(--text-primary)] transition-colors">
                  UGC Cost & ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-[var(--text-primary)] transition-colors">
                  All Growth Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
              Company & Legal
            </span>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--text-primary)] transition-colors">
                  Commercial Rights
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@autougc.ai"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="border-t border-subtle pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div>
            &copy; 2026 AutoUGC Inc. Built for DTC brands, SaaS founders, and creators.
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Next.js 15.2 Turbopack</span>
            <span>•</span>
            <span>Remotion 4.0</span>
            <span>•</span>
            <span>1080p 60fps Native</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
