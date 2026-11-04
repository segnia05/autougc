"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Clock,
  Play,
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
    (p) => p.approvalStatus === "awaiting_approval" || (p.requireApproval && p.publishStatus === "pending" && p.approvalStatus !== "approved")
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
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/60 to-white border border-amber-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs animate-bounce">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-amber-950 font-[family-name:var(--font-serif)]">
                {awaitingPosts.length} Post{awaitingPosts.length > 1 ? "s" : ""} Awaiting Pre-Publish Approval
              </h2>
              <Badge variant="amber" size="sm" pulse>
                1-Hour Gate Active
              </Badge>
            </div>
            <p className="text-[11px] text-amber-900/80">
              We also sent an approval email with a 1-click token to your inbox. You can approve here or edit before launch.
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
              className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                {/* Thumbnail */}
                <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-[#CBD5C4]">
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
                    <span className="font-bold text-[#1B231B] capitalize">
                      {post.socialAccount.platform} · {post.socialAccount.accountHandle}
                    </span>
                    <span className="text-[#717E6C] font-semibold">
                      {post.localScheduledTime || "4:00 PM EST"}
                    </span>
                  </div>

                  <p className="text-xs text-[#2E382D] font-medium line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-[#717E6C]">
                    <span>Voice: {post.video?.voiceId || "Sarah"}</span>
                    <span>•</span>
                    <span>Hook: {post.hookAngle?.replace("_", " ") || "Pattern Interrupt"}</span>
                  </div>
                </div>
              </div>

              {/* Actions: Get Drop Package, Edit in Studio, or 1-Click Approve */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#CBD5C4]/40">
                {onOpenDropPackage && (
                  <button
                    type="button"
                    onClick={() => onOpenDropPackage(post)}
                    className="px-3 py-1.5 rounded-xl border border-[#CBD5C4] hover:bg-[#E2E9DC] bg-[#FAF8F5] text-xs font-semibold text-[#1F3824] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1F3824]" />
                    <span>Drop Package</span>
                  </button>
                )}

                <Link
                  href={`/studio?scheduledPostId=${post.id}`}
                  className="px-3 py-1.5 rounded-xl border border-[#CBD5C4] hover:border-[#1F3824] bg-white text-xs font-semibold text-[#1B231B] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1F3824]" />
                  <span>Studio</span>
                </Link>

                <button
                  type="button"
                  disabled={isApproving}
                  onClick={() => handleApprove(post.id)}
                  className="px-4 py-1.5 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
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

