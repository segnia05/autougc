"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { TrendingUp, Eye, DollarSign, Target, BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell brandName="HumanifyLab" title="Analytics">
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
            Campaign Performance & ROAS
          </h1>
          <p className="text-xs text-[#52525B] mt-0.5">
            Aggregated metrics across Meta Ads, TikTok, and YouTube paid creator campaigns.
          </p>
        </div>

        {/* 4 Metric Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="fastlane-card p-5 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Total Impressions
            </span>
            <div className="font-digital text-2xl font-bold text-[#18181B]">
              0
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Awaiting campaign launch
            </span>
          </div>

          <div className="fastlane-card p-5 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Blended ROAS
            </span>
            <div className="font-digital text-2xl font-bold text-[#D95D39]">
              0.0x
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Target: 3.2x
            </span>
          </div>

          <div className="fastlane-card p-5 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Ad Spend This Week
            </span>
            <div className="font-digital text-2xl font-bold text-[#18181B]">
              $0.00
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Budget cap: $250/wk
            </span>
          </div>

          <div className="fastlane-card p-5 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Average CTR
            </span>
            <div className="font-digital text-2xl font-bold text-[#18181B]">
              --%
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Niche benchmark: 2.4%
            </span>
          </div>
        </div>

        {/* Campaign Velocity Notice */}
        <div className="fastlane-card p-8 bg-white flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9F6] border border-[#F5E2DA] flex items-center justify-center text-[#D95D39]">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#18181B]">
            Launch your first campaign to unlock live telemetry
          </h2>
          <p className="text-xs text-[#52525B] max-w-md">
            Once you connect your Meta Ad account and launch your starter ads, AutoUGC will stream real-time cost-per-click, conversion rates, and creative fatigue alerts.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
