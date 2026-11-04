"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import {
  Fingerprint,
  Target,
  Sparkles,
  Check,
  Globe,
  Users,
  Swords,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Save,
} from "lucide-react";

export default function BrandKnowledgePage() {
  const [brandName, setBrandName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [usp, setUsp] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBrandKnowledge() {
      try {
        const res = await fetch("/api/v1/workspace/active");
        if (res.ok) {
          const json = await res.json();
          if (json.onboarded) {
            setBrandName(json.brandName || "");
            setTargetUrl(json.targetUrl || "");
            setGoal(json.goal || "");
            setAudience(json.targetAudience || "");
            setUsp(json.whatItDoes || json.summary || "");
            setCompetitors(Array.isArray(json.competitors) ? json.competitors : []);
            setScreenshotUrl(json.screenshotUrl || "");
            setIsLoading(false);
            return;
          }
        }

        // Fallback to local storage
        if (typeof window !== "undefined") {
          const storedBrand = localStorage.getItem("autougc_brand_name");
          const storedGoal = localStorage.getItem("autougc_brand_goal");
          const storedShot = localStorage.getItem("autougc_screenshot_url");

          if (storedBrand) setBrandName(storedBrand);
          if (storedGoal) setGoal(storedGoal);
          if (storedShot) setScreenshotUrl(storedShot);
        }
      } catch (err) {
        console.warn("Failed loading brand knowledge", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrandKnowledge();
  }, []);

  const handleAddCompetitor = () => {
    if (!newCompetitor.trim()) return;
    const clean = newCompetitor.trim();
    if (!competitors.includes(clean)) {
      setCompetitors([...competitors, clean]);
    }
    setNewCompetitor("");
  };

  const handleRemoveCompetitor = (comp: string) => {
    setCompetitors(competitors.filter((c) => c !== comp));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/workspace/active", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          targetUrl: targetUrl.trim(),
          targetAudience: audience.trim(),
          competitors,
          whatItDoes: usp.trim(),
          goal: goal.trim(),
          screenshotUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to update brand knowledge.");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("autougc_brand_name", brandName);
        localStorage.setItem("autougc_brand_goal", goal);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setErrorMessage("Network error updating brand profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell brandName={brandName}>
      <div className="max-w-5xl mx-auto space-y-8 select-none pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                Brand Knowledge & Creative Assets
              </h1>
              <Badge variant="emerald" size="sm">
                SaaS Profile Active
              </Badge>
            </div>
            <p className="text-xs text-[#52525B] max-w-2xl leading-relaxed">
              AutoUGC's AI script engine references this knowledge base to inject authentic software proof, target audience hooks, and competitor counter-angles into every video creative.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8E8B85] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Synced with Neon PostgreSQL</span>
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (span 7): Core Positioning & Copy */}
            <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
              <h2 className="text-base font-bold text-[#18181B] tracking-tight">
                Brand Identity & Narrative Anchors
              </h2>

              {/* Brand Name & Target URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18181B]">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs font-semibold text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
                    <span>Website URL</span>
                    {targetUrl && (
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#D95D39] hover:underline flex items-center gap-0.5"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        <span>Visit</span>
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://yourproduct.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Target Audience Persona (Extracted by Gemini)</span>
                </label>
                <textarea
                  rows={2}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] resize-none leading-relaxed"
                />
              </div>

              {/* Core Value Proposition (USP) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Core Value Proposition & What It Does</span>
                </label>
                <textarea
                  rows={3}
                  value={usp}
                  onChange={(e) => setUsp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/50 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] resize-none leading-relaxed"
                />
              </div>

              {/* Primary Conversion Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D95D39] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Primary Growth & Conversion Goal</span>
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F3CEBE] bg-[#FDF3EF]/40 focus:bg-white text-xs text-[#18181B] font-medium focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                />
              </div>

              {/* Competitors List */}
              <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
                <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Competitor Counter-Angles (Rival Products)</span>
                </label>
                <p className="text-[11px] text-[#8E8B85]">
                  Our script generator uses these rival names to formulate high-converting "Why I switched from..." comparison hooks.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {competitors.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF2ED] border border-[#FCD4C7] text-xs font-medium text-[#D95D39]"
                    >
                      <span>{comp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompetitor(comp)}
                        className="hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add competitor (e.g. Undetectable AI)..."
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCompetitor();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCompetitor}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#FFF2ED] border border-[#E5E0D8] text-xs font-semibold text-[#D95D39] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (span 5): Live Software Mockup & Assets */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Live Software Proof UI
                  </h3>
                  <Badge variant="emerald" size="sm">
                    macOS Window
                  </Badge>
                </div>
                <p className="text-[11px] text-[#8E8B85] leading-relaxed">
                  Automatically extracted from your website. Floats dynamically over creator selfie video ads in Remotion to prove your product actually works.
                </p>

                {screenshotUrl ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#18181B] shadow-inner group">
                    <Image
                      src={screenshotUrl}
                      alt={`${brandName} Software UI`}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-[#E5E0D8] bg-[#FAF8F5] flex flex-col items-center justify-center text-center space-y-2">
                    <Globe className="w-6 h-6 text-[#8E8B85]" />
                    <p className="text-xs text-[#18181B] font-semibold">
                      No software screenshot captured
                    </p>
                    <p className="text-[10px] text-[#8E8B85]">
                      Captured automatically when onboarding with a valid URL.
                    </p>
                  </div>
                )}
              </div>

              {/* Tips Callout */}
              <div className="p-5 rounded-3xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2 text-xs">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Pro Tip for Viral UGC</span>
                </div>
                <p className="text-[11px] text-[#52525B] leading-relaxed">
                  Keeping your target audience specific (e.g. "college students writing essays under deadline") yields 3.4x higher watch retention than broad labels like "everyone".
                </p>
              </div>
            </div>
          </div>

          {/* Footer Save Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-[#E8F0E6] px-3 py-1.5 rounded-xl border border-emerald-300">
                <Check className="w-3.5 h-3.5" />
                <span>Changes saved to PostgreSQL database</span>
              </span>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Brand Knowledge</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
