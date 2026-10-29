"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Globe,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  Layers,
} from "lucide-react";
import {
  TIMEZONE_CONFIGS,
  CampaignCadence,
} from "@/lib/social/distributionEngine";

interface SocialAccountOption {
  id: string;
  platform: "tiktok" | "instagram" | "youtube";
  accountHandle: string;
  accountNickname?: string | null;
  isBurner?: boolean;
}

export interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  initialUrl?: string;
  initialBrand?: string;
  onSuccess?: () => void;
}

export function AutoScheduleModal({
  isOpen,
  onClose,
  projectId = "proj_demo_ugc",
  initialUrl = "",
  initialBrand = "",
  onSuccess,
}: AutoScheduleModalProps) {
  const [cadence, setCadence] = useState<CampaignCadence>("mon_wed_fri");
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [preferredHour, setPreferredHour] = useState<number>(16); // 4 PM
  const [totalVideos, setTotalVideos] = useState<number>(20);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("pers_sarah_01");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("organic_selfie");
  const [requireApproval, setRequireApproval] = useState<boolean>(true);
  const [url, setUrl] = useState<string>(initialUrl);
  const [brand, setBrand] = useState<string>(initialBrand);
  const [availableAccounts, setAvailableAccounts] = useState<SocialAccountOption[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [prevProps, setPrevProps] = useState({ initialUrl, initialBrand });

  if (initialUrl !== prevProps.initialUrl || initialBrand !== prevProps.initialBrand) {
    setPrevProps({ initialUrl, initialBrand });
    if (initialUrl) setUrl(initialUrl);
    if (initialBrand) setBrand(initialBrand);
  }

  // Load connected accounts
  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function fetchAccounts() {
      setLoadingAccounts(true);
      try {
        const res = await fetch("/api/v1/social/accounts");
        const data = await res.json();
        if (!ignore && data.accounts) {
          setAvailableAccounts(data.accounts);
          // Select all by default
          setSelectedAccountIds(data.accounts.map((a: SocialAccountOption) => a.id));
        }
      } catch (err) {
        console.warn("Failed to load accounts:", err);
      } finally {
        if (!ignore) setLoadingAccounts(false);
      }
    }

    fetchAccounts();
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const toggleAccount = (id: string) => {
    if (selectedAccountIds.includes(id)) {
      if (selectedAccountIds.length > 1) {
        setSelectedAccountIds(selectedAccountIds.filter((item) => item !== id));
      }
    } else {
      setSelectedAccountIds([...selectedAccountIds, id]);
    }
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/campaigns/auto-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          cadence,
          targetTimezone: timezone,
          preferredHour,
          totalVideos,
          socialAccountIds: selectedAccountIds.length > 0 ? selectedAccountIds : ["acc_tiktok_main"],
          campaignName: brand ? `${brand} Autopilot Drip` : "SaaS Autopilot Drip",
          requireApproval,
          creatorId: selectedCreatorId,
          archetype: selectedArchetype,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to auto-schedule campaign");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1600);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating campaign";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postsPerAccount = selectedAccountIds.length > 0
    ? Math.round(totalVideos / selectedAccountIds.length)
    : totalVideos;

  // Compute days preview based on cadence
  const getCadenceDaysLabel = () => {
    switch (cadence) {
      case "mon_wed_fri":
        return "Mondays, Wednesdays & Fridays";
      case "mon_wed_fri_sun":
        return "Mondays, Wednesdays, Fridays & Sundays";
      case "weekdays":
        return "Every Monday through Friday";
      case "daily_30":
        return "Every single day (7 days / week)";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Autopilot 30-Day Campaign Scheduler"
      description="Autonomous Just-In-Time video ad rendering and social distribution"
      maxWidth="lg"
      className="p-5 sm:p-7 bg-[#F6F7F2] border border-[#CBD5C4]"
    >
      <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-1 sm:pr-2">
        {/* Website & Brand Info Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#CBD5C4]/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0 border border-[#CBD5C4]">
              <Laptop className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#717E6C] font-semibold block">
                Target Product / SaaS
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1B231B] truncate">
                {brand || "Your Software Product"}
              </p>
              <p className="text-[11px] text-[#717E6C] font-mono truncate">
                {url || "https://yoursoftware.com"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4]/60 shrink-0">
            URL Parsed & Ready
          </span>
        </div>

        {/* Just-In-Time Architecture Highlight Card */}
        <div className="p-4 rounded-2xl bg-[#ECEFE7] border border-[#CBD5C4] flex items-start gap-3">
          <Clock className="h-5 w-5 text-[#1F3824] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-[#1B231B] flex items-center gap-2">
              <span>Just-In-Time (JIT) Generation Architecture</span>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#1F3824] text-white font-mono">
                Active
              </span>
            </p>
            <p className="text-[#4A544A] leading-relaxed">
              We do <strong>not</strong> batch-render all videos at once. AutoUGC renders each video automatically on its scheduled day (e.g., Monday&apos;s video renders Monday morning, Wednesday&apos;s on Wednesday) and automatically publishes it at your peak hour.
            </p>
          </div>
        </div>

        {/* Section 1: Cadence & Quota */}
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD5C4]/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1B231B] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#1F3824]" />
              1. Choose Posting Cadence
            </label>
            <span className="text-xs font-mono text-[#1F3824] font-bold">
              {totalVideos} Videos / Month
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "mon_wed_fri", label: "Mon / Wed / Fri", desc: "~3 posts / week" },
              { id: "mon_wed_fri_sun", label: "Mon / Wed / Fri / Sun", desc: "~4 posts / week (Starter)" },
              { id: "weekdays", label: "Weekdays Only", desc: "Mon – Fri drip" },
              { id: "daily_30", label: "Daily Blitz", desc: "7 days / week (Growth/Scale)" },
            ].map((item) => {
              const isSelected = cadence === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCadence(item.id as CampaignCadence)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#1F3824] bg-[#E2E9DC] text-[#1B231B] ring-1 ring-[#1F3824]"
                      : "border-[#CBD5C4]/70 bg-[#FAFBF9] text-[#4A544A] hover:border-[#1F3824]/60 hover:bg-white"
                  }`}
                >
                  <div className="text-xs font-bold text-[#1B231B]">{item.label}</div>
                  <div className="text-[10px] text-[#717E6C] mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Volume Pill Buttons */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <span className="text-[11px] text-[#717E6C]">Monthly Plan Allotment:</span>
            {[
              { count: 20, label: "20 Videos (Starter)" },
              { count: 60, label: "60 Videos (Growth)" },
              { count: 180, label: "180 Videos (Scale)" },
            ].map((item) => (
              <button
                key={item.count}
                type="button"
                onClick={() => setTotalVideos(item.count)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                  totalVideos === item.count
                    ? "bg-[#1F3824] text-white font-bold border-transparent"
                    : "bg-white text-[#4A544A] border-[#CBD5C4] hover:border-[#1F3824]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Target Country & Peak Hour */}
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD5C4]/70">
          <label className="text-xs font-semibold text-[#1B231B] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[#1F3824]" />
            2. Target Country & Peak Engagement Window
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#717E6C] block mb-1">Target Market Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                aria-label="Target Market Timezone"
                className="w-full bg-[#FAFBF9] border border-[#CBD5C4] rounded-xl px-3 py-2 text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1F3824]"
              >
                {Object.entries(TIMEZONE_CONFIGS).map(([tzKey, cfg]) => (
                  <option key={tzKey} value={tzKey} className="bg-white text-[#1B231B]">
                    {cfg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#717E6C] block mb-1">Peak Audience Window</label>
              <select
                value={preferredHour}
                onChange={(e) => setPreferredHour(Number(e.target.value))}
                aria-label="Peak Audience Window"
                className="w-full bg-[#FAFBF9] border border-[#CBD5C4] rounded-xl px-3 py-2 text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1F3824]"
              >
                <option value={16} className="bg-white">Afternoon Peak (4:00 PM local)</option>
                <option value={19} className="bg-white">Prime Evening (7:30 PM local)</option>
                <option value={12} className="bg-white">Lunch Scroll (12:00 PM local)</option>
                <option value={9} className="bg-white">Morning Commute (9:00 AM local)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Distribution Preview & Accounts */}
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD5C4]/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1B231B] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#1F3824]" />
              3. Connected Channels & Multi-Account Rotation
            </label>
            <span className="text-[11px] text-[#717E6C]">
              {selectedAccountIds.length} Channel{selectedAccountIds.length !== 1 ? "s" : ""} Active
            </span>
          </div>

          {loadingAccounts ? (
            <div className="p-4 text-center text-xs text-[#717E6C]">Loading connected accounts...</div>
          ) : availableAccounts.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#CBD5C4]/60 text-xs text-[#4A544A] flex items-center justify-between">
              <span>Main Brand Account (@brand_official) configured for automated publishing.</span>
              <Badge variant="emerald" size="sm">Active</Badge>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableAccounts.map((acc) => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={isSelected}
                    aria-label={`Channel ${acc.accountNickname || acc.accountHandle} on ${acc.platform}`}
                    onClick={() => toggleAccount(acc.id)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        toggleAccount(acc.id);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-[#1F3824] bg-[#E2E9DC]"
                        : "border-[#CBD5C4]/70 bg-[#FAFBF9] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#1B231B] truncate">
                          {acc.accountNickname || acc.accountHandle}
                        </span>
                        {acc.isBurner ? (
                          <Badge variant="amber" size="sm">Satellite</Badge>
                        ) : (
                          <Badge variant="emerald" size="sm">Brand</Badge>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#717E6C] truncate">
                        {acc.accountHandle} ({acc.platform})
                      </span>
                    </div>

                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#1F3824] bg-[#1F3824] text-white"
                          : "border-[#CBD5C4]"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Allocation Preview Strip */}
          <div className="p-3 rounded-xl bg-[#ECEFE7] border border-[#CBD5C4] flex items-center justify-between text-xs">
            <span className="text-[#4A544A]">Schedule Summary:</span>
            <span className="font-mono text-[#1F3824] font-semibold">
              {getCadenceDaysLabel()} • {postsPerAccount} videos / channel
            </span>
          </div>
        </div>

        {/* Section 4: Video Format / Template Archetype */}
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD5C4]/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1B231B] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#1F3824]" />
              4. Video Format & Template Archetype
            </label>
            <span className="text-[10px] font-semibold text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full border border-[#CBD5C4]/60">
              3 Core Formats
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: "organic_selfie",
                title: "Organic Selfie UGC",
                desc: "Real user talking to camera, candid workplace confession (video123 style)",
              },
              {
                id: "studio_minimalist",
                title: "Minimalist Studio UGC",
                desc: "Clean desk setup, high-authority founder product breakdown",
              },
              {
                id: "meme_reaction",
                title: "Viral Kinetic Meme",
                desc: "Funny hook text + music only & silent creator reaction",
              },
            ].map((t) => {
              const isSelected = selectedArchetype === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedArchetype(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#1F3824] bg-[#E2E9DC] text-[#1B231B] ring-1 ring-[#1F3824]"
                      : "border-[#CBD5C4]/70 bg-[#FAFBF9] text-[#4A544A] hover:bg-white"
                  }`}
                >
                  <div className="text-xs font-bold text-[#1B231B]">{t.title}</div>
                  <div className="text-[10px] text-[#717E6C] mt-1 leading-snug">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Deterministic Creator Persona Selection */}
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD5C4]/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1B231B] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#1F3824]" />
              5. Certified Creator Persona & Identity
            </label>
            <span className="text-[10px] font-semibold text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full border border-[#CBD5C4]/60">
              100% Zero AI Drift
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "pers_sarah_01", name: "Sarah Miller", tag: "US • SaaS & DTC", img: "/images/creator-glasses.jpg" },
              { id: "pers_alex_02", name: "Alex Chen", tag: "US • Tech Founder", img: "/images/creator-male.jpg" },
              { id: "pers_emma_03", name: "Emma Davis", tag: "UK • Productivity", img: "/images/study-creator.jpg" },
              { id: "pers_chloe_07", name: "Chloe Kim", tag: "US • Viral UGC", img: "/images/creator-glasses.jpg" },
            ].map((c) => {
              const isSelected = selectedCreatorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCreatorId(c.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#E2E9DC] border-[#1F3824] ring-1 ring-[#1F3824]"
                      : "bg-[#FAFBF9] border-[#CBD5C4]/70 hover:bg-white"
                  }`}
                >
                  <Image src={c.img} alt={c.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover mb-1.5 border border-[#CBD5C4]" />
                  <span className="text-xs font-bold text-[#1B231B] leading-tight">{c.name}</span>
                  <span className="text-[9px] text-[#717E6C] mt-0.5">{c.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 6: 1-Hour Pre-Publish Approval Gate */}
        <div
          onClick={() => setRequireApproval(!requireApproval)}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
            requireApproval
              ? "bg-[#E2E9DC] border-2 border-[#1F3824] shadow-xs"
              : "bg-white border-[#CBD5C4]/80 hover:border-[#1F3824]/50"
          }`}
        >
          <div className="pt-0.5">
            <div
              className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                requireApproval
                  ? "bg-[#1F3824] border-[#1F3824] text-white"
                  : "bg-white border-[#CBD5C4]"
              }`}
            >
              {requireApproval && <CheckCircle2 className="h-4 w-4" />}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#1B231B]">
                Require 1-Hour Pre-Publish Approval via Email
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1F3824] text-white font-mono">
                Recommended
              </span>
            </div>
            <p className="text-xs text-[#4A544A] leading-relaxed">
              AutoUGC renders each 1080p video 2 hours ahead of time and emails you a 1-click preview link 1 hour before publishing. Tap <strong>&quot;Approve & Publish&quot;</strong> from your phone, click <strong>&quot;Edit in Studio&quot;</strong> to customize hooks and templates, or uncheck to let AutoUGC post 100% autonomously without review.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-3.5 rounded-2xl bg-[#E2E9DC] border border-[#CBD5C4] text-xs text-[#1F3824] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-semibold">30-Day Autopilot Campaign generated successfully! Calendar updated.</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBD5C4]/60">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerate}
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            Launch Autopilot Campaign
          </Button>
        </div>
      </div>
    </Modal>
  );
}
