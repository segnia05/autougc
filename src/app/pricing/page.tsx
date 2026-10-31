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
      name: "Starter",
      tagline: "Solopreneurs starting out.",
      monthlyPrice: 29,
      annualPrice: 20,
      credits: "500 credits a month",
      costPerAd: "= up to 100 statics or 6 videos",
      badge: null,
      highlight: false,
      features: [
        "Light planning from AutoUGC AI",
        "1 campaign at a time",
        "1 social account, 1 seat",
        "25 AI characters",
        "Trending content library",
        "TikTok direct posting, unlimited scheduling",
      ],
      ctaText: "Choose Starter",
    },
    {
      id: "growth" as const,
      name: "Growth",
      tagline: "Starting to scale.",
      monthlyPrice: 79,
      annualPrice: 55,
      credits: "2,000 credits a month",
      costPerAd: "= up to 400 statics or 25 videos",
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "4x generation fuel",
        "5 campaigns at a time",
        "10 social accounts per workspace, 3 workspaces",
        "3 seats included, $10 a month per extra",
        "Analytics, remix and auto captions",
        "Unlimited AI characters, 100 real-person characters",
        "Priority support",
      ],
      ctaText: "Choose Growth",
    },
    {
      id: "pro" as const,
      name: "Pro",
      tagline: "Teams pushing high volume.",
      monthlyPrice: 199,
      annualPrice: 139,
      credits: "7,500 credits a month",
      costPerAd: "= up to 1,500 statics or 93 videos",
      badge: "SCALE HIGH VOLUME",
      highlight: false,
      features: [
        "5x generation fuel",
        "20 campaigns at a time",
        "500 social accounts per workspace, 10 workspaces",
        "10 seats included, $10 a month per extra",
        "Unlimited AI and real-person characters",
        "Analytics, remix, auto captions, priority support",
      ],
      ctaText: "Choose Pro",
    },
    {
      id: "enterprise" as const,
      name: "Enterprise",
      tagline: "Larger teams & agencies.",
      monthlyPrice: 999,
      annualPrice: 999,
      credits: "40,000 credits a month",
      costPerAd: "= up to 8,000 statics or 500 videos",
      badge: null,
      highlight: false,
      features: [
        "Every Pro feature included",
        "14x generation fuel",
        "25 seats included",
        "20 campaigns at a time",
        "500 social accounts per workspace, 10 workspaces",
        "Scales to $2,999/mo in $50 steps (adds 2,000 credits)",
      ],
      ctaText: "Book a setup call",
    },
  ];

  const handleCheckout = async (planId: "starter" | "growth" | "pro" | "enterprise") => {
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

      <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
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
          <div role="tablist" aria-label="Billing frequency options" className="inline-flex items-center p-1 rounded-full bg-[#ECEFE7] border border-[#CBD5C4]/70 mb-12">
            <button
              type="button"
              role="tab"
              aria-selected={billingCycle === "monthly"}
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
              role="tab"
              aria-selected={billingCycle === "annual"}
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

          {/* 4-Tier Pricing Grid (Fastlane Aligned) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto text-left">
            {plans.map((plan) => {
              const displayPrice = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all bg-white border ${
                    plan.highlight
                      ? "border-2 border-orange-500 shadow-lg bg-[#FAFBF9] ring-2 ring-orange-500/20"
                      : "border-[#CBD5C4]/70 shadow-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-xl font-bold text-[#1B231B]">
                        {plan.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#4A544A] mb-4 min-h-[28px]">
                      {plan.tagline}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#1B231B]">
                        ${displayPrice}
                      </span>
                      <span className="text-xs text-[#717E6C]">USD / month</span>
                    </div>

                    <div className="bg-[#F6F7F2] p-3 rounded-2xl border border-[#CBD5C4]/60 mb-5">
                      <div className="text-xs font-bold text-[#1F3824]">
                        {plan.credits}
                      </div>
                      <div className="text-[11px] text-[#717E6C] mt-0.5">
                        {plan.costPerAd}
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#4A544A] mb-6">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-[#1F3824] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingCheckoutPlan === plan.id}
                    className={`w-full py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                      plan.highlight
                        ? "bg-[#111827] hover:bg-black text-white shadow-sm"
                        : "bg-[#1B231B] hover:bg-black text-white"
                    }`}
                  >
                    {loadingCheckoutPlan === plan.id ? "Redirecting..." : plan.ctaText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Warmed Accounts Add-On Banner (Direct from Fastlane Feature) */}
          <div className="max-w-7xl mx-auto mt-10">
            <div className="rounded-3xl bg-white border border-[#CBD5C4]/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#1F3824] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Check className="h-6 w-6 text-[#FFE600]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B231B] flex items-center gap-2">
                    Warmed accounts
                    <span className="text-[10px] uppercase font-bold text-[#1F3824] bg-[#E2E9DC] px-2 py-0.5 rounded-full">
                      Add-on
                    </span>
                  </h3>
                  <p className="text-xs text-[#4A544A] max-w-2xl mt-1 leading-relaxed">
                    Real US & EU TikTok and Instagram accounts, created from scratch, warmed up in your niche and managed inside AutoUGC. Bypass algorithmic friction and shadowbans on fresh profiles.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    <span className="font-semibold text-rose-600">+ $1.50 per post upload</span>
                    <span className="text-[#717E6C]">• Active AutoUGC subscription required</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#CBD5C4]/50">
                <div className="text-left md:text-right">
                  <span className="text-3xl font-extrabold text-[#1B231B]">$100</span>
                  <span className="text-xs text-[#717E6C] block">/ mo per account</span>
                </div>
                <button
                  onClick={() => router.push("/dashboard?tab=accounts")}
                  className="px-6 py-3 rounded-full bg-[#111827] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Get started
                </button>
              </div>
            </div>

            {/* Meter & Trial Footnote */}
            <div className="text-center text-xs text-[#717E6C] mt-6 flex flex-wrap items-center justify-center gap-3">
              <span>7-day free trial, 50 credits</span>
              <span>•</span>
              <span>Credits are the only meter: a static is 5, a 5-second video is 80, any mix</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
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
                aria-label="Creative volume in ads per week"
                aria-valuemin={1}
                aria-valuemax={15}
                aria-valuenow={adsPerWeek}
                aria-valuetext={`${adsPerWeek} ads per week, ${monthlyAds} videos per month`}
                className="w-full accent-[#1F3824] cursor-pointer h-2 bg-[#ECEFE7] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
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
