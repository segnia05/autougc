"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, ChevronDown } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [adsPerWeek, setAdsPerWeek] = useState(5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [loadingCheckoutPlan, setLoadingCheckoutPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter" as const,
      name: "Starter Plan",
      tagline: "For solo founders & DTC bootstrappers",
      monthlyPrice: 49,
      annualPrice: 39,
      credits: "20 Videos / mo",
      costPerAd: "$1.95 / video",
      badge: null,
      highlight: false,
      features: [
        "20 1080p Video Exports / month",
        "1 Brand Account connected",
        "~4 posts / week (Mon/Wed/Fri/Sun drip)",
        "Autopilot Scheduler & Peak-Hour Timing",
        "1080p MP4 Downloads & Permanent Vault",
        "Zero watermarks & commercial license",
      ],
      ctaText: "Start Starter Plan",
    },
    {
      id: "growth" as const,
      name: "Growth Plan",
      tagline: "For scaling brands & high-velocity teams",
      monthlyPrice: 89,
      annualPrice: 69,
      credits: "60 Videos / mo",
      costPerAd: "$1.15 / video",
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "60 1080p Video Exports / month",
        "Up to 5 Accounts (Main + Satellites)",
        "~2 posts / day automated drip",
        "Multi-Account Army distribution",
        "Anti-Duplicate Shadowban Engine",
        "3 Team Seats for Media Buyers & Editors",
        "Priority GPU cloud rendering",
        "All 12 Conversational creator voices",
      ],
      ctaText: "Unlock Growth Plan",
    },
    {
      id: "scale" as const,
      name: "Scale Plan",
      tagline: "For agencies & aggressive media buyers",
      monthlyPrice: 199,
      annualPrice: 159,
      credits: "180 Videos / mo",
      costPerAd: "$0.88 / video",
      badge: "ENTERPRISE VOLUME",
      highlight: false,
      features: [
        "180 1080p Video Exports / month",
        "Up to 15 Accounts (Multi-Brand / Team)",
        "~6 posts / day high-velocity blitz",
        "10 Team Workspace Seats",
        "Agency Multi-Brand Management",
        "Anti-Duplicate Matrix on all variants",
        "Dedicated GPU Rendering Node & API",
        "Direct VIP support & onboarding",
      ],
      ctaText: "Get Scale Access",
    },
  ];

  const handleCheckout = async (planId: "starter" | "growth" | "scale") => {
    setLoadingCheckoutPlan(planId);
    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        router.push("/dashboard?tab=billing&upgraded=true&plan=" + planId);
      }
    } catch (err) {
      console.warn("Checkout trigger error:", err);
      router.push("/dashboard?tab=billing");
    } finally {
      setLoadingCheckoutPlan(null);
    }
  };

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
      q: "How does the monthly video allotment work?",
      a: "Each plan comes with a guaranteed monthly credit quota (20, 60, or 180 videos). Each credit covers a full 1080p vertical video render, complete with custom script generation, AI voiceover synthesis, kinetic typography, and automated multi-account scheduling. Overdelivery is standard.",
    },
    {
      q: "Do I own full commercial rights to videos generated with AutoUGC?",
      a: "Yes. Every video exported from AutoUGC includes full, irrevocable commercial rights for use across organic TikTok, Instagram Reels, YouTube Shorts, and paid Meta/TikTok advertising campaigns with zero royalties or watermarks.",
    },
    {
      q: "Can I upgrade or cancel my plan at any time?",
      a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly through your billing portal. Upgrades immediately credit your account with higher quotas and additional connected accounts.",
    },
    {
      q: "How does the Multi-Account Satellite Army protect my brand?",
      a: "Our Growth and Scale plans enable you to connect 5 to 15 accounts. AutoUGC automatically rotates creative angles, voices, and subtitle color palettes so each satellite account posts unique content. This dramatically expands top-of-funnel reach while eliminating algorithmic duplicate-content penalties.",
    },
    {
      q: "What if I need custom enterprise volume beyond 180 videos/mo?",
      a: "Contact our enterprise team for dedicated GPU clusters, API webhooks, and unlimited multi-brand workspaces customized to your agency or venture studio.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Header - Fluencify Editorial Precision */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-6 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#1F3824] animate-pulse" />
            <span>Predictable Volume • Zero Retainers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-4">
            One allotment. <span className="italic">Guaranteed volume.</span>
            <br />
            Zero operations.
          </h1>

          <p className="text-sm sm:text-base text-[#4A544A] max-w-2xl mx-auto mb-10 leading-relaxed">
            No 20–40% agency markups. No coordinating freelancers. One fixed monthly plan delivers high-retention 1080p creator ads on autopilot.
          </p>

          {/* Billing Toggle (Monthly / Annual) */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#ECEFE7] border border-[#CBD5C4]/70 mb-12">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-[#1B231B] shadow-sm"
                  : "text-[#4A544A] hover:text-[#1B231B]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-[#1F3824] text-white shadow-sm"
                  : "text-[#4A544A] hover:text-[#1B231B]"
              }`}
            >
              <span>Annual Billing</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                billingCycle === "annual" ? "bg-white/20 text-white font-bold" : "bg-[#1F3824]/10 text-[#1F3824]"
              }`}>
                Save 20%
              </span>
            </button>
          </div>

          {/* 3-Tier Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {plans.map((plan) => {
              const displayPrice = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all bg-white border ${
                    plan.highlight
                      ? "border-2 border-[#1F3824] shadow-md bg-[#FAFBF9]"
                      : "border-[#CBD5C4]/70 shadow-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1F3824] text-white font-bold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#1B231B]">
                        {plan.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#4A544A] mb-6 min-h-[32px]">
                      {plan.tagline}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-4xl font-extrabold text-[#1B231B]">
                        ${displayPrice}
                      </span>
                      <span className="text-xs text-[#717E6C]">/ month</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#1F3824] font-semibold pb-6 border-b border-[#CBD5C4]/60 mb-6">
                      <span>{plan.credits}</span>
                      <span className="text-[#717E6C] font-normal">{plan.costPerAd}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-[#4A544A] mb-8">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-[#1F3824] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingCheckoutPlan === plan.id}
                    className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                      plan.highlight
                        ? "bg-[#1F3824] hover:bg-[#162B1B] text-white shadow-sm"
                        : "border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white"
                    }`}
                  >
                    {loadingCheckoutPlan === plan.id ? "Redirecting..." : plan.ctaText}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: THE GUARANTEE (Fluencify Signature) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-3xl bg-[#ECEFE7] p-8 sm:p-12 border border-[#CBD5C4]/70">
            <div className="max-w-3xl">
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold mb-2 block">
                The Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] mb-4">
                A contracted creative floor, not an estimate.
              </h2>
              <p className="text-xs sm:text-sm text-[#4A544A] leading-relaxed mb-6">
                Agencies quote open-ended hours with zero commitment to creative volume. With AutoUGC, your monthly allotment is guaranteed. You receive uncompressed 1080p MP4 exports with full commercial usage rights, backed by automated multi-account scheduling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#CBD5C4]/60 text-xs">
                <div>
                  <span className="text-[#717E6C] block">Usage Rights</span>
                  <span className="text-sm font-bold text-[#1B231B] mt-1 block">100% Commercial Lifetime</span>
                </div>
                <div>
                  <span className="text-[#717E6C] block">Overdelivery</span>
                  <span className="text-sm font-bold text-[#1F3824] mt-1 block">Included on all plans</span>
                </div>
                <div>
                  <span className="text-[#717E6C] block">Distribution</span>
                  <span className="text-sm font-bold text-[#1F3824] mt-1 block">1 to 15 Accounts Drip</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE ROI CALCULATOR */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-3xl bg-white p-8 sm:p-12 border border-[#CBD5C4]/70 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold">
                Cost Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] mt-1">
                See what you save vs. traditional agencies.
              </h2>
            </div>

            <div className="max-w-2xl mx-auto mb-10">
              <div className="flex justify-between items-center mb-3 text-xs">
                <span className="text-[#4A544A]">Creative Volume Needed:</span>
                <span className="text-[#1F3824] font-bold text-sm">
                  {monthlyAds} Videos / month ({adsPerWeek} ads/week)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={adsPerWeek}
                onChange={(e) => setAdsPerWeek(parseInt(e.target.value, 10))}
                className="w-full accent-[#1F3824] cursor-pointer h-2 bg-[#ECEFE7] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#717E6C] mt-2">
                <span>4 ads/mo (Minimal)</span>
                <span>20 ads/mo (Starter)</span>
                <span>60 ads/mo (Growth)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 text-center">
              <div>
                <span className="text-[11px] text-[#717E6C] block mb-1">
                  Agency / Freelancer Cost
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#4A544A]">
                  ${traditionalAgencyCost.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#717E6C] block mt-0.5">($350/video benchmark)</span>
              </div>

              <div>
                <span className="text-[11px] text-[#717E6C] block mb-1">
                  AutoUGC Monthly Cost
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#1F3824]">
                  ${autoUgcCost.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#1F3824]/80 block mt-0.5">
                  (${ (autoUgcCost / monthlyAds).toFixed(2) }/video)
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#1F3824] block mb-1 font-semibold">
                  Estimated Monthly Savings
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#1F3824]">
                  ${netSavings.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#1F3824]/70 block mt-0.5">Reinvest into ad spend</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
          <div className="text-center mb-10">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] mt-1">
              Pricing & Billing Details
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-[#CBD5C4]/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer font-semibold text-sm text-[#1B231B]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#717E6C] shrink-0 transition-transform duration-200 ${
                      openFaqIndex === idx ? "rotate-180 text-[#1F3824]" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 text-xs text-[#4A544A] leading-relaxed border-t border-[#CBD5C4]/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
