"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
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
  X,
  Copy,
  Check,
  Film,
  User,
  Share2,
  Flame,
  Volume2,
  ExternalLink,
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
    durationSeconds?: number | string;
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
  onOpenDropPackage?: (post: ScheduledCalendarPost) => void;
}

export default function InteractiveMonthlyCalendar({
  posts,
  brandName,
  onRefreshPosts,
  onOpenScheduleModal,
  onOpenDropPackage,
}: InteractiveMonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledCalendarPost | null>(null);
  const [selectedDayPosts, setSelectedDayPosts] = useState<ScheduledCalendarPost[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPost) {
        setSelectedPost(null);
        setSelectedDayPosts([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

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

  // Helper to extract hashtags from caption
  const getHashtags = (caption: string): string[] => {
    const matched = caption.match(/#[a-zA-Z0-9_]+/g);
    if (matched && matched.length > 0) {
      return matched;
    }
    return [
      "#UGC",
      "#Productivity",
      "#AI",
      `#${brandName.replace(/[^a-zA-Z0-9]/g, "")}`,
      "#Shorts",
    ];
  };

  // Helper to determine creator persona details
  const getCreatorPersona = (post: ScheduledCalendarPost) => {
    const voice = (post.video?.voiceId || "").toLowerCase();
    const hook = (post.hookAngle || "").toLowerCase();

    if (voice.includes("alex") || hook.includes("founder")) {
      return {
        name: "Alex",
        role: "Tech Founder Proof",
        avatar: "/images/creator-alex.jpg",
        style: "Authentic Founder Walkthrough · High-Trust Organic Flow",
        voiceEngine: "ElevenLabs Ultra-Realistic (Alex DTC)",
      };
    }
    if (voice.includes("emma") || hook.includes("comparison")) {
      return {
        name: "Emma",
        role: "Gen-Z DTC Specialist",
        avatar: "/images/creator-emma.jpg",
        style: "Fast Paced Pattern Interrupt · Native TikTok Hook",
        voiceEngine: "ElevenLabs Ultra-Realistic (Emma Dynamic)",
      };
    }
    return {
      name: "Sarah",
      role: "Casual DTC Creator",
      avatar: "/images/creator-sarah.jpg",
      style: "Organic Selfie Handheld · Problem-Solution Narrative",
      voiceEngine: "ElevenLabs Ultra-Realistic (Sarah Casual)",
    };
  };

  // Helper for exact posting time
  const getPostingTimeFormatted = (post: ScheduledCalendarPost): string => {
    if (post.localScheduledTime) {
      return `${post.localScheduledTime} — Peak Reach`;
    }
    const d = new Date(post.scheduledFor);
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${timeStr} EST — Peak Reach`;
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
      setSelectedDayPosts([]);
      onRefreshPosts();
    } catch (err) {
      console.warn("Failed removing post", err);
    }
  };

  // Download MP4 action
  const handleDownloadMp4 = (post: ScheduledCalendarPost) => {
    const videoUrl = post.video?.videoUrl || "/videos/creator-sarah.mp4";
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `autougc_${brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_ad_${post.id.slice(0, 8)}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drop Package action
  const handleDropPackage = (post: ScheduledCalendarPost) => {
    if (onOpenDropPackage) {
      onOpenDropPackage(post);
    } else {
      const fullCopy = `${post.caption}\n\n${getHashtags(post.caption).join(" ")}`;
      navigator.clipboard.writeText(fullCopy);
      alert("Drop Package contents copied to clipboard!");
    }
  };

  // Copy caption
  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // Copy all hashtags
  const handleCopyHashtags = (hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  // Clicking on a calendar day
  const handleDayClick = (dayNumber: number, dayPosts: ScheduledCalendarPost[]) => {
    if (dayPosts.length > 0 && dayPosts[0]) {
      setSelectedPost(dayPosts[0]);
      setSelectedDayPosts(dayPosts);
      setApprovalFeedback(null);
    } else {
      // Unmarked day: offer quick scheduling
      onOpenScheduleModal();
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
              Click any marked day to inspect the scheduled 9:16 video creative, persona, and drop package
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
              onClick={() => handleDayClick(dayNumber, dayPosts)}
              className={`min-h-[105px] sm:min-h-[115px] rounded-2xl border transition-all p-2 flex flex-col justify-between cursor-pointer group ${
                isToday
                  ? "bg-[#FAF8F5] border-[#D95D39] shadow-xs ring-2 ring-[#D95D39]/15"
                  : hasPosts
                  ? "bg-white border-[#E5E0D8] hover:border-[#D95D39] hover:shadow-md shadow-2xs"
                  : "bg-white/60 border-[#E5E0D8]/60 hover:bg-white hover:border-[#E5E0D8]"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isToday
                      ? "bg-[#D95D39] text-white"
                      : hasPosts
                      ? "text-[#18181B] group-hover:text-[#D95D39]"
                      : "text-[#8E8B85]"
                  }`}
                >
                  {dayNumber}
                </span>

                {hasPosts && (
                  <span className="text-[10px] font-bold text-[#D95D39] px-1.5 py-0.5 rounded-md bg-[#FFF9F6] border border-[#F5E2DA] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D95D39] animate-pulse" />
                    {dayPosts.length} ad{dayPosts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Scheduled Posts Pills in Cell */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {dayPosts.slice(0, 2).map((post) => {
                  const isAwaiting = post.approvalStatus === "awaiting_approval";

                  return (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                        setSelectedDayPosts(dayPosts);
                        setApprovalFeedback(null);
                      }}
                      className={`w-full text-left p-1.5 rounded-xl border transition-all text-[10px] block cursor-pointer group/pill ${
                        isAwaiting
                          ? "bg-[#FFF9F6] border-[#F5E2DA] text-[#D95D39] hover:bg-[#FDF3EF]"
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
                        <span>{post.localScheduledTime || "4:15 PM"}</span>
                      </div>
                    </div>
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

      {/* DAY INSPECTOR DRAWER (Right Slide-Over) */}
      {selectedPost && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 animate-in fade-in duration-200"
            onClick={() => {
              setSelectedPost(null);
              setSelectedDayPosts([]);
              setApprovalFeedback(null);
            }}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-inspector-title"
            className="fixed inset-y-0 right-0 w-full sm:w-[500px] md:w-[540px] bg-white border-l border-[#E5E0D8] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300"
          >
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#FAF8F5] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#18181B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CalendarIcon className="w-4 h-4 text-[#D95D39]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="day-inspector-title" className="text-sm font-bold text-[#18181B]">
                      Day Inspector
                    </h3>
                    <Badge
                      variant={
                        selectedPost.approvalStatus === "awaiting_approval"
                          ? "amber"
                          : selectedPost.publishStatus === "published"
                          ? "neutral"
                          : "emerald"
                      }
                      size="sm"
                    >
                      {selectedPost.approvalStatus === "awaiting_approval"
                        ? "Awaiting Approval"
                        : selectedPost.publishStatus === "published"
                        ? "Published Live"
                        : "Scheduled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#52525B]">
                    {new Date(selectedPost.scheduledFor).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPost(null);
                  setSelectedDayPosts([]);
                  setApprovalFeedback(null);
                }}
                className="p-2 rounded-full text-[#8E8B85] hover:text-[#18181B] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Close Day Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Multiple Posts Switcher (if day has > 1 post) */}
            {selectedDayPosts.length > 1 && (
              <div className="px-6 py-2.5 bg-[#FAF8F5]/80 border-b border-[#E5E0D8] flex items-center gap-2 overflow-x-auto shrink-0">
                <span className="text-[11px] font-semibold text-[#52525B] shrink-0">
                  Drops on this day:
                </span>
                {selectedDayPosts.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPost(p)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      selectedPost.id === p.id
                        ? "bg-[#18181B] text-white shadow-2xs"
                        : "bg-white border border-[#E5E0D8] text-[#52525B] hover:text-[#18181B]"
                    }`}
                  >
                    Drop #{idx + 1} ({p.socialAccount.platform})
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* 1. Exact 9:16 Video Creative Scheduled for that Day */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    <Film className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>9:16 Vertical Video Creative</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8E8B85]">
                    1080 × 1920 UHD
                  </span>
                </div>

                <div className="relative aspect-9/16 max-h-[380px] w-auto mx-auto rounded-2xl overflow-hidden bg-[#18181B] border border-[#E5E0D8] shadow-md group">
                  <video
                    src={selectedPost.video?.videoUrl || "/videos/creator-sarah.mp4"}
                    poster={selectedPost.video?.thumbnailUrl || "/images/creator-sarah.jpg"}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                      {selectedPost.hookAngle?.replace("_", " ") || "Problem-Solution"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-bold text-emerald-400 border border-white/10">
                      {selectedPost.video?.durationSeconds || "22"}s
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Creator Persona Used */}
              {(() => {
                const persona = getCreatorPersona(selectedPost);
                return (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B]">
                        <User className="w-3.5 h-3.5 text-[#D95D39]" />
                        <span>Creator Persona</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[#18181B]">
                        {persona.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#18181B] shrink-0 border border-[#E5E0D8]">
                        <Image
                          src={persona.avatar}
                          alt={persona.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                          <span>{persona.name}</span>
                          <span className="text-xs font-normal text-[#52525B]">({persona.role})</span>
                        </h4>
                        <p className="text-xs text-[#52525B] leading-snug mt-0.5">
                          {persona.style}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E5E0D8]/60 flex items-center justify-between text-[11px] text-[#52525B]">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-[#D95D39]" />
                        Voice: {persona.voiceEngine}
                      </span>
                      <span className="font-semibold text-[#18181B]">Remotion Engine</span>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Target Social Account Handle & Exact Posting Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Target Social Account */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B] mb-2">
                    <Share2 className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Target Social Account</span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#18181B] truncate">
                      {selectedPost.socialAccount.accountHandle}
                    </div>
                    <div className="text-xs text-[#52525B] capitalize mt-0.5">
                      {selectedPost.socialAccount.platform} · {selectedPost.socialAccount.accountNickname || "Active Fleet"}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E5E0D8]/60 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Auto-Publishing Fleet Ready</span>
                  </div>
                </div>

                {/* Exact Posting Time */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B] mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Exact Posting Time</span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#18181B]">
                      {getPostingTimeFormatted(selectedPost)}
                    </div>
                    <div className="text-xs text-[#52525B] mt-0.5">
                      Optimal Engagement Window
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E5E0D8]/60 flex items-center gap-1.5 text-[10px] text-[#D95D39] font-semibold">
                    <Flame className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Peak Retention Cadence</span>
                  </div>
                </div>
              </div>

              {/* 4. Viral Caption & Hashtags */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                    <span>Viral Caption &amp; Hashtags</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCaption(selectedPost.caption)}
                    className="text-xs text-[#D95D39] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCaption ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Caption Text Box */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] text-xs text-[#18181B] leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedPost.caption}
                </div>

                {/* Hashtag Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-[#52525B]">
                      Algorithmic Hashtags
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHashtags(getHashtags(selectedPost.caption))}
                      className="text-[10px] text-[#52525B] hover:text-[#18181B] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedHashtags ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied all!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy all</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {getHashtags(selectedPost.caption).map((tag, idx) => (
                      <button
                        key={`tag-${idx}`}
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          setCopiedHashtags(true);
                          setTimeout(() => setCopiedHashtags(false), 1500);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E0D8] text-xs font-semibold text-[#D95D39] hover:border-[#D95D39] transition-colors cursor-pointer"
                        title="Click to copy single hashtag"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Approval Feedback Notice */}
              {approvalFeedback && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{approvalFeedback}</span>
                </div>
              )}
            </div>

            {/* Drawer Fixed Footer Actions */}
            <div className="p-5 border-t border-[#E5E0D8] bg-[#FAF8F5] shrink-0 space-y-3">
              {/* PRIMARY 2 BUTTONS: "Download MP4" and "Drop Package" */}
              <div className="grid grid-cols-2 gap-3">
                {/* Button 1: Download MP4 */}
                <button
                  type="button"
                  onClick={() => handleDownloadMp4(selectedPost)}
                  className="btn-fastlane-white py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#D95D39]" />
                  <span>Download MP4</span>
                </button>

                {/* Button 2: Drop Package */}
                <button
                  type="button"
                  onClick={() => handleDropPackage(selectedPost)}
                  className="btn-fastlane-black py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D95D39]" />
                  <span>Drop Package</span>
                </button>
              </div>

              {/* Secondary Actions Row */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from Schedule</span>
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/studio?scheduledPostId=${selectedPost.id}`}
                    className="text-xs font-semibold text-[#18181B] hover:text-[#D95D39] transition-colors flex items-center gap-1"
                  >
                    <span>Edit in Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  {selectedPost.approvalStatus === "awaiting_approval" && (
                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => handleApprovePost(selectedPost.id)}
                      className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isApproving ? "Approving..." : "Approve"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
