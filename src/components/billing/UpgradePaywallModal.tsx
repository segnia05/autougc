"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Users,
  ArrowRight,
  Layers,
} from "lucide-react";
import { NormalizedPlan } from "@/lib/billing/types";

export type PaywallTriggerReason =
  | "credits_exhausted"
  | "account_limit"
  | "team_seats"
  | "team_seats_scale"
  | "autopilot_locked"
  | "general";

export interface UpgradePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: PaywallTriggerReason;
  currentPlanTier?: string;
  onUpgradeSuccess?: (planTier: "starter" | "growth" | "scale") => void;
}

export function UpgradePaywallModal({
  isOpen,
  onClose,
  triggerReason = "general",
  currentPlanTier = "free",
  onUpgradeSuccess,
}: UpgradePaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "growth" | "scale">("growth");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dynamicPlans, setDynamicPlans] = useState<NormalizedPlan[]>([]);
  const [providerName, setProviderName] = useState<string>("polar");

  // Dynamically fetch live prices, names, and billing periods from Polar/Paddle API
  useEffect(() => {
    let isMounted = true;
    fetch("/api/v1/billing/plans")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.provider) {
          setProviderName(data.provider);
        }
        if (data.configured && Array.isArray(data.plans) && data.plans.length > 0) {
          setDynamicPlans(data.plans);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Dynamic plans fetch deferred to standard tiers:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getHeaderContext = () => {
    switch (triggerReason) {
      case "credits_exhausted":
        return {
          badgeText: "0 Credits Remaining",
          title: "Unlock Video Credits & Scale Your UGC Ads",
          description:
            "You have 0 video export credits. Upgrade your account to render high-definition 1080p vertical ads without watermarks and publish automatically.",
        };
      case "account_limit":
        return {
          badgeText: "Account Limit Reached",
          title: "Connect More TikTok & Instagram Accounts",
          description:
            "Your current plan fleet limit has been reached. Upgrade to Growth (5 accounts) or Scale (15 accounts) to expand your multi-account distribution network.",
        };
      case "team_seats":
      case "team_seats_scale":
        return {
          badgeText: "Team Collaboration Required",
          title: "Collaborate With Your Media Team",
          description:
            "Free accounts do not include additional seats. Upgrade to Growth for 3 seats or Scale for 10 seats to collaborate with your media buyers and editors.",
        };
      case "autopilot_locked":
        return {
          badgeText: "Autopilot Campaign Feature",
          title: "Automate Your 30-Day Content Distribution",
          description:
            "Autonomous scheduling, peak-hour timing, and automated drops require an active Starter, Growth, or Scale subscription.",
        };
      default:
        return {
          badgeText: "Upgrade Plan",
          title: "Supercharge Your UGC Ad Performance",
          description:
            "Select the high-converting production plan that fits your growth velocity and unlock higher video quotas, multi-account distribution, and priority rendering.",
        };
    }
  };

  const headerInfo = getHeaderContext();

  const handleSelectPlan = async (planId: "starter" | "growth" | "scale") => {
    setLoadingPlan(planId);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier: planId }),
      });

      const data = await res.json();
      if (!res.ok || (!data.url && !data.success)) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (onUpgradeSuccess) {
        onUpgradeSuccess(planId);
      }

      if (data.url) {
        window.location.assign(data.url);
      } else {
        window.location.assign("/pricing");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error initiating checkout";
      setErrorMessage(msg);
      setLoadingPlan(null);
    }
  };

  // Base configurations with dynamic price override
  const getPlanDetails = (tier: "starter" | "growth" | "scale") => {
    const dynamic = dynamicPlans.find((p) => p.planTier === tier);

    const fallbacks = {
      starter: {
        name: "Starter",
        price: "$49",
        billingPeriod: "/ month",
        credits: "20 Videos / mo",
        accounts: "1 Brand Account",
        seats: "1 Seat (Solo Founder)",
        highlight: false,
        popular: false,
      },
      growth: {
        name: "Growth",
        price: "$89",
        billingPeriod: "/ month",
        credits: "60 Videos / mo",
        accounts: "Up to 5 Accounts",
        seats: "3 Team Seats",
        highlight: true,
        popular: true,
      },
      scale: {
        name: "Scale",
        price: "$199",
        billingPeriod: "/ month",
        credits: "150 Videos / mo",
        accounts: "Up to 15 Accounts",
        seats: "10 Team Seats",
        highlight: false,
        popular: false,
      },
    }[tier];

    return {
      id: tier,
      name: dynamic?.name || fallbacks.name,
      price: dynamic?.formattedPrice || fallbacks.price,
      billingPeriod: dynamic?.billingInterval ? `/ ${dynamic.billingInterval}` : fallbacks.billingPeriod,
      credits: dynamic ? `${dynamic.creditsMonthlyAllowance} Videos / mo` : fallbacks.credits,
      accounts: fallbacks.accounts,
      seats: fallbacks.seats,
      highlight: fallbacks.highlight,
      popular: fallbacks.popular,
      features: dynamic?.features?.length ? dynamic.features : [
        `${dynamic?.creditsMonthlyAllowance || (tier === "starter" ? 20 : tier === "growth" ? 60 : 150)} 1080p Video Exports / mo`,
        fallbacks.accounts,
        "Subtitles & Voiceover Synthesis",
        "Multi-Platform Distribution",
        "Zero Watermarks",
      ],
    };
  };

  const plans = [
    getPlanDetails("starter"),
    getPlanDetails("growth"),
    getPlanDetails("scale"),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="p-6 md:p-8 space-y-7 bg-[#FAF8F5] text-[#18181B] rounded-3xl border border-[#E5E0D8] shadow-2xl">
        {/* Header Section */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] border border-[#F59E0B]/30">
              {headerInfo.badgeText}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#18181B] tracking-tight">
            {headerInfo.title}
          </h2>
          <p className="text-xs md:text-sm text-[#52525B] leading-relaxed">
            {headerInfo.description}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isCurrent = currentPlanTier === plan.id;
            const isSelected = selectedPlan === plan.id;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                  plan.highlight
                    ? "bg-white border-[#D95D39] shadow-md ring-2 ring-[#D95D39]/20"
                    : isSelected
                    ? "bg-white border-[#18181B] shadow-sm"
                    : "bg-white/70 border-[#E5E0D8] hover:border-[#18181B]/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D95D39] text-white shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#18181B]">{plan.name}</span>
                    {isCurrent && (
                      <Badge variant="outline" className="text-[10px] border-[#E5E0D8] text-[#8E8B85]">
                        Current Plan
                      </Badge>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#18181B] tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-[#8E8B85] text-xs">{plan.billingPeriod}</span>
                    </div>
                    <p className="text-xs text-[#D95D39] font-semibold mt-1">
                      {plan.credits}
                    </p>
                  </div>

                  {/* Highlights Pill */}
                  <div className="py-2 px-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-[#52525B]">
                      <Layers className="w-3.5 h-3.5 text-[#8E8B85] shrink-0" />
                      <span className="text-[11px] font-medium">{plan.accounts}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#52525B]">
                      <Users className="w-3.5 h-3.5 text-[#8E8B85] shrink-0" />
                      <span className="text-[11px] font-medium">{plan.seats}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1.5 pt-1 text-xs text-[#52525B]">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EFECE6]">
                  <button
                    disabled={isCurrent || isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan.id);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isCurrent
                        ? "bg-[#EFECE6] text-[#8E8B85] cursor-not-allowed"
                        : plan.highlight
                        ? "bg-[#D95D39] text-white hover:bg-[#C24D2B] shadow-xs active:scale-95"
                        : "bg-[#18181B] text-white hover:bg-black active:scale-95"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isCurrent ? (
                      "Active Plan"
                    ) : (
                      <>
                        <span>Upgrade to {plan.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="pt-3 border-t border-[#E5E0D8] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#8E8B85]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Checkout & Instant Credit Allocation</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Cancel anytime</span>
            <span>•</span>
            <span>Commercial rights</span>
            <span>•</span>
            <span>Full 1080p rendering</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
