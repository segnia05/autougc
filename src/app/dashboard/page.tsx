"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import BrandProfileHeader from "@/components/dashboard/BrandProfileHeader";
import PrePublishApprovalQueue from "@/components/dashboard/PrePublishApprovalQueue";
import ConnectedAccountsSection, {
  ConnectedSocialAccount,
} from "@/components/dashboard/ConnectedAccountsSection";
import InteractiveMonthlyCalendar, {
  ScheduledCalendarPost,
} from "@/components/dashboard/InteractiveMonthlyCalendar";
import SchedulePostModal from "@/components/dashboard/SchedulePostModal";
import { UpgradePaywallModal, PaywallTriggerReason } from "@/components/billing/UpgradePaywallModal";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // SaaS Workspace Profile State (Loaded directly from DB / Gemini Extraction)
  const [isLoading, setIsLoading] = useState(true);
  const [founderName, setFounderName] = useState("Founder");
  const [brandName, setBrandName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [whatItDoes, setWhatItDoes] = useState("");
  const [credits, setCredits] = useState(50);
  const [planTier, setPlanTier] = useState("starter");
  const [screenshotUrl, setScreenshotUrl] = useState("");

  // Social Channels & Scheduled Posts State
  const [accounts, setAccounts] = useState<ConnectedSocialAccount[]>([]);
  const [posts, setPosts] = useState<ScheduledCalendarPost[]>([]);

  // Modals State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTriggerReason, setUpgradeTriggerReason] = useState<PaywallTriggerReason>("general");

  // Fetch Connected Accounts
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/social/accounts");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
        }
      }
    } catch (err) {
      console.warn("Failed fetching connected accounts", err);
    }
  }, []);

  // Fetch Scheduled Calendar Posts
  const fetchScheduledPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/social/schedule");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      }
    } catch (err) {
      console.warn("Failed fetching scheduled posts", err);
    }
  }, []);

  // Initial Load Workspace Profile
  useEffect(() => {
    async function loadUserWorkspace() {
      try {
        const res = await fetch("/api/v1/workspace/active");
        if (res.ok) {
          const json = await res.json();
          if (json.onboarded && json.brandName) {
            setBrandName(json.brandName);
            setFounderName(json.founderName || "Founder");
            setTargetUrl(json.targetUrl || "");
            setTargetAudience(json.targetAudience || "");
            setCompetitors(Array.isArray(json.competitors) ? json.competitors : []);
            setWhatItDoes(json.whatItDoes || json.summary || "");
            setScreenshotUrl(json.screenshotUrl || "");
            setCredits(json.credits ?? 50);
            setPlanTier(json.planTier || "starter");
            setIsLoading(false);

            // Fetch accounts and scheduled calendar posts in parallel
            fetchAccounts();
            fetchScheduledPosts();
            return;
          }
        }

        // Check local storage fallback
        if (typeof window !== "undefined") {
          const storedBrand = localStorage.getItem("autougc_brand_name");
          const storedName = localStorage.getItem("autougc_founder_name");
          const storedCredits = localStorage.getItem("autougc_credits");
          const storedShot = localStorage.getItem("autougc_screenshot_url");

          if (storedBrand) {
            setBrandName(storedBrand);
            setFounderName(storedName || "Founder");
            setScreenshotUrl(storedShot || "");
            if (storedCredits) setCredits(parseInt(storedCredits, 10));
            setIsLoading(false);
            fetchAccounts();
            fetchScheduledPosts();
            return;
          }
        }

        // If user has no brand profile, route to onboarding
        router.replace("/onboarding");
      } catch {
        router.replace("/onboarding");
      }
    }

    loadUserWorkspace();
  }, [router, fetchAccounts, fetchScheduledPosts]);

  // Handle Upgrade Modal Trigger
  const handleTriggerUpgrade = (reason: string) => {
    if (reason.toLowerCase().includes("account") || reason.toLowerCase().includes("limit")) {
      setUpgradeTriggerReason("account_limit");
    } else if (reason.toLowerCase().includes("credit")) {
      setUpgradeTriggerReason("credits_exhausted");
    } else {
      setUpgradeTriggerReason("general");
    }
    setIsUpgradeModalOpen(true);
  };

  // Tier Account Limits: Starter: 1, Growth: 5, Scale: 15
  const maxAccountsAllowed =
    planTier === "scale" ? 15 : planTier === "growth" ? 5 : 1;

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
          <span className="text-xs text-[#8E8B85] font-medium font-mono">
            Loading your SaaS command center...
          </span>
        </div>
      </div>
    );
  }

  return (
    <AppShell brandName={brandName}>
      <main id="main-content" tabIndex={-1} className="space-y-8 focus:outline-none pb-12">
        {/* 1. SaaS Profile Header & Quick Studio Launch */}
        <BrandProfileHeader
          brandName={brandName}
          targetUrl={targetUrl}
          screenshotUrl={screenshotUrl}
          targetAudience={targetAudience}
          competitors={competitors}
          whatItDoes={whatItDoes}
          credits={credits}
          planTier={planTier}
          founderName={founderName}
          onOpenStudio={() => router.push("/studio")}
          onSchedulePost={() => setIsScheduleModalOpen(true)}
          onUpgrade={() => {
            setUpgradeTriggerReason("credits_exhausted");
            setIsUpgradeModalOpen(true);
          }}
        />

        {/* 2. Pre-Publish 1-Hour Approval Queue (With 1-click approve & Studio link) */}
        <PrePublishApprovalQueue
          posts={posts}
          onRefresh={() => {
            fetchScheduledPosts();
            fetchAccounts();
          }}
        />

        {/* 3. Connected Social Accounts / Devices Section */}
        <ConnectedAccountsSection
          accounts={accounts}
          maxAccountsAllowed={maxAccountsAllowed}
          planTier={planTier}
          onRefreshAccounts={fetchAccounts}
          onTriggerUpgrade={handleTriggerUpgrade}
        />

        {/* 4. Real Interactive Monthly Calendar with Marked Scheduled Days */}
        <InteractiveMonthlyCalendar
          posts={posts}
          brandName={brandName}
          onRefreshPosts={fetchScheduledPosts}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        />
      </main>

      {/* Schedule Post Modal */}
      <SchedulePostModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        accounts={accounts}
        brandName={brandName}
        onScheduled={() => {
          fetchScheduledPosts();
          fetchAccounts();
        }}
        onTriggerUpgrade={handleTriggerUpgrade}
        onConnectAccountClick={() => {
          // Handled via ConnectedAccountsSection connect modal
        }}
      />

      {/* Upgrade Paywall Modal */}
      <UpgradePaywallModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerReason={upgradeTriggerReason}
        currentPlanTier={planTier}
        onUpgradeSuccess={(newTier) => {
          setPlanTier(newTier);
          setIsUpgradeModalOpen(false);
          fetchAccounts();
        }}
      />
    </AppShell>
  );
}
