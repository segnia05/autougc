"use client";

import React, { useState } from "react";
import AppSidebar from "./AppSidebar";
import TopHeaderBar from "./TopHeaderBar";
import { Menu, X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  brandName?: string;
}

export default function AppShell({
  children,
  title,
  brandName,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const effectiveBrand = brandName || (typeof window !== "undefined" ? localStorage.getItem("autougc_brand_name") : null) || "Your Brand";

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-[#18181B] fastlane-grid-bg antialiased">
      {/* Desktop Sidebar (Persistent) */}
      <div className="hidden md:block flex-shrink-0">
        <AppSidebar brandName={effectiveBrand} />
      </div>

      {/* Mobile Drawer Trigger Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFECE6]">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded-lg border border-[#E5E0D8] bg-white text-[#18181B]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold">{effectiveBrand}</span>
        <div className="w-8" />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-72 max-w-[85vw] h-full bg-[#FAF8F5]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#E5E0D8] bg-white text-[#18181B]"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
            <AppSidebar brandName={effectiveBrand} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeaderBar brandName={effectiveBrand} title={title} />
        <main id="main-content" className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

