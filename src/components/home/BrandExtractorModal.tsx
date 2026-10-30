"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  Edit3,
  Sliders,
  Image as ImageIcon,
  Palette,
  ExternalLink,
  RotateCcw,
  Film,
  Zap,
} from "lucide-react";
import Image from "next/image";

export interface BrandExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  isManualMode?: boolean;
}

export function BrandExtractorModal({
  isOpen,
  onClose,
  initialUrl = "",
  isManualMode = false,
}: BrandExtractorModalProps) {
  const router = useRouter();

  // Wizard state: "loading" | "review" | "error"
  const [phase, setPhase] = useState<"loading" | "review" | "error">(
    isManualMode ? "review" : "loading"
  );
  const [statusMessage, setStatusMessage] = useState("Scanning webpage architecture & value props...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extracted and editable fields
  const [brandName, setBrandName] = useState("");
  const [targetAudience, setTargetAudience] = useState("High-growth SaaS & digital product founders");
  const [coreValueProp, setCoreValueProp] = useState("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#1F3824");
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Run extraction when opened with a URL
  useEffect(() => {
    if (!isOpen) return;

    if (isManualMode || !initialUrl) {
      setPhase("review");
      setBrandName("My Brand");
      setCoreValueProp("Turn hours of manual software operations into 30-second automated workflows.");
      setKeyFeatures(["Instant Setup", "No Code Required", "Enterprise Security"]);
      setScreenshotUrl("/images/hero-landscape.jpg");
      return;
    }

    let isCancelled = false;
    setPhase("loading");
    setTargetUrl(initialUrl);
    setErrorMessage(null);
    setStatusMessage("Extracting brand positioning and OpenGraph metadata...");

    const timer1 = setTimeout(() => {
      if (!isCancelled) setStatusMessage("Capturing 2560x1600 viewport screenshot for visual proof...");
    }, 1200);

    const timer2 = setTimeout(() => {
      if (!isCancelled) setStatusMessage("Analyzing value propositions and customer hook angles...");
    }, 2400);

    fetch("/api/v1/projects/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: initialUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.success && data.data) {
          const d = data.data;
          setBrandName(d.brandName || "My Brand");
          setCoreValueProp(d.summary || d.pageTitle || "High-performance digital software.");
          setKeyFeatures(d.headings && d.headings.length > 0 ? d.headings.slice(0, 4) : [
            "Seamless Productivity",
            "Built for Fast Teams",
            "Zero Workflow Lag",
          ]);
          setScreenshotUrl(d.screenshotUrl || "/images/hero-landscape.jpg");
          if (d.brandColors?.primary) {
            setPrimaryColor(d.brandColors.primary);
          }
          setPhase("review");
        } else {
          throw new Error(data.error?.message || "Failed to extract website intelligence");
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.warn("Scraping notice, opening manual editor:", err);
        // Fallback to editable manual state with best-effort values
        let inferredName = "My Brand";
        try {
          const host = new URL(initialUrl).hostname.replace(/^www\./, "").split(".")[0];
          if (host) inferredName = host.charAt(0).toUpperCase() + host.slice(1);
        } catch {
          // ignore
        }
        setBrandName(inferredName);
        setCoreValueProp(`High-performance software built for ${inferredName} customers.`);
        setKeyFeatures(["Automated Workflows", "Instant Onboarding", "Real-Time Sync"]);
        setScreenshotUrl("/images/hero-landscape.jpg");
        setPhase("review");
      });

    return () => {
      isCancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, initialUrl, isManualMode]);

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    if (!keyFeatures.includes(newFeatureInput.trim())) {
      setKeyFeatures([...keyFeatures, newFeatureInput.trim()]);
    }
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (feat: string) => {
    setKeyFeatures(keyFeatures.filter((f) => f !== feat));
  };

  const handleGenerateCampaign = () => {
    setIsSubmitting(true);
    onClose();

    // Navigate to dashboard with refined brand intelligence
    const query = new URLSearchParams({
      tab: "calendar",
      launchAutopilot: "true",
      brand: brandName,
      url: targetUrl || "",
      summary: coreValueProp,
      niche: targetAudience,
    });

    if (screenshotUrl) {
      query.set("screenshotUrl", screenshotUrl);
      query.set("productImage", screenshotUrl);
    }

    router.push(`/dashboard?${query.toString()}`);
  };

  const handleOpenInStudio = () => {
    setIsSubmitting(true);
    onClose();

    const hookText = `Stop manually struggling with ${brandName.toLowerCase()} tasks in 2026.`;
    const ctaText = `Try ${brandName} today at the link below.`;

    const query = new URLSearchParams({
      brand: brandName,
      hook: hookText,
      body: coreValueProp,
      cta: ctaText,
      video: "/videos/creator-sarah.mp4",
    });

    if (screenshotUrl) {
      query.set("productImage", screenshotUrl);
    }

    router.push(`/studio?${query.toString()}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="xl"
    >
      <div className="p-2 sm:p-5 text-[#1B231B]">
        {/* Loading Phase */}
        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-3xl bg-[#1F3824] flex items-center justify-center text-white shadow-xl">
                <Globe className="h-8 w-8 text-[#E2E9DC] animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#FFE600] flex items-center justify-center shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-[#1F3824]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <h3 className="text-xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                Extracting Brand Intelligence
              </h3>
              <p className="text-xs text-[#4A544A] leading-relaxed">
                {statusMessage}
              </p>
            </div>

            <div className="w-64 bg-[#E2E9DC] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1F3824] h-full w-2/3 animate-pulse rounded-full" />
            </div>

            <p className="text-[11px] text-[#717E6C] font-mono">
              Target: {targetUrl}
            </p>
          </div>
        )}

        {/* Review & Edit Phase */}
        {phase === "review" && (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#CBD5C4]/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#1F3824] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sliders className="h-5 w-5 text-[#E2E9DC]" />
                </div>
                <div>
                  <h2 className="text-xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                    Brand Intelligence Review
                  </h2>
                  <p className="text-xs text-[#4A544A]">
                    Review and customize your extracted product positioning before generating video ads.
                  </p>
                </div>
              </div>

              {targetUrl && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#4A544A] bg-[#ECEFE7] px-3 py-1 rounded-full border border-[#CBD5C4] self-start sm:self-auto">
                  <Globe className="h-3.5 w-3.5 text-[#1F3824]" />
                  <span className="font-mono truncate max-w-[200px]">{targetUrl}</span>
                </div>
              )}
            </div>

            {/* Split Grid: Form Controls Left, Proof Preview Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Brand Name & Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Linear"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#1B231B] font-semibold focus:outline-none focus:border-[#1F3824] focus:ring-1 focus:ring-[#1F3824]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                      Target Audience / Niche
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Software Engineers, Founders"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824] focus:ring-1 focus:ring-[#1F3824]"
                    />
                  </div>
                </div>

                {/* Core Value Proposition */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider">
                      Core Value Proposition & Hook USP
                    </label>
                    <span className="text-[10px] text-[#717E6C]">Used in script body & proof</span>
                  </div>
                  <textarea
                    rows={3}
                    value={coreValueProp}
                    onChange={(e) => setCoreValueProp(e.target.value)}
                    placeholder="What painful problem does this software solve in 30 seconds?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#1B231B] leading-relaxed focus:outline-none focus:border-[#1F3824] focus:ring-1 focus:ring-[#1F3824]"
                  />
                </div>

                {/* Key Features / Hook Angles */}
                <div>
                  <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                    Key Features / Talking Points
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    {keyFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2E9DC] border border-[#CBD5C4] text-xs font-medium text-[#1F3824]"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feat)}
                          className="hover:text-rose-700 text-[#717E6C] font-bold text-xs"
                          title="Remove feature"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Add talking point (press Enter)..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824]"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddFeature}
                      className="text-xs"
                    >
                      Add Point
                    </Button>
                  </div>
                </div>

                {/* Manual URL Input Option if started without one */}
                {!initialUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1F3824] uppercase tracking-wider mb-1.5">
                      Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://yourproduct.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824]"
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Visual Proof & Mockup Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4 bg-[#F6F7F2] p-4 rounded-2xl border border-[#CBD5C4]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1F3824] uppercase tracking-wider">
                    Visual Proof Demonstration
                  </span>
                  <Badge variant="neutral" className="text-[10px]">
                    Retina Capture
                  </Badge>
                </div>

                {/* macOS Mockup Device Frame */}
                <div className="rounded-2xl overflow-hidden border border-[#CBD5C4] bg-white shadow-md">
                  <div className="bg-[#E2E9DC] px-3 py-2 flex items-center justify-between border-b border-[#CBD5C4]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    </div>
                    <span className="text-[10px] font-mono text-[#4A544A] font-semibold truncate max-w-[150px]">
                      {brandName || "Product Demo"}
                    </span>
                    <div className="w-4" />
                  </div>

                  <div className="relative aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
                    {screenshotUrl ? (
                      <Image
                        src={screenshotUrl}
                        alt="Scraped Product Viewport"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-6 text-center text-[#717E6C]">
                        <ImageIcon className="h-8 w-8 text-[#CBD5C4]" />
                        <span className="text-xs">No screenshot captured</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-[#4A544A] leading-relaxed">
                  This viewport screenshot will slide into the ad at seconds 3.5–9 as proof of your product while creator Sarah or Alex narrates your value proposition.
                </p>

                {/* Ready Angles Pill */}
                <div className="p-3 rounded-xl bg-white border border-[#CBD5C4] flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-[#1F3824]">
                    5 Multi-Angle Video Ads Ready:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#4A544A]">
                    <span>• The Secret Hack</span>
                    <span>• The $5,000 Mistake</span>
                    <span>• Pattern Interrupt</span>
                    <span>• Honest 30-Day Review</span>
                    <span className="col-span-2">• POV Discovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#CBD5C4]/60 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#717E6C] hover:text-[#1B231B] transition-colors"
              >
                Cancel & Return
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleOpenInStudio}
                  disabled={isSubmitting}
                  leftIcon={<Film className="h-3.5 w-3.5" />}
                  className="text-xs flex-1 sm:flex-none"
                >
                  Edit Single Ad in Studio
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGenerateCampaign}
                  isLoading={isSubmitting}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  className="text-xs flex-1 sm:flex-none"
                >
                  Generate 5-Ad Campaign
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
