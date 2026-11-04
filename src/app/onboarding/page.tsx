"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import OnboardingHeader, { OnboardingStep } from "@/components/onboarding/OnboardingHeader";
import StepYou from "@/components/onboarding/StepYou";
import StepBrand from "@/components/onboarding/StepBrand";

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
  const [isAnalyzingWebsite, setIsAnalyzingWebsite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    category: "",
    competitors: [] as string[],
    whatItDoes: "",
  });

  useEffect(() => {
    if (initialUrlFromQuery && !formData.url) {
      setFormData((prev) => ({ ...prev, url: initialUrlFromQuery }));
    }
  }, [initialUrlFromQuery, formData.url]);

  // Step 1: YOU completed → Trigger website scrape + advance to brand
  const handleStepYouComplete = async (stepData: {
    url: string;
    founderName: string;
    referralSource: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));

    setIsAnalyzingWebsite(true);

    try {
      const res = await fetch("/api/v1/projects/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: stepData.url }),
      });

      if (res.ok) {
        const json = await res.json();
        const extracted = json.data || {};

        const brand = extracted.brandName || new URL(stepData.url).hostname.replace("www.", "").split(".")[0];
        const aud = extracted.targetAudience || `Target users and customers of ${brand}`;
        const val = extracted.valueProposition || extracted.summary || "High-velocity platform for creators";
        const goal = extracted.primaryGoal || `Sell more ${brand} plans to ${aud}`;
        const shot = extracted.screenshotUrl || "";
        const competitors = Array.isArray(extracted.competitors) ? extracted.competitors : [];
        const category = extracted.category || "";
        const whatItDoes = extracted.whatItDoes || val;

        setFormData((prev) => ({
          ...prev,
          brandName: brand.charAt(0).toUpperCase() + brand.slice(1),
          audience: aud,
          usp: val,
          goal,
          screenshotUrl: shot,
          category,
          competitors,
          whatItDoes,
        }));
      } else {
        const domainParts = new URL(stepData.url).hostname.replace("www.", "").split(".");
        const rawDomain = domainParts[0] || "product";
        const brand = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);
        setFormData((prev) => ({
          ...prev,
          brandName: brand,
          audience: "Founders and growth operators looking to scale conversions",
          usp: "Autonomous AI UGC engine that launches high-converting video ads",
          goal: `Sell more ${brand} plans to high-intent buyers`,
          whatItDoes: `${brand} helps founders automate marketing and growth.`,
        }));
      }
    } catch {
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
        whatItDoes: `${brand} is a software product for founders and creators.`,
      }));
    } finally {
      setIsAnalyzingWebsite(false);
      setCurrentStep("brand");
    }
  };

  // Step 2: YOUR BRAND confirmed → Save to Database & Launch Dashboard
  const handleStepBrandComplete = async (brandData: {
    brandName: string;
    audience: string;
    usp: string;
    goal: string;
    whatItDoes: string;
    competitors: string[];
  }) => {
    setIsSubmitting(true);
    const finalData = {
      ...formData,
      ...brandData,
    };
    setFormData(finalData);

    try {
      const res = await fetch("/api/v1/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        const json = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("autougc_founder_name", json.founderName || finalData.founderName || "Founder");
          localStorage.setItem("autougc_brand_name", json.brandName || finalData.brandName);
          localStorage.setItem("autougc_brand_goal", json.goal || finalData.goal);
          localStorage.setItem("autougc_screenshot_url", json.screenshotUrl || finalData.screenshotUrl);
          localStorage.setItem("autougc_credits", String(json.credits || 50));
        }
      }
    } catch (err) {
      console.warn("Saved in local state fallback", err);
    } finally {
      setIsSubmitting(false);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] fastlane-grid-bg antialiased">
      <OnboardingHeader currentStep={currentStep} />

      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-7xl w-full mx-auto">
        {currentStep === "you" && (
          <StepYou onComplete={handleStepYouComplete} initialUrl={initialUrlFromQuery} />
        )}

        {currentStep === "brand" && (
          <StepBrand
            initialBrandName={formData.brandName}
            initialAudience={formData.audience}
            initialUsp={formData.usp}
            initialWhatItDoes={formData.whatItDoes}
            initialGoal={formData.goal}
            initialCompetitors={formData.competitors}
            screenshotUrl={formData.screenshotUrl}
            isSubmitting={isSubmitting}
            onConfirm={handleStepBrandComplete}
            onBack={() => setCurrentStep("you")}
          />
        )}

        {/* Full-screen analysis overlay during Step 1 scrape */}
        {isAnalyzingWebsite && (
          <div className="fixed inset-0 bg-[#FAF8F5]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 text-center px-4 animate-in fade-in duration-200">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-3 border-[#D95D39]/20 border-t-[#D95D39] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#D95D39]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-[#18181B]">Analyzing website &amp; extracting UI...</p>
              <p className="text-xs text-[#52525B] max-w-sm">
                Extracting value propositions, capturing high-resolution UI proof, and discovering competitor angles with Gemini.
              </p>
            </div>
          </div>
        )}

        {/* Full-screen submission overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-[#FAF8F5]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 text-center px-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 border-3 border-[#D95D39]/30 border-t-[#D95D39] rounded-full animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#18181B]">Setting up your SaaS command center…</p>
              <p className="text-xs text-[#8E8B85]">Saving your brand profile &amp; generating your custom UGC creatives</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}