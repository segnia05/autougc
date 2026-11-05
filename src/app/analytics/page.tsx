"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Film,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  Play,
} from "lucide-react";

interface AnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  totalWatchTimeSeconds: number;
  engagementRate: string;
  publishedPostsCount: number;
}

interface AnalyticsAccount {
  id: string;
  platform: "tiktok" | "instagram" | "youtube";
  accountHandle: string;
  accountNickname?: string | null;
  isBurner?: boolean;
  postsCount: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate?: string;
  status: string;
}

interface AnalyticsPost {
  id: string;
  caption: string;
  hookAngle: string;
  hookText?: string;
  scheduledFor: string;
  postUrl: string;
  videoUrl?: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  watchTimeSeconds: number;
  platform: "tiktok" | "instagram" | "youtube";
  accountHandle: string;
  thumbnailUrl: string;
  durationSeconds: number;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview>({
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
    totalWatchTimeSeconds: 0,
    engagementRate: "0.0%",
    publishedPostsCount: 0,
  });

  const [accounts, setAccounts] = useState<AnalyticsAccount[]>([]);
  const [posts, setPosts] = useState<AnalyticsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [brandName, setBrandName] = useState("");
  const [credits, setCredits] = useState(0);
  const [previewingPost, setPreviewingPost] = useState<AnalyticsPost | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/analytics");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.overview) setOverview(json.overview);
          if (Array.isArray(json.accounts)) setAccounts(json.accounts);
          if (Array.isArray(json.posts)) setPosts(json.posts);
        }
      }
    } catch (err) {
      console.warn("Failed fetching analytics", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBrand = localStorage.getItem("autougc_brand_name");
      if (storedBrand) setBrandName(storedBrand);
    }

    fetch("/api/v1/workspace/active")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.brandName) setBrandName(json.brandName);
        if (json?.credits !== undefined) setCredits(json.credits);
      })
      .catch(() => {});

    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter posts by platform
  const filteredPosts = posts.filter((p) => {
    if (selectedPlatform !== "all" && p.platform !== selectedPlatform) return false;
    return true;
  });

  // Format watch time into hours/minutes
  const formatWatchTime = (seconds: number) => {
    const hours = (seconds / 3600).toFixed(1);
    return `${hours} hrs`;
  };

  return (
    <AppShell brandName={brandName} credits={credits}>
      <div className="max-w-7xl mx-auto space-y-8 select-none pb-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                {brandName ? `${brandName} Social Video Analytics` : "Social Video Analytics"}
              </h1>
              <Badge variant="emerald" size="sm">
                Live Feed Sync
              </Badge>
            </div>
            <p className="text-xs text-[#52525B] max-w-xl leading-relaxed">
              Real-time video views, audience watch duration, likes, and shares streamed directly from your connected TikTok and Instagram accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#18181B] text-xs font-semibold text-[#18181B] transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#D95D39]" : "text-[#8E8B85]"}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Latest Data"}</span>
            </button>
          </div>
        </div>

        {/* 5 Core Social Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Total Views */}
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                Total Views
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#18181B]">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              {overview.totalViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>Real creator impressions</span>
            </div>
          </div>

          {/* 2. Total Likes */}
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                Total Likes
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FFF2ED] flex items-center justify-center text-[#D95D39]">
                <Heart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              {overview.totalLikes.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#8E8B85] block">
              Across published UGC ads
            </span>
          </div>

          {/* 3. Total Shares */}
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                Total Shares
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#18181B]">
                <Share2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              {overview.totalShares.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#8E8B85] block">
              Viral distribution reach
            </span>
          </div>

          {/* 4. Total Comments */}
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                Comments
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#18181B]">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              {overview.totalComments.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#8E8B85] block">
              Audience discussions
            </span>
          </div>

          {/* 5. Avg Engagement Rate */}
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                Engagement Rate
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FFF2ED] flex items-center justify-center text-[#D95D39]">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#D95D39] tracking-tight">
              {overview.engagementRate}
            </div>
            <span className="text-[10px] text-[#8E8B85] block">
              Likes + Shares + Comments / Views
            </span>
          </div>
        </div>

        {/* Connected Channels Breakdown Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#18181B] uppercase tracking-wider">
              Connected Social Fleet Performance
            </h2>
            <span className="text-xs text-[#8E8B85]">
              {accounts.length} active channel{accounts.length !== 1 ? "s" : ""} streaming telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-[#E5E0D8] text-center col-span-full">
                <p className="text-xs text-[#8E8B85]">
                  No social accounts connected yet. Head to your Dashboard to connect your TikTok or Instagram account!
                </p>
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white border border-[#E5E0D8] rounded-2xl p-5 shadow-2xs space-y-4 hover:border-[#D95D39]/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#18181B] flex items-center justify-center text-white shrink-0 font-bold text-xs uppercase tracking-wider">
                        {acc.platform === "tiktok" ? "TikTok" : acc.platform === "instagram" ? "Reels" : "YT"}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#18181B] truncate">
                            {acc.accountHandle}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        </div>
                        <span className="text-[10px] text-[#8E8B85] capitalize">
                          {acc.platform} Distribution Fleet
                        </span>
                      </div>
                    </div>

                    <Badge variant="emerald" size="sm">
                      Live Sync
                    </Badge>
                  </div>

                  {/* 3 Channel Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EFECE6] text-center">
                    <div className="p-2 rounded-xl bg-[#FAF8F5]">
                      <span className="text-[9px] uppercase font-bold text-[#8E8B85] block">Live Ads</span>
                      <span className="text-sm font-bold text-[#18181B]">{acc.postsCount}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F5]">
                      <span className="text-[9px] uppercase font-bold text-[#8E8B85] block">Views</span>
                      <span className="text-sm font-bold text-[#18181B]">{acc.views.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFF2ED]">
                      <span className="text-[9px] uppercase font-bold text-[#D95D39] block">Likes</span>
                      <span className="text-sm font-bold text-[#D95D39]">{acc.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Video Performance Table */}
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
                Published Video Ad Performance
              </h2>
              <p className="text-xs text-[#8E8B85] mt-0.5">
                Individual telemetry streamed from published TikTok and Instagram video creatives.
              </p>
            </div>

            {/* Platform Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
              {["all", "tiktok", "instagram"].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    selectedPlatform === plat
                      ? "bg-[#18181B] text-white"
                      : "text-[#52525B] hover:text-[#18181B]"
                  }`}
                >
                  {plat === "all" ? "All Channels" : plat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List / Table */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#8E8B85]">
              Loading social analytics data...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Film className="w-8 h-8 text-[#E5E0D8] mx-auto" />
              <p className="text-xs font-semibold text-[#18181B]">
                No published videos yet for this filter
              </p>
              <p className="text-[11px] text-[#8E8B85]">
                Once your scheduled ads pass pre-publish approval and publish, views and likes will stream here live.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E0D8] text-[10px] font-bold uppercase tracking-wider text-[#8E8B85]">
                    <th className="pb-3 pl-1">Video Creative</th>
                    <th className="pb-3 px-3">Channel</th>
                    <th className="pb-3 px-3 text-right">Views</th>
                    <th className="pb-3 px-3 text-right">Likes</th>
                    <th className="pb-3 px-3 text-right">Shares</th>
                    <th className="pb-3 px-3 text-right">Comments</th>
                    <th className="pb-3 px-3 text-right">Watch Time</th>
                    <th className="pb-3 pr-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#FAF8F5]/80 transition-colors group">
                      {/* Video Hook & Thumbnail */}
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setPreviewingPost(post)}
                            className="relative w-12 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-[#E5E0D8] group/thumb cursor-pointer"
                          >
                            <Image
                              src={post.thumbnailUrl}
                              alt={post.hookAngle}
                              fill
                              className="object-cover group-hover/thumb:scale-105 transition-transform"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/40 flex items-center justify-center transition-colors">
                              <Play className="w-3.5 h-3.5 text-white fill-white opacity-80 group-hover/thumb:opacity-100" />
                            </div>
                          </button>
                          <div className="space-y-0.5 max-w-xs">
                            <span className="text-[10px] font-bold text-[#D95D39] uppercase tracking-wider block">
                              {post.hookAngle}
                            </span>
                            <p className="font-semibold text-[#18181B] line-clamp-2 leading-snug">
                              {post.caption}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Channel Badge */}
                      <td className="py-3.5 px-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] font-medium text-[11px] text-[#18181B]">
                          <span className="font-bold uppercase text-[9px] text-[#D95D39]">
                            {post.platform}
                          </span>
                          <span>{post.accountHandle}</span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 text-right font-bold text-sm text-[#18181B]">
                        {post.views.toLocaleString()}
                      </td>

                      {/* Likes */}
                      <td className="py-3.5 px-3 text-right font-medium text-[#18181B]">
                        {post.likes.toLocaleString()}
                      </td>

                      {/* Shares */}
                      <td className="py-3.5 px-3 text-right font-medium text-[#18181B]">
                        {post.shares.toLocaleString()}
                      </td>

                      {/* Comments */}
                      <td className="py-3.5 px-3 text-right font-medium text-[#18181B]">
                        {post.comments.toLocaleString()}
                      </td>

                      {/* Watch Time */}
                      <td className="py-3.5 px-3 text-right text-[11px] font-mono text-[#8E8B85]">
                        {formatWatchTime(post.watchTimeSeconds)}
                      </td>

                      {/* View Link & Preview Action */}
                      <td className="py-3.5 pr-1 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewingPost(post)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#52525B] hover:text-[#18181B] border border-[#E5E0D8] transition-colors text-[11px] font-semibold cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5" />
                            <span>Preview</span>
                          </button>

                          <a
                            href={post.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#18181B] text-[#18181B] hover:text-white border border-[#E5E0D8] hover:border-[#18181B] transition-colors text-[11px] font-semibold"
                          >
                            <span>View Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Published Post Detail Preview Modal */}
      {previewingPost && (
        <Modal
          isOpen={!!previewingPost}
          onClose={() => setPreviewingPost(null)}
          title={`Live Ad Telemetry: ${previewingPost.hookAngle}`}
        >
          <div className="space-y-4">
            <div className="relative aspect-[9/16] max-h-[55vh] bg-black rounded-2xl overflow-hidden mx-auto border border-[#E5E0D8]">
              <video
                src={previewingPost.videoUrl || "/videos/creator-sarah.mp4"}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#18181B]">Channel:</span>
                <span className="font-mono text-[#D95D39] font-bold">{previewingPost.platform.toUpperCase()} • {previewingPost.accountHandle}</span>
              </div>
              <div>
                <span className="font-bold text-[#18181B]">Caption: </span>
                <span className="text-[#52525B]">{previewingPost.caption}</span>
              </div>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E0D8]">
                <span className="text-[9px] uppercase font-bold text-[#8E8B85] block">Views</span>
                <span className="text-sm font-bold text-[#18181B]">{previewingPost.views.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E0D8]">
                <span className="text-[9px] uppercase font-bold text-[#8E8B85] block">Likes</span>
                <span className="text-sm font-bold text-[#D95D39]">{previewingPost.likes.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E0D8]">
                <span className="text-[9px] uppercase font-bold text-[#8E8B85] block">Shares</span>
                <span className="text-sm font-bold text-[#18181B]">{previewingPost.shares.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E0D8]">
                <span className="text-[9px] uppercase font-bold text-[#8E8B85] block">Comments</span>
                <span className="text-sm font-bold text-[#18181B]">{previewingPost.comments.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E5E0D8]">
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs font-semibold text-[#18181B] hover:border-[#18181B]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Iterate in Studio</span>
              </Link>

              <a
                href={previewingPost.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fastlane-black text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
              >
                <span>Open Live on {previewingPost.platform === "tiktok" ? "TikTok" : "Instagram"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
