"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Image from "next/image";
import { Sparkles, Play, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompetitorRival {
  id: string;
  name: string;
  category: string;
  daysLive: number;
  monthlyAds: number;
  videoRatio: number;
  longestRunningAd: {
    headline: string;
    hook: string;
    thumbnailUrl: string;
    format: string;
  };
}

export default function RadarPage() {
  const router = useRouter();

  const [rivals] = useState<CompetitorRival[]>([
    {
      id: "gpthuman",
      name: "GPTHuman.ai",
      category: "AI Detection & Essay Humanizer",
      daysLive: 348,
      monthlyAds: 22,
      videoRatio: 53,
      longestRunningAd: {
        headline: "How life feels after finding this AI humanizing tool",
        hook: "The reason professors flag your writing even when you didn't use AI...",
        thumbnailUrl: "/images/creator-sarah.jpg",
        format: "Video UGC Hook",
      },
    },
    {
      id: "walter",
      name: "Walter Writes AI",
      category: "Academic & Professional Writing",
      daysLive: 210,
      monthlyAds: 22,
      videoRatio: 65,
      longestRunningAd: {
        headline: "Stop paying $40/mo for clunky rewrite tokens",
        hook: "Watch this tool rewrite 1,000 words in 3 seconds flat.",
        thumbnailUrl: "/images/creator-alex.jpg",
        format: "Software Proof Demo",
      },
    },
    {
      id: "rephrasy",
      name: "Rephrasy",
      category: "Paraphrasing & Citation Tool",
      daysLive: 145,
      monthlyAds: 14,
      videoRatio: 48,
      longestRunningAd: {
        headline: "The 3 tools you must stop using in 2026",
        hook: "If you're still copying and pasting citations manually...",
        thumbnailUrl: "/images/creator-sarah.jpg",
        format: "Curiosity Split-Screen",
      },
    },
  ]);

  const handleRemix = (rival: CompetitorRival) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("autougc_remix_rival", rival.name);
      localStorage.setItem("autougc_remix_hook", rival.longestRunningAd.hook);
    }
    router.push("/campaigns");
  };

  return (
    <AppShell title="Radar">
      <div className="space-y-6 select-none">
        {/* Header & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
              Competitor Ad Radar
            </h1>
            <p className="text-xs text-[#52525B] mt-0.5">
              Live tracking of rival ad lifespans, monthly launch velocities, and winning hooks across Meta and TikTok.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E8B85]">Tracking 3 rivals in your niche</span>
          </div>
        </div>

        {/* Competitor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rivals.map((rival) => (
            <div
              key={rival.id}
              className="fastlane-card p-5 bg-white flex flex-col justify-between space-y-4 hover:border-[#D95D39] transition-all group"
            >
              <div>
                {/* Rival Name & Category */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[#18181B]">
                    {rival.name}
                  </div>
                  <span className="font-digital text-xs font-bold text-[#D95D39] px-2 py-0.5 rounded-md bg-[#FDF3EF] border border-[#F3CEBE]">
                    {rival.daysLive}d live
                  </span>
                </div>
                <div className="text-[11px] text-[#8E8B85] mt-0.5">
                  {rival.category}
                </div>

                {/* Metrics Row */}
                <div className="mt-3 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] text-xs">
                  <div>
                    <span className="text-[10px] text-[#8E8B85] uppercase tracking-wider block">
                      Velocity
                    </span>
                    <span className="font-digital font-bold text-[#18181B]">
                      {rival.monthlyAds} ads/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E8B85] uppercase tracking-wider block">
                      Video Share
                    </span>
                    <span className="font-digital font-bold text-[#18181B]">
                      {rival.videoRatio}%
                    </span>
                  </div>
                </div>

                {/* Longest Running Ad Creative */}
                <div className="mt-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                    Longest-Running Winning Ad
                  </div>

                  <div className="relative aspect-9/16 rounded-xl overflow-hidden bg-[#18181B] border border-[#EFECE6] group">
                    <Image
                      src={rival.longestRunningAd.thumbnailUrl}
                      alt={rival.longestRunningAd.headline}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] font-semibold text-white/90 line-clamp-2 leading-tight">
                        &ldquo;{rival.longestRunningAd.hook}&rdquo;
                      </span>
                      <span className="text-[9px] text-[#D95D39] font-medium mt-1">
                        {rival.longestRunningAd.format}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remix Action Button */}
              <button
                type="button"
                onClick={() => handleRemix(rival)}
                className="w-full btn-fastlane-black py-2.5 text-xs font-semibold justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Remix this ad for your brand</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

