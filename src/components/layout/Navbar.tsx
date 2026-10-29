"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E6DC] bg-[#F6F7F2]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Left: Brand Identity + Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2 rounded-xl"
            aria-label="AutoUGC Home"
          >
            <span className="text-2xl font-light text-[#1B231B] group-hover:rotate-45 transition-transform duration-300" aria-hidden="true">
              ✻
            </span>
            <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#1B231B] font-[family-name:var(--font-serif)]">
              AutoUGC
            </span>
          </Link>

          {/* Navigation Links to the right of the Brand Name */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#1B231B]"
          >
            {/* Solutions Dropdown with Full Keyboard Accessibility */}
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
                className="flex items-center gap-1 py-2 hover:text-[#1F3824] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg px-1.5"
              >
                <span>SOLUTIONS</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {solutionsOpen && (
                <div
                  role="menu"
                  aria-label="Solutions menu"
                  className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="rounded-2xl border border-[#D8DFD2] bg-white p-3 shadow-xl">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#738072]">
                      Platforms
                    </div>
                    <Link
                      href="/templates"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#1B231B] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
                    >
                      <span>TikTok Creator Ads</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">Viral</span>
                    </Link>
                    <Link
                      href="/templates"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#1B231B] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
                    >
                      <span>Instagram Reels</span>
                      <span className="text-[10px] text-[#738072] font-mono">9:16</span>
                    </Link>
                    <Link
                      href="/templates"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#1B231B] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
                    >
                      <span>YouTube Shorts</span>
                      <span className="text-[10px] text-[#738072] font-mono">Shorts</span>
                    </Link>
                    <div className="border-t border-[#EAEFE5] my-1 pt-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#738072]">
                      Verticals
                    </div>
                    <Link
                      href="/templates/b2b-saas"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="block p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#4A544A] hover:text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
                    >
                      AI & B2B SaaS
                    </Link>
                    <Link
                      href="/templates/ecommerce-shopify"
                      role="menuitem"
                      onClick={() => setSolutionsOpen(false)}
                      className="block p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#4A544A] hover:text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
                    >
                      DTC & E-Commerce
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/brands"
              className="hover:text-[#1F3824] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg px-1.5 py-1"
            >
              FOR SAAS & PRODUCTS
            </Link>

            <Link
              href="/pricing"
              className="hover:text-[#1F3824] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg px-1.5 py-1"
            >
              PRICING
            </Link>
          </nav>
        </div>

        {/* Right CTA Group: Blog in place of View Plans + Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/blog"
            className="btn-outline px-5 py-2 text-xs font-semibold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2"
          >
            BLOG
          </Link>

          <Suspense fallback={<div className="h-8 w-24 bg-[#E2E6DC] rounded-full animate-pulse" />}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wider text-[#1B231B] hover:text-black transition-colors cursor-pointer px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
                >
                  SIGN IN
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="btn-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2"
                >
                  GET STARTED
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link href="/dashboard">
                <button
                  type="button"
                  className="btn-outline px-4 py-2 text-xs font-semibold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2"
                >
                  DASHBOARD
                </button>
              </Link>
              <Link href="/studio">
                <button
                  type="button"
                  className="btn-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2"
                >
                  STUDIO
                </button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-1 ring-[#1F3824]/30",
                  },
                }}
              />
            </Show>
          </Suspense>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1B231B] hover:text-black rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824]"
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
          className="lg:hidden border-b border-[#E2E6DC] bg-[#F6F7F2] px-6 pt-4 pb-6 flex flex-col gap-3"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1F3824] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
          >
            <span aria-hidden="true">✻</span>
            <span>AUTOUGC HOME</span>
          </Link>
          <Link
            href="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
          >
            SOLUTIONS
          </Link>
          <Link
            href="/brands"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
          >
            FOR SAAS & PRODUCTS
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
          >
            PRICING
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
          >
            BLOG
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] rounded-lg"
          >
            DASHBOARD
          </Link>
          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 text-center btn-primary text-xs font-semibold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-offset-2"
          >
            GET STARTED
          </Link>
        </nav>
      )}
    </header>
  );
}
