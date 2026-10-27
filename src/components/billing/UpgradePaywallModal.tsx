"use client";

import React, { useState } from "react";
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
import { SubscriptionTier } from "@/lib/billing/stripe";

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
  onUpgradeSuccess?: (planTier: SubscriptionTier) => void;
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
        body: JSON.stringify({ planId }),
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

  const plans = [
    {
      id: "starter" as const,
      name: "Starter",
      price: "$49",
      billingPeriod: "/ month",
      credits: "20 Videos / mo",
      accounts: "1 Brand Account",
      cadence: "~4 posts / week drip",
      seats: "1 Seat (Solo Founder)",
      highlight: false,
      popular: false,
      features: [
        "20 1080p Video Exports / mo",
        "1 Connected Account",
        "~4 Posts / Week Scheduler",
        "Full Studio & Subtitle Engine",
        "Zero Watermarks",
      ],
    },
    {
      id: "growth" as const,
      name: "Growth",
      price: "$89",
      billingPeriod: "/ month",
      credits: "60 Videos / mo",
      accounts: "Up to 5 Accounts",
      cadence: "~2 posts / day automated drip",
      seats: "3 Team Seats",
      highlight: true,
      popular: true,
      features: [
        "60 1080p Video Exports / mo",
        "Up to 5 Brand & Burner Accounts",
        "~2 Posts / Day Automated Drip",
        "Multi-Account Clipping Army",
        "Anti-Duplicate Shadowban Engine",
        "3 Team Workspace Seats",
        "Priority GPU Cloud Rendering",
      ],
    },
    {
      id: "scale" as const,
      name: "Scale",
      price: "$199",
      billingPeriod: "/ month",
      credits: "180 Videos / mo",
      accounts: "Up to 15 Accounts",
      cadence: "~6 posts / day viral blitz",
      seats: "10 Team Seats",
      highlight: false,
      popular: false,
      features: [
        "180 1080p Video Exports / mo",
        "Up to 15 Accounts (Multi-Brand)",
        "~6 Posts / Day Viral Blitz",
        "10 Team Workspace Seats",
        "Dedicated GPU Rendering Cluster",
        "Agency Multi-Brand Management",
        "Direct API & VIP Support",
      ],
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      className="p-0 overflow-hidden bg-[#F6F7F2] border border-[#CBD5C4] rounded-3xl shadow-2xl text-[#1B231B]"
    >
      <div className="flex flex-col relative overflow-hidden">
        {/* Header Alert Banner */}
        <div className="p-6 sm:p-7 border-b border-[#CBD5C4]/60 bg-white relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824] font-semibold">
              {headerInfo.badgeText}
            </span>
            <span className="text-[11px] text-[#717E6C] font-mono">
              Current Plan: <span className="uppercase text-[#1B231B] font-semibold">{currentPlanTier}</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B]">
            {headerInfo.title}
          </h3>
          <p className="text-xs text-[#4A544A] mt-1.5 max-w-xl leading-relaxed">
            {headerInfo.description}
          </p>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3-Tier Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isCurrent = currentPlanTier === plan.id;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer bg-white ${
                  plan.popular
                    ? "border-2 border-[#1F3824] shadow-md bg-[#FAFBF9]"
                    : isSelected
                    ? "border border-[#1F3824]/80 shadow-xs"
                    : "border border-[#CBD5C4]/70 hover:border-[#1F3824]/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1F3824] text-white font-bold text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#1B231B]">
                      {plan.name}
                    </span>
                    {isCurrent && (
                      <Badge variant="neutral" size="sm" className="text-[9px] font-mono bg-[#E2E9DC] text-[#1F3824]">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-extrabold text-[#1B231B]">
                      {plan.price}
                    </span>
                    <span className="text-[11px] text-[#717E6C]">
                      {plan.billingPeriod}
                    </span>
                  </div>

                  <div className="space-y-1.5 pb-4 border-b border-[#CBD5C4]/60 mb-4">
                    <div className="text-[11px] font-semibold text-[#1F3824] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>{plan.credits}</span>
                    </div>
                    <div className="text-[11px] text-[#4A544A] flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 shrink-0 text-[#717E6C]" />
                      <span>{plan.accounts}</span>
                    </div>
                    <div className="text-[11px] text-[#4A544A] flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0 text-[#717E6C]" />
                      <span>{plan.seats}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-[11px] text-[#4A544A] flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-[#1F3824] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                  className={`w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    plan.popular
                      ? "bg-[#1F3824] hover:bg-[#162B1B] text-white shadow-sm"
                      : "border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white"
                  }`}
                >
                  {isLoading ? "Redirecting..." : isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="px-6 py-4 bg-[#EEF1EA] border-t border-[#CBD5C4]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4A544A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#1F3824] shrink-0" />
            <span>Cancel anytime with 1 click. Zero lock-in. Instant credit allotment.</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#717E6C] hover:text-[#1B231B] hover:underline transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </Modal>
  );
}
