"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import SchedulePostModal from "@/components/dashboard/SchedulePostModal";
import DropConciergeModal, { DropPackageData } from "@/components/dashboard/DropConciergeModal";
import { ConnectedSocialAccount } from "@/components/dashboard/ConnectedAccountsSection";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Film,
  Sparkles,
  Calendar as CalendarIcon,
  Play,
  Share2,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  Layers,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Zap,
} from "lucide-react";

interface CreatorVideo {
  id: string;
  brandName: string;
  projectName: string;
  hookAngle: string;
  hookText: string;
  bodyText: string;
  ctaText: string;
  caption: string;
  hashtags: string[];
  durationSeconds: number;
  renderStatus: string;
  videoUrl: string;
  thumbnailUrl: string;
  voiceId: string;
  aspectRatio: string;
  createdAt: string;
  scheduledSlot?: {
    id?: string;
    scheduledFor: string;
    localScheduledTime?: string | null;
    accountHandle: string;
    platform: string;
    publishStatus: string;
  } | null;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [credits, setCredits] = useState(0);
  const [videos, setVideos] = useState<CreatorVideo[]>([]);
  const [accounts, setAccounts] = useState<ConnectedSocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "ready" | "scheduled" | "published">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [previewingVideo, setPreviewingVideo] = useState<CreatorVideo | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [videoToSchedule, setVideoToSchedule] = useState<CreatorVideo | null>(null);
  const [selectedDropPackage, setSelectedDropPackage] = useState<DropPackageData | null>(null);

