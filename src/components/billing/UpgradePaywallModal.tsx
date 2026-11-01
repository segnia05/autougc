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
  AlertTriangle,
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
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

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
        if (data.configured === false || !data.success || !Array.isArray(data.plans) || data.plans.length === 0) {
          setIsConfigured(false);
          setMissingKeys(data.missingKeys || []);
          setDynamicPlans([]);
        } else {
          setIsConfigured(true);
          setDynamicPlans(data.plans);
          setMissingKeys([]);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Failed to load dynamic plans:", err);
        setIsConfigured(false);
        setDynamicPlans([]);
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
          title: "Unlock More Video Credits & Scale Your UGC Ads",
          description:
            "You've consumed all video export credits on your account. Upgrade your plan now to render high-definition 1080p vertical ads without watermarks.",
        };
      case "account_limit":
        return {
          badgeText: "Account Limit Reached",
          title: "Connect More Burners & Satellite Accounts",
          description:
            "Your current plan limit has been reached. Upgrade to Growth (5 accounts) or Scale (15 accounts) to expand your multi-account distribution army.",
        };
      case "team_seats":
      case "team_seats_scale":
        return {
          badgeText: "Team Collaboration Required",
          title: "Collaborate With Your Team & Media Buyers",
          description:
            "Solo plans do not include additional seats. Upgrade to Growth for 3 seats or Scale for 10 seats to collaborate with your media buyers and editors.",
        };
      case "autopilot_locked":
        return {
          badgeText: "Autopilot Campaign Feature",
          title: "Automate Your 30-Day Content Distribution",
          description:
            "Autonomous scheduling, peak-hour timing, and anti-shadowban rotation require an active Starter, Growth, or Scale subscription.",
        };
      default:
        return {
          badgeText: "Upgrade Plan",
          title: "Supercharge Your UGC Ad Performance",
          description:
            "Select the high-converting production plan that fits your growth velocity and unlock higher video quotas, multi-account clipping, and priority rendering.",
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
        `${dynamic?.creditsMonthlyAllowance || 20} 1080p Video Exports / mo`,
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
      <div className="p-6 md:p-8 space-y-8 bg-zinc-950 text-white rounded-2xl border border-zinc-800">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="amber" className="px-3 py-1 font-semibold tracking-wide uppercase text-xs">
              {headerInfo.badgeText}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs border-zinc-700 text-zinc-400 capitalize">
              Powered by {providerName} (MoR)
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {headerInfo.title}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            {headerInfo.description}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3-Tier Grid or Missing Credentials Alert */}
        {!isConfigured || dynamicPlans.length === 0 ? (
          <div className="rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 p-6 sm:p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Need Product ID and API Key</h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
              AutoUGC strictly prohibits static pricing. Plan names, tier pricing, and monthly video quotas must be dynamically fetched from <strong className="text-white capitalize">{providerName}</strong> using your product IDs and API key.
            </p>
            {missingKeys.length > 0 && (
              <div className="bg-black/60 rounded-xl p-4 border border-zinc-800 text-left max-w-md mx-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Missing Environment Variables</span>
                  <span className="text-amber-400 font-semibold">Action Required</span>
                </div>
                <ul className="space-y-1.5 font-mono text-xs text-amber-400">
                  {missingKeys.map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      <code>{key}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-[11px] text-zinc-500">
              Configure these keys in your <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded">.env.local</code> file to activate live pricing and checkout.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = currentPlanTier === plan.id;
              const isSelected = selectedPlan === plan.id;
              const isLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all cursor-pointer ${
                    plan.highlight
                      ? "bg-zinc-900/90 border-amber-500/70 shadow-lg shadow-amber-500/10"
                      : isSelected
                      ? "bg-zinc-900 border-zinc-600"
                      : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">{plan.name}</span>
                      {isCurrent && (
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                          Current Plan
                        </Badge>
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                          {plan.price}
                        </span>
                        <span className="text-zinc-500 text-xs">{plan.billingPeriod}</span>
                      </div>
                      <p className="text-xs text-amber-400/90 font-medium mt-1">
                        {plan.credits}
                      </p>
                    </div>

                    {/* Highlights Pill */}
                    <div className="py-2.5 px-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{plan.accounts}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{plan.seats}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 pt-2 text-xs text-zinc-300">
                      {plan.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-800/60">
                    <button
                      disabled={isCurrent || isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isCurrent
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                          : plan.highlight
                          ? "bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95"
                          : "bg-white text-black hover:bg-zinc-200 active:scale-95"
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
        )}

        {/* Footer Guarantee */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Checkout & Global Sales Tax handled via {providerName.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Cancel anytime</span>
            <span>Instant credit allocation</span>
            <span>100% Commercial rights</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
