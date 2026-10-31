"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Edit2, Target, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface StepBrandProps {
  initialBrandName: string;
  initialAudience: string;
  initialUsp: string;
  initialGoal?: string;
  screenshotUrl?: string;
  onConfirm: (data: {
    brandName: string;
    audience: string;
    usp: string;
    goal: string;
  }) => void;
  onBack: () => void;
}

export default function StepBrand({
  initialBrandName,
  initialAudience,
  initialUsp,
  initialGoal,
  screenshotUrl,
  onConfirm,
  onBack,
}: StepBrandProps) {
  const [brandName, setBrandName] = useState(initialBrandName || "Your Brand");
  const [audience, setAudience] = useState(
    initialAudience || "High-intent customers and target buyers"
  );
  const [usp, setUsp] = useState(
    initialUsp || "High-converting software platform"
  );
  const [goal, setGoal] = useState(
    initialGoal || `Sell more ${initialBrandName || "product"} plans to target customers`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      brandName: brandName.trim(),
      audience: audience.trim(),
      usp: usp.trim(),
      goal: goal.trim(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
          Confirm your brand details
        </h1>
        <p className="text-xs text-[#52525B]">
          We extracted your software UI and value proposition. Review and refine before we spy on competitor ads.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Editable Brand Form */}
          <div className="fastlane-card p-6 bg-white space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                  setGoal(`Sell more ${e.target.value} plans to people who want natural sounding text`);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                Target Audience
              </label>
              <textarea
                rows={2}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                Core Value Proposition (USP)
              </label>
              <textarea
                rows={2}
                value={usp}
                onChange={(e) => setUsp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] resize-none"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-[#D95D39] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Primary Growth Goal</span>
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F3CEBE] bg-[#FDF3EF]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium"
              />
            </div>
          </div>

          {/* Right Column: Live Viewport Screenshot Preview */}
          <div className="fastlane-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E8B85]">
                  Extracted Software UI
                </span>
                <span className="text-[10px] font-semibold text-[#D95D39] px-2 py-0.5 rounded-full bg-[#FDF3EF] border border-[#F3CEBE]">
                  Live Mockup
                </span>
              </div>

              {screenshotUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#EFECE6] bg-[#18181B] shadow-inner group">
                  <Image
                    src={screenshotUrl}
                    alt="Extracted website screenshot"
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              ) : (
                <div className="relative aspect-video rounded-xl border border-dashed border-[#E5E0D8] bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-6 h-6 text-[#D95D39] mb-2 opacity-80" />
                  <p className="text-xs font-semibold text-[#18181B]">Software UI Extracted</p>
                  <p className="text-[10px] text-[#8E8B85] mt-1">
                    Will float dynamically over your video ads in Remotion.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 text-[11px] text-[#8E8B85] leading-relaxed">
              This screenshot will automatically animate as a floating macOS window in your video ads, showing real software proof.
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-fastlane-white py-2.5 px-4 text-xs font-medium gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="btn-fastlane-black py-2.5 px-6 text-xs font-semibold gap-2 shadow-sm"
          >
            <span>Analyze Competitor Ads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

