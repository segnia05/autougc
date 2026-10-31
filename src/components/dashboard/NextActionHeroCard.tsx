"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoreHorizontal } from "lucide-react";

interface NextActionHeroCardProps {
  completedCount?: number;
  totalCount?: number;
  campaignName?: string;
  onOpen?: () => void;
  adThumbnails?: string[];
}

export default function NextActionHeroCard({
  completedCount = 3,
  totalCount = 30,
  campaignName = "Starter campaign",
  adThumbnails = [
    "/images/creator-sarah.jpg",
    "/images/creator-alex.jpg",
    "/images/creator-sarah.jpg",
  ],
}: NextActionHeroCardProps) {
  return (
    <div className="space-y-2.5 select-none">
      {/* Subtle Section Label */}
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#D95D39]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#D95D39]">◆</span>
          <span>Next Up · The 1 Thing That Needs You</span>
        </div>
        <button
          type="button"
          className="text-[#8E8B85] hover:text-[#18181B] transition-colors p-0.5"
          aria-label="Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Card Container (Screenshot 3 Match) */}
      <div className="fastlane-card p-6 bg-white relative flex flex-col justify-between overflow-hidden group hover:border-[#E5E0D8] transition-all">
        <div>
          {/* Top Tag Row */}
          <div className="flex items-center justify-between">
            <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#B44B27] text-white text-[10px] font-bold uppercase tracking-wider">
              Your Next Step
            </span>
            <span className="text-xs text-[#8E8B85] font-medium">
              {campaignName}
            </span>
          </div>

          {/* Status Subtitle */}
          <div className="mt-4 text-xs text-[#52525B]">
            {completedCount} of {totalCount} made · connect your Meta ad account, then launch
          </div>

          {/* Main Title */}
          <h2 className="mt-1 text-2xl font-bold text-[#18181B] tracking-tight">
            Launch your campaign
          </h2>
        </div>

        {/* Bottom Carousel / Thumbnails & Open Action */}
        <div className="mt-6 flex items-end justify-between gap-4">
          {/* 3 Ad Creatives Thumbnails */}
          <div className="flex items-center gap-2">
            {adThumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className="relative w-14 h-20 rounded-xl overflow-hidden bg-[#18181B] border border-[#EFECE6] shadow-2xs group-hover:scale-102 transition-transform"
              >
                <Image
                  src={thumb}
                  alt={`Draft ad #${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Open Button (Black Pill with Arrow) */}
          <Link
            href="/campaigns"
            className="btn-fastlane-black py-2.5 px-5 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <span>Open</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}

