"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

  const getStatusBadge = (status: string, scheduledFor?: string) => {
    switch (status) {
      case "published":
        return <Badge variant="emerald" size="sm">Published</Badge>;
      case "processing":
        return <Badge variant="amber" size="sm" pulse>Rendering & Posting...</Badge>;
      case "pending": {
        const isToday =
          scheduledFor &&
          new Date(scheduledFor).toDateString() === new Date().toDateString();
        return isToday ? (
          <Badge variant="amber" size="sm">Rendering Today (JIT)</Badge>
        ) : (
          <Badge variant="neutral" size="sm">Scheduled (JIT)</Badge>
        );
      }
      case "failed":
        return <Badge variant="rose" size="sm">Failed</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#CBD5C4]/60">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-full bg-[#E2E9DC] border border-[#CBD5C4] flex items-center justify-center text-[#1F3824] shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1B231B] font-[family-name:var(--font-serif)]">
                Automated 30-Day Publishing Queue
              </h3>
              <Badge variant="emerald" size="sm">Autopilot Active</Badge>
            </div>
            <p className="text-xs text-[#4A544A]">
              Scheduled broadcasts rotated across official brand and satellite accounts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          {/* Multi-Account Filter Dropdown */}
          {uniqueAccounts.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#F6F7F2] border border-[#CBD5C4] rounded-full px-3 py-1.5 text-xs text-[#4A544A]">
              <Users className="h-3.5 w-3.5 text-[#717E6C]" />
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                aria-label="Filter scheduled posts by social account"
                className="bg-transparent text-xs text-[#1B231B] focus:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1F3824]"
              >
                <option value="all" className="bg-white">All Accounts ({uniqueAccounts.length})</option>
                {uniqueAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-white">
                    {acc.nickname || acc.handle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter Buttons */}
          <div role="tablist" aria-label="Filter posts by publication status" className="flex items-center bg-[#ECEFE7] border border-[#CBD5C4]/70 rounded-full p-1 text-xs">
            {(["all", "pending", "published"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs capitalize transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? "bg-[#1F3824] text-white font-semibold shadow-xs"
                    : "text-[#4A544A] hover:text-[#1B231B]"
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
      <div className="flex flex-col divide-y divide-[#CBD5C4]/60 border border-[#CBD5C4]/70 rounded-2xl overflow-hidden bg-[#FAFBF9]">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#717E6C] font-mono">
            Loading scheduled broadcasts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#717E6C] flex flex-col items-center gap-3">
            <Clock className="h-6 w-6 text-[#717E6C]" />
            <p className="text-sm font-medium text-[#1B231B]">No scheduled posts found for the selected filter.</p>
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
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="h-10 w-8 rounded-lg bg-[#E2E9DC] border border-[#CBD5C4] flex items-center justify-center text-[#1F3824] shrink-0">
                    <Film className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    {/* Badges Bar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPlatformBadge(post.socialAccount.platform)}

                      {/* Account Nickname & Handle */}
                      <span className="text-xs font-semibold text-[#1B231B]">
                        {post.socialAccount.accountNickname || post.socialAccount.accountHandle}
                      </span>

                      {post.socialAccount.isBurner ? (
                        <Badge variant="amber" size="sm">Satellite</Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">Brand</Badge>
                      )}

                      {getHookBadge(post.hookAngle)}

                      <span className="text-xs text-[#CBD5C4]">•</span>

                      {/* Scheduled Local Time */}
                      <span className="text-xs font-mono text-[#1F3824] flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" /> {timeLabel}
                      </span>
                    </div>

                    {/* Post Caption */}
                    <p className="text-xs text-[#4A544A] truncate font-normal">
                      {post.caption}
                    </p>
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  {getStatusBadge(post.publishStatus, post.scheduledFor)}

                  {/* Edit in Studio Link */}
                  {post.publishStatus !== "published" && (
                    <Link
                      href={`/studio?scheduledPostId=${post.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F3824] bg-white border border-[#CBD5C4] hover:bg-[#E2E9DC] px-2.5 py-1 rounded-full transition-colors"
                    >
                      <span>Edit in Studio</span>
                    </Link>
                  )}

                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1F3824] hover:underline"
                    >
                      <span>Live Post</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {post.platformPostId && !post.postUrl && (
                    <span className="text-[11px] font-mono text-[#1F3824] font-semibold">
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
