"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface TopHeaderBarProps {
  brandName?: string;
  credits?: number;
  title?: string;
}

export default function TopHeaderBar({
  brandName = "Your Brand",
  credits = 50,
  title,
}: TopHeaderBarProps) {
  const [liveCredits, setLiveCredits] = useState<number>(credits);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("autougc_credits");
      if (stored) {
        setLiveCredits(parseInt(stored, 10));
      }
    }
  }, [credits]);

  return (
    <header className="w-full flex items-center justify-between px-6 md:px-8 py-3.5 bg-transparent border-b border-[#EFECE6]/80 select-none">
      {/* Left: View Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        {title ? (
          <h1 className="text-sm font-semibold text-[#18181B] tracking-tight">
            {title}
          </h1>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#8E8B85]">
            <span className="font-semibold text-[#18181B]">{brandName}</span>
            <span>/</span>
            <span className="text-[#52525B]">Command Center</span>
          </div>
        )}
      </div>

      {/* Right: Clean Credits & Account Controls */}
      <div className="flex items-center gap-3">
        {/* Video Credits Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E0D8] text-xs font-semibold text-[#18181B] shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-[#D95D39] fill-[#D95D39]" />
          <span>{liveCredits} Video Credits</span>
        </div>

        {/* Upgrade / Pricing Action */}
        <Link
          href="/pricing"
          className="btn-fastlane-black text-xs px-3.5 py-1.5 h-8 flex items-center gap-1.5 font-semibold"
        >
          <span>Upgrade</span>
        </Link>

        {/* Quick Studio Shortcut */}
        <Link
          href="/studio"
          className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8 flex items-center gap-1.5 font-semibold"
        >
          <Sparkles className="w-3 h-3 text-[#D95D39]" />
          <span>Studio</span>
        </Link>

        {/* Clerk User Profile */}
        <div className="ml-1 flex items-center">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-7 h-7 border border-[#E5E0D8]",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
