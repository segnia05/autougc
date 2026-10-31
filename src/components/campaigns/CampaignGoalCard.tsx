"use client";

import React from "react";
import { Target } from "lucide-react";

interface CampaignGoalCardProps {
  goalTitle?: string;
  goalDescription?: string;
}

export default function CampaignGoalCard({
  goalTitle = "Scale paid customer acquisition",
  goalDescription = "Convert high-intent audience with automated creator video ads and software proof.",
}: CampaignGoalCardProps) {
  return (
    <div className="fastlane-card p-6 bg-white space-y-4 flex flex-col justify-between select-none">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
          The Goal
        </div>

        {/* Primary Goal Statement (Screenshot 4 Match) */}
        <h3 className="mt-3 text-base font-bold text-[#18181B] leading-snug tracking-tight">
          {goalTitle}
        </h3>

        {/* Secondary Detail Text */}
        <p className="mt-2 text-xs text-[#52525B] leading-relaxed">
          {goalDescription}
        </p>
      </div>

      <div className="pt-4 border-t border-[#EFECE6]/70 flex items-center justify-between text-[11px] text-[#8E8B85]">
        <span>Campaign Strategy</span>
        <span className="font-semibold text-[#D95D39]">Conversion & Retargeting</span>
      </div>
    </div>
  );
}