  const handleOpenDropPackage = (video: CreatorVideo) => {
    setSelectedDropPackage({
      videoId: video.id,
      postId: video.scheduledSlot?.id,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      brandName: video.brandName,
      hookAngle: video.hookAngle.replace(/_/g, " "),
      hookHeadline: video.hookText,
      caption: video.caption,
      hashtags: video.hashtags || [],
      optimalPostingTime: video.scheduledSlot?.localScheduledTime || "Today at 4:15 PM EST (Peak Reach)",
      channelHandle: video.scheduledSlot?.accountHandle,
    });
  };

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/videos");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.videos)) {
          setVideos(json.videos);
        }
      }
    } catch (err) {
      console.warn("Failed fetching creator videos", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch connected accounts
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/social/accounts");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.accounts)) {
          setAccounts(json.accounts);
        }
      }
    } catch (err) {
      console.warn("Failed fetching accounts", err);
    }
  }, []);

  useEffect(() => {
    async function loadWorkspaceCredits() {
      try {
        const res = await fetch("/api/v1/workspace/active");
        if (res.ok) {
          const json = await res.json();
          if (json.brandName) setBrandName(json.brandName);
          const cr = json.credits ?? 0;
          setCredits(cr);
          if (typeof window !== "undefined") {
            localStorage.setItem("autougc_credits", String(cr));
          }
          return;
        }
      } catch {
        // fallback to storage below
      }

      if (typeof window !== "undefined") {
        const storedBrand = localStorage.getItem("autougc_brand_name");
        const storedCredits = localStorage.getItem("autougc_credits");
        const storedPlan = localStorage.getItem("autougc_plan_tier");
        if (storedBrand) setBrandName(storedBrand);
        if (storedPlan === "growth" || storedPlan === "scale") {
          if (storedCredits !== null) setCredits(parseInt(storedCredits, 10));
        } else {
          setCredits(0);
        }
      }
    }

    loadWorkspaceCredits();
    fetchVideos();
    fetchAccounts();
  }, [fetchVideos, fetchAccounts]);

  // Filtered video list
  const filteredVideos = videos.filter((vid) => {
    // Status filter
    if (statusFilter === "ready" && vid.scheduledSlot && vid.scheduledSlot.publishStatus !== "ready") return false;
    if (statusFilter === "scheduled" && (!vid.scheduledSlot || vid.scheduledSlot.publishStatus === "published")) return false;
    if (statusFilter === "published" && vid.scheduledSlot?.publishStatus !== "published") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHook = vid.hookText.toLowerCase().includes(q);
      const matchAngle = vid.hookAngle.toLowerCase().includes(q);
      const matchBrand = vid.brandName.toLowerCase().includes(q);
      if (!matchHook && !matchAngle && !matchBrand) return false;
    }

    return true;
  });

  const allCount = videos.length;
  const readyCount = videos.filter((v) => !v.scheduledSlot || v.scheduledSlot.publishStatus === "ready").length;
  const scheduledCount = videos.filter((v) => v.scheduledSlot && v.scheduledSlot.publishStatus !== "published").length;
  const publishedCount = videos.filter((v) => v.scheduledSlot?.publishStatus === "published").length;

  const handleOpenSchedule = (video: CreatorVideo) => {
    setVideoToSchedule(video);
    setIsScheduleModalOpen(true);
  };

  return (
    <AppShell brandName={brandName} credits={credits}>
      <div className="max-w-7xl mx-auto space-y-8 select-none pb-16">
        {/* Header Strip with AutoUGC Warm Canvas & Terracotta Accent */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-[#E5E0D8] pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                {brandName ? `${brandName} Creator Ad Vault` : "Creator Video Ad Vault"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] text-[10px] font-bold text-[#D95D39] uppercase tracking-wider">
                Remotion 1080x1920
              </span>
            </div>
            <p className="text-xs text-[#52525B] max-w-2xl leading-relaxed">
              Every high-converting AI UGC video creative generated for your software. Preview rendered ads, make granular script and voice edits in Studio, or schedule them to your social accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="btn-fastlane-black text-xs px-5 py-2.5 font-semibold gap-2 shadow-sm hover:scale-[1.01] transition-transform inline-flex items-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Create New Ad in Studio</span>
            </Link>
          </div>
        </div>

        {/* 4 Metrics Pods */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="fastlane-card bg-white p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Total Video Ads
            </span>
            <div className="text-2xl font-bold text-[#18181B]">
              {videos.length}
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Engineered UGC creatives
            </span>
          </div>

          <div className="fastlane-card bg-white p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95D39]">
              Ready to Launch
            </span>
            <div className="text-2xl font-bold text-[#D95D39]">
              {readyCount}
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Unscheduled video pool
            </span>
          </div>

          <div className="fastlane-card bg-white p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#18181B]">
              Active On Calendar
            </span>
            <div className="text-2xl font-bold text-[#18181B]">
              {scheduledCount}
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Drip-scheduled posts
            </span>
          </div>

          <div className="fastlane-card bg-white p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
              Video Credits
            </span>
            <div className="flex items-center gap-1.5 text-2xl font-bold text-[#18181B]">
              <Zap className="w-5 h-5 text-[#D95D39] fill-[#D95D39]" />
              <span>{credits}</span>
            </div>
            <span className="text-[10px] text-[#8E8B85]">
              Ready for high-res render
            </span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E5E0D8]">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1">
            {[
              { id: "all", label: "All", count: allCount },
              { id: "ready", label: "Ready to Launch", count: readyCount },
              { id: "scheduled", label: "Scheduled", count: scheduledCount },
              { id: "published", label: "Published Live", count: publishedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-[#18181B] text-white shadow-2xs"
                    : "text-[#52525B] hover:text-[#18181B] hover:bg-[#FAF8F5]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#8E8B85]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8E8B85] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by hook or angle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF8F5]/50 border border-[#E5E0D8] text-xs text-[#18181B] placeholder:text-[#8E8B85] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39]"
            />
          </div>
        </div>

        {/* Video Ad Grid */}
        {isLoading ? (
          <div className="p-16 rounded-3xl bg-white border border-[#E5E0D8] text-center space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#18181B] flex items-center justify-center text-white mx-auto animate-spin">
              <Film className="w-4 h-4" />
            </div>
            <p className="text-xs text-[#8E8B85]">Loading your creator video library...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white border border-dashed border-[#E5E0D8] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#D95D39] mx-auto">
              <Film className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#18181B]">
                No creator videos found
              </h3>
              <p className="text-xs text-[#8E8B85] max-w-sm mx-auto">
                {searchQuery
                  ? "No videos match your search query. Try clearing the filter."
                  : "Launch Studio to generate your first high-converting AI UGC video ad."}
              </p>
            </div>
            <Link
              href="/studio"
              className="btn-fastlane-black text-xs py-2 px-4 font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Studio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => {
              const durationFormatted = `${Math.floor(video.durationSeconds / 60)}:${Math.floor(video.durationSeconds % 60).toString().padStart(2, "0")}`;

              return (
                <div
                  key={video.id}
                  className="fastlane-card bg-white overflow-hidden shadow-xs hover:border-[#D95D39]/60 transition-all flex flex-col justify-between group"
                >
                  {/* Video Thumbnail & Play Overlay */}
                  <div>
                    <div className="relative aspect-[9/16] bg-black overflow-hidden group">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.hookText}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                          9:16 Vertical
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono font-bold text-white">
                          {durationFormatted}
                        </span>
                      </div>

                      {/* Center Play Button Overlay */}
                      <button
                        type="button"
                        onClick={() => setPreviewingVideo(video)}
                        className="absolute inset-0 flex items-center justify-center group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#18181B] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all">
                          <Play className="w-5 h-5 fill-[#18181B] ml-0.5" />
                        </div>
                      </button>

                      {/* Bottom Overlay Info */}
                      <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <div className="inline-block px-2 py-0.5 rounded bg-[#D95D39] text-[10px] font-bold text-white capitalize">
                          {video.hookAngle.replace(/_/g, " ")}
                        </div>
                        <p className="text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
                          &ldquo;{video.hookText}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3">
                      {/* Scheduled Status Badge */}
                      {video.scheduledSlot ? (
                        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-[#18181B] font-semibold truncate">
                            <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-[#D95D39]" />
                            <span className="truncate">
                              {video.scheduledSlot.accountHandle} ({video.scheduledSlot.platform.toUpperCase()})
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Scheduled
                          </span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-300 text-[11px] text-amber-950 font-medium flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>Ready for publishing schedule</span>
                        </div>
                      )}

                      {/* Script Body Snippet */}
                      <p className="text-[11px] text-[#52525B] line-clamp-2 leading-relaxed">
                        {video.bodyText}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 space-y-2">
                    {/* Primary Drop Concierge Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenDropPackage(video)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#FDF3EF] hover:bg-[#FBE8DF] border border-[#F3CEBE] text-[11px] font-bold text-[#D95D39] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                      <span>Ready to Drop • Get Package</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/studio?videoId=${video.id}&brand=${encodeURIComponent(video.brandName)}&hook=${encodeURIComponent(video.hookText)}&body=${encodeURIComponent(video.bodyText)}&cta=${encodeURIComponent(video.ctaText)}&video=${encodeURIComponent(video.videoUrl)}&image=${encodeURIComponent(video.thumbnailUrl)}&voice=${encodeURIComponent(video.voiceId)}`}
                        className="py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#E5E0D8] text-[11px] font-bold text-[#18181B] text-center hover:border-[#18181B] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#D95D39]" />
                        <span>Studio</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenSchedule(video)}
                        className="btn-fastlane-black text-[11px] py-2 px-3 font-bold text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <CalendarIcon className="w-3 h-3" />
                        <span>Schedule</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8E8B85] px-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setPreviewingVideo(video)}
                        className="hover:text-[#18181B] hover:underline flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>Preview Full Ad</span>
                      </button>

                      <a
                        href={video.videoUrl}
                        download={`autougc_${video.id}.mp4`}
                        className="hover:text-[#18181B] hover:underline flex items-center gap-1"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>Download MP4</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {previewingVideo && (
        <Modal
          isOpen={!!previewingVideo}
          onClose={() => setPreviewingVideo(null)}
          title={`Creative Preview: ${previewingVideo.hookAngle.replace(/_/g, " ")}`}
        >
          <div className="space-y-4">
            <div className="relative aspect-[9/16] max-h-[60vh] bg-black rounded-2xl overflow-hidden mx-auto border border-[#E5E0D8]">
              <video
                src={previewingVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2 text-xs">
              <div>
                <span className="font-bold text-[#18181B]">Hook Angle: </span>
                <span className="text-[#52525B]">{previewingVideo.hookText}</span>
              </div>
              <div>
                <span className="font-bold text-[#18181B]">Body: </span>
                <span className="text-[#52525B]">{previewingVideo.bodyText}</span>
              </div>
              <div>
                <span className="font-bold text-[#18181B]">Call To Action: </span>
                <span className="text-[#D95D39] font-semibold">{previewingVideo.ctaText}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <Link
                  href={`/studio?videoId=${previewingVideo.id}&brand=${encodeURIComponent(previewingVideo.brandName)}&hook=${encodeURIComponent(previewingVideo.hookText)}&body=${encodeURIComponent(previewingVideo.bodyText)}&cta=${encodeURIComponent(previewingVideo.ctaText)}&video=${encodeURIComponent(previewingVideo.videoUrl)}&image=${encodeURIComponent(previewingVideo.thumbnailUrl)}&voice=${encodeURIComponent(previewingVideo.voiceId)}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs font-semibold text-[#18181B] hover:border-[#18181B] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Open in Studio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const vid = previewingVideo;
                    setPreviewingVideo(null);
                    handleOpenDropPackage(vid);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FDF3EF] border border-[#F3CEBE] text-xs font-semibold text-[#D95D39] hover:bg-[#FBE8DF] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Ready to Drop</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const vid = previewingVideo;
                  setPreviewingVideo(null);
                  handleOpenSchedule(vid);
                }}
                className="btn-fastlane-black text-xs py-2 px-4 font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Schedule Video</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Drop Concierge Modal */}
      <DropConciergeModal
        isOpen={!!selectedDropPackage}
        onClose={() => setSelectedDropPackage(null)}
        dropData={selectedDropPackage}
        onMarkPublished={() => {
          fetchVideos();
        }}
      />

      {/* Schedule Post Modal */}
      <SchedulePostModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setVideoToSchedule(null);
        }}
        accounts={accounts}
        brandName={brandName}
        selectedVideo={videoToSchedule}
        onScheduled={() => {
          fetchVideos();
        }}
        onTriggerUpgrade={() => {
          router.push("/dashboard");
        }}
        onConnectAccountClick={() => {
          router.push("/dashboard");
        }}
      />
    </AppShell>
  );
}
