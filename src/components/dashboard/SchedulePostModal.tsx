"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Share2,
  AlertCircle,
  CheckCircle2,
  Film,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { ConnectedSocialAccount } from "./ConnectedAccountsSection";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: ConnectedSocialAccount[];
  brandName: string;
  onScheduled: () => void;
  onTriggerUpgrade: (reason: string) => void;
  onConnectAccountClick: () => void;
}

export default function SchedulePostModal({
  isOpen,
  onClose,
  accounts,
  brandName,
  onScheduled,
  onTriggerUpgrade,
  onConnectAccountClick,
}: SchedulePostModalProps) {
  // Tomorrow's date string YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id || ""
  );
  const [scheduledDate, setScheduledDate] = useState(defaultDateStr);
  const [scheduledTime, setScheduledTime] = useState("18:30");
  const [hookAngle, setHookAngle] = useState("Problem-Agitation-Solution");
  const [selectedVideoId, setSelectedVideoId] = useState("vid_ugc_showcase_1");
  const [caption, setCaption] = useState(
    `Why didn't anyone tell me about ${brandName} sooner?! If you write with AI, this is an absolute lifesaver. Link in bio! 🚀 #UGC #Productivity #AI #${brandName.replace(/\s+/g, "")}`
  );
  const [requireApproval, setRequireApproval] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available creative templates
  const videoCreatives = [
    {
      id: "vid_ugc_showcase_1",
      title: "Hook: Problem-Agitation-Solution",
      creator: "Sarah (Handheld Selfie)",
      duration: "0:22",
      thumbnailUrl: "/images/creator-sarah.jpg",
    },
    {
      id: "vid_ugc_showcase_2",
      title: "Hook: Competitor Comparison / Tear-Down",
      creator: "Alex (DTC Casual)",
      duration: "0:28",
      thumbnailUrl: "/images/creator-alex.jpg",
    },
    {
      id: "vid_ugc_showcase_3",
      title: "Hook: 30-Day Honest Founder Proof",
      creator: "Sarah (Studio Review)",
      duration: "0:19",
      thumbnailUrl: "/images/creator-sarah.jpg",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setErrorMsg("Please enter a post caption.");
      return;
    }

    // Determine platform
    const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
    const platform = selectedAccount?.platform || "tiktok";

    // Combine date and time
    const dateTimeIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/social/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: selectedVideoId,
          platforms: [platform],
          scheduledFor: dateTimeIso,
          caption: caption.trim(),
          hookAngle,
          requireApproval,
          socialAccountId: selectedAccount?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to schedule post.");
        return;
      }

      onScheduled();
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to schedule post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule UGC Video Ad">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Target Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
            <span>Target Social Channel</span>
            {accounts.length > 0 && (
              <span className="text-[11px] font-normal text-[#717E6C]">
                {accounts.length} connected
              </span>
            )}
          </label>

          {accounts.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-[#CBD5C4] bg-[#F6F7F2] text-center space-y-2">
              <Share2 className="w-5 h-5 text-[#717E6C] mx-auto" />
              <p className="text-xs text-[#2E382D] font-medium">
                No social channels connected yet
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConnectAccountClick();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F3824] text-white text-xs font-semibold hover:bg-[#162B1B]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect TikTok / Instagram</span>
              </button>
            </div>
          ) : (
            <select
              value={selectedAccountId || accounts[0]?.id}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5C4] bg-white text-xs font-medium text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1F3824]/20 focus:border-[#1F3824]"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.platform.toUpperCase()}: {acc.accountHandle}{" "}
                  {acc.accountNickname ? `(${acc.accountNickname})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 2. Choose Video Creative */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#18181B]">
              Select AI UGC Ad Creative
            </label>
            <Link
              href="/studio"
              className="text-[11px] text-[#1F3824] hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Or edit in Studio</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {videoCreatives.map((vid) => {
              const isSelected = selectedVideoId === vid.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => setSelectedVideoId(vid.id)}
                  className={`text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? "border-[#1F3824] bg-[#E8F0E6] ring-1 ring-[#1F3824]"
                      : "border-[#CBD5C4] bg-white hover:border-[#1F3824]/50"
                  }`}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2 border border-[#CBD5C4]/60">
                    <Image
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white">
                      {vid.duration}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-[#18181B] truncate">
                    {vid.title}
                  </div>
                  <div className="text-[10px] text-[#717E6C] truncate">
                    {vid.creator}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Date & Time Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#1F3824]" />
              <span>Publish Date</span>
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5C4] bg-white text-xs font-medium text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1F3824]/20 focus:border-[#1F3824]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1F3824]" />
              <span>Publish Time (Peak Slot)</span>
            </label>
            <select
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5C4] bg-white text-xs font-medium text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1F3824]/20 focus:border-[#1F3824]"
            >
              <option value="09:00">09:00 AM (Morning Catch)</option>
              <option value="12:30">12:30 PM (Lunch Break Peak)</option>
              <option value="18:30">06:30 PM (Evening Viral Window)</option>
              <option value="20:30">08:30 PM (Nighttime Discovery)</option>
            </select>
          </div>
        </div>

        {/* 4. Hook Angle Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B]">
            Hook Narrative Angle
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Problem-Agitation-Solution",
              "Competitor Comparison",
              "Behind The Scenes Proof",
              "Feature Showcase",
            ].map((angle) => (
              <button
                key={angle}
                type="button"
                onClick={() => setHookAngle(angle)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  hookAngle === angle
                    ? "bg-[#1F3824] text-white border-[#1F3824]"
                    : "bg-white text-[#4A544A] border-[#CBD5C4] hover:border-[#1F3824]"
                }`}
              >
                {angle}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Caption Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#18181B]">
              Caption & Hashtags
            </label>
            <span className="text-[10px] text-[#717E6C]">
              {caption.length} / 2200
            </span>
          </div>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1F3824]/20 focus:border-[#1F3824] resize-none"
            placeholder="Write your viral caption..."
          />
        </div>

        {/* 6. Pre-Publish Approval Gate */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-300 flex items-start gap-3">
          <input
            type="checkbox"
            id="requireApprovalCheck"
            checked={requireApproval}
            onChange={(e) => setRequireApproval(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-amber-400 text-[#1F3824] focus:ring-[#1F3824]"
          />
          <label
            htmlFor="requireApprovalCheck"
            className="text-xs text-amber-950 leading-relaxed cursor-pointer"
          >
            <span className="font-bold">Require 1-hour pre-publish email approval</span>
            <span className="block text-[11px] text-amber-900/80 mt-0.5">
              AutoUGC will email you a 1-click approval button 1 hour before publishing. You can approve or make edits right on your phone or in Studio.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBD5C4]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBD5C4] text-xs font-semibold text-[#4A544A] hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Confirm & Schedule</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

