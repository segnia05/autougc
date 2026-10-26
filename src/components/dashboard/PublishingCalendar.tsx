"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  RefreshCw,
  Film,
  Sparkles,
  ExternalLink,
  Users,
} from "lucide-react";
import { AutoScheduleModal } from "./AutoScheduleModal";

export interface ScheduledPostItem {
  id: string;
  caption: string;
  scheduledFor: string;
  localScheduledTime?: string | null;
  publishStatus: "pending" | "processing" | "published" | "failed";
  platformPostId?: string | null;
  postUrl?: string | null;
  hookAngle?: string | null;
  socialAccount: {
    id?: string;
    platform: "tiktok" | "instagram" | "youtube";
    accountHandle: string;
    accountNickname?: string | null;
    isBurner?: boolean;
  };
  video?: {
    durationSeconds: number;
    thumbnailUrl?: string | null;
  };
  campaign?: {
    id: string;
    name: string;
    cadence: string;
  } | null;
}

export function PublishingCalendar() {
  const [posts, setPosts] = useState<ScheduledPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "published">("all");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/v1/social/schedule", window.location.origin);
      if (selectedAccountId !== "all") {
        url.searchParams.set("accountId", selectedAccountId);
      }
      if (statusFilter !== "all") {
        url.searchParams.set("status", statusFilter);
      }
      const res = await fetch(url.toString());
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
    let ignore = false;
    async function loadInitial() {
      try {
        const url = new URL("/api/v1/social/schedule", window.location.origin);
        if (selectedAccountId !== "all") {
          url.searchParams.set("accountId", selectedAccountId);
        }
        if (statusFilter !== "all") {
          url.searchParams.set("status", statusFilter);
        }
        const res = await fetch(url.toString());
        const data = await res.json();
        if (!ignore && data.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.warn("Failed to load scheduled posts:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, [selectedAccountId, statusFilter]);

  // Extract unique accounts present in posts
  const uniqueAccountsMap = new Map<string, { id: string; handle: string; nickname?: string | null }>();
  posts.forEach((p) => {
    if (p.socialAccount.id) {
      uniqueAccountsMap.set(p.socialAccount.id, {
        id: p.socialAccount.id,
        handle: p.socialAccount.accountHandle,
        nickname: p.socialAccount.accountNickname,
      });
    }
  });
  const uniqueAccounts = Array.from(uniqueAccountsMap.values());

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

  const getHookBadge = (hookAngle?: string | null) => {
    if (!hookAngle) return null;
    switch (hookAngle) {
      case "pattern_interrupt":
        return <Badge variant="rose" size="sm">Pattern Interrupt</Badge>;
      case "curiosity_hack":
        return <Badge variant="amber" size="sm">Curiosity Hack</Badge>;
      case "problem_agitation":
        return <Badge variant="neutral" size="sm">Problem / Agitation</Badge>;
      case "social_proof":
        return <Badge variant="emerald" size="sm">Social Proof</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{hookAngle.replace("_", " ")}</Badge>;
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide">
                Automated 30-Day Publishing Queue
              </h3>
              <Badge variant="emerald" size="sm">Autopilot Active</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Scheduled broadcasts rotated across official brand and satellite accounts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          {/* Multi-Account Filter Dropdown (if multiple accounts exist) */}
          {uniqueAccounts.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[var(--bg-app)] border border-subtle rounded-lg px-2 py-1 text-xs text-[var(--text-secondary)]">
              <Users className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[var(--bg-surface)]">All Accounts ({uniqueAccounts.length})</option>
                {uniqueAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[var(--bg-surface)]">
                    {acc.nickname || acc.handle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[var(--bg-app)] border border-subtle rounded-lg p-1 text-xs">
            {(["all", "pending", "published"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                  statusFilter === tab
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

          {/* Autopilot Launch Wizard Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            leftIcon={<Sparkles className="h-3.5 w-3.5" />}
          >
            Auto-Schedule 30-Day Drip
          </Button>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="flex flex-col divide-y divide-subtle border border-subtle rounded-lg overflow-hidden bg-[var(--bg-app)]/40">
        {loading ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
            Loading scheduled broadcasts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-3">
            <Clock className="h-6 w-6 text-zinc-600" />
            <p>No scheduled posts found for the selected filter.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Generate 30-Day Autopilot Schedule
            </Button>
          </div>
        ) : (
          posts.map((post) => {
            const timeLabel = post.localScheduledTime || new Date(post.scheduledFor).toLocaleString("en-US", {
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

                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    {/* Badges Bar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPlatformBadge(post.socialAccount.platform)}

                      {/* Account Nickname & Handle */}
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {post.socialAccount.accountNickname || post.socialAccount.accountHandle}
                      </span>

                      {post.socialAccount.isBurner ? (
                        <Badge variant="amber" size="sm">Satellite</Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">Brand</Badge>
                      )}

                      {getHookBadge(post.hookAngle)}

                      <span className="text-xs text-[var(--text-muted)]">•</span>

                      {/* Scheduled Local Time */}
                      <span className="text-xs font-mono text-[var(--accent-primary)] flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {timeLabel}
                      </span>
                    </div>

                    {/* Post Caption */}
                    <p className="text-xs text-[var(--text-secondary)] truncate font-normal">
                      {post.caption}
                    </p>
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {getStatusBadge(post.publishStatus)}

                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--accent-primary)] hover:underline"
                    >
                      <span>Live Post</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {post.platformPostId && !post.postUrl && (
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

      {/* Auto-Schedule 30-Day Drip Wizard Modal */}
      <AutoScheduleModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={fetchPosts}
      />
    </div>
  );
}
