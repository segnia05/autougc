"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  CheckCircle2,
  Hash,
  AlertCircle,
  Music2,
  Camera,
  Play,
} from "lucide-react";
import { SocialPlatform } from "@/lib/social/oauth";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCaption: string;
  defaultHashtags?: string[];
  videoId?: string;
}

export function ScheduleModal({
  isOpen,
  onClose,
  defaultCaption,
  defaultHashtags = ["#ugc", "#viral", "#marketing", "#saas"],
  videoId = "video_demo_1080p",
}: ScheduleModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    "tiktok",
    "instagram",
  ]);
  const [caption, setCaption] = useState(defaultCaption);
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    // Default to tomorrow 10:00 AM
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleQuickTimePreset = (hoursFromNow: number) => {
    const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    setScheduledDateTime(d.toISOString().slice(0, 16));
  };

  const addHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => `${prev.trim()} ${tag}`);
    }
  };

  const handleScheduleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/social/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          platforms: selectedPlatforms,
          scheduledFor: new Date(scheduledDateTime).toISOString(),
          caption,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to schedule post");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Schedule failed";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) {
          setIsSuccess(false);
          setErrorMessage(null);
          onClose();
        }
      }}
      title="Automated Multi-Platform Scheduler"
      description="Distribute your 9:16 vertical ad across TikTok, Instagram Reels, and YouTube Shorts simultaneously."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center border border-[#CBD5C4]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-[#1B231B]">Scheduled for Automated Publishing!</h4>
          <p className="text-xs text-[#4A544A] max-w-sm">
            AutoUGC background queue will render your high-res 1080x1920 MP4 and dispatch to{" "}
            {selectedPlatforms.map((p) => p.toUpperCase()).join(", ")} at the exact scheduled time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 py-2">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Platform Multi-Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1B231B]">
              Target Channels
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: "tiktok", label: "TikTok", icon: Music2 },
                  { id: "instagram", label: "Instagram Reels", icon: Camera },
                  { id: "youtube", label: "YouTube Shorts", icon: Play },
                ] as const
              ).map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1F3824] bg-[#E2E9DC] text-[#1F3824] font-semibold"
                        : "border-[#CBD5C4]/70 bg-[#F6F7F2] text-[#4A544A] hover:border-[#1F3824]/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-[#1F3824]" />
                      <span className="text-xs">{p.label}</span>
                    </div>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[#1F3824]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Date & Time Picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1B231B]">
                Publish Date & Time
              </label>
              <span className="text-[11px] text-[#1F3824] font-mono font-medium">
                Auto-timezone adjusted
              </span>
            </div>

            <div className="relative">
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full bg-[#F6F7F2] border border-[#CBD5C4] rounded-2xl px-3 py-2 text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824] transition-colors"
              />
            </div>

            {/* Quick Timing Presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-[#717E6C]">Quick presets:</span>
              <button
                type="button"
                onClick={() => handleQuickTimePreset(2)}
                className="text-[11px] px-3 py-1 rounded-full bg-[#ECEFE7] border border-[#CBD5C4] hover:bg-white text-[#1B231B] transition-colors cursor-pointer"
              >
                In 2 hours
              </button>
              <button
                type="button"
                onClick={() => handleQuickTimePreset(12)}
                className="text-[11px] px-3 py-1 rounded-full bg-[#ECEFE7] border border-[#CBD5C4] hover:bg-white text-[#1B231B] transition-colors cursor-pointer"
              >
                Tonight (Peak UGC)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTimePreset(24)}
                className="text-[11px] px-3 py-1 rounded-full bg-[#ECEFE7] border border-[#CBD5C4] hover:bg-white text-[#1B231B] transition-colors cursor-pointer"
              >
                Tomorrow 10 AM
              </button>
            </div>
          </div>

          {/* Caption Editor & Hashtags */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1B231B]">
                Social Caption & Viral Hashtags
              </label>
              <span className="text-[11px] font-mono text-[#717E6C]">
                {caption.length} / 2200 chars
              </span>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full bg-[#F6F7F2] border border-[#CBD5C4] rounded-2xl p-3 text-xs text-[#1B231B] placeholder-[#717E6C] focus:outline-none focus:border-[#1F3824] resize-none"
              placeholder="Write high-retention caption with call to action..."
            />

            {/* Recommended Hashtags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-[#717E6C] flex items-center gap-1">
                <Hash className="h-3 w-3" /> Insert:
              </span>
              {defaultHashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addHashtag(tag)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#ECEFE7] border border-[#CBD5C4] hover:border-[#1F3824] text-[#1F3824] hover:bg-[#E2E9DC] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#CBD5C4]/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleScheduleSubmit}
              isLoading={isSubmitting}
              leftIcon={<Calendar className="h-4 w-4" />}
            >
              Queue & Schedule Ad
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
