"use client";

import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export type OnboardingStep = "you" | "brand";

interface OnboardingHeaderProps {
  currentStep: OnboardingStep;
  onStepChange?: (step: OnboardingStep) => void;
}

const STEPS: { key: OnboardingStep; label: string }[] = [
  { key: "you", label: "YOU" },
  { key: "brand", label: "YOUR BRAND" },
];

export default function OnboardingHeader({
  currentStep,
  onStepChange,
}: OnboardingHeaderProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent border-b border-[#EFECE6]/70 select-none">
      {/* Left: Brand Icon */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#18181B] text-white shadow-xs">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 15L14 4H10L2 15H4Z" fill="currentColor" />
            <path d="M10 20L20 9H16L8 20H10Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Center: Minimalist Dashed Stepper (Screenshot 5 Match) */}
      <div className="flex items-center gap-8 md:gap-12">
        {STEPS.map((step, idx) => {
          const isActive = step.key === currentStep;
          const isDone = idx < currentIdx;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-1.5 cursor-default"
            >
              <span
                className={`text-[11px] font-bold tracking-wider transition-colors ${
                  isActive
                    ? "text-[#D95D39]"
                    : isDone
                    ? "text-[#18181B]"
                    : "text-[#8E8B85]"
                }`}
              >
                {step.label}
              </span>

              {/* Dashed / Solid Indicator Bar */}
              <div className="flex items-center gap-1">
                <span
                  className={`h-0.5 w-6 rounded-full transition-all ${
                    isActive
                      ? "bg-[#D95D39] w-8"
                      : isDone
                      ? "bg-[#18181B]"
                      : "bg-[#E5E0D8]"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Finish Later & Sign Out */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8"
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

