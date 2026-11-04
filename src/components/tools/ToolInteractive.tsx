"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  ArrowRight,
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] selection:bg-[#D95D39] selection:text-white">
      <Navbar />

      <div className="border-b border-[#E5E0D8]/60 bg-[#F4F1EA] py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#8E8B85]">
            <Link href="/tools" className="hover:text-[#D95D39] font-medium transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-[#18181B] font-semibold">{slug}</span>
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F4F1EA] text-[#D95D39]">
            SaaS Marketing Utility
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center items-center">
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-display font-semibold text-[#18181B]">
            {tool.title}
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] max-w-2xl leading-relaxed">
            {tool.subtitle}
          </p>
        </div>

        {/* Interactive Tool Area */}
        {slug === "ugc-video-cost-calculator" ? (
          /* ROI Calculator Tool */
          <div className="bg-white border border-[#E5E0D8]/70 rounded-3xl p-6 sm:p-10 flex flex-col gap-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                  Videos Needed Per Month: <span className="text-[#D95D39] font-bold">{monthlyAdsNeeded}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={monthlyAdsNeeded}
                  onChange={(e) => setMonthlyAdsNeeded(Number(e.target.value))}
                  className="w-full accent-[#D95D39] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                  Traditional Agency Rate / Video: <span className="text-[#D95D39] font-bold">${agencyRatePerAd}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="25"
                  value={agencyRatePerAd}
                  onChange={(e) => setAgencyRatePerAd(Number(e.target.value))}
                  className="w-full accent-[#D95D39] cursor-pointer"
                />
              </div>
            </div>

            {/* Savings Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E0D8]/60">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60 flex flex-col gap-1">
                <span className="text-xs text-[#8E8B85]">Traditional Agency Cost</span>
                <span className="text-2xl font-bold font-sans text-rose-600">
                  ${agencyTotalCost.toLocaleString()}
                  <span className="text-xs text-[#8E8B85] font-normal">/mo</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60 flex flex-col gap-1">
                <span className="text-xs text-[#8E8B85]">AutoUGC Growth Plan</span>
                <span className="text-2xl font-bold font-sans text-[#D95D39]">
                  ${autoUgcCost}
                  <span className="text-xs text-[#8E8B85] font-normal">/mo</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#F5E2DA] flex flex-col gap-1">
                <span className="text-xs text-[#D95D39] font-bold">
                  Net Monthly Savings
                </span>
                <span className="text-2xl font-extrabold font-sans text-[#D95D39]">
                  ${netSavings.toLocaleString()}
                  <span className="text-xs text-[#D95D39]/80 font-normal">/mo</span>
                </span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Link href="/studio">
                <button className="px-8 py-3.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
                  <span>Start Saving With AutoUGC Today</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* Viral Hook & Script Generator Tool */
          <div className="bg-white border border-[#E5E0D8]/70 rounded-3xl p-6 sm:p-10 flex flex-col gap-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                Enter Your Product, Service or Value Proposition:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={productTopic}
                  onChange={(e) => setProductTopic(e.target.value)}
                  className="flex-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-full px-5 py-2.5 text-xs text-[#18181B] focus:outline-none focus:border-[#D95D39] transition-colors"
                  placeholder="e.g. Ergonomic lumbar desk chair for software engineers"
                />
                <button
                  onClick={handleGenerateHooks}
                  className="px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Generated Variations */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                Tested Viral Hooks:
              </span>
              <div className="flex flex-col gap-2.5">
                {generatedHooks.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-[#F4F1EA] text-[#D95D39] text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-xs font-medium text-[#18181B]">
                        &ldquo;{h}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => copyToClipboard(h, i)}
                        className="p-1.5 rounded-full hover:bg-white text-[#8E8B85] hover:text-[#18181B] transition-colors cursor-pointer"
                        aria-label="Copy hook"
                      >
                        {copiedIndex === i ? (
                          <Check className="h-4 w-4 text-[#D95D39]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/studio?hook=${encodeURIComponent(h)}`}
                        className="text-xs font-semibold text-[#D95D39] hover:underline flex items-center gap-1"
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

      <Footer />
    </div>
  );
}
