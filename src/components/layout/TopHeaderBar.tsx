"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Sparkles, Zap } from "lucide-react";

interface TopHeaderBarProps {
  brandName?: string;
  credits?: number;
  trialEndDays?: number;
  title?: string;
}

export default function TopHeaderBar({
  brandName = "Active Brand",
  credits = 50,
  trialEndDays = 7,
  title,
}: TopHeaderBarProps) {
  const [timeString, setTimeString] = useState<string>("8:11 AM");
  const [dateString, setDateString] = useState<string>("Sat 31 Oct");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
      setDateString(
        now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-8 py-3.5 bg-transparent border-b border-[#EFECE6]/80 select-none">
      {/* Left: Optional View Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-sm font-semibold text-[#18181B] tracking-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Right: Clock, Status Metadata & Fastlane Action Pills */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Digital LCD Live Clock */}
        <div className="font-digital text-xs font-bold text-[#18181B] tracking-wide px-2 py-1 bg-white border border-[#EFECE6] rounded-lg shadow-2xs">
          {timeString}
        </div>

        {/* Status Line Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#8E8B85]">
          <span>{dateString}</span>
          <span>·</span>
          <span className="font-medium text-[#52525B]">{brandName}</span>
          <span>·</span>
          <span className="font-digital font-bold text-[#18181B]">{credits} credits</span>
          <span>·</span>
          <span className="text-[#D95D39]">Copilot trial ends in {trialEndDays}d</span>
        </div>

        {/* Ask Copilot Action Button */}
        <button
          type="button"
          className="btn-fastlane-white text-xs px-3 py-1.5 h-8 flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-[#D95D39]" />
          <span>Ask Copilot</span>
        </button>

        {/* Upgrade Pill (Screenshot 1 Match) */}
        <Link
          href="/pricing"
          className="btn-fastlane-black text-xs px-3.5 py-1.5 h-8 flex items-center gap-1"
        >
          <Zap className="w-3 h-3 text-[#D95D39]" />
          <span>Upgrade</span>
        </Link>

        {/* See Plans Pill (Screenshot 1 Match) */}
        <Link
          href="/pricing"
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8"
        >
          See plans
        </Link>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle appearance"
          className="w-8 h-8 rounded-full border border-[#E5E0D8] bg-white hover:bg-[#FAF9F6] text-[#52525B] flex items-center justify-center transition-all shadow-2xs ml-1"
        >
          {isDarkMode ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </header>
  );
}

