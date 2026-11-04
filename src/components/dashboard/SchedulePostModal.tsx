"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Share2,
  AlertCircle,
  CheckCircle2,
  Plus,
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
      title: "Problem Agitation Hook",
      creator: "Sarah Miller (UGC)",
      duration: "0:28",
      thumbnailUrl: "/images/creator-sarah.jpg",
    },
    {
      id: "vid_ugc_showcase_2",
      title: "Direct Confession Angle",
      creator: "Alex Rivera (DTC)",
      duration: "0:32",
      thumbnailUrl: "/images/creator-male.jpg",
    },
    {
      id: "vid_ugc_showcase_3",
      title: "Product UI Showcase",
      creator: "Emma Watson (Tech)",
      duration: "0:24",
      thumbnailUrl: "/images/creator-glasses.jpg",
    },
  ];

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accounts.length === 0) {
      setErrorMsg("Please connect at least one TikTok or Instagram account first.");
      return;
    }

    const accountToUse =
      accounts.find((a) => a.id === selectedAccountId) || accounts[0];
    if (!accountToUse) {
      setErrorMsg("Please select a target channel.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const scheduledIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

      const res = await fetch("/api/v1/social/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialAccountId: accountToUse.id,
          videoId: selectedVideoId,
          caption: caption.trim(),
          scheduledFor: scheduledIso,
          localScheduledTime: `${scheduledTime} (Peak Reach)`,
          requireApproval,
          hookAngle,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.upgradeRequired) {
          onClose();
          onTriggerUpgrade(data.error);
          return;
        }
        setErrorMsg(data.error || "Failed scheduling post.");
        return;
      }

      onClose();
      onScheduled();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Autopilot UGC Video Drop"
      maxWidth="lg"
    >
      <form onSubmit={handleScheduleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Target Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B] flex items-center justify-between">
            <span>Destination Channel</span>
            {accounts.length > 0 && (
              <span className="text-[11px] font-normal text-[#8E8B85]">
                {accounts.length} connected
              </span>
            )}
          </label>

          {accounts.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-[#E5E0D8] bg-[#FAF8F5] text-center space-y-2">
              <Share2 className="w-5 h-5 text-[#8E8B85] mx-auto" />
              <p className="text-xs text-[#18181B] font-medium">
                No social channels connected yet
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConnectAccountClick();
                }}
                className="btn-fastlane-black text-xs px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Connect TikTok / Instagram</span>
              </button>
            </div>
          ) : (
            <select
              value={selectedAccountId || accounts[0]?.id}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 text-xs font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] cursor-pointer"
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
              className="text-[11px] text-[#D95D39] hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3 text-[#D95D39]" />
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
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#D95D39] bg-[#FDF3EF] ring-2 ring-[#D95D39]/20 shadow-2xs"
                      : "border-[#E5E0D8] bg-white hover:border-[#D95D39]/50"
                  }`}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2 border border-[#E5E0D8]">
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
                  <div className="text-[10px] text-[#8E8B85] truncate">
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
              <CalendarIcon className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Publish Date</span>
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Optimal Time</span>
            </label>
            <input
              type="time"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
            />
          </div>
        </div>

        {/* 4. Hook Angle Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18181B] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Tested Viral Hook Angle</span>
          </label>
          <select
            value={hookAngle}
            onChange={(e) => setHookAngle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white text-xs font-medium text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] cursor-pointer"
          >
            <option value="Problem-Agitation-Solution">Problem-Agitation-Solution (High Conversions)</option>
            <option value="Direct Callout">Direct Callout (&ldquo;Stop doing this manually in 2026&rdquo;)</option>
            <option value="Relatable Confession">Relatable Confession (&ldquo;The one tool that saved my workflow&rdquo;)</option>
            <option value="Curiosity Gap">Curiosity Gap (&ldquo;Why 90% of founders fail at short-form&rdquo;)</option>
          </select>
        </div>

        {/* 5. Caption Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#18181B]">
              Caption &amp; Hashtags
            </label>
            <span className="text-[10px] text-[#8E8B85]">
              {caption.length} / 2200
            </span>
          </div>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]/60 focus:bg-white text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] resize-none font-medium leading-relaxed"
            placeholder="Write your viral caption..."
          />
        </div>

        {/* 6. Pre-Publish Approval Gate */}
        <div className="p-3.5 rounded-xl bg-[#FDF3EF] border border-[#F3CEBE] flex items-start gap-3">
          <input
            type="checkbox"
            id="requireApprovalCheck"
            checked={requireApproval}
            onChange={(e) => setRequireApproval(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#F3CEBE] accent-[#D95D39] cursor-pointer"
          />
          <label
            htmlFor="requireApprovalCheck"
            className="text-xs text-[#18181B] leading-relaxed cursor-pointer"
          >
            <span className="font-bold">Require 1-hour pre-publish email approval</span>
            <span className="block text-[11px] text-[#52525B] mt-0.5">
              AutoUGC will email you a 1-click approval button 1 hour before publishing. You can approve or make edits right on your phone or in Studio.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE6]">
          <button
            type="button"
            onClick={onClose}
            className="btn-fastlane-white text-xs px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-fastlane-black text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <CalendarIcon className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Confirm &amp; Schedule</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}