"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Sparkles } from "lucide-react";
import {
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EFECE6] bg-[#FAF8F5]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Left: Brand Identity + Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] focus-visible:ring-offset-2 rounded-xl"
            aria-label="AutoUGC Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FDF3EF] border border-[#F3CEBE] flex items-center justify-center text-[#D95D39] shadow-2xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-[#D95D39]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]">
              Auto<span className="text-[#D95D39]">UGC</span>
            </span>
          </Link>

          {/* Navigation Links to the right of the Brand Name */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#18181B]"
          >
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSolutionsOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={solutionsOpen}
                aria-label="Solutions dropdown menu"
                className="flex items-center gap-1 py-2 hover:text-[#D95D39] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg px-1.5"
              >
                <span>SOLUTIONS</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${solutionsOpen ? "rotate-180 text-[#D95D39]" : "text-[#8E8B85]"}`}
                  aria-hidden="true"
                />
              </button>

              {solutionsOpen && (
                <div
                  role="menu"
                  aria-label="Solutions menu"
                  className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="rounded-2xl border border-[#E5E0D8] bg-white p-3 shadow-xl">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8E8B85]">
                      Platforms
                    </div>
                    <Link
                      href="/templates"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-xs text-[#18181B] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
                    >
                      <span>TikTok Creator Ads</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF3EF] text-[#D95D39] font-bold">Viral</span>
                    </Link>
                    <Link
                      href="/templates"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-xs text-[#18181B] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
                    >
                      <span>Instagram Reels</span>
                      <span className="text-[10px] text-[#8E8B85] font-mono">9:16</span>
                    </Link>
                    <Link
                      href="/templates"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-xs text-[#18181B] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
                    >
                      <span>YouTube Shorts</span>
                      <span className="text-[10px] text-[#8E8B85] font-mono">Shorts</span>
                    </Link>
                    <div className="border-t border-[#EFECE6] my-1 pt-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#8E8B85]">
                      Verticals
                    </div>
                    <Link
                      href="/templates/b2b-saas"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="block p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-xs text-[#52525B] hover:text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
                    >
                      AI &amp; B2B SaaS
                    </Link>
                    <Link
                      href="/templates/ecommerce-shopify"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="block p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-xs text-[#52525B] hover:text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
                    >
                      DTC &amp; E-Commerce
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/brands"
              className="hover:text-[#D95D39] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg px-1.5 py-1"
            >
              FOR SAAS &amp; PRODUCTS
            </Link>

            <Link
              href="/pricing"
              className="hover:text-[#D95D39] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg px-1.5 py-1"
            >
              PRICING
            </Link>
          </nav>
        </div>

        {/* Right CTA Group: Blog + Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider text-[#18181B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
          >
            BLOG
          </Link>

          <Suspense fallback={<div className="h-8 w-24 bg-[#E5E0D8] rounded-full animate-pulse" />}>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="text-xs font-semibold uppercase tracking-wider text-[#18181B] hover:text-[#D95D39] transition-colors cursor-pointer px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
              >
                SIGN IN
              </Link>

              <Link
                href="/sign-up"
                className="px-5 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
              >
                GET STARTED
              </Link>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider text-[#18181B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
              >
                DASHBOARD
              </Link>
              <Link
                href="/studio"
                className="px-4 py-2 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
              >
                STUDIO
              </Link>
              <div className="ml-1">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8 ring-1 ring-[#E5E0D8]",
                    },
                  }}
                />
              </div>
            </Show>
          </Suspense>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#18181B] hover:text-[#D95D39] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile Navigation"
          className="lg:hidden border-b border-[#EFECE6] bg-[#FAF8F5] px-6 pt-4 pb-6 flex flex-col gap-3"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#D95D39] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#D95D39]" />
            <span>AUTOUGC HOME</span>
          </Link>
          <Link
            href="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
          >
            SOLUTIONS
          </Link>
          <Link
            href="/brands"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
          >
            FOR SAAS &amp; PRODUCTS
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
          >
            PRICING
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
          >
            BLOG
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39] rounded-lg"
          >
            DASHBOARD
          </Link>
          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 text-center rounded-full bg-[#18181B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
          >
            GET STARTED
          </Link>
        </nav>
      )}
    </header>
  );
}
