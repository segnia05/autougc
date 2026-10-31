"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Sparkles,
  Fingerprint,
  Radar,
  BarChart3,
  Plus,
  MessageSquare,
} from "lucide-react";
import WorkspaceSelector from "./WorkspaceSelector";
import WorkspaceCreditBadge from "./WorkspaceCreditBadge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isSpecial?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home, badge: "1" },
  { label: "Campaigns", href: "/campaigns", icon: Layers },
  { label: "Studio", href: "/studio", icon: Sparkles, isSpecial: true },
  { label: "Brand", href: "/brand", icon: Fingerprint },
  { label: "Radar", href: "/radar", icon: Radar },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

interface AppSidebarProps {
  brandName?: string;
  credits?: number;
}

export default function AppSidebar({ brandName, credits = 50 }: AppSidebarProps) {
  const pathname = usePathname();
  const effectiveBrand = brandName || (typeof window !== "undefined" ? localStorage.getItem("autougc_brand_name") : null) || "Your Brand";

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between p-4 bg-[#FAF8F5] border-r border-[#EFECE6] select-none">
      {/* Top Section: Workspace Selector & Navigation Links */}
      <div className="space-y-6">
        {/* Workspace Brand Switcher */}
        <div className="pt-1 px-1">
          <WorkspaceSelector currentBrand={effectiveBrand} />
        </div>

        {/* Primary Navigation Stack */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white border border-[#EFECE6] text-[#18181B] font-semibold shadow-2xs"
                    : "text-[#52525B] hover:text-[#18181B] hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? item.isSpecial
                          ? "text-[#D95D39]"
                          : "text-[#18181B]"
                        : "text-[#8E8B85] group-hover:text-[#18181B]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Badge Indicator (e.g. "• 1") */}
                {item.badge && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#D95D39]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D95D39]" />
                    <span>{item.badge}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Conversational Copilot Threads Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-semibold text-[#52525B]">Chats</span>
            <button
              type="button"
              title="New thread"
              className="w-5 h-5 rounded-md border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-[#D95D39] flex items-center justify-center transition-all shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 px-3">
            <p className="text-xs text-[#8E8B85]">No threads yet.</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Credit Consumption Badge */}
      <div className="pt-4">
        <WorkspaceCreditBadge
          brandName={effectiveBrand}
          credits={credits}
          maxCredits={250}
          percentageUsed={20}
        />
      </div>
    </aside>
  );
}

