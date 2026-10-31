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

  // Local state hydrated from onboarding or defaults
  const [founderName, setFounderName] = useState("Segni");
  const [brandName, setBrandName] = useState("HumanifyLab");
  const [brandGoal, setBrandGoal] = useState(
    "Sell more HumanifyLab plans to people who want natural sounding text"
  );
  const [credits, setCredits] = useState(50);
  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("autougc_founder_name");
      const storedBrand = localStorage.getItem("autougc_brand_name");
      const storedGoal = localStorage.getItem("autougc_brand_goal");
      const storedCredits = localStorage.getItem("autougc_credits");
      const storedShot = localStorage.getItem("autougc_screenshot_url");

      if (storedName) setFounderName(storedName);
      if (storedBrand) setBrandName(storedBrand);
      if (storedGoal) setBrandGoal(storedGoal);
      if (storedCredits) setCredits(parseInt(storedCredits, 10));
      if (storedShot) setScreenshotUrl(storedShot);
    }
  }, []);

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

  return (
    <AppShell brandName={brandName}>
      <div className="space-y-6">
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
      </div>
    </AppShell>
  );
}
