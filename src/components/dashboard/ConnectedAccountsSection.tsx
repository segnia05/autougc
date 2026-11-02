"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Share2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface ConnectedSocialAccount {
  id: string;
  platform: "tiktok" | "instagram" | "youtube";
  accountHandle: string;
  accountNickname?: string | null;
  isBurner?: boolean;
  dailyPostLimit?: number;
  createdAt?: string;
}

interface ConnectedAccountsSectionProps {
  accounts: ConnectedSocialAccount[];
  maxAccountsAllowed: number;
  planTier: string;
  onRefreshAccounts: () => void;
  onTriggerUpgrade: (reason: string) => void;
}

export default function ConnectedAccountsSection({
  accounts,
  maxAccountsAllowed,
  planTier,
  onRefreshAccounts,
  onTriggerUpgrade,
}: ConnectedAccountsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<"tiktok" | "instagram">("tiktok");
  const [handle, setHandle] = useState("");
  const [nickname, setNickname] = useState("");
  const [isBurner, setIsBurner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAtCapacity = accounts.length >= maxAccountsAllowed;

  const handleOpenConnect = (targetPlatform: "tiktok" | "instagram") => {
    if (isAtCapacity) {
      onTriggerUpgrade(
        `Your ${planTier.toUpperCase()} tier allows up to ${maxAccountsAllowed} account(s). Upgrade to Growth (5 accounts) or Scale (15 accounts) to connect more.`
      );
      return;
    }
    setPlatform(targetPlatform);
    setHandle("");
    setNickname("");
    setIsBurner(false);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      setErrorMsg("Please enter an account handle.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/social/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          accountHandle: handle.trim(),
          accountNickname: nickname.trim() || undefined,
          isBurner,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.upgradeRequired) {
          setIsModalOpen(false);
          onTriggerUpgrade(data.error);
          return;
        }
        setErrorMsg(data.error || "Failed to connect account.");
        return;
      }

      setIsModalOpen(false);
      onRefreshAccounts();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;
    try {
      await fetch(`/api/v1/social/accounts?id=${accountId}`, {
        method: "DELETE",
      });
      onRefreshAccounts();
    } catch (err) {
      console.warn("Failed disconnecting account", err);
    }
  };

  return (
    <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Capacity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#CBD5C4]/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-[#1B231B] font-[family-name:var(--font-serif)]">
              Connected Social Media & Devices
            </h2>
            <Badge variant={isAtCapacity ? "amber" : "emerald"} size="sm">
              {accounts.length} / {maxAccountsAllowed} Active
            </Badge>
          </div>
          <p className="text-xs text-[#52525B]">
            Automated video distribution rotates across your official brand and satellite accounts.
          </p>
        </div>

        {/* Quick Connect Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleOpenConnect("tiktok")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <TikTokIcon className="w-3.5 h-3.5 text-white" />
            <span>Connect TikTok</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenConnect("instagram")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E1306C] to-[#C13584] hover:opacity-95 text-white text-xs font-semibold shadow-xs transition-opacity"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-white" />
            <span>Connect Instagram</span>
          </button>
        </div>
      </div>

      {/* Accounts List / Grid */}
      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#CBD5C4] bg-[#FAF8F5]/50 p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#E2E9DC] flex items-center justify-center text-[#1F3824] mx-auto">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1B231B]">
              No social accounts connected yet
            </h3>
            <p className="text-xs text-[#52525B] max-w-md mx-auto">
              Connect your primary TikTok or Instagram account to enable 1-click scheduled autopilot publishing.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenConnect("tiktok")}
              className="px-4 py-2 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-black"
            >
              Connect TikTok
            </button>
            <button
              type="button"
              onClick={() => handleOpenConnect("instagram")}
              className="px-4 py-2 rounded-xl bg-[#E1306C] text-white text-xs font-semibold hover:opacity-90"
            >
              Connect Instagram
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const isTikTok = acc.platform === "tiktok";
            return (
              <div
                key={acc.id}
                className="p-4 rounded-2xl border border-[#CBD5C4] bg-[#F6F7F2]/60 hover:bg-white hover:border-[#1F3824] transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                        isTikTok ? "bg-black" : "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
                      }`}
                    >
                      {isTikTok ? <TikTokIcon className="w-4 h-4" /> : <InstagramIcon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1B231B] line-clamp-1">
                        {acc.accountHandle}
                      </div>
                      <div className="text-[10px] text-[#717E6C] line-clamp-1">
                        {acc.accountNickname || (acc.isBurner ? "Burner Satellite" : "Official Brand")}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDisconnect(acc.id)}
                    aria-label={`Disconnect ${acc.accountHandle}`}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#8E8B85] hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#CBD5C4]/40 text-[10px]">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active & Syncing</span>
                  </div>
                  <span className="text-[#717E6C]">
                    Cadence: 2 / day
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Account Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Connect ${platform === "tiktok" ? "TikTok" : "Instagram"} Account`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F7F2] border border-[#CBD5C4]">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                platform === "tiktok" ? "bg-black" : "bg-gradient-to-tr from-[#F58529] to-[#8134AF]"
              }`}
            >
              {platform === "tiktok" ? <TikTokIcon className="w-4 h-4" /> : <InstagramIcon className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-[#1B231B] capitalize">
                {platform} Creator Channel
              </div>
              <div className="text-[11px] text-[#717E6C]">
                Used for scheduled autonomous video publishing
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1B231B] block mb-1">
              Account Handle
            </label>
            <input
              type="text"
              required
              placeholder={platform === "tiktok" ? "@yourbrand_official" : "@yourbrand"}
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3824]/20 focus:border-[#1F3824] text-xs text-[#1B231B]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1B231B] block mb-1">
              Channel Nickname (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Main Brand Channel or US Satellite #1"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-[#FAF8F5]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3824]/20 focus:border-[#1F3824] text-xs text-[#1B231B]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="burnerCheck"
              checked={isBurner}
              onChange={(e) => setIsBurner(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5C4] accent-[#1F3824]"
            />
            <label htmlFor="burnerCheck" className="text-xs text-[#52525B] cursor-pointer">
              Mark as Burner / Satellite Account (Used for anti-shadowban creative rotation)
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#CBD5C4]/50">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#CBD5C4] text-xs font-semibold text-[#4A544A] hover:bg-[#ECEFE7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? "Connecting..." : "Save Account"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.12V9.32a6.34 6.34 0 0 0-.84-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.6a8.28 8.28 0 0 0 4.85 1.57V7.72a4.85 4.85 0 0 1-1.08-1.03z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

