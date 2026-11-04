"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Download,
} from "lucide-react";

export interface ScheduledCalendarPost {
  id: string;
  caption: string;
  scheduledFor: string;
  localScheduledTime?: string | null;
  publishStatus: "pending" | "processing" | "published" | "failed";
  requireApproval?: boolean;
  approvalStatus?: "none" | "awaiting_approval" | "approved" | "rejected" | "expired";
  hookAngle?: string | null;
  socialAccount: {
    id?: string;
    platform: "tiktok" | "instagram" | "youtube";
    accountHandle: string;
    accountNickname?: string | null;
  };
  video?: {
    id?: string;
    durationSeconds?: number;
    thumbnailUrl?: string | null;
    videoUrl?: string | null;
    voiceId?: string | null;
  };
}

interface InteractiveMonthlyCalendarProps {
  posts: ScheduledCalendarPost[];
  brandName: string;
  onRefreshPosts: () => void;
  onOpenScheduleModal: () => void;
}

export default function InteractiveMonthlyCalendar({
  posts,
  brandName,
  onRefreshPosts,
  onOpenScheduleModal,
}: InteractiveMonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledCalendarPost | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate days in current month & starting day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 1-Click Approval Action from Dashboard
  const handleApprovePost = async (postId: string) => {
    setIsApproving(true);
    setApprovalFeedback(null);
    try {
      const res = await fetch("/api/v1/campaigns/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledPostId: postId,
          action: "approve",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApprovalFeedback("Post approved successfully! It will publish on schedule.");
        onRefreshPosts();
        if (selectedPost) {
          setSelectedPost({
            ...selectedPost,
            approvalStatus: "approved",
          });
        }
      } else {
        setApprovalFeedback(data.error || "Approval failed.");
      }
    } catch {
      setApprovalFeedback("Network error approving post.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Remove this post from your schedule?")) return;
    try {
      await fetch(`/api/v1/social/schedule?id=${postId}`, { method: "DELETE" });
      setSelectedPost(null);
      onRefreshPosts();
    } catch (err) {
      console.warn("Failed removing post", err);
    }
  };

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Calendar Header & Month Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EFECE6]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#18181B] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <CalendarIcon className="h-5 w-5 text-[#D95D39]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#18181B]">
                {monthNames[month]} {year}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[10px] font-bold text-[#18181B] uppercase tracking-wider shadow-2xs">
                Real Cadence Calendar
              </span>
            </div>
            <p className="text-xs text-[#52525B]">
              Marked days indicate scheduled autopilot UGC video drops for {brandName}
            </p>
          </div>
        </div>

        {/* Month Navigation & Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded-lg text-[#52525B] hover:bg-white hover:text-[#18181B] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-[#18181B] hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-lg text-[#52525B] hover:bg-white hover:text-[#18181B] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenScheduleModal}
            className="btn-fastlane-black text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#8E8B85] uppercase tracking-wider py-1 border-b border-[#EFECE6]">
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 7-Column Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="min-h-[105px] rounded-2xl bg-[#FAF8F5]/30 border border-transparent p-2"
          />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNumber = idx + 1;
          const isToday = isCurrentMonth && now.getDate() === dayNumber;

          // Find scheduled posts on this specific date
          const dayPosts = posts.filter((p) => {
            const postDate = new Date(p.scheduledFor);
            return (
              postDate.getFullYear() === year &&
              postDate.getMonth() === month &&
              postDate.getDate() === dayNumber
            );
          });

          const hasPosts = dayPosts.length > 0;

          return (
            <div
              key={`day-${dayNumber}`}
              className={`min-h-[105px] sm:min-h-[115px] rounded-2xl border transition-all p-2 flex flex-col justify-between ${
                isToday
                  ? "bg-[#FAF8F5] border-[#D95D39] shadow-xs ring-2 ring-[#D95D39]/10"
                  : hasPosts
                  ? "bg-white border-[#E5E0D8] hover:border-[#D95D39] shadow-2xs"
                  : "bg-white/60 border-[#E5E0D8]/60 hover:bg-white"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? "bg-[#D95D39] text-white"
                      : "text-[#18181B]"
                  }`}
                >
                  {dayNumber}
                </span>

                {hasPosts && (
                  <span className="text-[10px] font-bold text-[#D95D39] px-1.5 py-0.5 rounded-md bg-[#FDF3EF] border border-[#F3CEBE]">
                    {dayPosts.length} ad{dayPosts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Scheduled Posts Pills in Cell */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {dayPosts.slice(0, 2).map((post) => {
                  const isAwaiting = post.approvalStatus === "awaiting_approval";

                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      className={`w-full text-left p-1.5 rounded-xl border transition-all text-[10px] block cursor-pointer group ${
                        isAwaiting
                          ? "bg-[#FDF3EF] border-[#F3CEBE] text-[#D95D39] hover:bg-[#FCE7DE]"
                          : post.publishStatus === "published"
                          ? "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"
                          : "bg-[#FAF8F5] border-[#E5E0D8] text-[#18181B] hover:border-[#D95D39] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-1 font-semibold truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isAwaiting
                              ? "bg-[#D95D39] animate-pulse"
                              : post.publishStatus === "published"
                              ? "bg-zinc-400"
                              : "bg-emerald-500"
                          }`}
                        />
                        <span className="truncate">{post.caption.slice(0, 22)}...</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-[#8E8B85] mt-0.5">
                        <span className="capitalize">{post.socialAccount.platform}</span>
                        <span>{post.localScheduledTime || "4:00 PM"}</span>
                      </div>
                    </button>
                  );
                })}

                {dayPosts.length > 2 && (
                  <div className="text-[9px] text-center text-[#8E8B85] font-semibold">
                    +{dayPosts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Details & 1-Click Approval Modal */}
      {selectedPost && (
        <Modal
          isOpen={!!selectedPost}
          onClose={() => {
            setSelectedPost(null);
            setApprovalFeedback(null);
          }}
          title="Scheduled UGC Video Details"
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Status & Platform Strip */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedPost.approvalStatus === "awaiting_approval"
                      ? "amber"
                      : selectedPost.publishStatus === "published"
                      ? "neutral"
                      : "emerald"
                  }
                  size="sm"
                  pulse={selectedPost.approvalStatus === "awaiting_approval"}
                >
                  {selectedPost.approvalStatus === "awaiting_approval"
                    ? "Awaiting Pre-Publish Approval"
                    : selectedPost.publishStatus === "published"
                    ? "Published Live"
                    : "Scheduled & Approved"}
                </Badge>
                <span className="text-xs text-[#52525B]">
                  on <strong className="text-[#18181B] capitalize">{selectedPost.socialAccount.platform}</strong> ({selectedPost.socialAccount.accountHandle})
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#18181B] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>
                  {new Date(selectedPost.scheduledFor).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {selectedPost.localScheduledTime || "4:00 PM EST"}
                </span>
              </div>
            </div>

            {/* Video Preview & Caption Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Video Thumbnail */}
              <div className="md:col-span-5">
                <div className="relative aspect-9/16 rounded-2xl overflow-hidden bg-[#18181B] border border-[#E5E0D8] shadow-sm">
                  <Image
                    src={selectedPost.video?.thumbnailUrl || "/images/creator-sarah.jpg"}
                    alt="Scheduled Ad Creative"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-xs text-white">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Kinetic Subtitles Sync
                    </div>
                    <div className="text-xs font-semibold line-clamp-2 mt-0.5">
                      {selectedPost.caption}
                    </div>
                  </div>
                </div>
              </div>

              {/* Script Details & Caption */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#18181B] block mb-1">
                    Caption Copy &amp; Hashtags
                  </label>
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#18181B] leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedPost.caption}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#52525B]">
                  <div className="flex justify-between border-b border-[#EFECE6] py-1.5">
                    <span>Hook Angle:</span>
                    <strong className="text-[#18181B] capitalize">{selectedPost.hookAngle?.replace("_", " ") || "Pattern Interrupt"}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#EFECE6] py-1.5">
                    <span>Creator Voice:</span>
                    <strong className="text-[#18181B] capitalize">{selectedPost.video?.voiceId || "Sarah (Casual DTC)"}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#EFECE6] py-1.5">
                    <span>Render Engine:</span>
                    <strong className="text-[#18181B]">Remotion 1080p Overlay</strong>
                  </div>
                </div>

                {approvalFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{approvalFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#EFECE6]">
              <button
                type="button"
                onClick={() => handleDeletePost(selectedPost.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 px-3 py-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Calendar</span>
              </button>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* Download MP4 */}
                <a
                  href={selectedPost.video?.videoUrl || "/videos/creator-sarah.mp4"}
                  download={`autougc_post_${selectedPost.id}.mp4`}
                  className="btn-fastlane-white text-xs px-4 py-2 flex items-center gap-1.5 font-semibold"
                >
                  <Download className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Download MP4</span>
                </a>

                {/* Edit in Studio */}
                <Link
                  href={`/studio?scheduledPostId=${selectedPost.id}`}
                  className="btn-fastlane-white text-xs px-4 py-2 flex items-center gap-1.5 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Edit in Studio</span>
                </Link>

                {/* 1-Click Approval Button */}
                {selectedPost.approvalStatus === "awaiting_approval" && (
                  <button
                    type="button"
                    disabled={isApproving}
                    onClick={() => handleApprovePost(selectedPost.id)}
                    className="btn-fastlane-black text-xs px-5 py-2 flex items-center gap-1.5 font-semibold shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{isApproving ? "Approving..." : "Approve for Publishing"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}