"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OnboardingHeader, { OnboardingStep } from "@/components/onboarding/OnboardingHeader";
import StepYou from "@/components/onboarding/StepYou";
import StepBrand from "@/components/onboarding/StepBrand";
import StepRadar from "@/components/onboarding/StepRadar";
import {
  analyzeCompetitorLandscape,
  NicheBenchmark,
} from "@/lib/intelligence/competitorRadarService";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs font-mono text-[#8E8B85]">Loading onboarding...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUrlFromQuery = searchParams.get("url") || "";

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("you");

  // Onboarding Form State
  const [formData, setFormData] = useState({
    url: initialUrlFromQuery,
    founderName: "",
    referralSource: "Twitter / X",
    brandName: "",
    audience: "",
    usp: "",
    goal: "",
    screenshotUrl: "",
  });

  useEffect(() => {
    if (initialUrlFromQuery && !formData.url) {
      setFormData((prev) => ({ ...prev, url: initialUrlFromQuery }));
    }
  }, [initialUrlFromQuery, formData.url]);

  const [benchmark, setBenchmark] = useState<NicheBenchmark | null>(null);

  // Step 1: YOU completed -> Trigger website scrape
  const handleStepYouComplete = async (stepData: {
    url: string;
    founderName: string;
    referralSource: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));

    try {
      // Call background scrape API
      const res = await fetch("/api/v1/projects/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: stepData.url }),
      });

      if (res.ok) {
        const json = await res.json();
        const extracted = json.data || {};

        const brand = extracted.brandName || new URL(stepData.url).hostname.replace("www.", "").split(".")[0];
        const aud = extracted.targetAudience || "Tech founders, developers, and product teams";
        const val = extracted.valueProposition || extracted.summary || "High-velocity platform for creators";
        const shot = extracted.screenshotUrl || "";

        setFormData((prev) => ({
          ...prev,
          brandName: brand.charAt(0).toUpperCase() + brand.slice(1),
          audience: aud,
          usp: val,
          goal: `Sell more ${brand} plans to people who want ${val}`,
          screenshotUrl: shot,
        }));
      } else {
        // Fallback for unresolvable URLs
        const domainParts = new URL(stepData.url).hostname.replace("www.", "").split(".");
        const rawDomain = domainParts[0] || "product";
        const brand = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);
        setFormData((prev) => ({
          ...prev,
          brandName: brand,
          audience: "Founders and growth operators looking to scale conversions",
          usp: "Autonomous AI UGC engine that launches high-converting video ads",
          goal: `Sell more ${brand} plans to high-intent buyers`,
        }));
      }
    } catch {
      // Safe fallback
      const urlParts = stepData.url.replace(/^https?:\/\//i, "").split("/");
      const domainParts = (urlParts[0] || "product").split(".");
      const rawDomain = domainParts[0] || "product";
      const brand = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);
      setFormData((prev) => ({
        ...prev,
        brandName: brand,
        audience: "Founders and creators",
        usp: "High-converting UGC video ads",
        goal: `Sell more ${brand} plans`,
      }));
    }

    setCurrentStep("brand");
  };

  // Step 2: YOUR BRAND completed -> Compute competitor intelligence
  const handleStepBrandComplete = (brandData: {
    brandName: string;
    audience: string;
    usp: string;
    goal: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...brandData,
    }));

    // Compute Niche Benchmarks
    const radarData = analyzeCompetitorLandscape(
      formData.url || brandData.brandName,
      brandData.brandName,
      formData.screenshotUrl
    );
    setBenchmark(radarData);

    setCurrentStep("radar");
  };

  // Step 3: YOUR ADS (Radar) completed -> Move to First Ads presentation
  const handleStepRadarComplete = () => {
    setCurrentStep("first_ads");
  };

  // Step 4: Finalize & Launch into Dashboard
  const handleLaunchDashboard = () => {
    // Persist brand profile locally for seamless dashboard hydration
    if (typeof window !== "undefined") {
      localStorage.setItem("autougc_founder_name", formData.founderName || "Founder");
      localStorage.setItem("autougc_brand_name", formData.brandName || "HumanifyLab");
      localStorage.setItem("autougc_brand_goal", formData.goal || "Scale paid ads across Meta and TikTok");
      localStorage.setItem("autougc_screenshot_url", formData.screenshotUrl || "");
      localStorage.setItem("autougc_credits", "50");
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] fastlane-grid-bg antialiased">
      <OnboardingHeader
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
      />

      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-7xl w-full mx-auto">
        {currentStep === "you" && (
          <StepYou onComplete={handleStepYouComplete} />
        )}

        {currentStep === "brand" && (
          <StepBrand
            initialBrandName={formData.brandName}
            initialAudience={formData.audience}
            initialUsp={formData.usp}
            initialGoal={formData.goal}
            screenshotUrl={formData.screenshotUrl}
            onConfirm={handleStepBrandComplete}
            onBack={() => setCurrentStep("you")}
          />
        )}

        {currentStep === "radar" && benchmark && (
          <StepRadar
            benchmark={benchmark}
            onContinue={handleStepRadarComplete}
            onBack={() => setCurrentStep("brand")}
          />
        )}

        {currentStep === "first_ads" && benchmark && (
          <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-3 duration-200 text-center select-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] text-[11px] font-bold text-[#D95D39] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 Ad Creatives Ready</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#18181B] mb-2">
              Your starter campaign is pre-loaded, {formData.founderName || "Founder"}
            </h1>
            <p className="text-xs text-[#52525B] max-w-lg mx-auto mb-8">
              We generated 1 competitor remix, 1 live product demo overlay, and 1 high-velocity UGC hook. You can review and launch them in your command center.
            </p>

            {/* 3 Ad Creatives Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {benchmark.suggestedFirstAds.map((ad, idx) => (
                <div
                  key={ad.id}
                  className="fastlane-card p-4 bg-white flex flex-col justify-between text-left group hover:border-[#D95D39] transition-all"
                >
                  <div className="relative aspect-9/16 rounded-xl overflow-hidden bg-[#18181B] mb-3 border border-[#EFECE6]">
                    <Image
                      src={ad.thumbnailUrl}
                      alt={ad.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-white">
                      Ad #{idx + 1}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#18181B] line-clamp-1">
                      {ad.title}
                    </div>
                    <div className="text-[11px] text-[#8E8B85] mt-0.5">
                      {ad.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Transition CTA */}
            <button
              type="button"
              onClick={handleLaunchDashboard}
              className="btn-fastlane-black py-3 px-8 text-xs font-semibold gap-2 shadow-md hover:scale-[1.01] transition-transform mx-auto"
            >
              <span>Enter Executive Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
