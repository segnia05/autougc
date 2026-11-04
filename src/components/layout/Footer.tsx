import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { CookiePreferencesFooterButton } from "@/components/compliance/CookiePreferencesFooterButton";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-[#FAF8F5] text-[#52525B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        {/* Top Brand Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-12 border-b border-[#EFECE6]">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-2 mb-4 group focus:outline-none">
              <div className="w-7 h-7 rounded-lg bg-[#FDF3EF] border border-[#F3CEBE] flex items-center justify-center text-[#D95D39] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 fill-[#D95D39]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#18181B]">
                Auto<span className="text-[#D95D39]">UGC</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#52525B]">
              AutoUGC automates your entire short-form creator ad workflow — from software URL extraction and psychological hook generation to Remotion 1080p rendering, kinetic captions, and multi-channel drip scheduling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#18181B] border border-[#E5E0D8] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-semibold">All Systems Operational</span>
              <span className="text-[#8E8B85]">(99.98% SLA)</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#18181B] border border-[#E5E0D8] shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D95D39]" />
              <span className="font-semibold">100% Commercial Usage Rights</span>
            </div>
          </div>
        </div>

        {/* 5-Column Mega Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-[#EFECE6]">
          {/* Col 1: Platforms */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#18181B] font-bold">
              Platforms
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#52525B]">
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  TikTok UGC Ads
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Instagram Reels
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  YouTube Shorts
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Multi-Account Army
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Paid Ads Pipelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Product */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#18181B] font-bold">
              Product
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#52525B]">
              <li>
                <Link href="/studio" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Creative Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Autopilot Engine
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Kinetic Subtitles
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Voice Synthesizer
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  1080p Video Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#18181B] font-bold">
              Industries
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#52525B]">
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  AI &amp; B2B SaaS
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  DTC &amp; E-Commerce
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Consumer Mobile Apps
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Ed-Tech &amp; Study Tools
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Fintech &amp; Modern Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Growth Tools & Data */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#18181B] font-bold">
              Growth Tools
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#52525B]">
              <li>
                <Link href="/tools/tiktok-hook-generator" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  TikTok Hook Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/instagram-reels-script-generator" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Reels Script Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/ugc-video-cost-calculator" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  UGC Cost &amp; ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  AI Marketing Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#18181B] font-bold">
              Company
            </span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#52525B]">
              <li>
                <Link href="/brands" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  For SaaS Companies
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  For Digital Product Sellers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Performance Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Contact Founding Team
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/retention" className="hover:text-[#D95D39] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-sm">
                  Data Retention Policy
                </Link>
              </li>
              <li>
                <CookiePreferencesFooterButton />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8B85]">
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