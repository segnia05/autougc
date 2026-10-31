"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Image from "next/image";
import { Fingerprint, Target, Sparkles, Check, Globe } from "lucide-react";

export default function BrandKnowledgePage() {
  const [brandName, setBrandName] = useState("HumanifyLab");
  const [goal, setGoal] = useState("Sell more HumanifyLab plans to people who want natural sounding text");
  const [audience, setAudience] = useState("Students, founders, and professionals writing high-stakes essays");
  const [usp, setUsp] = useState("Bypasses AI detectors by rewriting with authentic human cadence and original citations");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBrand = localStorage.getItem("autougc_brand_name");
      const storedGoal = localStorage.getItem("autougc_brand_goal");
      const storedShot = localStorage.getItem("autougc_screenshot_url");

      if (storedBrand) setBrandName(storedBrand);
      if (storedGoal) setGoal(storedGoal);
      if (storedShot) setScreenshotUrl(storedShot);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("autougc_brand_name", brandName);
      localStorage.setItem("autougc_brand_goal", goal);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppShell brandName={brandName} title="Brand Knowledge Base">
      <div className="max-w-4xl mx-auto space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
            Brand Knowledge & Creative Assets
          </h1>
          <p className="text-xs text-[#52525B] mt-0.5">
            AutoUGC uses this knowledge base to inject authentic brand proof, USPs, and screenshots into your video ads.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="fastlane-card p-6 bg-white space-y-5">
            {/* Brand Name & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#18181B]">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs font-semibold text-[#18181B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D95D39] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Primary Conversion Goal</span>
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F3CEBE] bg-[#FDF3EF]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium"
                />
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">Target Audience Persona</label>
              <textarea
                rows={2}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] resize-none"
              />
            </div>

            {/* Core USP */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">Core Value Proposition (USP)</label>
              <textarea
                rows={2}
                value={usp}
                onChange={(e) => setUsp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] resize-none"
              />
            </div>
          </div>

          {/* Software Screenshot Section */}
          <div className="fastlane-card p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                  Live Software Proof Screenshot
                </h3>
                <p className="text-[11px] text-[#8E8B85]">
                  Extracted from your live web app. Renders as an animated macOS demo window over creator clips.
                </p>
              </div>
            </div>

            {screenshotUrl ? (
              <div className="relative aspect-video max-w-md rounded-xl overflow-hidden border border-[#EFECE6] bg-[#18181B] shadow-inner">
                <Image
                  src={screenshotUrl}
                  alt="Extracted website screenshot"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-[#E5E0D8] bg-[#FAF8F5] flex flex-col items-center justify-center text-center">
                <Globe className="w-6 h-6 text-[#8E8B85] mb-2" />
                <p className="text-xs text-[#18181B] font-medium">No screenshot stored yet</p>
                <p className="text-[10px] text-[#8E8B85] mt-0.5">
                  Extracted automatically when you run onboarding with a live URL.
                </p>
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Changes saved to brand profile</span>
              </span>
            )}

            <button
              type="submit"
              className="btn-fastlane-black py-2.5 px-6 text-xs font-semibold shadow-xs"
            >
              Save Brand Knowledge
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
