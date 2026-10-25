"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  CheckCircle2,
  Hash,
  AlertCircle,
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
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold">Scheduled for Automated Publishing!</h4>
          <p className="text-xs text-[var(--text-muted)] max-w-sm">
            AutoUGC background queue will render your high-res 1080x1920 MP4 and dispatch to{" "}
            {selectedPlatforms.map((p) => p.toUpperCase()).join(", ")} at the exact scheduled time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 py-2">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Platform Multi-Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Target Channels
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: "tiktok", label: "TikTok", icon: "🎵" },
                  { id: "instagram", label: "Instagram Reels", icon: "📸" },
                  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
                ] as const
              ).map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-[var(--accent-primary)] bg-[var(--accent-glow)] text-[var(--text-primary)]"
                        : "border-subtle bg-[var(--bg-app)]/50 text-[var(--text-muted)] hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-xs font-medium">{p.label}</span>
                    </div>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Date & Time Picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Publish Date & Time
              </label>
              <span className="text-[11px] text-[var(--accent-primary)] font-mono">
                Auto-timezone adjusted
              </span>
            </div>

            <div className="relative">
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full bg-[var(--bg-app)] border border-subtle rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>

            {/* Quick Timing Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">Quick presets:</span>
              <button
                type="button"
                onClick={() => handleQuickTimePreset(2)}
                className="text-[11px] px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-subtle hover:border-zinc-700 text-[var(--text-secondary)]"
              >
                In 2 hours
              </button>
              <button
                type="button"
                onClick={() => handleQuickTimePreset(12)}
                className="text-[11px] px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-subtle hover:border-zinc-700 text-[var(--text-secondary)]"
              >
                Tonight (Peak UGC)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTimePreset(24)}
                className="text-[11px] px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-subtle hover:border-zinc-700 text-[var(--text-secondary)]"
              >
                Tomorrow 10 AM
              </button>
            </div>
          </div>

          {/* Caption Editor & Hashtags */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Social Caption & Viral Hashtags
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {caption.length} / 2200 chars
              </span>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full bg-[var(--bg-app)] border border-subtle rounded-lg p-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              placeholder="Write high-retention caption with call to action..."
            />

            {/* Recommended Hashtags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                <Hash className="h-3 w-3" /> Insert:
              </span>
              {defaultHashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addHashtag(tag)}
                  className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-subtle hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-subtle">
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
