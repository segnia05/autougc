"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/ui/Modal";
import { PublishingCalendar } from "@/components/dashboard/PublishingCalendar";
import type { PaywallTriggerReason } from "@/components/billing/UpgradePaywallModal";

// Lazy-loaded dialogs to optimize initial page performance
const AutoScheduleModal = dynamic(
  () => import("@/components/dashboard/AutoScheduleModal").then((mod) => mod.AutoScheduleModal),
  { ssr: false }
);

const UpgradePaywallModal = dynamic(
  () => import("@/components/billing/UpgradePaywallModal").then((mod) => mod.UpgradePaywallModal),
  { ssr: false }
);
import {
  Calendar,
  Film,
  Users,
  CreditCard,
  Sparkles,
  Download,
  Copy,
  Check,
  Play,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  ChevronRight,
  Plus,
  Lock,
  ArrowRight,
  Layers,
} from "lucide-react";
import Image from "next/image";

interface VaultVideo {
  id: string;
  brandName: string;
  projectName: string;
  hookAngle: string;
  hookText: string;
  bodyText: string;
  ctaText: string;
  caption: string;
  hashtags: string[];
  durationSeconds: number;
  renderStatus: string;
  videoUrl: string;
  thumbnailUrl: string;
  voiceId: string;
  aspectRatio: string;
  createdAt: string;
  scheduledSlot?: {
    scheduledFor: string;
    localScheduledTime?: string | null;
    accountHandle: string;
    platform: string;
  } | null;
}

interface SocialAccount {
  id: string;
  platform: string;
  accountHandle: string;
  accountNickname?: string | null;
  isBurner: boolean;
  connectedAt: string;
}

