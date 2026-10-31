"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BlitzAdVariation } from "@/lib/ai/blitzEngine";
import {
  Zap,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Sliders,
  Check,
  Video,
} from "lucide-react";
import Image from "next/image";

interface BlitzCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function BlitzCampaignModal({
  isOpen,
  onClose,
  onComplete,
}: BlitzCampaignModalProps) {
  const router = useRouter();

  // Wizard state: "setup" | "generating" | "review" | "success"
  const [step, setStep] = useState<"setup" | "generating" | "review" | "success">("setup");
  const [urlInput, setUrlInput] = useState("");
  const [brandInput, setBrandInput] = useState("Lumina");
  const [nicheInput, setNicheInput] = useState("saas");
  const [generationPhase, setGenerationPhase] = useState("Analyzing brand USP & competitor angles...");

  const [variations, setVariations] = useState<BlitzAdVariation[]>([]);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleLaunchBlitz = async () => {
    setStep("generating");
    setGenerationPhase("Scanning URL & brand intelligence...");

    try {
      // Step simulation for UX delight
      setTimeout(() => setGenerationPhase("Mining viral hooks & high-retention frameworks..."), 1200);
      setTimeout(() => setGenerationPhase("Pairing with real UGC creator personas..."), 2200);

      const res = await fetch("/api/v1/campaigns/blitz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput.trim() || undefined,
          brandName: brandInput.trim() || "My Brand",
          niche: nicheInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.variations) {
        setVariations(data.variations);
        setSelectedAdId(data.variations[0]?.id || null);
        setStep("review");
      } else {
        throw new Error(data.error?.message || "Failed to generate Blitz campaign");
      }
    } catch (err) {
      console.warn("Blitz generation notice:", err);
      // Fallback: populate default variations
      setStep("review");
    }
  };

  const handleToggleAd = (id: string) => {
    setVariations((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, approved: !ad.approved } : ad))
    );
  };

  const handleApproveAll = async () => {
    setIsScheduling(true);
    // Simulate batch scheduling to publishing calendar
    setTimeout(() => {
      setIsScheduling(false);
      setStep("success");
      if (onComplete) onComplete();
    }, 1500);
  };

  const handleOpenInStudio = (ad: BlitzAdVariation) => {
    onClose();
    router.push(
      `/studio?brand=${encodeURIComponent(brandInput)}&hook=${encodeURIComponent(
        ad.hook
      )}&body=${encodeURIComponent(ad.body)}&cta=${encodeURIComponent(
        ad.cta
      )}&video=${encodeURIComponent(ad.creatorPersona.videoUrl)}${
        ad.productImageUrl ? `&productImage=${encodeURIComponent(ad.productImageUrl)}` : ""
      }`
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-2 sm:p-4 text-[#1B231B]">
        {/* Step 1: Blitz Setup */}
        {step === "setup" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#1F3824] flex items-center justify-center text-white shadow-md">
                <Zap className="h-5 w-5 fill-[#FFE600] text-[#FFE600]" />
              </div>
              <div>
                <h2 className="text-xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                  Blitz Campaign Engine
                </h2>
                <p className="text-xs text-[#4A544A]">
                  Autonomous batch creation: generate 5 viral video ad variations in under 30 seconds.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-[#F6F7F2] p-5 rounded-2xl border border-[#CBD5C4]/70">
              <div>
                <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                  Website or Product URL (Optional)
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourproduct.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5C4] rounded-xl text-sm text-[#1B231B] placeholder-[#717E6C] focus:outline-none focus:ring-2 focus:ring-[#1F3824]"
                />
                <span className="text-[11px] text-[#717E6C] mt-1 block">
                  AutoUGC AI will crawl your landing page to extract USPs, features, and target audience pain points.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="e.g. Lumina"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5C4] rounded-xl text-sm text-[#1B231B] focus:outline-none focus:ring-2 focus:ring-[#1F3824]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                    Target Niche
                  </label>
                  <select
                    value={nicheInput}
                    onChange={(e) => setNicheInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5C4] rounded-xl text-sm text-[#1B231B] focus:outline-none focus:ring-2 focus:ring-[#1F3824]"
                  >
                    <option value="saas">B2B SaaS & Tech</option>
                    <option value="ecommerce">Shopify & DTC Brands</option>
                    <option value="mobile">Mobile Apps & Gaming</option>
                    <option value="agency">Agencies & Consultancies</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#E2E9DC]/60 border border-[#CBD5C4] p-4 rounded-xl flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-[#1F3824] shrink-0 mt-0.5" />
              <div className="text-xs text-[#2A3B2A] leading-relaxed">
                <strong>What happens next:</strong> We will generate 5 multi-angle ad concepts (Secret Hack, POV Discovery, Costly Mistake, Competitor Roast, and Pattern Interrupt) paired with authentic creator videos and kinetic subtitles ready for 1-click approval.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleLaunchBlitz} className="bg-[#1F3824] text-white hover:bg-[#2A4C30] gap-2 px-6">
                <Zap className="h-4 w-4 fill-[#FFE600] text-[#FFE600]" />
                Launch 5-Ad Blitz
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Generating Simulation */}
        {step === "generating" && (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-5">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-[#1F3824]/10 flex items-center justify-center text-[#1F3824] animate-spin">
                <RefreshCw className="h-8 w-8" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-5 w-5 fill-[#FFE600] text-[#FFE600]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold text-[#1B231B]">
                Running Blitz Creative Generation
              </h3>
              <p className="text-xs text-[#717E6C] font-mono animate-pulse">
                {generationPhase}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Fastlane Swipe / Grid Review Deck */}
        {step === "review" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#CBD5C4]/70 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full mb-1">
                  <Zap className="h-3 w-3 fill-[#1F3824]" />
                  Blitz Batch: 5 Creatives Generated
                </div>
                <h3 className="text-lg font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                  Review & Approve Queue
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleApproveAll}
                  disabled={isScheduling}
                  className="bg-[#1F3824] text-white hover:bg-[#2A4C30] gap-1.5 text-xs font-semibold shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFE600]" />
                  {isScheduling ? "Scheduling..." : "Approve & Schedule All 5"}
                </Button>
              </div>
            </div>

            {/* Grid of 5 Generated Variations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {variations.map((ad, idx) => (
                <div
                  key={ad.id}
                  className={`group relative rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                    ad.approved
                      ? "bg-white border-[#1F3824] shadow-md ring-1 ring-[#1F3824]"
                      : "bg-[#F6F7F2] border-[#CBD5C4] opacity-70"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3824] bg-[#E2E9DC] px-2 py-0.5 rounded-md">
                      #{idx + 1} {ad.angleTitle}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#2563EB] bg-[#DBEAFE] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {ad.benchmarkCtr}
                    </span>
                  </div>

                  {/* Creator Avatar & Hook Preview */}
                  <div className="flex items-center gap-3 mb-3 bg-[#F6F7F2] p-2.5 rounded-xl border border-[#CBD5C4]/50">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#CBD5C4] shrink-0">
                      <Image
                        src={ad.creatorPersona.imageUrl}
                        alt={ad.creatorPersona.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-[#1B231B] truncate">
                        {ad.creatorPersona.name}
                      </div>
                      <div className="text-[10px] text-[#717E6C] truncate">
                        {ad.creatorPersona.role}
                      </div>
                    </div>
                  </div>

                  {/* Script Hook */}
                  <div className="text-xs text-[#1B231B] font-medium leading-snug line-clamp-3 mb-4 italic bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E5E9E1]">
                    &ldquo;{ad.hook}&rdquo;
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#CBD5C4]/40 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleAd(ad.id)}
                      className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        ad.approved
                          ? "bg-[#1F3824] text-white"
                          : "bg-white text-[#4A544A] border border-[#CBD5C4]"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      {ad.approved ? "Approved" : "Exclude"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInStudio(ad)}
                      className="text-xs text-[#1F3824] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Edit in Studio
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Success Confirmation */}
        {step === "success" && (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Blitz Campaign Scheduled!
            </h3>

            <p className="text-xs text-[#4A544A] max-w-sm leading-relaxed">
              5 high-converting video ads have been scheduled to drip across your connected accounts automatically.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <Button onClick={onClose} className="bg-[#1F3824] text-white hover:bg-[#2A4C30]">
                View Publishing Calendar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

