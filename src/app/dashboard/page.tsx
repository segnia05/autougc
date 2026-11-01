"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import DashboardExecutiveHeader from "@/components/dashboard/DashboardExecutiveHeader";
import NextActionHeroCard from "@/components/dashboard/NextActionHeroCard";
import PaceGaugeCard from "@/components/dashboard/PaceGaugeCard";
import DockedCopilotBar from "@/components/dashboard/DockedCopilotBar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // Dynamic state populated exclusively from real user data
  const [isLoading, setIsLoading] = useState(true);
  const [founderName, setFounderName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandGoal, setBrandGoal] = useState("");
  const [credits, setCredits] = useState(50);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    async function loadUserWorkspace() {
      try {
        const res = await fetch("/api/v1/workspace/active");
        if (res.ok) {
          const json = await res.json();
          if (json.onboarded && json.brandName) {
            setBrandName(json.brandName);
            setFounderName(json.founderName || "Founder");
            setBrandGoal(json.goal || `Scale paid creator ads for ${json.brandName}`);
            setScreenshotUrl(json.screenshotUrl || "");
            setCredits(json.credits ?? 50);
            setIsLoading(false);
            return;
          }
        }

        // Check local storage fallback
        if (typeof window !== "undefined") {
          const storedBrand = localStorage.getItem("autougc_brand_name");
          const storedName = localStorage.getItem("autougc_founder_name");
          const storedGoal = localStorage.getItem("autougc_brand_goal");
          const storedCredits = localStorage.getItem("autougc_credits");
          const storedShot = localStorage.getItem("autougc_screenshot_url");

          if (storedBrand) {
            setBrandName(storedBrand);
            setFounderName(storedName || "Founder");
            setBrandGoal(storedGoal || `Scale paid creator ads for ${storedBrand}`);
            setScreenshotUrl(storedShot || "");
            if (storedCredits) setCredits(parseInt(storedCredits, 10));
            setIsLoading(false);
            return;
          }
        }

        // If user has no brand profile, strictly block dashboard and route to onboarding
        router.replace("/onboarding");
      } catch {
        router.replace("/onboarding");
      }
    }

    loadUserWorkspace();
  }, [router]);

  const handleCopilotSubmit = (prompt: string, intent: string) => {
    // When the user submits a copilot prompt, route to Studio with preloaded prompt
    if (typeof window !== "undefined") {
      localStorage.setItem("autougc_copilot_prompt", prompt);
      localStorage.setItem("autougc_copilot_intent", intent);
    }
    router.push("/studio");
  };

  const adThumbnails = [
    screenshotUrl || "/images/creator-sarah.jpg",
    "/images/creator-alex.jpg",
    "/images/creator-sarah.jpg",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center fastlane-grid-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#18181B] flex items-center justify-center animate-pulse">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 15L14 4H10L2 15H4Z" fill="#D95D39" />
              <path d="M10 20L20 9H16L8 20H10Z" fill="#D95D39" />
            </svg>
          </div>
          <span className="text-xs text-[#8E8B85] font-medium">Loading command center...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell brandName={brandName}>
      <main id="main-content" tabIndex={-1} className="space-y-6 focus:outline-none">
        {/* Executive Header & Goal Strip (Screenshot 3 Match) */}
        <DashboardExecutiveHeader
          founderName={founderName}
          brandName={brandName}
          goal={brandGoal}
          credits={credits}
          trialEndDays={7}
          onAskCopilot={() => router.push("/studio")}
        />

        {/* 2-Column Core Action & Momentum Grid (Screenshot 3 Match) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (span 6): The 1 Thing That Needs You */}
          <div className="lg:col-span-6">
            <NextActionHeroCard
              completedCount={3}
              totalCount={30}
              campaignName="Starter campaign"
              adThumbnails={adThumbnails}
              onOpen={() => router.push("/campaigns")}
            />
          </div>

          {/* Right Column (span 6): Velocity & Pace Gauge */}
          <div className="lg:col-span-6">
            <PaceGaugeCard
              currentDailyViews={0}
              postsOut={0}
              postsGoal={0}
              adSpendWeek="None"
              credits={credits}
            />
          </div>
        </div>

        {/* Bottom Persistent Docked Copilot Command Bar (Screenshot 3 Match) */}
        <div className="pt-6">
          <DockedCopilotBar
            brandName={brandName}
            onSubmit={handleCopilotSubmit}
          />
        </div>
      </main>
    </AppShell>
  );
}
