"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, ArrowLeft, Swords, Plus, X, Globe, CheckCircle2 } from "lucide-react";

interface StepBrandProps {
  initialBrandName: string;
  initialAudience: string;
  initialUsp: string;
  initialWhatItDoes?: string;
  initialGoal?: string;
  initialCompetitors?: string[];
  screenshotUrl?: string;
  isSubmitting?: boolean;
  onConfirm: (data: {
    brandName: string;
    audience: string;
    usp: string;
    goal: string;
    whatItDoes: string;
    competitors: string[];
  }) => void;
  onBack: () => void;
}

export default function StepBrand({
  initialBrandName,
  initialAudience,
  initialUsp,
  initialWhatItDoes,
  initialGoal,
  initialCompetitors = [],
  screenshotUrl,
  isSubmitting = false,
  onConfirm,
  onBack,
}: StepBrandProps) {
  const [brandName, setBrandName] = useState(initialBrandName || "Your Brand");
  const [whatItDoes, setWhatItDoes] = useState(
    initialWhatItDoes || initialUsp || "AI-powered software that solves high-friction workflows"
  );
  const [audience, setAudience] = useState(
    initialAudience || "Founders, operators, and target end-users"
  );
  const [usp, setUsp] = useState(
    initialUsp || "High-converting short-form video ad engine"
  );
  const [goal, setGoal] = useState(
    initialGoal || `Sell more ${initialBrandName || "product"} plans to target customers`
  );
  const [competitors, setCompetitors] = useState<string[]>(
    initialCompetitors.length > 0 ? initialCompetitors : ["Undetectable AI", "QuillBot", "HideMyAI"]
  );
  const [newCompetitor, setNewCompetitor] = useState("");

  const handleAddCompetitor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newCompetitor.trim();
    if (!clean) return;
    if (!competitors.includes(clean)) {
      setCompetitors([...competitors, clean]);
    }
    setNewCompetitor("");
  };

  const handleRemoveCompetitor = (name: string) => {
    setCompetitors(competitors.filter((c) => c !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      brandName: brandName.trim(),
      audience: audience.trim(),
      usp: usp.trim(),
      goal: goal.trim(),
      whatItDoes: whatItDoes.trim(),
      competitors,
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 animate-in fade-in slide-in-from-bottom-3 duration-200 w-full">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] text-[10px] font-bold tracking-widest text-[#D95D39] uppercase shadow-2xs">
          <Sparkles className="w-3 h-3 fill-[#D95D39]" />
          <span>Gemini 2.5 Flash Brand Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
          Confirm your brand profile
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] max-w-lg mx-auto">
          We extracted your software UI, target buyers, core value hook, and competitor landscape. Review and confirm to launch your command center.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 fastlane-card p-6 sm:p-7 bg-white space-y-4 shadow-sm border border-[#E5E0D8]">
            {/* Brand Name */}
            <div className="space-y-1.5">
              <label htmlFor="brand-name" className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
                <span>Brand Name</span>
                <span className="text-[10px] text-[#8E8B85]">Auto-filled</span>
              </label>
              <input
                id="brand-name"
                type="text"
                required
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                  if (!goal || goal.includes("plans")) {
                    setGoal(`Sell more ${e.target.value} subscriptions`);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-bold transition-all"
              />
            </div>

            {/* What It Does (1-Sentence Plain English) */}
            <div className="space-y-1.5">
              <label htmlFor="what-it-does" className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
                <span>What It Does (1-Sentence Plain English)</span>
                <span className="text-[10px] text-[#D95D39] font-medium">Gemini 2.5 Flash</span>
              </label>
              <textarea
                id="what-it-does"
                rows={2}
                required
                value={whatItDoes}
                onChange={(e) => setWhatItDoes(e.target.value)}
                placeholder="e.g. An AI text humanizer that rewrites AI-generated essays to score 0% on AI detectors."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-1.5">
              <label htmlFor="target-audience" className="text-xs font-semibold text-[#18181B]">
                Target Audience (End Users)
              </label>
              <input
                id="target-audience"
                type="text"
                required
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. College students, academic essay writers, and bloggers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium transition-all"
              />
            </div>

            {/* Core Value Proposition (USP) */}
            <div className="space-y-1.5">
              <label htmlFor="core-usp" className="text-xs font-semibold text-[#18181B]">
                Core Value Proposition (USP)
              </label>
              <textarea
                id="core-usp"
                rows={2}
                required
                value={usp}
                onChange={(e) => setUsp(e.target.value)}
                placeholder="e.g. Convert AI-generated content into natural human writing that bypasses Turnitin & GPTZero."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-medium resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Detected Competitors */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Detected Competitors</span>
                </span>
                <span className="text-[10px] text-[#8E8B85]">Click &times; to remove or add custom</span>
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                {competitors.map((comp) => (
                  <span
                    key={comp}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E5E0D8] text-xs font-semibold text-[#18181B] shadow-2xs group hover:border-[#D95D39] transition-colors"
                  >
                    <span>{comp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetitor(comp)}
                      className="text-[#8E8B85] hover:text-red-600 transition-colors cursor-pointer"
                      aria-label={`Remove competitor ${comp}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add another competitor (e.g. QuillBot)..."
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCompetitor();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 text-xs text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddCompetitor()}
                  className="px-3.5 py-2 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Primary Growth Goal */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="primary-goal" className="text-xs font-semibold text-[#D95D39] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Primary Growth Goal</span>
              </label>
              <input
                id="primary-goal"
                type="text"
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Help students and writers bypass AI detection without getting flagged"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F3CEBE] bg-[#FDF3EF]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-semibold transition-all"
              />
            </div>
          </div>

          {/* Right Column: Extracted Software UI Proof (5 cols) */}
          <div className="lg:col-span-5 fastlane-card p-6 bg-white flex flex-col justify-between shadow-sm border border-[#E5E0D8] space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Extracted Software UI Proof</span>
                </span>
                <span className="text-[10px] font-bold text-[#D95D39] px-2 py-0.5 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] shadow-2xs">
                  1280x720 Capture
                </span>
              </div>

              {/* Browser Viewport Window Frame */}
              <div className="rounded-2xl border border-[#E5E0D8] overflow-hidden bg-[#18181B] shadow-md">
                {/* Browser Top Navigation Bar */}
                <div className="h-7 bg-[#27272A] px-3 flex items-center gap-1.5 border-b border-[#3F3F46]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <div className="ml-2 flex-1 max-w-[200px] h-4 rounded-md bg-[#18181B]/80 px-2 flex items-center">
                    <span className="text-[9px] text-[#A1A1AA] truncate font-mono">
                      {brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com
                    </span>
                  </div>
                </div>

                {/* Screenshot Display */}
                {screenshotUrl ? (
                  <div className="relative aspect-video w-full bg-[#18181B] group">
                    <Image
                      src={screenshotUrl}
                      alt={`${brandName} extracted UI proof`}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center">
                    <Sparkles className="w-8 h-8 text-[#D95D39] mb-2" />
                    <p className="text-xs font-bold text-[#18181B]">{brandName} Live UI Mockup</p>
                    <p className="text-[10px] text-[#8E8B85] mt-1 max-w-[220px]">
                      Extracted viewport screenshot floating over video ads in Remotion.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Explanatory Micro-Copy */}
            <div className="pt-3 text-[11px] text-[#52525B] leading-relaxed border-t border-[#EFECE6] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#18181B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>How AutoUGC uses this proof:</span>
              </div>
              <p>
                Our Remotion engine overlays this high-resolution software mockup dynamically as a floating window inside your 9:16 vertical ads, proving to TikTok and Reels viewers that your SaaS is real and active.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EFECE6]">
          <button
            type="button"
            onClick={onBack}
            className="btn-fastlane-white py-2.5 px-4 text-xs font-medium gap-1.5 cursor-pointer flex items-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !brandName.trim()}
            className="btn-fastlane-black py-3 px-7 text-xs font-semibold gap-2 shadow-sm hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Setting up command center...</span>
              </>
            ) : (
              <>
                <span>Launch Dashboard &amp; Create UGC Ads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}