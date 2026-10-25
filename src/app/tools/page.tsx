"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      accentColor: "text-amber-400",
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
      accentColor: "text-emerald-400",
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
      accentColor: "text-blue-400",
      stats: "Used 9,200+ times this month",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="amber" size="sm" className="mb-4 font-mono">
            100% FREE GROWTH UTILITIES
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-display)] mb-4">
            Free AI Tools for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              High-Velocity Ad Teams
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Free standalone utilities to test hooks, generate scripts, and analyze ad creative production economics. No credit card required.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 items-stretch">
          {tools.map((tool) => {
            const IconComponent = tool.icon;

            return (
              <Card
                key={tool.slug}
                hoverEffect
                className="flex flex-col justify-between border border-subtle hover:border-[var(--accent-primary)]/50 transition-all bg-[var(--bg-surface)] p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[var(--bg-surface-elevated)] border border-subtle flex items-center justify-center">
                      <IconComponent className={`h-5 w-5 ${tool.accentColor}`} />
                    </div>
                    <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                      {tool.category}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold font-[family-name:var(--font-display)] mb-1">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-[var(--accent-primary)] font-mono mb-3">
                    {tool.tagline}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  <div className="p-3 rounded-lg bg-[var(--bg-app)] border border-subtle flex items-center justify-between text-xs font-mono mb-6">
                    <span className="text-[var(--text-muted)]">Benchmark:</span>
                    <span className="text-[var(--accent-emerald)] font-bold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {tool.metric}
                    </span>
                  </div>
                </div>

                <div>
                  <Link href={`/tools/${tool.slug}`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center font-semibold text-xs"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Launch Free Tool
                    </Button>
                  </Link>
                  <span className="text-[11px] text-[var(--text-muted)] text-center block mt-3 font-mono">
                    {tool.stats}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Feature Highlights Section */}
        <div className="rounded-2xl bg-[var(--bg-surface)] border border-subtle p-8 sm:p-10 max-w-5xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
              Why Performance Marketers Use AutoUGC Tools
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Built on data from 500,000+ vertical video ad impressions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Zero AI Hallucinations
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Hooks and scripts are constrained to proven direct-response marketing formulas that drive conversions, not generic fluff.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Native Short-Form Pacing
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Word counts and sentence breaks are optimized specifically for 12 to 18 second TikTok and Reels retention curves.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                1-Click Studio Transition
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Send any generated hook directly into the 1080p Studio with voice synthesis and kinetic subtitles in a single click.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-display)] mb-3">
            Ready to Render Your First Video Ad?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
            Hop into AutoUGC Studio. Create 9:16 vertical video variations with natural voice synthesis and auto-scheduling.
          </p>
          <Link href="/studio">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-xs shadow-glow-amber"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Open Studio Editor
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
