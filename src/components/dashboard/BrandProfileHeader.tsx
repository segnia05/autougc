"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  ExternalLink,
  Users,
  Swords,
  Sparkles,
  Zap,
  Plus,
} from "lucide-react";

interface BrandProfileHeaderProps {
  brandName: string;
  targetUrl?: string;
  screenshotUrl?: string;
  targetAudience?: string;
  competitors?: string[];
  whatItDoes?: string;
  credits: number;
  planTier?: string;
  founderName?: string;
  onOpenStudio?: () => void;
  onSchedulePost?: () => void;
  onUpgrade?: () => void;
}

export default function BrandProfileHeader({
  brandName,
  targetUrl,
  screenshotUrl,
  targetAudience,
  competitors = [],
  whatItDoes,
  credits,
  planTier = "starter",
  founderName,
  onOpenStudio,
  onSchedulePost,
  onUpgrade,
}: BrandProfileHeaderProps) {
  const cleanUrl = targetUrl
    ? targetUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "")
    : "";

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        {/* Left: Brand Identity & SaaS Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Live Software Screenshot Mockup */}
          {screenshotUrl ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#18181B] shrink-0 shadow-2xs group">
              <Image
                src={screenshotUrl}
                alt={`${brandName} Software UI`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[8px] font-bold text-white uppercase tracking-wider">
                Live UI
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FDF3EF] border border-[#F3CEBE] flex items-center justify-center text-[#D95D39] text-2xl font-bold shrink-0 shadow-2xs">
              <Sparkles className="w-8 h-8 fill-[#D95D39]" />
            </div>
          )}

          {/* Brand Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#18181B] tracking-tight">
                {brandName || "Your SaaS Brand"}
              </h1>

              {cleanUrl && (
                <a
                  href={targetUrl || `https://${cleanUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-medium text-[#52525B] hover:text-[#18181B] hover:border-[#D95D39] transition-colors"
                >
                  <Globe className="w-3 h-3 text-[#D95D39]" />
                  <span>{cleanUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}

              {/* Current Plan Badge */}
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[10px] font-bold text-[#18181B] uppercase tracking-wider shadow-2xs">
                {planTier.toUpperCase()} PLAN
              </span>
            </div>

            {/* What it does */}
            {whatItDoes && (
              <p className="text-xs text-[#52525B] max-w-2xl leading-relaxed">
                {whatItDoes}
              </p>
            )}

            {/* Target Audience & Competitors Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {targetAudience && (
                <div className="inline-flex items-center gap-1.5 text-xs text-[#52525B]">
                  <Users className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span className="font-semibold text-[#18181B]">Audience:</span>
                  <span>{targetAudience}</span>
                </div>
              )}

              {competitors && competitors.length > 0 && (
                <div className="inline-flex items-center gap-1.5 text-xs">
                  <Swords className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span className="font-semibold text-[#18181B]">Rivals:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {competitors.slice(0, 4).map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-[10px] font-medium text-[#18181B]"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons & Credits */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-4 xl:pt-0 border-[#EFECE6]">
          {/* Credit Balance Badge */}
          <div className="flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
                <Zap className="w-3.5 h-3.5 text-[#D95D39] fill-[#D95D39]" />
                <span>{credits} Video Credits</span>
              </div>
              <div className="text-[10px] text-[#8E8B85] capitalize">
                {planTier === "free" ? "Free Tier (0 Allowance)" : `${planTier} monthly allowance`}
              </div>
            </div>
            {onUpgrade ? (
              <button
                type="button"
                onClick={onUpgrade}
                className="px-3 py-1 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#D95D39] text-[10px] font-bold text-[#18181B] transition-colors cursor-pointer"
              >
                Upgrade
              </button>
            ) : (
              <Link
                href="/pricing"
                className="px-3 py-1 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#D95D39] text-[10px] font-bold text-[#18181B] transition-colors"
              >
                Upgrade
              </Link>
            )}
          </div>

          {/* Quick Action: Open Studio */}
          <Link
            href="/studio"
            className="btn-fastlane-black px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Open Studio</span>
          </Link>

          {/* Quick Action: Schedule Post */}
          {onSchedulePost && (
            <button
              type="button"
              onClick={onSchedulePost}
              className="btn-fastlane-white px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Schedule Post</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}