"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";

export interface ToolConfig {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  metaDescription: string;
}

interface ToolInteractiveProps {
  slug: string;
  tool: ToolConfig;
}

export function ToolInteractive({ slug, tool }: ToolInteractiveProps) {
  // Calculator State
  const [monthlyAdsNeeded, setMonthlyAdsNeeded] = useState(20);
  const [agencyRatePerAd, setAgencyRatePerAd] = useState(250);

  // Hook Generator State
  const [productTopic, setProductTopic] = useState("AI cold email writer for B2B sales teams");
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([
    "If your sales reps are still spending 2 hours writing cold emails in 2026, stop.",
    "The $40 tool B2B SDRs use to book 18 meetings a week on autopilot.",
    "Why 90% of cold email campaigns get instantly flagged as spam this year.",
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const agencyTotalCost = monthlyAdsNeeded * agencyRatePerAd;
  const autoUgcCost = 89; // Growth plan
  const netSavings = agencyTotalCost - autoUgcCost;

  const handleGenerateHooks = () => {
    if (!productTopic) return;
    setGeneratedHooks([
      `Stop doing ${productTopic} manually in 2026.`,
      `The simple hack for ${productTopic} nobody in your industry talks about.`,
      `The #1 reason your ${productTopic} isn't getting results yet.`,
    ]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-subtle bg-[var(--bg-app)]/80 backdrop-blur-md sticky top-0 z-40 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>AutoUGC Tools</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <Badge variant="amber" size="sm">
            100% Free Tool
          </Badge>
        </div>

        <Link href="/studio">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Open Studio
          </Button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center items-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-display)]">
            {tool.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
            {tool.subtitle}
          </p>
        </div>

        {/* Interactive Tool Area */}
        {slug === "ugc-video-cost-calculator" ? (
          /* ROI Calculator Tool */
          <div className="bg-[var(--bg-surface)] border border-subtle rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Videos Needed Per Month: {monthlyAdsNeeded}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={monthlyAdsNeeded}
                  onChange={(e) => setMonthlyAdsNeeded(Number(e.target.value))}
                  className="w-full accent-[var(--accent-primary)] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Traditional Agency Rate / Video: ${agencyRatePerAd}
                </label>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="25"
                  value={agencyRatePerAd}
                  onChange={(e) => setAgencyRatePerAd(Number(e.target.value))}
                  className="w-full accent-[var(--accent-primary)] cursor-pointer"
                />
              </div>
            </div>

            {/* Savings Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-subtle">
              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col gap-1">
                <span className="text-xs text-[var(--text-muted)]">Traditional Agency Cost</span>
                <span className="text-2xl font-bold font-mono text-red-400">
                  ${agencyTotalCost.toLocaleString()}
                  <span className="text-xs text-[var(--text-muted)]">/mo</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col gap-1">
                <span className="text-xs text-[var(--text-muted)]">AutoUGC Growth Plan</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  ${autoUgcCost}
                  <span className="text-xs text-[var(--text-muted)]">/mo</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent-primary)]/30 flex flex-col gap-1">
                <span className="text-xs text-[var(--accent-primary)] font-semibold">
                  Net Monthly Savings
                </span>
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                  ${netSavings.toLocaleString()}
                  <span className="text-xs text-[var(--text-muted)]">/mo</span>
                </span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Link href="/studio">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start Saving With AutoUGC Today
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Viral Hook & Script Generator Tool */
          <div className="bg-[var(--bg-surface)] border border-subtle rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Enter Your Product, Service or Value Proposition:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={productTopic}
                  onChange={(e) => setProductTopic(e.target.value)}
                  className="flex-1 bg-[var(--bg-app)] border border-subtle rounded-lg px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                  placeholder="e.g. Ergonomic lumbar desk chair for software engineers"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateHooks}
                  leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Generated Variations */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Tested Viral Hooks:
              </span>
              <div className="flex flex-col gap-2.5">
                {generatedHooks.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-400">
                        {i + 1}
                      </span>
                      <p className="text-xs font-medium text-[var(--text-primary)]">
                        &ldquo;{h}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(h, i)}
                        aria-label="Copy hook"
                      >
                        {copiedIndex === i ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Link
                        href={`/studio?hook=${encodeURIComponent(h)}`}
                        className="text-xs font-medium text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                      >
                        <span>Animate in Studio</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
