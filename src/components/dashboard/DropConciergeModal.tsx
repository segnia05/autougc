"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Flame,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export interface DropPackageData {
  postId?: string;
  videoId?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  brandName: string;
  hookAngle: string;
  hookHeadline: string;
  caption: string;
  hashtags: string[];
  optimalPostingTime?: string;
  targetPlatform?: "tiktok" | "instagram" | "youtube";
  channelHandle?: string;
}

interface DropConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dropData: DropPackageData | null;
  onMarkPublished?: (postId: string) => void;
}

export default function DropConciergeModal({
  isOpen,
  onClose,
  dropData,
  onMarkPublished,
}: DropConciergeModalProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMarkingPublished, setIsMarkingPublished] = useState(false);
  const [isPublishedDone, setIsPublishedDone] = useState(false);

  if (!isOpen || !dropData) return null;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const fullHashtagsString = dropData.hashtags
    .map((h) => (h.startsWith("#") ? h : `#${h}`))
    .join(" ");

  const fullCaptionAndTags = `${dropData.caption}\n\n${fullHashtagsString}`;

  // 1-Click "Copy Caption"
  const handleCopyCaptionOnly = () => {
    navigator.clipboard.writeText(dropData.caption);
    setCopiedCaption(true);
    showToast("Caption copied to clipboard!");
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // 1-Click "Copy Hashtags"
  const handleCopyHashtagsOnly = () => {
    navigator.clipboard.writeText(fullHashtagsString);
    setCopiedHashtags(true);
    showToast("Viral hashtags copied to clipboard!");
    setTimeout(() => setCopiedHashtags(false), 2500);
  };

  // 1-Click "Download 1080p MP4"
  const handleDownloadMp4 = () => {
    const videoUrl = dropData.videoUrl || "/videos/creator-sarah.mp4";
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${dropData.brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_1080p_ad.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading 1080p MP4 directly to your device...");
  };

  // "Mark as Published" button: Updates DB status & logs into /analytics
  const handleMarkAsPosted = async () => {
    const targetPostId = dropData.postId || dropData.videoId;
    if (!targetPostId) return;
    setIsMarkingPublished(true);
    try {
      const res = await fetch("/api/v1/campaigns/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledPostId: targetPostId,
          action: "mark_published",
        }),
      });

      if (res.ok) {
        setIsPublishedDone(true);
        showToast("✓ Marked as Published! Logged into /analytics");
        if (onMarkPublished) {
          onMarkPublished(targetPostId);
        }
      }
    } catch (err) {
      console.warn("Failed marking post as published", err);
    } finally {
      setIsMarkingPublished(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-[#18181B] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-3 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative w-full max-w-3xl bg-white border border-[#E5E0D8] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Drop Concierge"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 md:bg-[#FAF8F5] text-[#18181B] hover:bg-[#EFECE6] transition-colors border border-[#E5E0D8] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: 9:16 Vertical Video Player with Controls */}
        <div className="w-full md:w-5/12 bg-[#18181B] p-6 flex flex-col items-center justify-between text-white shrink-0">
          <div className="w-full text-center mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
              {dropData.hookAngle || "Creator Video Ad"}
            </span>
            <div className="text-xs font-semibold text-white truncate mt-0.5">
              {dropData.brandName}
            </div>
          </div>

          {/* 9:16 Vertical Video Player */}
          <div className="relative aspect-[9/16] w-full max-w-[210px] rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
            <video
              src={dropData.videoUrl || "/videos/creator-sarah.mp4"}
              poster={dropData.thumbnailUrl || "/images/creator-sarah.jpg"}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Buttons: 1-Click "Download 1080p MP4" */}
          <div className="w-full mt-4 space-y-2">
            <button
              type="button"
              onClick={handleDownloadMp4}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2B] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 1080p MP4</span>
            </button>

            {dropData.videoId && (
              <Link
                href={`/studio?videoId=${dropData.videoId}`}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4D4D8] hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <Edit2 className="w-3 h-3" />
                <span>Customize in Studio Canvas</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Drop Concierge Details, Optimal Time Badge & Viral Copy Box */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto bg-[#FAF8F5]">
          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF2ED] text-[#D95D39] border border-[#FCD4C7] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D95D39]" />
                Drop Concierge Package
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
              Ready to Post on Socials
            </h2>
            <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
              Download your 1080p vertical video, copy the pre-written caption & hashtags, and drop directly onto your TikTok or Instagram channels.
            </p>

            {/* Optimal Posting Time Badge: Calculated by our distribution engine for peak algorithm reach */}
            <div className="mt-4 p-4 bg-white border border-[#E5E0D8] rounded-xl flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF2ED] flex items-center justify-center text-[#D95D39]">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                      Optimal Posting Time
                    </span>
                    <span className="text-xs font-bold text-[#18181B]">
                      {dropData.optimalPostingTime || "Today at 4:15 PM EST"}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                  <Flame className="w-3 h-3 text-emerald-600" />
                  Peak Reach
                </span>
              </div>

              <div className="pt-2 border-t border-[#EFECE6] text-[11px] text-[#52525B] leading-tight">
                Calculated by our distribution engine for peak algorithm reach.
              </div>
            </div>

            {/* Target Channel Info (if present) */}
            {dropData.channelHandle && (
              <div className="mt-2.5 px-3.5 py-2 bg-white border border-[#E5E0D8] rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#52525B]">Target Social Channel:</span>
                <span className="font-semibold text-[#18181B] capitalize">
                  {dropData.targetPlatform || "tiktok"} · <strong className="text-[#D95D39]">{dropData.channelHandle}</strong>
                </span>
              </div>
            )}

            {/* Caption & Hashtags Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#18181B]">
                  Pre-Written Caption &amp; Viral Hashtags
                </span>
                
                {/* 1-Click "Copy Caption" Button */}
                <button
                  type="button"
                  onClick={handleCopyCaptionOnly}
                  className="text-xs font-semibold text-[#D95D39] hover:text-[#C24E2B] flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#E5E0D8] hover:bg-[#FFF2ED] transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Caption Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Caption</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                rows={4}
                value={fullCaptionAndTags}
                className="w-full p-3 rounded-xl border border-[#E5E0D8] bg-white text-xs text-[#18181B] font-sans leading-relaxed resize-none focus:outline-none shadow-2xs"
              />
            </div>

            {/* 1-Click "Copy Hashtags" Button & Pills */}
            <div className="mt-3 p-3 bg-white border border-[#E5E0D8] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#71717A] font-mono uppercase">
                  Viral Hashtags
                </span>

                {/* 1-Click "Copy Hashtags" */}
                <button
                  type="button"
                  onClick={handleCopyHashtagsOnly}
                  className="text-xs font-semibold text-[#D95D39] hover:text-[#C24E2B] flex items-center gap-1 cursor-pointer"
                >
                  {copiedHashtags ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Hashtags Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Hashtags</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                {dropData.hashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const cleanTag = tag.startsWith("#") ? tag : `#${tag}`;
                      navigator.clipboard.writeText(cleanTag);
                      showToast(`Copied ${cleanTag}`);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-[#18181B] font-medium hover:border-[#D95D39] transition-colors cursor-pointer"
                    title="Click to copy single hashtag"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls: Links & "Mark as Published" button */}
          <div className="mt-6 pt-4 border-t border-[#E5E0D8] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#71717A] hover:text-[#18181B] font-medium flex items-center gap-1"
              >
                <span>TikTok</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#71717A] hover:text-[#18181B] font-medium flex items-center gap-1"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              {isPublishedDone ? (
                <Link
                  href="/analytics"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-emerald-100 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View in Analytics</span>
                </Link>
              ) : (dropData.postId || dropData.videoId) ? (
                <button
                  type="button"
                  disabled={isMarkingPublished}
                  onClick={handleMarkAsPosted}
                  className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isMarkingPublished ? "Updating..." : "Mark as Published"}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
