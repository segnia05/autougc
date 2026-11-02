"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  });

  useEffect(() => {
    if (initialUrlFromQuery && !formData.url) {
      setFormData((prev) => ({ ...prev, url: initialUrlFromQuery }));
    }
  }, [initialUrlFromQuery, formData.url]);

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
        const aud = extracted.targetAudience || `Target users and customers of ${brand}`;
        const val = extracted.valueProposition || extracted.summary || "High-velocity platform for creators";
        const goal = extracted.primaryGoal || `Sell more ${brand} plans to ${aud}`;
        const shot = extracted.screenshotUrl || "";
        const competitors = Array.isArray(extracted.competitors) ? extracted.competitors : [];
        const category = extracted.category || "";

        setFormData((prev) => ({
          ...prev,
          brandName: brand.charAt(0).toUpperCase() + brand.slice(1),
          audience: aud,
          usp: val,
          goal: goal,
          screenshotUrl: shot,
          category: category,
          competitors: competitors,
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 2: YOUR BRAND completed -> Persist and launch directly into Dashboard
  const handleStepBrandComplete = async (brandData: {
    brandName: string;
    audience: string;
    usp: string;
    goal: string;
  }) => {
    const finalData = {
      ...formData,
      ...brandData,
    };
    setFormData(finalData);
    await handleLaunchDashboard(finalData);
  };

  // Finalize & Launch into Dashboard
  const handleLaunchDashboard = async (dataToSubmit?: typeof formData) => {
    setIsSubmitting(true);
    const payload = dataToSubmit || formData;
    try {
      const res = await fetch("/api/v1/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("autougc_founder_name", json.founderName || payload.founderName || "Founder");
          localStorage.setItem("autougc_brand_name", json.brandName || payload.brandName);
          localStorage.setItem("autougc_brand_goal", json.goal || payload.goal);
          localStorage.setItem("autougc_screenshot_url", json.screenshotUrl || payload.screenshotUrl);
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
            isSubmitting={isSubmitting}
            onConfirm={handleStepBrandComplete}
            onBack={() => setCurrentStep("you")}
          />
        )}
      </main>
    </div>
  );
}
