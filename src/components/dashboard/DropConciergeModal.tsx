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
      <div className="relative w-full max-w-3xl bg-white border border-[#CBD5C4] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/80 md:bg-[#FAF8F5] text-[#1B231B] hover:bg-[#EFECE6] transition-colors border border-[#CBD5C4]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: 9:16 Video Preview & Download */}
        <div className="w-full md:w-5/12 bg-[#1B231B] p-6 flex flex-col items-center justify-between text-white">
          <div className="w-full text-center mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#CBD5C4]">
              {dropData.hookAngle || "Creator Video Ad"}
            </span>
            <div className="text-xs font-semibold text-white truncate mt-0.5">
              {dropData.brandName}
            </div>
          </div>

          {/* 9:16 Player */}
          <div className="relative aspect-[9/16] w-full max-w-[210px] rounded-xl overflow-hidden border-2 border-[#1F3824] shadow-2xl bg-black">
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
              className="w-full py-2.5 px-4 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4 (1080x1920)</span>
            </a>

            {dropData.videoId && (
              <Link
                href={`/studio?videoId=${dropData.videoId}`}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#CBD5C4] hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10"
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#1F3824]" />
                Drop Concierge Package
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#1B231B] tracking-tight">
              Ready to Post on Socials
            </h2>
            <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
              Download your vertical video, copy the pre-written viral caption & hashtags, and post directly to TikTok or Reels.
            </p>

            {/* Optimal Drop Time Card */}
            <div className="mt-4 p-3.5 bg-white border border-[#CBD5C4] rounded-xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E2E9DC] flex items-center justify-center text-[#1F3824]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#717E6C] uppercase">
                    Recommended Post Time
                  </div>
                  <div className="text-xs font-bold text-[#1B231B]">
                    {dropData.optimalPostingTime || "Today at 4:15 PM EST (Peak Reach)"}
                  </div>
                </div>
              </div>

              {dropData.channelHandle && (
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#717E6C] uppercase">
                    Target Channel
                  </div>
                  <div className="text-xs font-semibold text-[#1F3824]">
                    {dropData.channelHandle}
                  </div>
                </div>
              )}
            </div>

            {/* Caption & Hashtags Box */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#1B231B]">
                  Pre-Written Caption & Viral Hashtags
                </span>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="text-xs font-semibold text-[#1F3824] hover:text-[#162B1B] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#E2E9DC]/50 transition-colors"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1F3824]" />
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
                className="w-full p-3 rounded-xl border border-[#CBD5C4] bg-white text-xs text-[#1B231B] font-mono resize-none focus:outline-none shadow-2xs"
              />
            </div>

            {/* Hashtag Quick Strip */}
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-[#717E6C] font-mono mr-1">Hashtags:</span>
              {dropData.hashtags.slice(0, 5).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#CBD5C4] text-[#1F3824] font-medium"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
              <button
                type="button"
                onClick={handleCopyHashtags}
                className="text-[10px] text-[#1F3824] hover:underline font-semibold ml-auto"
              >
                {copiedHashtags ? "Copied!" : "Copy Hashtags Only"}
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-[#CBD5C4]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#717E6C] hover:text-[#1B231B] font-medium flex items-center gap-1"
              >
                <span>TikTok</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#717E6C] hover:text-[#1B231B] font-medium flex items-center gap-1"
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
                className="px-4 py-2 rounded-xl bg-[#1B231B] hover:bg-[#2C352C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
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

