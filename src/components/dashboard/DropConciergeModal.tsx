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
  const [isMarkingPublished, setIsMarkingPublished] = useState(false);
  const [isPublishedDone, setIsPublishedDone] = useState(false);

  if (!isOpen || !dropData) return null;

  const fullHashtagsString = dropData.hashtags
    .map((h) => (h.startsWith("#") ? h : `#${h}`))
    .join(" ");

  const fullCaption = `${dropData.caption}\n\n${fullHashtagsString}`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(fullHashtagsString);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2500);
  };

  const handleMarkAsPosted = async () => {
    if (!dropData.postId) return;
    setIsMarkingPublished(true);
    try {
      const res = await fetch("/api/v1/campaigns/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledPostId: dropData.postId,
          action: "mark_published",
        }),
      });

      if (res.ok) {
        setIsPublishedDone(true);
        if (onMarkPublished) {
          onMarkPublished(dropData.postId);
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
      <div className="relative w-full max-w-3xl bg-white border border-[#E5E0D8] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/80 md:bg-[#FAF8F5] text-[#18181B] hover:bg-[#EFECE6] transition-colors border border-[#E5E0D8]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: 9:16 Video Preview & Download */}
        <div className="w-full md:w-5/12 bg-[#18181B] p-6 flex flex-col items-center justify-between text-white">
          <div className="w-full text-center mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
              {dropData.hookAngle || "Creator Video Ad"}
            </span>
            <div className="text-xs font-semibold text-white truncate mt-0.5">
              {dropData.brandName}
            </div>
          </div>

          {/* 9:16 Player */}
          <div className="relative aspect-[9/16] w-full max-w-[210px] rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
            <video
              src={dropData.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-4 space-y-2">
            <a
              href={dropData.videoUrl}
              download={`${dropData.brandName.toLowerCase()}_ad.mp4`}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D95D39] hover:bg-[#C24E2B] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4 (1080x1920)</span>
            </a>

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

        {/* Right Column: Drop Concierge Details & Viral Copy Box */}
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
              Download your vertical video, copy the pre-written viral caption & hashtags, and post directly to TikTok or Reels.
            </p>

            {/* Optimal Drop Time Card */}
            <div className="mt-4 p-3.5 bg-white border border-[#E5E0D8] rounded-xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF2ED] flex items-center justify-center text-[#D95D39]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#71717A] uppercase">
                    Recommended Post Time
                  </div>
                  <div className="text-xs font-bold text-[#18181B]">
                    {dropData.optimalPostingTime || "Today at 4:15 PM EST (Peak Reach)"}
                  </div>
                </div>
              </div>

              {dropData.channelHandle && (
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#71717A] uppercase">
                    Target Channel
                  </div>
                  <div className="text-xs font-semibold text-[#D95D39]">
                    {dropData.channelHandle}
                  </div>
                </div>
              )}
            </div>

            {/* Caption & Hashtags Box */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#18181B]">
                  Pre-Written Caption & Viral Hashtags
                </span>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="text-xs font-semibold text-[#D95D39] hover:text-[#C24E2B] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#FFF2ED] transition-colors"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#D95D39]" />
                      <span>Copied!</span>
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
                value={fullCaption}
                className="w-full p-3 rounded-xl border border-[#E5E0D8] bg-white text-xs text-[#18181B] font-mono resize-none focus:outline-none shadow-2xs"
              />
            </div>

            {/* Hashtag Quick Strip */}
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-[#71717A] font-mono mr-1">Hashtags:</span>
              {dropData.hashtags.slice(0, 5).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E5E0D8] text-[#18181B] font-medium"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
              <button
                type="button"
                onClick={handleCopyHashtags}
                className="text-[10px] text-[#D95D39] hover:underline font-semibold ml-auto"
              >
                {copiedHashtags ? "Copied!" : "Copy Hashtags Only"}
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
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

            {dropData.postId && (
              <button
                type="button"
                disabled={isMarkingPublished || isPublishedDone}
                onClick={handleMarkAsPosted}
                className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isPublishedDone ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Posted Live!</span>
                  </>
                ) : (
                  <>
                    <span>Mark as Posted</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

