"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Check,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [adsPerWeek, setAdsPerWeek] = useState(5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Annual discount is 20%
  const plans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "For solo founders & DTC bootstrappers",
      monthlyPrice: 49,
      annualPrice: 39,
      credits: "20 Videos / mo",
      costPerAd: "$2.45 / video",
      badge: null,
      highlight: false,
      features: [
        "20 Videos / month",
        "1 Brand Account connected",
        "~4 posts / week (Mon/Wed/Fri/Sun drip)",
        "Autopilot Scheduler & Peak-Hour Timing",
        "1080p MP4 Downloads & Permanent Vault",
        "Zero watermarks & commercial license",
      ],
      ctaText: "Start Free Trial",
      ctaVariant: "secondary" as const,
    },
    {
      id: "growth",
      name: "Growth",
      tagline: "For scaling brands & high-velocity teams",
      monthlyPrice: 89,
      annualPrice: 69,
      credits: "60 Videos / mo",
      costPerAd: "$1.48 / video",
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "60 Videos / month",
        "Up to 5 Accounts (Main + Satellites)",
        "~2 posts / day automated drip",
        "Multi-Account Army distribution",
        "Anti-Duplicate Shadowban Engine",
        "All 12 Conversational creator voices",
        "Priority GPU cloud rendering",
      ],
      ctaText: "Unlock Growth Plan",
      ctaVariant: "primary" as const,
    },
    {
      id: "scale",
      name: "Scale",
      tagline: "For agencies & aggressive media buyers",
      monthlyPrice: 199,
      annualPrice: 159,
      credits: "180 Videos / mo",
      costPerAd: "$1.11 / video",
      badge: "BEST VALUE",
      highlight: false,
      features: [
        "180 Videos / month",
        "Up to 15 Accounts (Multi-Brand / Team)",
        "~6 posts / day high-velocity blitz",
        "Agency Multi-Brand Workspaces",
        "Anti-Duplicate Matrix on all variants",
        "Priority GPU Rendering Node & API",
        "Dedicated campaign & account support",
      ],
      ctaText: "Get Scale Access",
      ctaVariant: "secondary" as const,
    },
  ];

  // ROI Calculator Calculations
  const monthlyAds = adsPerWeek * 4;
  const traditionalAgencyCost = monthlyAds * 350; // $350 avg per UGC video
  const autoUgcCost =
    monthlyAds <= 20 ? (billingCycle === "annual" ? 39 : 49) :
    monthlyAds <= 60 ? (billingCycle === "annual" ? 69 : 89) :
    (billingCycle === "annual" ? 159 : 199);
  const netSavings = traditionalAgencyCost - autoUgcCost;

  const faqs = [
    {
      q: "Do I own full commercial rights to videos generated with AutoUGC?",
      a: "Yes, 100%. All exported 1080p vertical video files include royalty-free commercial rights. You can deploy them directly in paid ad campaigns on TikTok Ads Manager, Meta Ads (Instagram/Facebook), and YouTube Shorts Ads without royalty obligations.",
    },
    {
      q: "What happens if I need more video credits during the month?",
      a: "You can purchase additional credit bundles instantly from your dashboard at discounted per-video rates, or upgrade your plan anytime with immediate pro-rated billing.",
    },
    {
      q: "Can I cancel or pause my subscription at any time?",
      a: "Yes. There are no contracts or commitments. You can cancel with a single click inside your account billing settings before the next renewal date.",
    },
    {
      q: "How does the autonomous URL scraper work?",
      a: "Our parser extracts key product value propositions, pricing, customer review sentiment, and product images from your Shopify, Amazon, or custom web storefront in under 3 seconds to generate tailored script variations.",
    },
    {
      q: "Is the background audio licensed for commercial advertising?",
      a: "Yes. All audio tracks included in AutoUGC Studio are pre-cleared and licensed for commercial digital ad distribution across TikTok, Instagram, and YouTube.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="amber" size="sm" className="mb-4 font-mono">
            TRANSPARENT VALUE PRICING
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-display)] mb-4">
            Scale High-Converting Video Ads{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              Without Agency Retainers
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Replace $3,500/mo agency retainers and 14-day creator turnarounds. Export tested 9:16 vertical ads in under 60 seconds.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-xl bg-[var(--bg-surface)] border border-subtle">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                billingCycle === "annual"
                  ? "bg-[var(--accent-primary)] text-black shadow-glow-amber"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <span>Annual Billing</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  billingCycle === "annual"
                    ? "bg-black/20 text-black font-bold"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all ${
                  plan.highlight
                    ? "bg-[var(--bg-surface-elevated)] border-2 border-[var(--accent-primary)] shadow-glow-amber/20"
                    : "bg-[var(--bg-surface)] border border-subtle hover:border-zinc-700"
                } p-8`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--accent-primary)] text-black text-[11px] font-bold uppercase tracking-wider font-mono px-3 py-1 rounded-full shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">
                        {plan.name}
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {plan.tagline}
                      </p>
                    </div>
                    <Badge variant={plan.highlight ? "amber" : "neutral"} size="sm" className="font-mono text-xs">
                      {plan.credits}
                    </Badge>
                  </div>

                  {/* Price display */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl sm:text-5xl font-extrabold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                      ${price}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      / month {billingCycle === "annual" ? "(billed yearly)" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--accent-emerald)] font-mono font-medium mb-6">
                    Effective cost: {plan.costPerAd}
                  </div>

                  <div className="h-[1px] bg-[var(--border-subtle)] my-6" />

                  {/* Features list */}
                  <ul className="space-y-3 mb-8 text-xs text-[var(--text-secondary)]">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[var(--accent-emerald)] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Link href={`/studio?plan=${plan.id}`}>
                    <Button
                      variant={plan.ctaVariant}
                      size="lg"
                      className="w-full justify-center font-semibold text-xs"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                  <p className="text-[11px] text-[var(--text-muted)] text-center mt-3 font-mono">
                    Instant access • No lock-in contract
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Savings & ROI Calculator */}
        <div className="bg-[var(--bg-surface)] border border-subtle rounded-2xl p-8 mb-20 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="amber" size="sm" className="mb-2 font-mono">
                ROI IMPACT CALCULATOR
              </Badge>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
                Calculate Your Exact Monthly Savings
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Based on traditional UGC creator fees ($350 average per 15s video ad).
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--text-muted)] font-mono block">Testing Volume</span>
              <span className="text-2xl font-bold text-[var(--accent-primary)] font-mono">
                {adsPerWeek} ads / week ({monthlyAds} / mo)
              </span>
            </div>
          </div>

          <div className="mb-8">
            <input
              type="range"
              min="1"
              max="45"
              value={adsPerWeek}
              onChange={(e) => setAdsPerWeek(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-mono mt-2">
              <span>~5 ads / wk (Starter: 20/mo)</span>
              <span>~15 ads / wk (Growth: 60/mo)</span>
              <span>~45 ads / wk (Scale: 180/mo)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-subtle">
            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <span className="text-xs text-[var(--text-muted)] block mb-1">Traditional Agency Cost:</span>
              <span className="text-xl font-bold text-rose-400 font-mono">
                ${traditionalAgencyCost.toLocaleString()} / mo
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-1">At $350 per creator video</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <span className="text-xs text-[var(--text-muted)] block mb-1">AutoUGC Platform:</span>
              <span className="text-xl font-bold text-[var(--text-primary)] font-mono">
                ${autoUgcCost} / mo
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                {monthlyAds <= 20 ? "Starter plan" : monthlyAds <= 60 ? "Growth plan" : "Scale plan"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-xs text-emerald-400 block mb-1 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Net Capital Saved:
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                +${netSavings.toLocaleString()} / mo
              </span>
              <span className="text-[10px] text-emerald-300/80 block mt-1 font-mono">
                {Math.round((netSavings / traditionalAgencyCost) * 100)}% cost reduction
              </span>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
              Detailed Feature Comparison
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Everything included across each subscription tier.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-subtle bg-[var(--bg-surface)]">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-subtle bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] font-mono">
                  <th className="py-3.5 px-4 font-semibold">Capability</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Starter</th>
                  <th className="py-3.5 px-4 font-semibold text-center text-[var(--accent-primary)]">Growth</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Scale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Monthly Video Renders</td>
                  <td className="py-3 px-4 text-center font-mono">20</td>
                  <td className="py-3 px-4 text-center font-mono text-[var(--accent-primary)] font-bold">60</td>
                  <td className="py-3 px-4 text-center font-mono">180</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Connected Brand Accounts</td>
                  <td className="py-3 px-4 text-center">1 Account</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)] font-bold">Up to 5 Accounts</td>
                  <td className="py-3 px-4 text-center">Up to 15 Accounts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Posting Cadence</td>
                  <td className="py-3 px-4 text-center font-mono">~4 posts / week</td>
                  <td className="py-3 px-4 text-center font-mono text-[var(--accent-primary)] font-bold">~2 posts / day</td>
                  <td className="py-3 px-4 text-center font-mono">~6 posts / day</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Autopilot Scheduler</td>
                  <td className="py-3 px-4 text-center">Peak-Hour Timing</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)]">Multi-Account Balancing</td>
                  <td className="py-3 px-4 text-center">Agency Multi-Brand</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Multi-Account Army</td>
                  <td className="py-3 px-4 text-center text-[var(--text-muted)]">-</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)] font-bold">Included (5 Burners)</td>
                  <td className="py-3 px-4 text-center font-bold">Included (15 Burners)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Anti-Duplicate Tech</td>
                  <td className="py-3 px-4 text-center text-[var(--text-muted)]">Standard Variety</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)] font-bold">4-Layer Permutation</td>
                  <td className="py-3 px-4 text-center font-bold">Enterprise Permutation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">1080p MP4 Downloads</td>
                  <td className="py-3 px-4 text-center">1080p 30fps</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)]">1080p 60fps</td>
                  <td className="py-3 px-4 text-center">1080p 60fps</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">AI Creator Voice Variety</td>
                  <td className="py-3 px-4 text-center">3 Voices</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)]">All 12 Voices</td>
                  <td className="py-3 px-4 text-center">All + Custom Clone</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Cloud Rendering Queue</td>
                  <td className="py-3 px-4 text-center text-[var(--text-muted)]">Standard (~2m)</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)]">Priority Cloud (~25s)</td>
                  <td className="py-3 px-4 text-center">Dedicated Node (~15s)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">Team Member Seats</td>
                  <td className="py-3 px-4 text-center">1 Seat</td>
                  <td className="py-3 px-4 text-center text-[var(--accent-primary)]">3 Seats</td>
                  <td className="py-3 px-4 text-center">10 Seats / Agency</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">API & Webhook Access</td>
                  <td className="py-3 px-4 text-center text-[var(--text-muted)]">-</td>
                  <td className="py-3 px-4 text-center text-[var(--text-muted)]">-</td>
                  <td className="py-3 px-4 text-center text-emerald-400">Full REST & Webhook</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Everything you need to know about billing, licensing, and video delivery.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-subtle bg-[var(--bg-surface)] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono text-base text-[var(--text-muted)] ml-4">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-subtle pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-display)] mb-3">
            Ready to Automate Your Video Ad Creative?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
            Paste any product link into AutoUGC Studio. No credit card required to test your first 3 ad hooks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/studio">
              <Button
                variant="primary"
                size="lg"
                className="font-semibold text-xs shadow-glow-amber"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Launch Studio Now
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="secondary" size="lg" className="text-xs">
                Explore Free AI Tools
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
