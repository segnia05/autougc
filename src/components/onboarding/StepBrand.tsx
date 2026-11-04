"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Edit2, Target, Sparkles, ArrowRight, ArrowLeft, Swords, Plus, X, Globe } from "lucide-react";

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
    initialWhatItDoes || initialUsp || "High-converting SaaS product"
  );
  const [audience, setAudience] = useState(
    initialAudience || "High-intent customers and target buyers"
  );
  const [usp, setUsp] = useState(
    initialUsp || "Automate high-converting UGC video ad generation"
  );
  const [goal, setGoal] = useState(
    initialGoal || `Sell more ${initialBrandName || "product"} plans to target customers`
  );
  const [competitors, setCompetitors] = useState<string[]>(
    initialCompetitors.length > 0 ? initialCompetitors : ["Competitor A", "Competitor B"]
  );
  const [newCompetitor, setNewCompetitor] = useState("");

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.trim()) return;
    if (!competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
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
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] text-[10px] font-bold tracking-widest text-[#D95D39] uppercase mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Gemini AI Brand Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
          Confirm your brand profile
        </h1>
        <p className="text-xs text-[#52525B] max-w-lg mx-auto">
          We extracted your software UI, target buyers, core differentiator, and competitor landscape. Review and confirm to launch your command center.
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
                  setGoal(`Sell more ${e.target.value} plans to ${audience}`);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B] font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                What It Does (1-Sentence Plain English)
              </label>
              <input
                type="text"
                value={whatItDoes}
                onChange={(e) => setWhatItDoes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] text-xs text-[#18181B]"
                placeholder="e.g. AI text humanizer that rewrites AI essays to bypass detection."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                Target Audience (End Buyers)
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

            {/* Competitors Detected by Gemini */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Detected Competitors</span>
                </span>
                <span className="text-[10px] text-[#8E8B85]">Used for ad angle benchmarking</span>
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                {competitors.map((comp) => (
                  <span
                    key={comp}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#E5E0D8] text-[11px] font-medium text-[#18181B] shadow-2xs"
                  >
                    <span>{comp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetitor(comp)}
                      className="text-[#8E8B85] hover:text-[#D95D39] transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add another competitor..."
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
                        setCompetitors([...competitors, newCompetitor.trim()]);
                        setNewCompetitor("");
                      }
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-white text-xs text-[#18181B] focus:outline-none focus:ring-1 focus:ring-[#D95D39]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
                      setCompetitors([...competitors, newCompetitor.trim()]);
                      setNewCompetitor("");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#18181B] text-white text-xs font-semibold hover:bg-black"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
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
                  Extracted Software UI Proof
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

            <div className="pt-4 text-[11px] text-[#8E8B85] leading-relaxed border-t border-[#EFECE6] mt-4">
              <span className="font-semibold text-[#18181B]">How this is used: </span>
              AutoUGC attaches this high-resolution software mockup dynamically as a floating window inside your 9:16 vertical ads, proving to TikTok and Reels viewers that your SaaS is real and active.
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
            disabled={isSubmitting}
            className="btn-fastlane-black py-2.5 px-6 text-xs font-semibold gap-2 shadow-sm hover:scale-[1.01] transition-transform disabled:opacity-70 flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching Dashboard...</span>
              </>
            ) : (
              <>
                <span>Launch Dashboard & Create UGC Ads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
