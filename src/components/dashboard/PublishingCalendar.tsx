"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Film,
} from "lucide-react";

export interface ScheduledPostItem {
  id: string;
  caption: string;
  scheduledFor: string;
  publishStatus: "pending" | "processing" | "published" | "failed";
  platformPostId?: string | null;
  socialAccount: {
    platform: "tiktok" | "instagram" | "youtube";
    accountHandle: string;
  };
  video?: {
    durationSeconds: number;
    thumbnailUrl?: string | null;
  };
}

export function PublishingCalendar() {
  const [posts, setPosts] = useState<ScheduledPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "failed">("all");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/social/schedule");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.warn("Failed to load scheduled posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (filter === "all") return true;
    return p.publishStatus === filter;
  });

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "tiktok":
        return <Badge variant="neutral" size="sm">TikTok</Badge>;
      case "instagram":
        return <Badge variant="amber" size="sm">IG Reels</Badge>;
      case "youtube":
        return <Badge variant="rose" size="sm">YT Shorts</Badge>;
      default:
        return <Badge size="sm">{platform}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="emerald" size="sm">Published</Badge>;
      case "processing":
        return <Badge variant="amber" size="sm" pulse>Uploading...</Badge>;
      case "pending":
        return <Badge variant="neutral" size="sm">Queued</Badge>;
      case "failed":
        return <Badge variant="rose" size="sm">Failed</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-subtle rounded-xl p-6 shadow-xs flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide">
              Automated Publishing Calendar
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Scheduled social media queue across connected creator accounts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[var(--bg-app)] border border-subtle rounded-lg p-1 text-xs">
            {(["all", "pending", "published"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                  filter === tab
                    ? "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-medium shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchPosts}
            isLoading={loading}
            aria-label="Refresh calendar"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="flex flex-col divide-y divide-subtle border border-subtle rounded-lg overflow-hidden bg-[var(--bg-app)]/40">
        {loading ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
            Loading scheduled broadcasts...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-2">
            <Clock className="h-5 w-5 text-zinc-600" />
            <span>No scheduled posts found for current filter.</span>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const dateStr = new Date(post.scheduledFor).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={post.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-surface-elevated)]/30 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="h-10 w-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                    <Film className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPlatformBadge(post.socialAccount.platform)}
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {post.socialAccount.accountHandle}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-xs font-mono text-[var(--accent-primary)] flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {dateStr}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-primary)] truncate font-normal">
                      {post.caption}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {getStatusBadge(post.publishStatus)}
                  {post.platformPostId && (
                    <span className="text-[11px] font-mono text-emerald-400">
                      ID: {post.platformPostId}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
