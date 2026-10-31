"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, Volume2, TrendingUp, Share2, Layers, CheckCircle2 } from "lucide-react";

const AD_ANGLES = [
  {
    tag: "PROBLEM AGITATION",
    headline: "Turn your SaaS features into 30 high-converting video ads.",
    metrics: "4.8% CTR • 92% Hook Retention",
    channel: "Meta Ads & TikTok",
  },
  {
    tag: "COMPETITOR REMIX",
    headline: "Why founders are ditching expensive video agencies in 2026.",
    metrics: "4.6x ROAS • $0.18 CPC",
    channel: "Instagram & Reels",
  },
  {
    tag: "PRODUCT WALKTHROUGH",
    headline: "Automate your paid growth on Meta, TikTok & YouTube Shorts.",
    metrics: "+340% Inbound Signups",
    channel: "YouTube Shorts & TikTok",
  },
];

export function AuthMarketingCanvas() {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  // Smooth rotation of ad hooks every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAngleIndex((prev) => (prev + 1) % AD_ANGLES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentAngle = AD_ANGLES[activeAngleIndex] ?? AD_ANGLES[0]!;

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-screen bg-[#0C0D12] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Soft Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(74, 107, 78, 0.45) 0%, rgba(217, 93, 57, 0.15) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <span className="text-sm font-light text-neutral-300">✻</span>
          <span className="text-xs font-mono font-medium text-neutral-300 tracking-wider uppercase">
            AutoUGC Creative Engine
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Pipeline</span>
        </div>
      </div>

      {/* Center Stage: Minimalist Vertical Video Ad Showcase */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center gap-6">
        {/* 9:16 Video Ad Preview Card */}
        <div className="relative w-[280px] h-[430px] rounded-3xl p-5 bg-[#12141C]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono tracking-wider text-neutral-300 uppercase">
                9:16 Video Ad
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
              {currentAngle.channel}
            </span>
          </div>

          {/* Dynamic Ad Content */}
          <div className="my-auto flex flex-col gap-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#FF8B5E] border border-[#FF8B5E]/30 self-start">
              {currentAngle.tag}
            </span>

            <h3 className="text-base font-semibold text-white tracking-tight leading-snug min-h-[48px] transition-all duration-300">
              {currentAngle.headline}
            </h3>

            {/* Performance Stat Pill */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Performance
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400">
                {currentAngle.metrics}
              </span>
            </div>

            {/* Audio Synthesis Equalizer Simulation */}
            <div className="flex items-center justify-between pt-2">
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                <Volume2 className="w-3 h-3 text-neutral-400" />
                AI Voiceover
              </span>
              <div className="flex items-end gap-1 h-4">
                {[40, 70, 50, 90, 60, 80, 45, 95].map((val, idx) => (
                  <span
                    key={idx}
                    className="w-1 rounded-full bg-white/70"
                    style={{
                      height: `${val}%`,
                      animation: `pulse 1.${idx + 2}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Status: Ready to deploy</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Simple Workflow Stepper */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
          <span className="text-white">URL Scraped</span>
          <span>→</span>
          <span className="text-white">Scripts Generated</span>
          <span>→</span>
          <span className="text-white">Video Rendered</span>
        </div>
      </div>

      {/* Bottom Minimalist Status Bar */}
      <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>AutoUGC Engine v2.0</span>
        </div>
        <span>Autonomous Video Ads for SaaS</span>
      </div>
    </div>
  );
}
