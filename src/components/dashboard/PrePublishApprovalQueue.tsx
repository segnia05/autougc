"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { ScheduledCalendarPost } from "./InteractiveMonthlyCalendar";

interface PrePublishApprovalQueueProps {
  posts: ScheduledCalendarPost[];
  onRefresh: () => void;
  onOpenDropPackage?: (post: ScheduledCalendarPost) => void;
}

export default function PrePublishApprovalQueue({
  posts,
  onRefresh,
  onOpenDropPackage,
}: PrePublishApprovalQueueProps) {
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Filter posts requiring pre-publish approval
  const awaitingPosts = posts.filter(
    (p) =>
      p.approvalStatus === "awaiting_approval" ||
      (p.requireApproval && p.publishStatus === "pending" && p.approvalStatus !== "approved")
  );

  if (awaitingPosts.length === 0) return null;

  const handleApprove = async (postId: string) => {
    setApprovingId(postId);
    try {
      const res = await fetch("/api/v1/campaigns/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledPostId: postId,
          action: "approve",
        }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.warn("Failed approving post", err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="bg-[#FDF3EF]/60 border border-[#F3CEBE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F3CEBE]/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D95D39] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#18181B]">
                {awaitingPosts.length} Post{awaitingPosts.length > 1 ? "s" : ""} Awaiting Pre-Publish Review
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#D95D39] text-white text-[9px] font-bold uppercase tracking-wider shadow-2xs">
                1-Hour Gate Active
              </span>
            </div>
            <p className="text-[11px] text-[#52525B]">
              Posts scheduled within the next hour appear here for 1-click review. Approve directly or download the Drop Package.
            </p>
          </div>
        </div>
      </div>

      {/* Awaiting Posts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awaitingPosts.map((post) => {
          const isApproving = approvingId === post.id;
          return (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                {/* Thumbnail */}
                <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-[#E5E0D8]">
                  <Image
                    src={post.video?.thumbnailUrl || "/images/creator-sarah.jpg"}
                    alt="Pending Video Ad"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#18181B] capitalize truncate">
                      {post.socialAccount.platform} · {post.socialAccount.accountHandle}
                    </span>
                    <span className="text-[#D95D39] font-bold shrink-0 ml-2">
                      {post.localScheduledTime || "In 45 mins"}
                    </span>
                  </div>

                  <p className="text-xs text-[#18181B] font-medium line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-[#8E8B85]">
                    <span>Voice: {post.video?.voiceId || "Sarah"}</span>
                    <span>•</span>
                    <span>Hook: {post.hookAngle?.replace("_", " ") || "Pattern Interrupt"}</span>
                  </div>
                </div>
              </div>

              {/* Actions: Get Drop Package, Edit in Studio, or 1-Click Approve */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#EFECE6]">
                {onOpenDropPackage && (
                  <button
                    type="button"
                    onClick={() => onOpenDropPackage(post)}
                    className="btn-fastlane-white text-xs px-3 py-1.5 h-8 flex items-center gap-1.5 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Drop Package</span>
                  </button>
                )}

                <Link
                  href={`/studio?scheduledPostId=${post.id}`}
                  className="btn-fastlane-white text-xs px-3 py-1.5 h-8 flex items-center gap-1.5 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Edit in Studio</span>
                </Link>

                <button
                  type="button"
                  disabled={isApproving}
                  onClick={() => handleApprove(post.id)}
                  className="btn-fastlane-black text-xs px-4 py-1.5 h-8 flex items-center gap-1.5 font-semibold shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isApproving ? "Approving..." : "Approve Now"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}