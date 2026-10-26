"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PublishingCalendar } from "@/components/dashboard/PublishingCalendar";
import { AutoScheduleModal } from "@/components/dashboard/AutoScheduleModal";
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
  AlertCircle,
  Plus,
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
  platform: "tiktok" | "instagram" | "youtube";
  accountHandle: string;
  accountNickname?: string | null;
  isBurner?: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "vault" | "accounts" | "billing">("pipeline");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Video Vault state
  const [videos, setVideos] = useState<VaultVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [previewVideo, setPreviewVideo] = useState<VaultVideo | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Accounts state
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // New account form
  const [newHandle, setNewHandle] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newPlatform, setNewPlatform] = useState<"tiktok" | "instagram" | "youtube">("tiktok");
  const [newIsBurner, setNewIsBurner] = useState(true);
  const [connectingAccount, setConnectingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Current organization plan details
  const [currentPlan, setCurrentPlan] = useState({
    tier: "growth" as const,
    name: "Growth Plan",
    priceUsd: 89,
    creditsTotal: 60,
    creditsUsed: 18,
    creditsRemaining: 42,
    maxAccounts: 5,
    cadence: "~2 posts / day automated drip",
    renewalDate: "November 26, 2026",
    maxSeats: 3,
  });

  // Load Subscription
  useEffect(() => {
    let ignore = false;
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/v1/billing/subscription");
        const data = await res.json();
        if (!ignore && data.subscription) {
          setCurrentPlan(data.subscription);
        }
      } catch (err) {
        console.warn("Error loading subscription details:", err);
      }
    }
    fetchSubscription();
    return () => {
      ignore = true;
    };
  }, []);

  // Load Videos
  useEffect(() => {
    let ignore = false;
    async function fetchVideos() {
      setLoadingVideos(true);
      try {
        const res = await fetch("/api/v1/videos");
        const data = await res.json();
        if (!ignore && data.videos) {
          setVideos(data.videos);
        }
      } catch (err) {
        console.warn("Error loading videos:", err);
      } finally {
        if (!ignore) setLoadingVideos(false);
      }
    }
    fetchVideos();
    return () => {
      ignore = true;
    };
  }, []);

  // Load Accounts
  const fetchAccounts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/v1/social/accounts");
      const data = await res.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.warn("Error loading accounts:", err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadAccounts() {
      try {
        const res = await fetch("/api/v1/social/accounts");
        const data = await res.json();
        if (!ignore && data.accounts) {
          setAccounts(data.accounts);
        }
      } catch (err) {
        console.warn("Error loading accounts:", err);
      } finally {
        if (!ignore) {
          setLoadingAccounts(false);
        }
      }
    }
    loadAccounts();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCopyCaption = (video: VaultVideo) => {
    const fullCaption = `${video.caption} ${video.hashtags.map((h) => `#${h}`).join(" ")}`;
    navigator.clipboard.writeText(fullCaption);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadMp4 = (video: VaultVideo) => {
    setDownloadingId(video.id);
    const a = document.createElement("a");
    a.href = video.videoUrl;
    a.download = `${video.brandName}_${video.hookAngle}_1080p.mp4`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  const handleConnectAccount = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setInviteEmail("");
      setIsInviteModalOpen(false);
    }, 1500);
  };

  const percentCreditsUsed = Math.round((currentPlan.creditsUsed / currentPlan.creditsTotal) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Workspace Executive Header & Fuel Gauge */}
        <div className="bg-[var(--bg-surface)] border border-subtle rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)]">
                  Lumina DTC Workspace
                </span>
                <Badge variant="amber" size="sm" className="font-mono text-xs font-bold">
                  {currentPlan.name}
                </Badge>
                <Badge variant="emerald" size="sm" className="font-mono text-xs">
                  Autopilot Drip Active
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Autonomous 30-Day Content Matrix • Next broadcast: <span className="text-[var(--accent-primary)] font-semibold">Today @ 4:00 PM EST</span> on @lumina_official
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Link href="/studio">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto text-xs font-semibold"
                  leftIcon={<Film className="h-4 w-4" />}
                >
                  Create Video (Studio)
                </Button>
              </Link>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsWizardOpen(true)}
                className="w-full sm:w-auto text-xs font-semibold shadow-glow-amber"
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Launch 30-Day Autopilot
              </Button>
            </div>
          </div>

          {/* Metric Fuel Gauges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-subtle">
            {/* Credits Gauge */}
            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                  <Film className="h-3.5 w-3.5 text-[var(--accent-primary)]" /> Monthly Video Quota
                </span>
                <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                  {currentPlan.creditsRemaining} / {currentPlan.creditsTotal} Left
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${100 - percentCreditsUsed}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono mt-2">
                <span>{currentPlan.creditsUsed} generated this month</span>
                <span>Resets in 30 days</span>
              </div>
            </div>

            {/* Connected Accounts Capacity */}
            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                  <Users className="h-3.5 w-3.5 text-emerald-400" /> Multi-Account Army
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {accounts.length} / {currentPlan.maxAccounts} Accounts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(accounts.length / currentPlan.maxAccounts) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono mt-2">
                <span>{accounts.filter((a) => a.isBurner).length} Burners • {accounts.filter((a) => !a.isBurner).length} Official</span>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(true)}
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  + Add account
                </button>
              </div>
            </div>

            {/* Cadence & Velocity */}
            <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-subtle flex flex-col justify-between">
              <div>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium mb-1">
                  <Zap className="h-3.5 w-3.5 text-amber-400" /> Automated Cadence
                </span>
                <span className="text-sm font-semibold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                  {currentPlan.cadence}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Anti-Duplicate Shadowban Engine Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Command Center Tabs */}
        <div className="flex items-center gap-2 border-b border-subtle mb-8 overflow-x-auto pb-px">
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
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <Badge variant="emerald" size="sm" className="text-[10px] px-1 py-0 font-mono">
                    {tab.badge}
                  </Badge>
                )}
                {typeof tab.count === "number" && (
                  <span className="ml-1 px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded-full text-[10px] font-mono">
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
            {/* Quick Hero Alert */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    Next Autopilot Broadcast In 3 Hours
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Posting to <span className="font-mono text-amber-400">@lumina_official</span> (TikTok) • Target Peak Hour: <span className="font-mono">4:00 PM EST</span> • Angle: <span className="font-semibold text-zinc-200">Problem Agitation</span>
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsWizardOpen(true)}
                className="text-xs shrink-0"
                rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
              >
                Re-adjust Cadence
              </Button>
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
                <h3 className="text-base font-bold font-[family-name:var(--font-display)]">
                  1080p Video Vault & Permanent Media Archive
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Download watermark-free high-resolution vertical ads for Meta Ads Manager, TikTok Ads, and YouTube Shorts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm" className="font-mono text-xs">
                  {videos.length} Ready Exports
                </Badge>
                <Link href="/studio">
                  <Button variant="primary" size="sm" className="text-xs" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                    New Creative
                  </Button>
                </Link>
              </div>
            </div>

            {loadingVideos ? (
              <div className="p-12 text-center text-xs text-[var(--text-muted)] font-mono">
                Loading video archive...
              </div>
            ) : videos.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-subtle rounded-2xl bg-[var(--bg-surface)]">
                <Film className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">No videos rendered yet</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 mb-4">
                  Launch the studio to generate your first vertical video ad.
                </p>
                <Link href="/studio">
                  <Button variant="primary" size="sm">Launch Studio</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="group rounded-xl border border-subtle bg-[var(--bg-surface)] overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xs"
                  >
                    <div>
                      {/* Video Thumbnail with Hover Play */}
                      <div className="relative aspect-[9/16] bg-zinc-900 overflow-hidden cursor-pointer" onClick={() => setPreviewVideo(vid)}>
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
                          <span className="bg-black/70 backdrop-blur-md text-[10px] font-mono px-1.5 py-0.5 rounded text-zinc-300">
                            0:{Math.round(vid.durationSeconds)}
                          </span>
                        </div>

                        {/* Center Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-12 w-12 rounded-full bg-[var(--accent-primary)] text-black flex items-center justify-center shadow-glow-amber">
                            <Play className="h-6 w-6 ml-1 fill-black" />
                          </div>
                        </div>

                        {/* Bottom Scheduled Tag */}
                        {vid.scheduledSlot && (
                          <div className="absolute bottom-2.5 left-2.5 right-2.5">
                            <div className="bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-md text-[10px] text-emerald-300 font-mono px-2 py-1 rounded flex items-center justify-between">
                              <span className="truncate">{vid.scheduledSlot.accountHandle}</span>
                              <span className="text-[9px] text-emerald-400 font-bold shrink-0">Autopilot</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video Details */}
                      <div className="p-3.5 space-y-2">
                        <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                          &ldquo;{vid.hookText}&rdquo;
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {vid.caption}
                        </p>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-3.5 pt-0 flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyCaption(vid)}
                        className="flex-1 text-[11px] font-medium"
                        leftIcon={copiedId === vid.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      >
                        {copiedId === vid.id ? "Copied!" : "Caption"}
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownloadMp4(vid)}
                        isLoading={downloadingId === vid.id}
                        className="flex-1 text-[11px] font-semibold"
                        leftIcon={<Download className="h-3.5 w-3.5" />}
                      >
                        1080p MP4
                      </Button>
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
            {/* Section A: Multi-Account Clipping Army */}
            <div className="bg-[var(--bg-surface)] border border-subtle rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-[family-name:var(--font-display)]">
                      Multi-Account Satellite & Burner Network
                    </h3>
                    <Badge variant="amber" size="sm">
                      {accounts.length} / {currentPlan.maxAccounts} Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Rotate video permutations across official and burner accounts to maximize algorithmic distribution.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsConnectModalOpen(true)}
                  className="text-xs"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                >
                  Connect New Account
                </Button>
              </div>

              {loadingAccounts ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
                  Loading connected channels...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-xl border border-subtle bg-[var(--bg-app)] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                            {acc.accountNickname || acc.accountHandle}
                          </span>
                          {acc.isBurner ? (
                            <Badge variant="amber" size="sm">Burner</Badge>
                          ) : (
                            <Badge variant="emerald" size="sm">Official</Badge>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] block truncate">
                          {acc.accountHandle} • {acc.platform.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="emerald" size="sm" pulse>Active</Badge>
                      </div>
                    </div>
                  ))}

                  {/* Add Slot Placeholder if limit not reached */}
                  {accounts.length < currentPlan.maxAccounts && (
                    <button
                      type="button"
                      onClick={() => setIsConnectModalOpen(true)}
                      className="p-4 rounded-xl border border-dashed border-subtle hover:border-[var(--accent-primary)] bg-[var(--bg-app)]/50 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer min-h-[72px]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Connect Slot #{accounts.length + 1} ({currentPlan.maxAccounts - accounts.length} slots left)</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section B: Team Workspaces & Seats */}
            <div className="bg-[var(--bg-surface)] border border-subtle rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-[family-name:var(--font-display)]">
                      Workspace Team Members
                    </h3>
                    <Badge variant="neutral" size="sm">
                      1 / {currentPlan.maxSeats} Seats Used
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Collaborate with editors, performance media buyers, and founders.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="text-xs"
                  leftIcon={<Users className="h-3.5 w-3.5" />}
                >
                  Invite Team Member
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-subtle bg-[var(--bg-app)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs font-mono">
                      FO
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">Founder (You)</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">owner@lumina.com</div>
                    </div>
                  </div>
                  <Badge variant="amber" size="sm">Workspace Owner</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING & QUOTAS */}
        {activeTab === "billing" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-[var(--bg-surface)] border border-subtle rounded-2xl p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <Badge variant="amber" size="sm" className="font-mono mb-2">CURRENT SUBSCRIPTION</Badge>
                  <h3 className="text-2xl font-extrabold font-[family-name:var(--font-display)]">
                    {currentPlan.name} ($89 / mo)
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Next automatic billing renewal: <span className="text-[var(--text-primary)] font-mono font-medium">{currentPlan.renewalDate}</span>
                  </p>
                </div>

                <Link href="/pricing">
                  <Button variant="secondary" size="sm" className="text-xs font-semibold" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                    Upgrade to Scale ($199/mo)
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[var(--bg-app)] border border-subtle mb-6">
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Monthly Video Allowance</span>
                  <span className="text-lg font-bold text-[var(--text-primary)] font-mono">60 Videos / mo</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Multi-Account Capacity</span>
                  <span className="text-lg font-bold text-[var(--text-primary)] font-mono">Up to 5 Accounts</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Cloud Render Priority</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">Priority Node (~25s)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open("/api/v1/billing/portal", "_blank")}
                  className="text-xs font-semibold"
                  rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                >
                  Manage Invoices on Stripe Portal
                </Button>
                <Link href="/pricing">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All Plan Limits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* 30-Day Autopilot Modal */}
      <AutoScheduleModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => {
          // Trigger refresh
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
            <div className="aspect-[9/16] max-h-[500px] mx-auto bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <video
                src={previewVideo.videoUrl}
                controls
                autoPlay
                className="h-full w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-subtle space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--text-primary)]">Hook Angle:</span>
                <span className="font-mono text-amber-400 capitalize">{previewVideo.hookAngle.replace("_", " ")}</span>
              </div>
              <div>
                <span className="font-semibold text-[var(--text-primary)] block mb-1">Caption:</span>
                <p className="text-[var(--text-secondary)] leading-relaxed">{previewVideo.caption}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => handleCopyCaption(previewVideo)}>
                Copy Caption
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDownloadMp4(previewVideo)}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download 1080p MP4
              </Button>
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
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Platform</label>
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value as "tiktok" | "instagram" | "youtube")}
              className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reels</option>
              <option value="youtube">YouTube Shorts</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Account Handle</label>
            <input
              type="text"
              placeholder="@brand_or_burner"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              required
              className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Internal Nickname (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Desk Hacks Satellite #1"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isBurnerCheckbox"
              checked={newIsBurner}
              onChange={(e) => setNewIsBurner(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <label htmlFor="isBurnerCheckbox" className="text-xs text-[var(--text-secondary)] cursor-pointer">
              Tag as Satellite / Burner Account (for anti-shadowban rotation)
            </label>
          </div>

          {accountError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{accountError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-subtle">
            <Button variant="ghost" size="sm" onClick={() => setIsConnectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={connectingAccount}>
              Save Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invite Team Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Workspace Member"
        maxWidth="sm"
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Team Member Email</label>
            <input
              type="email"
              placeholder="colleague@agency.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Role & Permissions</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="editor">Editor (Can create scripts & export videos)</option>
              <option value="media_buyer">Media Buyer (Can download 1080p MP4s & manage schedule)</option>
              <option value="admin">Admin (Full workspace control)</option>
            </select>
          </div>

          {inviteSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>Invitation sent successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-subtle">
            <Button variant="ghost" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
