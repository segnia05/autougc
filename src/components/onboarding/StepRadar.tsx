"use client";

import React from "react";
import Image from "next/image";
import { CornerDownLeft, Play, Sparkles } from "lucide-react";
import { NicheBenchmark } from "@/lib/intelligence/competitorRadarService";

interface StepRadarProps {
  benchmark: NicheBenchmark;
  onContinue: () => void;
  onBack: () => void;
}

export default function StepRadar({
  benchmark,
  onContinue,
  onBack,
}: StepRadarProps) {
  const {
    longestRunningDays,
    topCompetitorName,
    monthlyVelocityTotal,
    topCompetitorVelocity,
    videoSharePercent,
    monthlyTrends,
    longestRunningAd,
    suggestedFirstAds,
  } = benchmark;

  return (
    <div className="max-w-6xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-3 duration-200 select-none">
      {/* 3-Column Executive Grid (Screenshot 5 Match) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1 (span 3): Longest-Running Ad */}
        <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-2xl bg-[#FFF9F6] border border-[#F5E2DA] shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Longest-Running Ad
            </div>

            {/* Giant LCD Metric */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-digital text-4xl font-bold text-[#D95D39] tracking-tight">
                {longestRunningDays}
              </span>
              <span className="text-xs text-[#52525B] font-medium">days live</span>
            </div>

            <p className="mt-2 text-xs text-[#52525B] leading-snug">
              {topCompetitorName}&apos;s ad is still running.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#EFECE6] bg-[#18181B] group shadow-xs">
              <Image
                src={longestRunningAd.thumbnailUrl}
                alt={longestRunningAd.headline}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/90 text-[#18181B] flex items-center justify-center shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#18181B]">
                {topCompetitorName}
              </div>
              <div className="text-[11px] text-[#8E8B85] leading-snug mt-0.5">
                {longestRunningAd.note}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 (span 4): Niche Velocity & Video Share */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card Top: Ads Launched in Your Niche */}
          <div className="flex-1 p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
                Ads Launched in Your Niche
              </div>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-digital text-3xl font-bold text-[#18181B] tracking-tight">
                  {monthlyVelocityTotal}+
                </span>
                <span className="text-xs text-[#52525B]">a month</span>
              </div>

              <p className="mt-1 text-xs text-[#52525B]">
                Walter Writes AI alone launches {topCompetitorVelocity}.
              </p>
            </div>

            {/* Mini Histogram (May -> Oct) */}
            <div className="mt-6 flex items-end justify-between gap-2 h-16 pt-2">
              {monthlyTrends.map((bar) => {
                const maxCount = Math.max(...monthlyTrends.map((t) => t.count));
                const heightPercent = Math.round((bar.count / maxCount) * 100);

                return (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-sm transition-all duration-300 ${
                        bar.active ? "bg-[#D95D39]" : "bg-[#E5E0D8]"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-[#8E8B85] font-medium">
                      {bar.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Bottom: Video Share */}
          <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Video Share
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-digital text-3xl font-bold text-[#18181B] tracking-tight">
                {videoSharePercent}%
              </span>
            </div>

            <p className="mt-1 text-xs text-[#52525B]">
              of your rivals&apos; ads are video.
            </p>

            {/* Segmented Bar (Orange for Video, Gray for Static) */}
            <div className="mt-4 space-y-1.5">
              <div className="h-2 w-full rounded-full bg-[#EFECE6] overflow-hidden flex">
                <div
                  className="bg-[#D95D39] h-full transition-all duration-500"
                  style={{ width: `${videoSharePercent}%` }}
                />
                <div
                  className="bg-[#E5E0D8] h-full transition-all duration-500"
                  style={{ width: `${100 - videoSharePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-medium text-[#8E8B85]">
                <span className="text-[#D95D39]">Video ({videoSharePercent}%)</span>
                <span>Static ({100 - videoSharePercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 (span 5): Your First Ads */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#FFF9F6] border border-[#F5E2DA] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Your First Ads
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-digital text-4xl font-bold text-[#D95D39] tracking-tight">
                3
              </span>
              <span className="text-xs text-[#52525B] font-medium">free ads</span>
            </div>

            <p className="mt-2 text-xs text-[#52525B] leading-snug">
              We remix your best ad, 1 of {topCompetitorName}&apos;s, and make 1 in a new format.
            </p>
          </div>

          {/* 3 Ad Cards Grid */}
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {suggestedFirstAds.map((ad, idx) => {
              if (ad.type === "new_format") {
                return (
                  <div
                    key={ad.id}
                    className="relative aspect-9/16 rounded-xl border border-dashed border-[#D95D39] bg-white/60 flex flex-col items-center justify-center p-2 text-center group cursor-pointer hover:bg-white transition-all shadow-2xs"
                  >
                    <Sparkles className="w-5 h-5 text-[#D95D39] mb-1.5" />
                    <span className="text-xs font-semibold text-[#D95D39] leading-tight">
                      + New format
                    </span>
                    <span className="text-[9px] text-[#8E8B85] mt-1 leading-tight">
                      Angle test
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={ad.id}
                  className="relative aspect-9/16 rounded-xl overflow-hidden border border-[#EFECE6] bg-[#18181B] group shadow-xs flex flex-col justify-end p-2"
                >
                  <Image
                    src={ad.thumbnailUrl}
                    alt={ad.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="relative z-10">
                    <span className="text-[9px] font-semibold text-white/90 line-clamp-2 leading-tight">
                      {ad.title}
                    </span>
                    <span className="text-[8px] text-[#D95D39] font-medium block mt-0.5">
                      Ready to launch
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Central Action Bar & Back Link (Screenshot 5 Match) */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onContinue}
          className="btn-fastlane-black py-3 px-8 text-xs font-semibold gap-2 shadow-md hover:scale-[1.01] transition-transform"
        >
          <span>Continue</span>
          <CornerDownLeft className="w-3.5 h-3.5 text-white/80" />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-xs text-[#8E8B85] hover:text-[#18181B] font-medium transition-colors py-1 px-3"
        >
          Back
        </button>
      </div>
    </div>
  );
}
