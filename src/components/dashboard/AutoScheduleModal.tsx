"use client";

import React, { useState, useEffect } from "react";
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
  Zap,
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

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onSuccess?: () => void;
}

export function AutoScheduleModal({
  isOpen,
  onClose,
  projectId = "proj_demo_ugc",
  onSuccess,
}: AutoScheduleModalProps) {
  const [cadence, setCadence] = useState<CampaignCadence>("mon_wed_fri_sun");
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [preferredHour, setPreferredHour] = useState<number>(16); // 4 PM
  const [totalVideos, setTotalVideos] = useState<number>(20);
  const [availableAccounts, setAvailableAccounts] = useState<SocialAccountOption[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
          socialAccountIds: selectedAccountIds,
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
      }, 1800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating campaign";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postsPerAccount = selectedAccountIds.length > 0
    ? Math.round(totalVideos / selectedAccountIds.length)
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="30-Day Autopilot Campaign Wizard" maxWidth="lg">
      <div className="space-y-6">
        {/* Subtitle / Value Prop */}
        <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-subtle flex items-start gap-3">
          <Zap className="h-5 w-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-[var(--text-primary)]">
              Autonomous Drip-Feed & Multi-Account Distribution Engine
            </p>
            <p className="text-[var(--text-secondary)]">
              Automatically calculates peak hours in your audience&apos;s country, spaces videos across the calendar,
              and permutes hooks and voices across accounts to prevent shadowbans.
            </p>
          </div>
        </div>

        {/* Section 1: Cadence & Quota */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              1. Posting Cadence & Video Volume
            </label>
            <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">
              {totalVideos} Videos Total
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "mon_wed_fri", label: "Mon/Wed/Fri", desc: "12-14 posts/mo" },
              { id: "mon_wed_fri_sun", label: "Mon/Wed/Fri/Sun", desc: "16-18 posts/mo" },
              { id: "weekdays", label: "Weekdays Only", desc: "20-22 posts/mo" },
              { id: "daily_30", label: "Daily Blitz", desc: "30-60 posts/mo" },
            ].map((item) => {
              const isSelected = cadence === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCadence(item.id as CampaignCadence)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--text-primary)] ring-1 ring-[var(--accent-primary)]"
                      : "border-subtle bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[var(--text-secondary)]">Volume:</span>
            {[20, 40, 60, 90].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setTotalVideos(num)}
                className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                  totalVideos === num
                    ? "bg-[var(--accent-primary)] text-black font-bold border-transparent"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-subtle hover:border-[var(--border-strong)]"
                }`}
              >
                {num} Videos
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Target Audience Country & Timezone */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            2. Target Country & Peak Engagement Hour
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-[var(--text-muted)] block mb-1">Target Market Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
              >
                {Object.entries(TIMEZONE_CONFIGS).map(([tzKey, cfg]) => (
                  <option key={tzKey} value={tzKey} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {cfg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[var(--text-muted)] block mb-1">Peak Audience Window</label>
              <select
                value={preferredHour}
                onChange={(e) => setPreferredHour(Number(e.target.value))}
                className="w-full bg-[var(--bg-surface)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
              >
                <option value={12} className="bg-[var(--bg-surface)]">Lunch Scroll (12:00 PM local)</option>
                <option value={16} className="bg-[var(--bg-surface)]">Afternoon Peak (4:00 PM local)</option>
                <option value={19} className="bg-[var(--bg-surface)]">Prime Evening (7:30 PM local)</option>
                <option value={9} className="bg-[var(--bg-surface)]">Morning Commute (9:00 AM local)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Multi-Account Distribution Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
              3. Connected Accounts Distribution Matrix
            </label>
            <span className="text-[11px] text-[var(--text-muted)]">
              {selectedAccountIds.length} of {availableAccounts.length} selected
            </span>
          </div>

          {loadingAccounts ? (
            <div className="p-4 text-center text-xs text-[var(--text-muted)]">Loading accounts...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableAccounts.map((acc) => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => toggleAccount(acc.id)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                        : "border-subtle bg-[var(--bg-surface)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {acc.accountNickname || acc.accountHandle}
                        </span>
                        {acc.isBurner ? (
                          <Badge variant="amber" size="sm">Burner</Badge>
                        ) : (
                          <Badge variant="emerald" size="sm">Official</Badge>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                        {acc.accountHandle} ({acc.platform})
                      </span>
                    </div>

                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black"
                          : "border-subtle"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Allocation Preview Banner */}
          <div className="p-2.5 rounded-lg bg-[var(--bg-app)] border border-subtle flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">Anti-Duplicate Allocation:</span>
            <span className="font-mono text-[var(--accent-primary)] font-semibold">
              ~{postsPerAccount} unique videos / account
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>30-Day Autopilot Campaign generated successfully! Calendar updated.</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-subtle">
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
            Generate 30-Day Drip Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
}
