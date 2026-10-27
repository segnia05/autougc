import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#CBD5C4]/60 bg-[#EEF1EA] text-[#4A544A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-14">
        {/* Top Fluencify-Style Brand Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 pb-16 border-b border-[#CBD5C4]/60">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-2 mb-4 group focus:outline-none">
              <span className="text-[#1F3824] text-xl font-bold leading-none select-none">✻</span>
              <span className="text-xl font-semibold tracking-tight text-[#1B231B] font-sans">
                Auto<span className="font-normal">UGC</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#4A544A]">
              AutoUGC runs your entire creator program end to end — scraping, brief generation, voice synthesis, kinetic captions, quality review, multi-account posting, and analytics. Your team only sets the direction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4]">
              <span className="h-2 w-2 rounded-full bg-[#1F3824] animate-pulse" />
              <span className="font-semibold">All Systems Operational</span>
              <span className="text-[#4A544A]">(99.98% SLA)</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1F3824]" />
              <span className="font-semibold">100% Commercial Usage Rights</span>
            </div>
          </div>
        </div>

        {/* 5-Column Mega Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-14 border-b border-[#CBD5C4]/60">
          {/* Col 1: Platforms */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#1B231B] font-bold">
              Platforms
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4A544A]">
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  TikTok UGC Ads
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  Instagram Reels
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  YouTube Shorts
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  Multi-Account Army
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  Paid Ads Pipelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Product */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#1B231B] font-bold">
              Product
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4A544A]">
              <li>
                <Link href="/studio" className="hover:text-[#1F3824] font-medium transition-colors">
                  Creative Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#1F3824] font-medium transition-colors">
                  Autopilot Engine
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#1F3824] font-medium transition-colors">
                  Kinetic Subtitles
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#1F3824] font-medium transition-colors">
                  Voice Synthesizer
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=vault" className="hover:text-[#1F3824] font-medium transition-colors">
                  1080p Video Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#1B231B] font-bold">
              Industries
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4A544A]">
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  AI & B2B SaaS
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  DTC & E-Commerce
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  Consumer Mobile Apps
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  Ed-Tech & Study Tools
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
                  Fintech & Modern Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Growth Tools & Data */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#1B231B] font-bold">
              Growth Tools
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4A544A]">
              <li>
                <Link href="/tools/tiktok-hook-generator" className="hover:text-[#1F3824] font-medium transition-colors">
                  TikTok Hook Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/instagram-reels-script-generator" className="hover:text-[#1F3824] font-medium transition-colors">
                  Reels Script Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/ugc-video-cost-calculator" className="hover:text-[#1F3824] font-medium transition-colors">
                  UGC Cost & ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-[#1F3824] font-medium transition-colors">
                  AI Marketing Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#1B231B] font-bold">
              Company
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#4A544A]">
              <li>
                <Link href="/brands" className="hover:text-[#1F3824] font-medium transition-colors">
                  For SaaS Companies
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#1F3824] font-medium transition-colors">
                  For Digital Product Sellers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#1F3824] font-medium transition-colors">
                  Performance Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#1F3824] font-medium transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1F3824] font-medium transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#1F3824] font-medium transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#717E6C]">
          <div>
            &copy; 2026 AutoUGC Inc. Autonomous creator marketing infrastructure.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span>PostgreSQL Powered</span>
            <span>•</span>
            <span>Clerk Protected</span>
            <span>•</span>
            <span>1080p 60fps Native</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
