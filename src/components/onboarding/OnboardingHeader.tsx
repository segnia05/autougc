"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export type OnboardingStep = "you" | "brand";

interface OnboardingHeaderProps {
  currentStep: OnboardingStep;
  onStepChange?: (step: OnboardingStep) => void;
}

export default function OnboardingHeader({
  currentStep,
}: OnboardingHeaderProps) {
  const isYouActive = currentStep === "you";
  const isBrandActive = currentStep === "brand";

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#FAF8F5]/90 border-b border-[#EFECE6] backdrop-blur-md select-none">
      {/* Left: Brand Identity */}
      <Link href="/" className="flex items-center gap-2 group focus:outline-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FDF3EF] border border-[#F3CEBE] text-[#D95D39] shadow-2xs group-hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 fill-[#D95D39]" />
        </div>
        <span className="text-xs font-bold tracking-tight text-[#18181B]">
          Auto<span className="text-[#D95D39]">UGC</span>
        </span>
      </Link>

      {/* Center: Stepper (YOU ➔ YOUR BRAND) */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Step 1: YOU */}
        <div className="flex flex-col items-center gap-1.5 cursor-default">
          <span
            className={`text-[11px] font-bold tracking-wider transition-colors ${
              isYouActive
                ? "text-[#D95D39]"
                : "text-[#18181B]"
            }`}
          >
            YOU
          </span>
          <span
            className={`h-0.5 rounded-full transition-all ${
              isYouActive
                ? "bg-[#D95D39] w-8"
                : "bg-[#18181B] w-6"
            }`}
          />
        </div>

        {/* Arrow Divider */}
        <div className="text-[#8E8B85] flex items-center">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Step 2: YOUR BRAND */}
        <div className="flex flex-col items-center gap-1.5 cursor-default">
          <span
            className={`text-[11px] font-bold tracking-wider transition-colors ${
              isBrandActive
                ? "text-[#D95D39]"
                : "text-[#8E8B85]"
            }`}
          >
            YOUR BRAND
          </span>
          <span
            className={`h-0.5 rounded-full transition-all ${
              isBrandActive
                ? "bg-[#D95D39] w-8"
                : "bg-[#E5E0D8] w-6"
            }`}
          />
        </div>
      </div>

      {/* Right: Finish Later & Sign Out */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8 flex items-center justify-center font-semibold"
        >
          Finish later
        </Link>
        <Link
          href="/sign-in"
          className="text-xs text-[#8E8B85] hover:text-[#18181B] transition-colors font-medium px-2"
        >
          Log out
        </Link>
      </div>
    </header>
  );
}