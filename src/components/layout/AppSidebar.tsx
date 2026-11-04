"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Sparkles,
  Fingerprint,
  BarChart3,
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
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Campaigns", href: "/campaigns", icon: Layers },
  { label: "Studio", href: "/studio", icon: Sparkles, isSpecial: true },
  { label: "Brand", href: "/brand", icon: Fingerprint },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Contact Us", href: "/contact", icon: MessageSquare },
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

                {item.isSpecial && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FDF3EF] text-[#D95D39] border border-[#F3CEBE]">
                    Editor
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
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