interface SubscriptionData {
  tier: "free" | "starter" | "growth" | "scale";
  name: string;
  creditsRemaining: number;
  creditsTotal: number;
  creditsUsed: number;
  maxAccounts: number;
  maxSeats: number;
  cadence: string;
  workspaceName?: string;
  userEmail?: string;
  userFullName?: string;
  renewalDate?: string;
  priceUsd?: number;
  members?: Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    isCurrentUser: boolean;
  }>;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F7F2] flex items-center justify-center text-xs font-mono text-[#717E6C]">
          Loading AutoUGC Command Center...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "pipeline" | "vault" | "accounts" | "billing") || "pipeline";

  const [activeTab, setActiveTab] = useState<"pipeline" | "vault" | "accounts" | "billing">(initialTab);
  const [videos, setVideos] = useState<VaultVideo[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [currentPlan, setCurrentPlan] = useState<SubscriptionData>({
    tier: "growth",
    name: "Growth Autopilot",
    creditsRemaining: 48,
    creditsTotal: 60,
    creditsUsed: 12,
    maxAccounts: 5,
    maxSeats: 3,
    cadence: "~2 posts / day automated drip",
    workspaceName: "Lumina Labs (Growth)",
    userEmail: "founder@luminalight.com",
    userFullName: "Alex Vance",
    renewalDate: "November 26, 2026",
    priceUsd: 89,
    members: [
      { id: "mem_1", email: "founder@luminalight.com", fullName: "Alex Vance", role: "owner", isCurrentUser: true },
      { id: "mem_2", email: "sarah@growthmedia.agency", fullName: "Sarah Connor", role: "editor", isCurrentUser: false },
    ],
  });

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<PaywallTriggerReason>("general");
  const [isWizardOpen, setIsWizardOpen] = useState(() => searchParams.get("launchAutopilot") === "true");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VaultVideo | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [upgradeNotification, setUpgradeNotification] = useState<string | null>(() => {
    if (searchParams.get("upgraded") === "true") {
      const plan = searchParams.get("plan");
      return `Plan upgraded to ${plan ? plan.toUpperCase() : "PRO"}! Extra credits and multi-account seats credited immediately.`;
    }
    return null;
  });

  // Connect Account Form State
  const [newPlatform, setNewPlatform] = useState<"tiktok" | "instagram" | "youtube">("tiktok");
  const [newHandle, setNewHandle] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newIsBurner, setNewIsBurner] = useState(false);
  const [connectingAccount, setConnectingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Invite Member Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/billing/subscription");
      if (res.ok) {
        const data = await res.json();
        if (data.subscription) {
          setCurrentPlan(data.subscription);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch subscription:", err);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/videos");
      if (res.ok) {
        const data = await res.json();
        if (data.videos) {
          setVideos(data.videos);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch videos:", err);
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/social/accounts");
      if (res.ok) {
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch accounts:", err);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadInitialData = async () => {
      try {
        const [subRes, vidRes, accRes] = await Promise.all([
          fetch("/api/v1/billing/subscription"),
          fetch("/api/v1/videos"),
          fetch("/api/v1/social/accounts"),
        ]);
        if (!ignore) {
          if (subRes.ok) {
            const data = await subRes.json();
            if (data.subscription) setCurrentPlan(data.subscription);
          }
          if (vidRes.ok) {
            const data = await vidRes.json();
            if (data.videos) setVideos(data.videos);
          }
          if (accRes.ok) {
            const data = await accRes.json();
            if (data.accounts) setAccounts(data.accounts);
          }
        }
      } catch (err) {
        console.warn("Error fetching dashboard initial data:", err);
      } finally {
        if (!ignore) {
          setLoadingVideos(false);
          setLoadingAccounts(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCopyCaption = (video: VaultVideo) => {
    navigator.clipboard.writeText(`${video.caption}\n\n${(video.hashtags || []).join(" ")}`);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadMp4 = (video: VaultVideo) => {
    setDownloadingId(video.id);
    try {
      const a = document.createElement("a");
      a.href = video.videoUrl;
      a.download = `${video.brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${video.hookAngle}_1080p.mp4`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.warn("Download error:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const handleDirectUpgrade = async (planId: "starter" | "growth" | "scale") => {
    setUpgradingPlan(planId);
    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        router.push("/dashboard?tab=billing&upgraded=true&plan=" + planId);
      }
    } catch (err) {
      console.warn("Upgrade error:", err);
      setPaywallReason("general");
      setIsPaywallOpen(true);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const handleConnectAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle) return;

    if (accounts.length >= currentPlan.maxAccounts) {
      setIsConnectModalOpen(false);
      setPaywallReason("account_limit");
      setIsPaywallOpen(true);
      return;
    }

    setConnectingAccount(true);
    setAccountError(null);

    try {
      const res = await fetch("/api/v1/social/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-plan-tier": currentPlan.tier,
        },
        body: JSON.stringify({
          platform: newPlatform,
          accountHandle: newHandle,
          accountNickname: newNickname || undefined,
          isBurner: newIsBurner,
        }),
      });

      const data = await res.json();
      if (res.status === 403 || data.upgradeRequired) {
        setIsConnectModalOpen(false);
        setPaywallReason("account_limit");
        setIsPaywallOpen(true);
        return;
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to link account");
      }

      setNewHandle("");
      setNewNickname("");
      setIsConnectModalOpen(false);
      await fetchAccounts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting account";
      setAccountError(msg);
    } finally {
      setConnectingAccount(false);
    }
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    if (currentPlan.tier === "free" || currentPlan.tier === "starter") {
      setIsInviteModalOpen(false);
      setPaywallReason("team_seats");
      setIsPaywallOpen(true);
      return;
    }
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setInviteEmail("");
      setIsInviteModalOpen(false);
    }, 1500);
  };

  const percentCreditsUsed = currentPlan.creditsTotal > 0
    ? Math.round((currentPlan.creditsUsed / currentPlan.creditsTotal) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {upgradeNotification && (
          <div className="mb-6 p-4 rounded-2xl bg-[#E2E9DC] border border-[#CBD5C4] flex items-center justify-between text-xs text-[#1F3824] font-semibold">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{upgradeNotification}</span>
            </div>
            <button
              onClick={() => setUpgradeNotification(null)}
              className="text-[#1F3824] hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Executive Header & Fuel Gauge */}
        <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                  {currentPlan.workspaceName || "Creative Workspace"}
                </span>
                <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                  {currentPlan.name}
                </span>
                {currentPlan.tier === "free" ? (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#ECEFE7] text-[#4A544A] border border-[#CBD5C4]/60">
                    No Active Plan (Subscription Required)
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4]/60 inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1F3824] animate-pulse" />
                    Autopilot Drip Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A544A]">
                {accounts.length > 0
                  ? `${accounts.length} Brand Account${accounts.length > 1 ? "s" : ""} Connected • ${currentPlan.cadence}`
                  : "No social accounts connected yet • Connect an account in Tab 3 to start automated distribution."}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Link href="/studio">
                <button className="px-5 py-2.5 rounded-full border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs">
                  <Film className="h-4 w-4" />
                  <span>Create Video</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  if (currentPlan.tier === "free") {
                    setPaywallReason("autopilot_locked");
                    setIsPaywallOpen(true);
                  } else {
                    setIsWizardOpen(true);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Launch 30-Day Autopilot</span>
              </button>
            </div>
          </div>

          {/* Metric Fuel Gauges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#CBD5C4]/60 relative z-10">
            {/* Credits Gauge */}
            <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#4A544A] flex items-center gap-1.5 font-medium">
                  <Film className="h-3.5 w-3.5 text-[#1F3824]" /> Monthly Video Quota
                </span>
                <span className="text-xs font-bold text-[#1F3824]">
                  {currentPlan.creditsRemaining} / {currentPlan.creditsTotal} Left
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#CBD5C4]/60 overflow-hidden">
                <div
                  className="h-full bg-[#1F3824] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, 100 - percentCreditsUsed)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#717E6C] font-mono mt-2">
                <span>{currentPlan.creditsUsed} generated this month</span>
                <span>Resets in 30 days</span>
              </div>
            </div>

            {/* Connected Accounts Capacity */}
            <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#4A544A] flex items-center gap-1.5 font-medium">
                  <Users className="h-3.5 w-3.5 text-[#1F3824]" /> Multi-Account Army
                </span>
                <span className="text-xs font-bold text-[#1F3824]">
                  {accounts.length} / {currentPlan.maxAccounts} Accounts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#CBD5C4]/60 overflow-hidden">
                <div
                  className="h-full bg-[#1F3824] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (accounts.length / Math.max(1, currentPlan.maxAccounts)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#717E6C] font-mono mt-2">
                <span>{accounts.filter((a) => a.isBurner).length} Burners • {accounts.filter((a) => !a.isBurner).length} Official</span>
                <button
                  type="button"
                  onClick={() => {
                    if (accounts.length >= currentPlan.maxAccounts) {
                      setPaywallReason("account_limit");
                      setIsPaywallOpen(true);
                    } else {
                      setIsConnectModalOpen(true);
                    }
                  }}
                  className="text-[#1F3824] font-semibold hover:underline cursor-pointer"
                >
                  + Add account
                </button>
              </div>
            </div>

            {/* Cadence & Velocity */}
            <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#4A544A] flex items-center gap-1.5 font-medium mb-1">
                  <Zap className="h-3.5 w-3.5 text-[#1F3824]" /> Automated Cadence
                </span>
                <span className="text-sm font-bold text-[#1B231B]">
                  {currentPlan.cadence}
                </span>
              </div>
              <span className="text-[10px] text-[#1F3824] font-semibold mt-2 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#1F3824]" /> Anti-Duplicate Shadowban Engine Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Command Center Tabs (Fluencify Pill Segmented Container) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#ECEFE7] border border-[#CBD5C4]/70 mb-8 overflow-x-auto max-w-fit shadow-xs">
          {[
            { id: "pipeline", label: "30-Day Autopilot Pipeline", icon: Calendar, badge: "Live" },
            { id: "vault", label: "Video Vault & Downloads", icon: Film, count: videos.length },
            { id: "accounts", label: "Multi-Account Army & Team", icon: Users, count: accounts.length },
            { id: "billing", label: "Billing & Quotas", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${isCurrent
                  ? "bg-[#1F3824] text-white shadow-sm"
                  : "text-[#4A544A] hover:text-[#1B231B]"
                  }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isCurrent ? "text-white" : "text-[#717E6C]"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${isCurrent ? "bg-white/20 text-white" : "bg-[#E2E9DC] text-[#1F3824]"
                    }`}>
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === "number" && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isCurrent ? "bg-white/20 text-white" : "bg-white text-[#4A544A]"
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: 30-DAY AUTOPILOT PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white border border-[#CBD5C4]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#E2E9DC] flex items-center justify-center text-[#1F3824] shrink-0 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1B231B]">
                    Next Autopilot Broadcast In 3 Hours
                  </h4>
                  <p className="text-xs text-[#4A544A] mt-0.5">
                    Posting to <span className="font-semibold text-[#1F3824]">@lumina_official</span> (TikTok) • Target Peak Hour: <span className="font-semibold">4:00 PM EST</span> • Angle: <span className="font-semibold text-[#1B231B]">Problem Agitation</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-4 py-1.5 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Re-adjust Cadence</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Embedded Publishing Calendar Engine */}
            <PublishingCalendar />
          </div>
        )}

        {/* TAB 2: VIDEO VAULT & DOWNLOADS */}
        {activeTab === "vault" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                  1080p Video Vault & Permanent Media Archive
                </h3>
                <p className="text-xs text-[#717E6C] mt-0.5">
                  Download watermark-free high-resolution vertical ads for Meta Ads Manager, TikTok Ads, and YouTube Shorts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#ECEFE7] text-[#4A544A] border border-[#CBD5C4]/60">
                  {videos.length} Ready Exports
                </span>
                <Link href="/studio">
                  <button className="px-4 py-1.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Creative</span>
                  </button>
                </Link>
              </div>
            </div>

            {loadingVideos ? (
              <div className="p-12 text-center text-xs text-[#717E6C] font-mono">
                Loading video archive...
              </div>
            ) : videos.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-[#CBD5C4] rounded-3xl bg-white shadow-xs">
                <Film className="h-8 w-8 text-[#717E6C] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1B231B]">No videos rendered yet</p>
                <p className="text-xs text-[#4A544A] mt-1 mb-4">
                  Launch the studio to generate your first vertical video ad.
                </p>
                <Link href="/studio">
                  <button className="px-6 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer">
                    Launch Studio
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="group rounded-3xl border border-[#CBD5C4]/70 bg-white overflow-hidden flex flex-col justify-between hover:border-[#1F3824]/60 transition-all shadow-sm"
                  >
                    <div>
                      {/* Video Thumbnail with Hover Play */}
                      <div className="relative aspect-[9/16] bg-[#ECEFE7] overflow-hidden cursor-pointer" onClick={() => setPreviewVideo(vid)}>
                        <Image
                          src={vid.thumbnailUrl}
                          alt={vid.hookText}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                          <span className="bg-black/70 backdrop-blur-md text-[10px] font-mono px-2 py-0.5 rounded text-amber-300 uppercase tracking-wider font-bold">
                            {vid.hookAngle.replace("_", " ")}
                          </span>
                          <span className="bg-black/70 backdrop-blur-md text-[10px] font-mono px-1.5 py-0.5 rounded text-white/80">
                            0:{Math.round(vid.durationSeconds)}
                          </span>
                        </div>

                        {/* Center Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-12 w-12 rounded-full bg-[#1F3824] text-white flex items-center justify-center shadow-lg">
                            <Play className="h-6 w-6 ml-1 fill-white" />
                          </div>
                        </div>

                        {/* Bottom Scheduled Tag */}
                        {vid.scheduledSlot && (
                          <div className="absolute bottom-2.5 left-2.5 right-2.5">
                            <div className="bg-[#1F3824]/90 border border-[#CBD5C4]/30 backdrop-blur-md text-[10px] text-white font-mono px-2.5 py-1 rounded-full flex items-center justify-between">
                              <span className="truncate">{vid.scheduledSlot.accountHandle}</span>
                              <span className="text-[9px] text-emerald-300 font-bold shrink-0">Autopilot</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video Details */}
                      <div className="p-4 space-y-2">
                        <p className="text-xs font-bold text-[#1B231B] line-clamp-2 leading-snug">
                          &ldquo;{vid.hookText}&rdquo;
                        </p>
                        <p className="text-[11px] text-[#4A544A] line-clamp-2 leading-relaxed">
                          {vid.caption}
                        </p>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCaption(vid)}
                        className="flex-1 py-2 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-[11px] font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {copiedId === vid.id ? <Check className="h-3.5 w-3.5 text-[#1F3824]" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedId === vid.id ? "Copied!" : "Caption"}</span>
                      </button>

                      <button
                        onClick={() => handleDownloadMp4(vid)}
                        disabled={downloadingId === vid.id}
                        className="flex-1 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-[11px] font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>1080p MP4</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MULTI-ACCOUNT ARMY & TEAM */}
        {activeTab === "accounts" && (
          <div className="space-y-8">
            {/* Section A: Multi-Account Satellite & Burner Network */}
            <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                      Multi-account satellite & burner network
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                      {accounts.length} / {currentPlan.maxAccounts} Connected
                    </span>
                  </div>
                  <p className="text-xs text-[#4A544A] mt-1">
                    Rotate video permutations across official and burner accounts to maximize algorithmic distribution.
                  </p>
                </div>

                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-5 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Connect New Account</span>
                </button>
              </div>

              {loadingAccounts ? (
                <div className="p-8 text-center text-xs text-[#717E6C] font-mono">
                  Loading connected channels...
                </div>
              ) : accounts.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#CBD5C4] rounded-2xl bg-[#F6F7F2] flex flex-col items-center justify-center gap-3">
                  <Users className="h-8 w-8 text-[#717E6C]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1B231B]">No accounts connected yet</p>
                    <p className="text-xs text-[#4A544A] mt-1">
                      Connect your official brand account or burner satellite channels to enable multi-account distribution.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="px-5 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Connect First Account</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-2xl border border-[#CBD5C4]/70 bg-[#F6F7F2] flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#1B231B] truncate">
                            {acc.accountNickname || acc.accountHandle}
                          </span>
                          {acc.isBurner ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Burner</span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">Official</span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#717E6C] block truncate">
                          {acc.accountHandle} • {acc.platform.toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824] shrink-0">
                        Active
                      </span>
                    </div>
                  ))}

                  {/* Add Slot Placeholder if limit not reached */}
                  {accounts.length < currentPlan.maxAccounts && (
                    <button
                      type="button"
                      onClick={() => setIsConnectModalOpen(true)}
                      className="p-4 rounded-2xl border border-dashed border-[#CBD5C4] hover:border-[#1F3824] bg-white flex items-center justify-center gap-2 text-xs text-[#4A544A] hover:text-[#1F3824] transition-colors cursor-pointer min-h-[72px]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Connect Slot #{accounts.length + 1} ({currentPlan.maxAccounts - accounts.length} slots left)</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section B: Team Workspaces & Seats */}
            <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                      Workspace team members
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                      {currentPlan.members && currentPlan.members.length > 0 ? currentPlan.members.length : 1} / {currentPlan.maxSeats} Seat{currentPlan.maxSeats > 1 ? "s" : ""} Used
                    </span>
                  </div>
                  <p className="text-xs text-[#4A544A] mt-1">
                    Collaborate with editors, performance media buyers, and founders.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (currentPlan.tier === "free" || currentPlan.tier === "starter") {
                      setPaywallReason("team_seats");
                      setIsPaywallOpen(true);
                    } else {
                      setIsInviteModalOpen(true);
                    }
                  }}
                  className="px-4 py-2 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="h-3.5 w-3.5 text-[#1F3824]" />
                  <span>Invite Team Member</span>
                </button>
              </div>

              {(currentPlan.tier === "free" || currentPlan.tier === "starter") && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Lock className="h-4 w-4 shrink-0 text-amber-700" />
                    <span>Team seats are locked on {currentPlan.name}. Upgrade to Growth (3 seats) or Scale (10 seats) to invite media buyers and editors.</span>
                  </div>
                  <button
                    onClick={() => {
                      setPaywallReason("team_seats");
                      setIsPaywallOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#1F3824] text-white text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer shadow-xs"
                  >
                    Unlock Team Seats
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {currentPlan.members && currentPlan.members.length > 0 ? (
                  currentPlan.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-2xl border border-[#CBD5C4]/60 bg-[#F6F7F2] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#E2E9DC] text-[#1F3824] font-bold flex items-center justify-center text-xs">
                          {member.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1B231B]">
                            {member.fullName} {member.isCurrentUser ? "(You)" : ""}
                          </div>
                          <div className="text-[10px] text-[#717E6C] font-mono">{member.email}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                        {member.role === "owner" ? "Workspace Owner" : member.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-2xl border border-[#CBD5C4]/60 bg-[#F6F7F2] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#E2E9DC] text-[#1F3824] font-bold flex items-center justify-center text-xs">
                        {(currentPlan.userFullName || "You").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1B231B]">
                          {currentPlan.userFullName || "Founder"} (You)
                        </div>
                        <div className="text-[10px] text-[#717E6C] font-mono">
                          {currentPlan.userEmail || "Signed-in Creator"}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                      Workspace Owner
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING & QUOTAS */}
        {activeTab === "billing" && (
          <div className="space-y-8 max-w-5xl">
            {/* Active Plan Overview */}
            <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                      Current Subscription
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Status: Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                    {currentPlan.name} ({currentPlan.priceUsd === 0 ? "Subscription Required" : `$${currentPlan.priceUsd} / mo`})
                  </h3>
                  <p className="text-xs text-[#4A544A] mt-1">
                    Billing renewal date: <span className="text-[#1B231B] font-semibold">{currentPlan.renewalDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPaywallReason("general");
                      setIsPaywallOpen(true);
                    }}
                    className="px-5 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Change Plan</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => window.open("/api/v1/billing/portal", "_blank")}
                    className="px-4 py-2 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Stripe Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 relative z-10">
                <div>
                  <span className="text-[11px] text-[#717E6C] block">Monthly Video Allowance</span>
                  <span className="text-lg font-bold text-[#1B231B] font-sans">
                    {currentPlan.creditsTotal} Videos / mo
                  </span>
                  <span className="text-[10px] text-[#1F3824] font-semibold block mt-0.5">
                    {currentPlan.creditsRemaining} remaining
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#717E6C] block">Connected Accounts</span>
                  <span className="text-lg font-bold text-[#1B231B] font-sans">
                    Up to {currentPlan.maxAccounts} Account{currentPlan.maxAccounts > 1 ? "s" : ""}
                  </span>
                  <span className="text-[10px] text-[#1F3824] font-semibold block mt-0.5">
                    {accounts.length} currently active
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#717E6C] block">Team Seats</span>
                  <span className="text-lg font-bold text-[#1B231B] font-sans">
                    {currentPlan.maxSeats} Seat{currentPlan.maxSeats > 1 ? "s" : ""}
                  </span>
                  <span className="text-[10px] text-[#717E6C] block mt-0.5">
                    {currentPlan.tier === "free" || currentPlan.tier === "starter" ? "Solo Operator" : "Collaborative"}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Matrix & 1-Click Upgrade Options */}
            <div>
              <div className="mb-5">
                <h4 className="text-lg font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
                  Production plans & capacity upgrades
                </h4>
                <p className="text-xs text-[#4A544A] mt-0.5">
                  Switch or upgrade your plan anytime. Extra credits and higher account limits take effect immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    id: "starter" as const,
                    name: "Starter Plan",
                    price: "$49",
                    period: "/ month",
                    credits: "20 Videos / mo",
                    accounts: "1 Brand Account",
                    seats: "1 Seat (Solo Founder)",
                    popular: false,
                    features: [
                      "20 1080p Video Exports / mo",
                      "1 Brand Account Connected",
                      "~4 Posts / Week Scheduler",
                      "Full Creative Studio Canvas",
                      "Zero Watermarks & HD Vault",
                    ],
                  },
                  {
                    id: "growth" as const,
                    name: "Growth Plan",
                    price: "$89",
                    period: "/ month",
                    credits: "60 Videos / mo",
                    accounts: "Up to 5 Accounts",
                    seats: "3 Team Seats",
                    popular: true,
                    features: [
                      "60 1080p Video Exports / mo",
                      "Up to 5 Accounts (Main + Satellites)",
                      "~2 Posts / Day Automated Drip",
                      "Multi-Account Clipping Army",
                      "Anti-Duplicate Shadowban Engine",
                      "3 Team Seats for Media Buyers",
                      "Priority GPU Cloud Rendering",
                    ],
                  },
                  {
                    id: "scale" as const,
                    name: "Scale Plan",
                    price: "$199",
                    period: "/ month",
                    credits: "180 Videos / mo",
                    accounts: "Up to 15 Accounts",
                    seats: "10 Team Seats",
                    popular: false,
                    features: [
                      "180 1080p Video Exports / mo",
                      "Up to 15 Accounts (Multi-Brand)",
                      "~6 Posts / Day High-Velocity Blitz",
                      "10 Team Workspace Seats",
                      "Dedicated GPU Rendering Cluster",
                      "Agency Multi-Brand Management",
                      "Direct VIP Support & API Access",
                    ],
                  },
                ].map((plan) => {
                  const isCurrent = currentPlan.tier === plan.id;
                  const isUpgrading = upgradingPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all bg-white border ${plan.popular
                        ? "border-2 border-[#1F3824] shadow-md bg-[#FAFBF9]"
                        : isCurrent
                          ? "border border-[#1F3824]/80 shadow-xs"
                          : "border-[#CBD5C4]/70 hover:border-[#1F3824]/40"
                        }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1F3824] text-white font-bold text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                          Most Popular
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-base font-bold text-[#1B231B]">
                            {plan.name}
                          </h5>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                              Current Plan
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-bold font-sans text-[#1B231B]">
                            {plan.price}
                          </span>
                          <span className="text-xs text-[#717E6C]">{plan.period}</span>
                        </div>

                        <div className="space-y-1.5 pb-4 border-b border-[#CBD5C4]/60 mb-4">
                          <div className="text-xs font-semibold text-[#1F3824] flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                            <span>{plan.credits}</span>
                          </div>
                          <div className="text-xs text-[#4A544A] flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 shrink-0 text-[#717E6C]" />
                            <span>{plan.accounts}</span>
                          </div>
                          <div className="text-xs text-[#4A544A] flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 shrink-0 text-[#717E6C]" />
                            <span>{plan.seats}</span>
                          </div>
                        </div>

                        <ul className="space-y-2.5 mb-6">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="text-xs text-[#4A544A] flex items-start gap-2">
                              <Check className="h-3.5 w-3.5 text-[#1F3824] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {isCurrent ? (
                        <button disabled className="w-full py-2.5 rounded-full bg-[#ECEFE7] text-[#4A544A] text-xs font-semibold uppercase tracking-wider opacity-75 cursor-default">
                          Active Plan
                        </button>
                      ) : (
                        <button
                          disabled={isUpgrading}
                          onClick={() => handleDirectUpgrade(plan.id)}
                          className={`w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${plan.popular
                            ? "bg-[#1F3824] hover:bg-[#162B1B] text-white shadow-xs"
                            : "border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white"
                            }`}
                        >
                          {isUpgrading ? "Redirecting..." : `Select ${plan.name}`}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Paywall Modal */}
      <UpgradePaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        triggerReason={paywallReason}
        currentPlanTier={currentPlan.tier}
        onUpgradeSuccess={() => {
          setIsPaywallOpen(false);
          fetchSubscription();
        }}
      />

      <Footer />

      {/* 30-Day Autopilot Modal */}
      <AutoScheduleModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialUrl={searchParams.get("url") || ""}
        initialBrand={searchParams.get("brand") || currentPlan.workspaceName || ""}
        projectId={searchParams.get("projectId") || "proj_saas_campaign"}
        onSuccess={() => {
          fetchVideos();
          fetchSubscription();
        }}
      />

      {/* Video Preview Modal */}
      {previewVideo && (
        <Modal
          isOpen={Boolean(previewVideo)}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.hookText}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="aspect-[9/16] max-h-[500px] mx-auto bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-md">
              <video
                src={previewVideo.videoUrl}
                controls
                autoPlay
                className="h-full w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1B231B]">Hook Angle:</span>
                <span className="font-semibold text-[#1F3824] capitalize">{previewVideo.hookAngle.replace("_", " ")}</span>
              </div>
              <div>
                <span className="font-semibold text-[#1B231B] block mb-1">Caption:</span>
                <p className="text-[#4A544A] leading-relaxed">{previewVideo.caption}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleCopyCaption(previewVideo)}
                className="px-4 py-2 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-xs font-semibold transition-colors cursor-pointer"
              >
                Copy Caption
              </button>
              <button
                onClick={() => handleDownloadMp4(previewVideo)}
                className="px-5 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download 1080p MP4</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Connect Account Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="Connect Social Account or Burner"
        maxWidth="sm"
      >
        <form onSubmit={handleConnectAccount} className="space-y-4">
          <div>
            <label className="text-xs text-[#4A544A] font-semibold block mb-1">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {(["tiktok", "instagram", "youtube"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPlatform(p)}
                  className={`p-2 rounded-full text-xs font-semibold capitalize border transition-all cursor-pointer ${newPlatform === p
                    ? "bg-[#1F3824] text-white border-transparent"
                    : "bg-[#F6F7F2] border-[#CBD5C4] text-[#4A544A] hover:text-[#1B231B]"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#4A544A] font-semibold block mb-1">Account Handle</label>
            <input
              type="text"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              placeholder="@brand_handle"
              className="w-full px-4 py-2 rounded-full bg-[#F6F7F2] border border-[#CBD5C4] text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#4A544A] font-semibold block mb-1">Account Nickname (Optional)</label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="e.g. US Burner Satellite 1"
              className="w-full px-4 py-2 rounded-full bg-[#F6F7F2] border border-[#CBD5C4] text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isBurner"
              checked={newIsBurner}
              onChange={(e) => setNewIsBurner(e.target.checked)}
              className="h-4 w-4 rounded accent-[#1F3824]"
            />
            <label htmlFor="isBurner" className="text-xs text-[#4A544A] cursor-pointer">
              Mark as Burner / Satellite Account
            </label>
          </div>

          {accountError && (
            <p className="text-xs text-rose-600 font-mono">{accountError}</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsConnectModalOpen(false)}
              className="px-4 py-2 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={connectingAccount}
              className="px-6 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-xs disabled:opacity-50"
            >
              {connectingAccount ? "Connecting..." : "Save Account"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        maxWidth="sm"
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label className="text-xs text-[#4A544A] font-semibold block mb-1">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="editor@yourcompany.com"
              className="w-full px-4 py-2 rounded-full bg-[#F6F7F2] border border-[#CBD5C4] text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#4A544A] font-semibold block mb-1">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-[#F6F7F2] border border-[#CBD5C4] text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824] cursor-pointer"
            >
              <option value="editor">Editor (Create & Schedule)</option>
              <option value="viewer">Viewer (View & Download Only)</option>
              <option value="admin">Admin (Full Control)</option>
            </select>
          </div>

          {inviteSuccess && (
            <p className="text-xs text-[#1F3824] font-semibold">Invitation sent successfully!</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 rounded-full border border-[#CBD5C4] hover:bg-[#ECEFE7] text-[#1B231B] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
