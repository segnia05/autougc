"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import { NormalizedPlan } from "@/lib/billing/types";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [adsPerWeek, setAdsPerWeek] = useState(5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [loadingCheckoutPlan, setLoadingCheckoutPlan] = useState<string | null>(null);
  const [dynamicPlans, setDynamicPlans] = useState<NormalizedPlan[]>([]);
  const [providerName, setProviderName] = useState<string>("polar");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/v1/billing/plans")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          setDynamicPlans(data.plans);
          if (data.provider) {
            setProviderName(data.provider);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load dynamic plans on pricing page:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getDynamicPrice = (tier: string, defaultMonthly: number, defaultAnnual: number) => {
    const found = dynamicPlans.find((p) => p.planTier === tier);
    if (found) {
      const monthly = Math.round(found.amountCents / 100);
      const annual = Math.round(monthly * 0.7);
      return billingCycle === "annual" ? annual : monthly;
    }
    return billingCycle === "annual" ? defaultAnnual : defaultMonthly;
  };

  const getDynamicName = (tier: string, defaultName: string) => {
    const found = dynamicPlans.find((p) => p.planTier === tier);
    return found?.name || defaultName;
  };

  const plans = [
    {
      id: "starter" as const,
      name: getDynamicName("starter", "Starter"),
      tagline: "Solopreneurs starting out.",
      price: getDynamicPrice("starter", 49, 39),
      credits: "20 high-definition video credits / mo",
      costPerAd: "Full 1080p vertical video exports",
      badge: null,
      highlight: false,
      features: [
        "Automated UGC script variations",
        "1 brand account connection",
        "Voiceover synthesis & kinetic subtitles",
        "AI avatar library & deterministic hooks",
        "Direct multi-platform scheduling",
        "Commercial rights & zero watermarks",
      ],
      ctaText: "Choose Starter",
    },
    {
      id: "growth" as const,
      name: getDynamicName("growth", "Growth"),
      tagline: "Starting to scale.",
      price: getDynamicPrice("growth", 89, 69),
      credits: "60 high-definition video credits / mo",
      costPerAd: "Priority cloud rendering",
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "60 1080p video exports / mo",
        "Up to 5 brand & burner accounts",
        "Automated drip publishing",
        "Anti-shadowban audio-video pitch variations",
        "3 team workspace seats",
        "Priority GPU cloud rendering",
      ],
      ctaText: "Choose Growth",
    },
    {
      id: "scale" as const,
      name: getDynamicName("scale", "Scale"),
      tagline: "Teams pushing high volume.",
      price: getDynamicPrice("scale", 199, 159),
      credits: "150 high-definition video credits / mo",
      costPerAd: "Dedicated GPU cluster",
      badge: "SCALE HIGH VOLUME",
      highlight: false,
      features: [
        "150 1080p video exports / mo",
        "Up to 15 connected accounts",
        "Automated viral blitz scheduling",
        "10 team workspace seats",
        "Multi-brand workspace routing",
        "Direct API & VIP support",
      ],
      ctaText: "Choose Scale",
    },
    {
      id: "enterprise" as const,
      name: "Enterprise",
      tagline: "Larger teams & agencies.",
      price: billingCycle === "annual" ? 799 : 999,
      credits: "Custom video allowances",
      costPerAd: "Dedicated private rendering",
      badge: null,
      highlight: false,
      features: [
        "Every Scale feature included",
        "Custom video rendering pipeline",
        "Unlimited seats & workspaces",
        "Custom branded avatar training",
        "Dedicated account manager",
        "Custom invoicing & SLA guarantees",
      ],
      ctaText: "Book a setup call",
    },
  ];

  const handleCheckout = async (planId: "starter" | "growth" | "scale" | "enterprise") => {
    if (planId === "enterprise") {
      router.push("/dashboard?tab=support&contact=enterprise");
      return;
    }

    setLoadingCheckoutPlan(planId);
    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier: planId }),
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
      a: "Each plan comes with a guaranteed monthly credit quota (20, 60, or 150 videos). Each credit covers a full 1080p vertical video render, complete with custom script generation, AI voiceover synthesis, kinetic typography, and automated multi-account scheduling. Overdelivery is standard.",
    },
    {
      q: "Do I own full commercial rights to videos generated with AutoUGC?",
      a: "Yes. Every video exported from AutoUGC includes full, irrevocable commercial rights for use across organic TikTok, Instagram Reels, YouTube Shorts, and paid Meta/TikTok advertising campaigns with zero royalties or watermarks.",
    },
    {
      q: "How does sales tax, VAT, and invoicing work?",
      a: `Payments are processed securely via our Merchant of Record partner (${providerName.toUpperCase()}). Global sales taxes, VAT, and GST are automatically calculated, collected, and remitted in full compliance with local tax authorities worldwide. Official tax invoices are available in your customer portal.`,
    },
    {
      q: "Can I cancel or change plans at any time?",
      a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from the customer billing portal. If you cancel, your plan benefits remain active until the end of your current billing period.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#1B231B] flex flex-col font-sans selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main id="main-content" className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F3824]/10 border border-[#1F3824]/20 text-[#1F3824] text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Merchant of Record Powered by {providerName.toUpperCase()} — Global VAT & Tax Included</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1B231B] tracking-tight leading-[1.1] mb-6">
            Predictable UGC Pricing for <br className="hidden sm:inline" />
            High-Growth SaaS Teams.
          </h1>

          <p className="text-base sm:text-lg text-[#4A544A] max-w-2xl mx-auto leading-relaxed mb-10">
            Scale your organic pipeline with high-converting vertical ads. No surprise usage fees,
            no agency retainers, and full commercial rights included.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1.5 bg-[#EAECE4] rounded-full border border-[#CBD5C4]/60 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#1F3824] text-white shadow-sm"
                  : "text-[#4A544A] hover:text-[#1B231B]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
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
        </section>

        {/* 4-Tier Pricing Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {plans.map((plan) => {
              const isLoading = loadingCheckoutPlan === plan.id;

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
                        ${plan.price}
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

                  <div className="pt-4 border-t border-[#CBD5C4]/40">
                    <button
                      disabled={isLoading}
                      onClick={() => handleCheckout(plan.id)}
                      className={`w-full py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        plan.highlight
                          ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95"
                          : "bg-[#1F3824] text-white hover:bg-[#162719] active:scale-95"
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>{plan.ctaText}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#CBD5C4]/70 shadow-sm text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B231B] mb-3">
              Calculate Your UGC Production Savings
            </h2>
            <p className="text-sm text-[#4A544A] max-w-xl mx-auto mb-8">
              Compare your current traditional agency or freelance cost against automated AutoUGC production.
            </p>

            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center text-xs font-bold text-[#1B231B] mb-2">
                <span>Target Video Output:</span>
                <span className="text-[#1F3824] bg-[#1F3824]/10 px-2 py-0.5 rounded-full">
                  {adsPerWeek} ads/week ({monthlyAds} ads/month)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={adsPerWeek}
                onChange={(e) => setAdsPerWeek(parseInt(e.target.value, 10))}
                className="w-full accent-[#1F3824] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60">
                <span className="text-xs text-[#717E6C] uppercase font-bold block mb-1">Traditional Agency</span>
                <span className="text-xl sm:text-2xl font-black text-[#1B231B]">
                  ${traditionalAgencyCost.toLocaleString()} / mo
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1F3824]/5 border border-[#1F3824]/20">
                <span className="text-xs text-[#1F3824] uppercase font-bold block mb-1">AutoUGC Software</span>
                <span className="text-xl sm:text-2xl font-black text-[#1F3824]">
                  ${autoUgcCost.toLocaleString()} / mo
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-emerald-800 uppercase font-bold block mb-1">Estimated Savings</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700">
                  ${netSavings.toLocaleString()} / mo
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B231B] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#CBD5C4]/60 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-[#1B231B]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#717E6C] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#4A544A] leading-relaxed border-t border-[#CBD5C4]/30 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
