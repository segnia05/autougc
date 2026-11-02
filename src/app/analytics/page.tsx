"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
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
  status: string;
}

interface AnalyticsPost {
  id: string;
  caption: string;
  hookAngle: string;
  scheduledFor: string;
  postUrl: string;
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
    <AppShell brandName={brandName}>
      <div className="max-w-7xl mx-auto space-y-8 select-none pb-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CBD5C4]/70 pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B231B]">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#CBD5C4] hover:border-[#1F3824] text-xs font-semibold text-[#1B231B] transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#1F3824]" : "text-[#717E6C]"}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Latest Data"}</span>
            </button>
          </div>
        </div>

        {/* 5 Core Social Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Total Views */}
          <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717E6C]">
                Total Views
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E8F0E6] flex items-center justify-center text-[#1F3824]">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B231B] tracking-tight">
              {overview.totalViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              <span>Real creator impressions</span>
            </div>
          </div>

          {/* 2. Total Likes */}
          <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717E6C]">
                Total Likes
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#FDF3EF] flex items-center justify-center text-[#D95D39]">
                <Heart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B231B] tracking-tight">
              {overview.totalLikes.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#717E6C] block">
              Across published UGC ads
            </span>
          </div>

          {/* 3. Total Shares */}
          <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717E6C]">
                Total Shares
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#F6F7F2] flex items-center justify-center text-[#1F3824]">
                <Share2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B231B] tracking-tight">
              {overview.totalShares.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#717E6C] block">
              Viral distribution reach
            </span>
          </div>

          {/* 4. Total Comments */}
          <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717E6C]">
                Comments
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#F6F7F2] flex items-center justify-center text-[#1F3824]">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B231B] tracking-tight">
              {overview.totalComments.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#717E6C] block">
              Audience discussions
            </span>
          </div>

          {/* 5. Avg Engagement Rate */}
          <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717E6C]">
                Engagement Rate
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E8F0E6] flex items-center justify-center text-[#1F3824]">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#1F3824] tracking-tight">
              {overview.engagementRate}
            </div>
            <span className="text-[10px] text-[#717E6C] block">
              Likes + Shares + Comments / Views
            </span>
          </div>
        </div>

        {/* Connected Channels Breakdown Strip */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#1B231B] uppercase tracking-wider">
            Connected Social Fleet Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-[#CBD5C4] text-center col-span-full">
                <p className="text-xs text-[#717E6C]">
                  No social accounts connected yet. Head to your Dashboard to connect your TikTok or Instagram account!
                </p>
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white border border-[#CBD5C4]/80 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1F3824] flex items-center justify-center text-white shrink-0 font-bold text-sm">
                      {acc.platform === "tiktok" ? "TT" : "IG"}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#1B231B] truncate">
                          {acc.accountHandle}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      </div>
                      <span className="text-[10px] text-[#717E6C]">
                        {acc.postsCount} video{acc.postsCount !== 1 ? "s" : ""} live • {acc.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>

                  <Badge variant="emerald" size="sm">
                    Live Sync
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Video Performance Table */}
        <div className="bg-white border border-[#CBD5C4]/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CBD5C4]/60 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1B231B] tracking-tight">
                Published Video Ad Performance
              </h2>
              <p className="text-xs text-[#717E6C] mt-0.5">
                Individual telemetry streamed from published TikTok and Instagram video creatives.
              </p>
            </div>

            {/* Platform Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F6F7F2] border border-[#CBD5C4]">
              {["all", "tiktok", "instagram"].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    selectedPlatform === plat
                      ? "bg-[#1F3824] text-white"
                      : "text-[#4A544A] hover:text-[#1B231B]"
                  }`}
                >
                  {plat === "all" ? "All Channels" : plat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List / Table */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#717E6C]">
              Loading social analytics data...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Film className="w-8 h-8 text-[#CBD5C4] mx-auto" />
              <p className="text-xs font-semibold text-[#1B231B]">
                No published videos yet for this filter
              </p>
              <p className="text-[11px] text-[#717E6C]">
                Once your scheduled ads pass pre-publish approval and publish, views and likes will stream here live.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CBD5C4]/60 text-[10px] font-bold uppercase tracking-wider text-[#717E6C]">
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
                <tbody className="divide-y divide-[#CBD5C4]/40">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#FAF8F5]/50 transition-colors group">
                      {/* Video Hook & Thumbnail */}
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-[#CBD5C4]">
                            <Image
                              src={post.thumbnailUrl}
                              alt={post.hookAngle}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/10" />
                          </div>
                          <div className="space-y-0.5 max-w-xs">
                            <span className="text-[10px] font-bold text-[#1F3824] uppercase tracking-wider block">
                              {post.hookAngle}
                            </span>
                            <p className="font-semibold text-[#1B231B] line-clamp-2 leading-snug">
                              {post.caption}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Channel Badge */}
                      <td className="py-3.5 px-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F6F7F2] border border-[#CBD5C4] font-medium text-[11px] text-[#1B231B]">
                          <span className="font-bold uppercase text-[9px] text-[#1F3824]">
                            {post.platform}
                          </span>
                          <span>{post.accountHandle}</span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-3 text-right font-bold text-sm text-[#1B231B]">
                        {post.views.toLocaleString()}
                      </td>

                      {/* Likes */}
                      <td className="py-3.5 px-3 text-right font-medium text-[#1B231B]">
                        {post.likes.toLocaleString()}
                      </td>

                      {/* Shares */}
                      <td className="py-3.5 px-3 text-right font-medium text-[#1B231B]">
                        {post.shares.toLocaleString()}
                      </td>

                      {/* Comments */}
                      <td className="py-3.5 px-3 text-right font-medium text-[#1B231B]">
                        {post.comments.toLocaleString()}
                      </td>

                      {/* Watch Time */}
                      <td className="py-3.5 px-3 text-right text-[11px] font-mono text-[#717E6C]">
                        {formatWatchTime(post.watchTimeSeconds)}
                      </td>

                      {/* View Link */}
                      <td className="py-3.5 pr-1 text-right">
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F6F7F2] hover:bg-[#1F3824] text-[#1B231B] hover:text-white border border-[#CBD5C4] hover:border-[#1F3824] transition-colors text-[11px] font-semibold"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
