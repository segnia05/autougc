"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Calculator,
  Film,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function ToolsIndexPage() {
  const tools = [
    {
      slug: "tiktok-hook-generator",
      name: "TikTok Hook Generator",
      tagline: "Pattern Interrupt & Curiosity Hooks",
      description:
        "Generate 3 viral TikTok hooks for any product or software in seconds. Formatted to capture viewer attention in the crucial first 0.8 seconds.",
      category: "Ad Creative",
      metric: "4.2% Avg CTR",
      icon: Zap,
      stats: "Used 18,400+ times this month",
    },
    {
      slug: "instagram-reels-script-generator",
      name: "Instagram Reels Script Generator",
      tagline: "15-Second High-Conversion Scripts",
      description:
        "Turn your product value propositions into high-retention 15-second vertical script structures with synchronized kinetic subtitle cues.",
      category: "Copywriting",
      metric: "82% Completion",
      icon: Film,
      stats: "Used 12,900+ times this month",
    },
    {
      slug: "ugc-video-cost-calculator",
      name: "UGC Ad Cost & ROI Calculator",
      tagline: "Agency Retainer vs AI Generator",
      description:
        "Calculate exactly how much money and production time your marketing team saves by replacing traditional agency retainers with automated video ads.",
      category: "Financial ROI",
      metric: "92% Cost Reduction",
      icon: Calculator,
      stats: "Used 9,200+ times this month",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-4 text-xs font-semibold uppercase tracking-wider">
            SaaS Growth Utilities
          </div>
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-4">
            AI ad utilities for <span className="italic">high-velocity</span> SaaS teams.
          </h1>
          <p className="text-sm sm:text-base text-[#4A544A] leading-relaxed">
            Standalone utilities to test viral hook formulas, generate high-retention script copy, and calculate UGC production economics.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 items-stretch">
          {tools.map((tool) => {
            const IconComponent = tool.icon;

            return (
              <div
                key={tool.slug}
                className="flex flex-col justify-between border border-[#CBD5C4]/70 hover:border-[#1F3824]/60 transition-all bg-white rounded-3xl p-7 shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ECEFE7] text-[#4A544A] border border-[#CBD5C4]/60">
                      {tool.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#1B231B] group-hover:text-[#1F3824] transition-colors mb-1">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-[#1F3824] font-semibold mb-3">
                    {tool.tagline}
                  </p>
                  <p className="text-xs text-[#4A544A] leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 flex items-center justify-between text-xs mb-6">
                    <span className="text-[#717E6C]">Benchmark:</span>
                    <span className="text-[#1F3824] font-bold flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {tool.metric}
                    </span>
                  </div>
                </div>

                <div>
                  <Link href={`/tools/${tool.slug}`}>
                    <button className="w-full py-3 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                      <span>Open Tool</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <span className="text-[11px] text-[#717E6C] text-center block mt-3">
                    {tool.stats}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights Section */}
        <div className="rounded-3xl bg-white border border-[#CBD5C4]/70 p-8 sm:p-12 max-w-5xl mx-auto mb-20 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Why performance marketers use AutoUGC tools
            </h2>
            <p className="text-xs sm:text-sm text-[#4A544A] mt-1">
              Built on data from 500,000+ vertical video ad impressions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#1B231B]">
                Zero AI Hallucinations
              </span>
              <p className="text-xs text-[#4A544A] leading-relaxed">
                Hooks and scripts are constrained to proven direct-response marketing formulas that drive conversions, not generic fluff.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#1B231B]">
                Native Short-Form Pacing
              </span>
              <p className="text-xs text-[#4A544A] leading-relaxed">
                Word counts and sentence breaks are optimized specifically for 12 to 18 second TikTok and Reels retention curves.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#1B231B]">
                1-Click Studio Transition
              </span>
              <p className="text-xs text-[#4A544A] leading-relaxed">
                Send any generated hook directly into the 1080p Studio with voice synthesis and kinetic subtitles in a single click.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-[#ECEFE7] border border-[#CBD5C4]/70 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] mb-3">
            Ready to render your first video ad?
          </h2>
          <p className="text-xs sm:text-sm text-[#4A544A] max-w-xl mx-auto mb-6">
            Hop into AutoUGC Studio. Create 9:16 vertical video variations with natural voice synthesis and auto-scheduling.
          </p>
          <Link href="/studio">
            <button className="px-8 py-3.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
              <span>Open Studio Editor</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
