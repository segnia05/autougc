"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CampaignCreditLedgerCardProps {
  currentCredits?: number;
  completedPosts?: number;
  totalPosts?: number;
  postsStillToMake?: number;
  creditsToCoverAll?: number;
  shortfallCredits?: number;
}

export default function CampaignCreditLedgerCard({
  currentCredits = 50,
  completedPosts = 3,
  totalPosts = 30,
  postsStillToMake = 27,
  creditsToCoverAll = 1232,
  shortfallCredits = 1182,
}: CampaignCreditLedgerCardProps) {
  return (
    <div className="fastlane-card p-6 bg-white space-y-4 flex flex-col justify-between select-none">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
          Your Credits
        </div>

        {/* Giant LCD Metric */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-digital text-3xl font-bold text-[#18181B] tracking-tight">
            {currentCredits}
          </span>
          <span className="text-xs text-[#52525B] font-medium">credits</span>
        </div>

        {/* Campaign Run-rate Subtitle */}
        <p className="mt-1 text-xs text-[#52525B]">
          {completedPosts} of {totalPosts} made · {postsStillToMake} posts still to make, {creditsToCoverAll.toLocaleString()} credits
        </p>

        {/* Cover All Posts CTA Button (Screenshot 4 Match) */}
        <div className="mt-4">
          <Link
            href="/pricing"
            className="w-full btn-fastlane-black py-2.5 px-4 text-xs font-semibold justify-between shadow-xs"
          >
            <span>Cover all posts · {shortfallCredits.toLocaleString()} credits</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-[#EFECE6]/70">
        <p className="text-[11px] text-[#8E8B85] leading-relaxed">
          Covering adds {shortfallCredits.toLocaleString()} credits, enough to make every draft. Nothing is made or charged until you press Make. Launch asks you to confirm first. Drafts nobody made stay drafts; Make them any time.
        </p>

        {/* Reassurance Warning with terracotta diamond (Screenshot 4 Match) */}
        <div className="flex items-start gap-1.5 text-[11px] text-[#52525B]">
          <span className="text-[#D95D39] flex-shrink-0">◆</span>
          <span>AI can make mistakes. Check each post before it goes out.</span>
        </div>
      </div>
    </div>
  );
}

