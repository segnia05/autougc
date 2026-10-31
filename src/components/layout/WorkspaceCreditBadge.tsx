"use client";

import React, { useState } from "react";
import { ChevronUp, Zap, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WorkspaceCreditBadgeProps {
  brandName?: string;
  credits?: number;
  maxCredits?: number;
  percentageUsed?: number;
}

export default function WorkspaceCreditBadge({
  brandName = "Active Brand",
  credits = 50,
  maxCredits = 250,
  percentageUsed = 20,
}: WorkspaceCreditBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Bottom Credit Card Pill Container */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#EFECE6] shadow-2xs hover:border-[#E5E0D8] transition-all cursor-pointer group select-none"
      >
        {/* Left: Brand Icon & Details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-center text-[#D95D39]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10c0-4.42-3-8-7-9.5" />
              <path d="M8.5 8.5c1.5 2 4.5 2 6 0" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#18181B] truncate">
              {brandName}
            </div>

            {/* Progress Bar & Percentage */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-16 h-1 rounded-full bg-[#EFECE6] overflow-hidden">
                <div
                  className="h-full bg-[#D95D39] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, percentageUsed)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#8E8B85] font-medium leading-none">
                {percentageUsed}% used
              </span>
            </div>
          </div>
        </div>

        {/* Right: Credits in Digital LCD Font & Chevron */}
        <div className="flex flex-col items-end pl-2">
          <div className="text-xs font-bold text-[#18181B] font-digital tracking-tight">
            {credits} cr
          </div>
          <ChevronUp
            className={`w-3.5 h-3.5 text-[#8E8B85] transition-transform duration-200 mt-0.5 ${
              isExpanded ? "rotate-180 text-[#18181B]" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Credit & Upgrade Drawer */}
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute bottom-16 left-0 right-0 z-50 p-4 rounded-2xl bg-white border border-[#EFECE6] shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFECE6]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E8B85]">
                Creative Credits
              </span>
              <span className="text-xs font-digital font-bold text-[#D95D39]">
                {credits} / {maxCredits} cr
              </span>
            </div>

            <div className="py-3 space-y-1.5 text-xs text-[#52525B]">
              <div className="flex justify-between">
                <span>Cost per 9:16 video:</span>
                <span className="font-semibold text-[#18181B]">5 credits</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per image ad:</span>
                <span className="font-semibold text-[#18181B]">1 credit</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly reset:</span>
                <span className="text-[#8E8B85]">7 days remaining</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EFECE6] flex flex-col gap-2">
              <Link
                href="/pricing"
                onClick={() => setIsExpanded(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#18181B] hover:bg-[#09090B] text-white text-xs font-medium transition-colors shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Upgrade Plan</span>
                <ArrowRight className="w-3 h-3 ml-auto text-white/60" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

