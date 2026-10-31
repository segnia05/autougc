"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Sun, Moon } from "lucide-react";

interface DashboardExecutiveHeaderProps {
  founderName?: string;
  brandName?: string;
  goal?: string;
  credits?: number;
  trialEndDays?: number;
  onAskCopilot?: () => void;
}

export default function DashboardExecutiveHeader({
  founderName = "Segni",
  brandName = "HumanifyLab",
  goal = "Sell more HumanifyLab plans to people who want natural sounding text",
  credits = 50,
  trialEndDays = 7,
  onAskCopilot,
}: DashboardExecutiveHeaderProps) {
  const [greeting, setGreeting] = useState("Morning");
  const [timeString, setTimeString] = useState("8:11 AM");
  const [dateString, setDateString] = useState("Sat 31 Oct");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Morning");
      else if (hour < 18) setGreeting("Afternoon");
      else setGreeting("Evening");

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
    <div className="space-y-3 select-none pb-2">
      {/* Top Row: Greeting & Meta Badges (Screenshot 3 Match) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#18181B]">
          {greeting}, {founderName}
        </h1>

        <div className="flex items-center gap-3">
          <div className="text-xs text-[#8E8B85] hidden sm:flex items-center gap-1.5">
            <span>{dateString}</span>
            <span>·</span>
            <span className="font-medium text-[#52525B]">{brandName}</span>
            <span>·</span>
            <span className="font-digital font-bold text-[#18181B]">{credits} credits</span>
            <span>·</span>
            <span className="text-[#D95D39]">Copilot trial ends {trialEndDays} Nov</span>
          </div>

          {/* Clock Pill */}
          <div className="font-digital text-xs font-bold text-[#18181B] px-2 py-1 bg-white border border-[#EFECE6] rounded-lg shadow-2xs">
            {timeString}
          </div>

          {/* Ask Copilot Button */}
          <button
            type="button"
            onClick={onAskCopilot}
            className="btn-fastlane-white text-xs px-3 py-1.5 h-8 flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-[#D95D39]" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* Goal Banner Strip (Screenshot 3 Match) */}
      <div className="flex items-start md:items-center gap-2 text-xs">
        <span className="font-bold text-[#D95D39] tracking-wider uppercase flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-xs bg-[#D95D39]" />
          GOAL
        </span>
        <span className="text-[#52525B] font-medium leading-relaxed truncate">
          {goal}
        </span>
      </div>
    </div>
  );
}
