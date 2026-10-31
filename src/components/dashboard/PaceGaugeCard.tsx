"use client";

import React from "react";

interface PaceGaugeCardProps {
  currentDailyViews?: number;
  postsOut?: number;
  postsGoal?: number;
  adSpendWeek?: string;
  credits?: number;
}

export default function PaceGaugeCard({
  currentDailyViews = 0,
  postsOut = 0,
  postsGoal = 0,
  adSpendWeek = "None",
  credits = 50,
}: PaceGaugeCardProps) {
  // Speedometer angle: -90deg (0%) to +90deg (100%)
  const percentage = Math.min(100, (currentDailyViews / 1000) * 100);
  const needleRotation = -90 + (percentage / 100) * 180;

  return (
    <div className="space-y-2.5 select-none">
      {/* Subtle Section Label */}
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
        Pace
      </div>

      <div className="fastlane-card p-6 bg-white space-y-6">
        {/* Speedometer Gauge Dial (Screenshot 3 Match) */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
            {/* SVG Arc Gauge */}
            <svg
              className="w-48 h-48 absolute top-0"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Dotted Track */}
              <circle
                cx="100"
                cy="100"
                r="78"
                stroke="#EFECE6"
                strokeWidth="10"
                strokeDasharray="3 6"
                strokeLinecap="round"
              />

              {/* Active Orange Glow Gradient Arc */}
              <circle
                cx="100"
                cy="100"
                r="78"
                stroke="url(#paceGaugeGrad)"
                strokeWidth="10"
                strokeDasharray="245"
                strokeDashoffset="122"
                strokeLinecap="round"
                className="opacity-70"
              />

              <defs>
                <linearGradient
                  id="paceGaugeGrad"
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#E5E0D8" />
                  <stop offset="100%" stopColor="#D95D39" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gauge Needle / Dial Pivot */}
            <div
              className="absolute bottom-0 w-1 h-20 bg-[#D95D39] origin-bottom transition-transform duration-700 ease-out rounded-full shadow-xs"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            />
            <div className="absolute bottom-0 w-3.5 h-3.5 rounded-full bg-[#18181B] border-2 border-white shadow-xs z-10" />

            {/* Min and Max Markers */}
            <span className="absolute bottom-1 left-2 text-[10px] text-[#8E8B85] font-mono">
              0
            </span>
            <span className="absolute bottom-1 right-2 text-[10px] text-[#8E8B85] font-mono">
              100
            </span>
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs text-[#52525B]">
              views a day, Sun to Fri. No views yet.
            </span>
          </div>
        </div>

        {/* 3 Metric Pods (Screenshot 3 Match) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#EFECE6]">
          {/* Metric 1: POSTS OUT */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Posts Out
            </span>
            <div className="my-1.5">
              <span className="font-digital text-sm font-bold text-[#18181B]">
                {postsOut} of {postsGoal}
              </span>
              <span className="text-[10px] text-[#8E8B85] ml-1">this week</span>
            </div>
            <span className="text-[10px] text-[#8E8B85] truncate">
              Nothing booked yet.
            </span>
          </div>

          {/* Metric 2: AD SPEND THIS WEEK */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Ad Spend This Week
            </span>
            <div className="my-1.5">
              <span className="font-digital text-sm font-bold text-[#18181B]">
                {adSpendWeek}
              </span>
            </div>
            <span className="text-[10px] text-[#8E8B85] truncate">
              No ads running. Copilot can add them.
            </span>
          </div>

          {/* Metric 3: CREDITS */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Credits
            </span>
            <div className="my-1.5">
              <span className="font-digital text-xl font-bold text-[#18181B] tracking-tight">
                {credits}
              </span>
            </div>
            <span className="text-[10px] text-[#D95D39] font-medium truncate">
              Ready to generate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
