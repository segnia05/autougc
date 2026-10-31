"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface IntegrationChannel {
  id: string;
  name: string;
  subtitle: string;
  notice?: string;
  iconSvg: React.ReactNode;
  isConnected: boolean;
}

export default function IntegrationsSettingsPage() {
  const [channels, setChannels] = useState<IntegrationChannel[]>([
    {
      id: "tiktok",
      name: "TikTok",
      subtitle: "Log in to TikTok in this browser first",
      isConnected: false,
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.82 4.48c1.3-1.3 1.9-3.05 1.9-5.12V8.47a8.27 8.27 0 0 0 4.77 1.52V6.69z" />
        </svg>
      ),
    },
    {
      id: "instagram",
      name: "Instagram",
      subtitle: "Log in to Instagram in this browser first",
      isConnected: false,
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: "youtube",
      name: "YouTube",
      subtitle: "Not connected",
      isConnected: false,
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      subtitle: "Not connected",
      notice: "LinkedIn connections expire every 60 days; you will be prompted to reconnect.",
      isConnected: false,
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ]);

  const [metaConnected, setMetaConnected] = useState(false);

  const handleToggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isConnected: !c.isConnected } : c))
    );
  };

  const connectedCount = channels.filter((c) => c.isConnected).length + (metaConnected ? 1 : 0);

  return (
    <AppShell title="Integrations">
      <div className="max-w-4xl mx-auto space-y-6 select-none">
        {/* Header Breadcrumb & Title (Screenshot 2 Match) */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs text-[#8E8B85] hover:text-[#18181B] font-medium transition-colors mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
            Integrations
          </h1>

          <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
            Where AutoUGC posts · {connectedCount} of 10 connected
          </div>
        </div>

        {/* Social Organic Publisher Cards List (Screenshot 2 Match) */}
        <div className="fastlane-card bg-white overflow-hidden divide-y divide-[#EFECE6]">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/40 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#18181B] shadow-2xs">
                  {channel.iconSvg}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#18181B]">
                    {channel.name}
                  </div>
                  <div className="text-[11px] text-[#8E8B85] truncate">
                    {channel.isConnected ? "Connected & active" : channel.subtitle}
                  </div>
                  {channel.notice && !channel.isConnected && (
                    <div className="text-[10px] text-[#8E8B85] mt-0.5">
                      {channel.notice}
                    </div>
                  )}
                </div>
              </div>

              {channel.isConnected ? (
                <button
                  type="button"
                  onClick={() => handleToggleChannel(channel.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleChannel(channel.id)}
                  className="btn-fastlane-white text-xs px-4 py-1.5 h-8 shadow-2xs"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Warmed Accounts Bridge Callout (Screenshot 2 Match) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFF9F6] border border-[#F5E2DA]">
          <div className="text-xs text-[#52525B]">
            Ready-made accounts we run for you have their own page in Settings.
          </div>
          <button
            type="button"
            className="btn-fastlane-white text-xs px-3.5 py-1.5 h-8 self-start sm:self-center flex items-center gap-1 shadow-2xs"
          >
            <span>Warmed accounts</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E8B85]" />
          </button>
        </div>

        {/* ADS Section (Screenshot 2 Match) */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B85]">
            Ads
          </div>

          <div
            onClick={() => setMetaConnected(!metaConnected)}
            className="fastlane-card p-4 sm:p-5 bg-white flex items-center justify-between gap-4 cursor-pointer hover:border-[#E5E0D8] transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-center text-[#0668E1] shadow-2xs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7.3 4.5 3.5 7.9 3.5 12c0 2.4 1.3 4.6 3.3 5.9.3.2.4.6.2.9-.2.3-.6.4-.9.2-2.4-1.6-3.9-4.2-3.9-7C2.2 6.8 6.6 3 12 3s9.8 3.8 9.8 9c0 2.8-1.5 5.4-3.9 7-.3.2-.7.1-.9-.2-.2-.3-.1-.7.2-.9 2-1.3 3.3-3.5 3.3-5.9 0-4.1-3.8-7.5-8.5-7.5zm-2.7 6.3c-1.3 0-2.4 1-2.4 2.3 0 1.2 1.1 2.3 2.4 2.3 1 0 1.9-.6 2.2-1.5.1-.3.4-.5.7-.5s.6.2.7.5c.3.9 1.2 1.5 2.2 1.5 1.3 0 2.4-1 2.4-2.3 0-1.2-1.1-2.3-2.4-2.3-.9 0-1.7.5-2.1 1.3-.2.3-.5.5-.8.5s-.6-.2-.8-.5c-.4-.8-1.2-1.3-2.1-1.3z" />
                </svg>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#18181B] flex items-center gap-2">
                  <span>Meta ad account</span>
                  {metaConnected && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#8E8B85]">
                  AutoUGC runs paid posts from it
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#8E8B85] group-hover:text-[#18181B] transition-colors" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

