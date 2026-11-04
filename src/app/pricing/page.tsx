"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, ChevronDown, ShieldCheck, AlertTriangle } from "lucide-react";
import { NormalizedPlan } from "@/lib/billing/types";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [adsPerWeek, setAdsPerWeek] = useState(5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [loadingCheckoutPlan, setLoadingCheckoutPlan] = useState<string | null>(null);
  const [dynamicPlans, setDynamicPlans] = useState<NormalizedPlan[]>([]);
  const [providerName, setProviderName] = useState<string>("polar");
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/v1/billing/plans")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setIsLoadingPlans(false);
        if (data.provider) {
          setProviderName(data.provider);
        }

        if (data.configured === false || !data.success || !Array.isArray(data.plans) || data.plans.length === 0) {
          setIsConfigured(false);
          setMissingKeys(data.missingKeys || []);
          setErrorMessage(data.error || "Need product id and api key");
          setDynamicPlans([]);
        } else {
          setIsConfigured(true);
          setDynamicPlans(data.plans);
          setMissingKeys([]);
          setErrorMessage(null);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Failed to load dynamic plans on pricing page:", err);
        setIsLoadingPlans(false);
        setIsConfigured(false);
        setErrorMessage("Need product id and api key");
        setDynamicPlans([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayPlans = dynamicPlans.map((p) => {
    const isMonthly = billingCycle === "monthly";
    const monthlyDollars = Math.round(p.amountCents / 100);
    const annualDollars = Math.round(monthlyDollars * 0.8);
    const price = isMonthly ? monthlyDollars : annualDollars;
    const isPopular = p.popular || p.planTier === "growth";

    return {
      id: p.planTier as "starter" | "growth" | "scale",
      name: p.name,
      tagline: p.description,
      price,
      credits: `${p.creditsMonthlyAllowance} high-definition video credits / mo`,
      costPerAd:
        p.planTier === "starter"
          ? "Full 1080p vertical video exports"
          : p.planTier === "growth"
          ? "Priority cloud rendering"
          : "Dedicated GPU cluster",
      badge: isPopular ? "MOST POPULAR" : p.planTier === "scale" ? "SCALE HIGH VOLUME" : null,
      highlight: isPopular,
      features: p.features || [],
      ctaText: `Choose ${p.name}`,
    };
  });

  const handleCheckout = async (planId: "starter" | "growth" | "scale") => {
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
  const starterPlan = dynamicPlans.find((p) => p.planTier === "starter");
  const growthPlan = dynamicPlans.find((p) => p.planTier === "growth");
  const scalePlan = dynamicPlans.find((p) => p.planTier === "scale");

  const starterCost = starterPlan
    ? Math.round((starterPlan.amountCents / 100) * (billingCycle === "annual" ? 0.8 : 1))
    : 49;
  const growthCost = growthPlan
    ? Math.round((growthPlan.amountCents / 100) * (billingCycle === "annual" ? 0.8 : 1))
    : 89;
  const scaleCost = scalePlan
    ? Math.round((scalePlan.amountCents / 100) * (billingCycle === "annual" ? 0.8 : 1))
    : 199;

  const autoUgcCost =
    monthlyAds <= 20 ? starterCost : monthlyAds <= 60 ? growthCost : scaleCost;
  const netSavings = Math.max(0, traditionalAgencyCost - autoUgcCost);

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
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex flex-col font-sans selection:bg-[#D95D39] selection:text-white">
      <Navbar />

      <main id="main-content" className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F1EA] border border-[#E5E0D8] text-[#D95D39] text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Merchant of Record Powered by {providerName.toUpperCase()} — Global VAT & Tax Included</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#18181B] tracking-tight leading-[1.1] mb-6">
            Predictable UGC Pricing for <br className="hidden sm:inline" />
            High-Growth SaaS Teams.
          </h1>

          <p className="text-base sm:text-lg text-[#52525B] max-w-2xl mx-auto leading-relaxed mb-10">
            Scale your organic pipeline with high-converting vertical ads. No surprise usage fees,
            no agency retainers, and full commercial rights included.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1.5 bg-[#F4F1EA] rounded-full border border-[#E5E0D8]/60 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#18181B] text-white shadow-sm"
                  : "text-[#52525B] hover:text-[#18181B]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-[#18181B] text-white shadow-sm"
                  : "text-[#52525B] hover:text-[#18181B]"
              }`}
            >
              <span>Annual Billing</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                billingCycle === "annual" ? "bg-white/20 text-white font-bold" : "bg-[#F4F1EA] text-[#D95D39]"
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </section>

        {/* Live Dynamic Pricing Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D95D39] border-t-transparent" />
                <span className="text-xs text-[#8E8B85] font-mono">
                  Syncing live catalog from {providerName === "paddle" ? "Paddle" : "Polar"}...
                </span>
              </div>
            </div>
          ) : !isConfigured || dynamicPlans.length === 0 ? (
            /* Missing Credentials Alert Card */
            <div className="rounded-3xl bg-[#FEF3C7]/40 border-2 border-[#F59E0B]/60 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#FEF3C7] text-[#D97706] mb-5 border border-[#F59E0B]/30 shadow-xs">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#18181B] mb-3">
                Need Product ID and API Key
              </h3>
              <p className="text-sm text-[#52525B] max-w-lg mx-auto mb-6 leading-relaxed">
                AutoUGC strictly prohibits static pricing. Plan names, tier pricing, and monthly video quotas must be dynamically fetched from <strong className="text-[#18181B]">{providerName === "paddle" ? "Paddle" : "Polar"}</strong> using your product IDs and API key.
              </p>

              {missingKeys.length > 0 && (
                <div className="bg-white/80 rounded-2xl p-5 border border-[#E5E0D8]/70 max-w-md mx-auto text-left mb-6 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#8E8B85] mb-3 flex items-center justify-between">
                    <span>Missing Environment Variables</span>
                    <span className="text-[10px] text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full font-semibold">Action Required</span>
                  </div>
                  <ul className="space-y-2 font-mono text-xs text-[#991B1B]">
                    {missingKeys.map((key) => (
                      <li key={key} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                        <code className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">{key}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-[#8E8B85] max-w-md mx-auto">
                Configure these keys in your <code className="text-xs bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#18181B]">.env.local</code> file to dynamically synchronize your live Merchant of Record pricing catalog.
              </p>
            </div>
          ) : (
            /* 3-Tier Dynamic Pricing Grid */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {displayPlans.map((plan) => {
                  const isLoading = loadingCheckoutPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all bg-white border ${
                        plan.highlight
                          ? "border-2 border-orange-500 shadow-lg bg-[#FAFBF9] ring-2 ring-orange-500/20"
                          : "border-[#E5E0D8]/70 shadow-sm"
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                          {plan.badge}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-xl font-bold text-[#18181B]">
                            {plan.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#52525B] mb-4 min-h-[28px]">
                          {plan.tagline}
                        </p>

                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#18181B]">
                            ${plan.price}
                          </span>
                          <span className="text-xs text-[#8E8B85]">USD / month</span>
                        </div>

                        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E0D8]/60 mb-5">
                          <div className="text-xs font-bold text-[#D95D39]">
                            {plan.credits}
                          </div>
                          <div className="text-[11px] text-[#8E8B85] mt-0.5">
                            {plan.costPerAd}
                          </div>
                        </div>

                        <ul className="space-y-2.5 text-xs text-[#52525B] mb-6">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-3.5 w-3.5 text-[#D95D39] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-[#E5E0D8]/40">
                        <button
                          disabled={isLoading}
                          onClick={() => handleCheckout(plan.id)}
                          className={`w-full py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                            plan.highlight
                              ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95"
                              : "bg-[#18181B] text-white hover:bg-[#27272A] active:scale-95"
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

              {/* Enterprise Custom Inquiry Banner */}
              <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8]/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D95D39] bg-[#FFF9F6] px-2.5 py-1 rounded-full inline-block mb-2">
                    Enterprise Custom
                  </span>
                  <h4 className="text-xl font-bold text-[#18181B] mb-1">
                    Need custom video pipelines or dedicated GPU clusters?
                  </h4>
                  <p className="text-xs text-[#52525B] max-w-xl">
                    For high-growth agencies and venture-backed SaaS requiring unlimited seats, custom AI avatar training, and bespoke invoicing.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard?tab=support&contact=enterprise")}
                  className="px-6 py-3 rounded-full border border-[#18181B] text-[#18181B] hover:bg-[#18181B] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                >
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ROI Calculator Section */}
        <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E0D8]/70 shadow-sm text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mb-3">
              Calculate Your UGC Production Savings
            </h2>
            <p className="text-sm text-[#52525B] max-w-xl mx-auto mb-8">
              Compare your current traditional agency or freelance cost against automated AutoUGC production.
            </p>

            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center text-xs font-bold text-[#18181B] mb-2">
                <span>Target Video Output:</span>
                <span className="text-[#D95D39] bg-[#FFF9F6] px-2 py-0.5 rounded-full">
                  {adsPerWeek} ads/week ({monthlyAds} ads/month)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={adsPerWeek}
                onChange={(e) => setAdsPerWeek(parseInt(e.target.value, 10))}
                className="w-full accent-[#D95D39] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60">
                <span className="text-xs text-[#8E8B85] uppercase font-bold block mb-1">Traditional Agency</span>
                <span className="text-xl sm:text-2xl font-black text-[#18181B]">
                  ${traditionalAgencyCost.toLocaleString()} / mo
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#F5E2DA]">
                <span className="text-xs text-[#D95D39] uppercase font-bold block mb-1">AutoUGC Software</span>
                <span className="text-xl sm:text-2xl font-black text-[#D95D39]">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E5E0D8]/60 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-[#18181B]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8E8B85] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#E5E0D8]/30 pt-3">
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
