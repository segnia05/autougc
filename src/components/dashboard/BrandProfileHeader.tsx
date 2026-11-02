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
  CreditCard,
  Plus,
  Play,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
    <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        {/* Left: Brand Identity & Gemini-extracted SaaS Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Live Software Screenshot Mockup */}
          {screenshotUrl ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#CBD5C4] bg-[#18181B] shrink-0 shadow-xs group">
              <Image
                src={screenshotUrl}
                alt={`${brandName} Software UI`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[8px] font-bold text-white uppercase tracking-wider">
                Live UI
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#1F3824] flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-xs">
              {brandName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Brand Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#1B231B] tracking-tight">
                {brandName}
              </h1>
              {cleanUrl && (
                <a
                  href={targetUrl || `https://${cleanUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F6F7F2] border border-[#CBD5C4] text-[11px] font-medium text-[#4A544A] hover:text-[#1B231B] hover:border-[#1F3824] transition-colors"
                >
                  <Globe className="w-3 h-3 text-[#1F3824]" />
                  <span>{cleanUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              <Badge variant="emerald" size="sm">
                SaaS Profile Active
              </Badge>
            </div>

            {/* What it does */}
            {whatItDoes && (
              <p className="text-xs text-[#4A544A] max-w-2xl leading-relaxed">
                {whatItDoes}
              </p>
            )}

            {/* Target Audience & Competitors Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {targetAudience && (
                <div className="inline-flex items-center gap-1.5 text-xs text-[#2E382D]">
                  <Users className="w-3.5 h-3.5 text-[#1F3824]" />
                  <span className="font-semibold text-[#1B231B]">Audience:</span>
                  <span className="text-[#52525B]">{targetAudience}</span>
                </div>
              )}

              {competitors && competitors.length > 0 && (
                <div className="inline-flex items-center gap-1.5 text-xs">
                  <Swords className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span className="font-semibold text-[#1B231B]">Rivals:</span>
                  <div className="flex items-center gap-1">
                    {competitors.slice(0, 3).map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-0.5 rounded-md bg-[#FDF3EF] border border-[#F3CEBE] text-[10px] font-medium text-[#D95D39]"
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

        {/* Right: Plan Status & Studio Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-4 xl:pt-0 border-[#CBD5C4]/60">
          {/* Credit Ledger Pill */}
          <div className="flex items-center justify-between sm:justify-start gap-3 px-4 py-3 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B231B] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-[#D95D39] fill-[#D95D39]" />
                <span>{credits} Credits</span>
              </div>
              <div className="text-[10px] text-[#717E6C] capitalize">
                {planTier} Tier Allowance
              </div>
            </div>
            {onUpgrade && (
              <button
                type="button"
                onClick={onUpgrade}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5C4] hover:border-[#1F3824] text-[10px] font-bold text-[#1B231B] transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>

          {/* Studio Primary CTA */}
          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Launch Studio</span>
          </Link>

          {/* Schedule Post CTA */}
          {onSchedulePost && (
            <button
              type="button"
              onClick={onSchedulePost}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-[#CBD5C4] hover:border-[#1F3824] text-xs font-semibold text-[#1B231B] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#1F3824]" />
              <span>Schedule Post</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

