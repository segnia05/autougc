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
          {/* Website Name AutoUGC placed at the first position on the left of Solutions */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none shrink-0"
            aria-label="AutoUGC Home"
          >
            <span className="text-2xl font-light text-[#1B231B] group-hover:rotate-45 transition-transform duration-300">
              ✻
            </span>
            <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#1B231B] font-[family-name:var(--font-serif)]">
              AutoUGC
            </span>
          </Link>

          {/* Navigation Links to the right of the Brand Name */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#1B231B]">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 py-2 hover:text-[#1F3824] transition-colors cursor-pointer"
              >
                <span>SOLUTIONS</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="rounded-2xl border border-[#D8DFD2] bg-white p-3 shadow-xl">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#738072]">
                      Platforms
                    </div>
                    <Link
                      href="/templates"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#1B231B] font-medium"
                    >
                      <span>TikTok Creator Ads</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E2E9DC] text-[#1F3824]">Viral</span>
                    </Link>
                    <Link
                      href="/templates"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#1B231B] font-medium"
                    >
                      <span>Instagram Reels</span>
                      <span className="text-[10px] text-[#738072] font-mono">9:16</span>
                    </Link>
                    <Link
                      href="/templates"
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#1B231B] font-medium"
                    >
                      <span>YouTube Shorts</span>
                      <span className="text-[10px] text-[#738072] font-mono">Shorts</span>
                    </Link>
                    <div className="border-t border-[#EAEFE5] my-1 pt-1 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#738072]">
                      Verticals
                    </div>
                    <Link
                      href="/templates/b2b-saas"
                      className="block p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#4A544A] hover:text-[#1B231B]"
                    >
                      AI & B2B SaaS
                    </Link>
                    <Link
                      href="/templates/ecommerce-shopify"
                      className="block p-2 rounded-xl hover:bg-[#F2F5ED] transition-colors text-xs text-[#4A544A] hover:text-[#1B231B]"
                    >
                      DTC & E-Commerce
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/brands"
              className="hover:text-[#1F3824] transition-colors"
            >
              FOR SAAS & PRODUCTS
            </Link>

            <Link
              href="/pricing"
              className="hover:text-[#1F3824] transition-colors"
            >
              PRICING
            </Link>
          </nav>
        </div>

        {/* Right CTA Group: Blog in place of View Plans + Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/blog"
            className="btn-outline px-5 py-2 text-xs font-semibold uppercase tracking-wider"
          >
            BLOG
          </Link>

          <Suspense fallback={<div className="h-8 w-24 bg-[#E2E6DC] rounded-full animate-pulse" />}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wider text-[#1B231B] hover:text-black transition-colors cursor-pointer px-2"
                >
                  SIGN IN
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="btn-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  GET STARTED
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link href="/dashboard">
                <button
                  type="button"
                  className="btn-outline px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                >
                  DASHBOARD
                </button>
              </Link>
              <Link href="/studio">
                <button
                  type="button"
                  className="btn-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider"
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
            className="p-2 text-[#1B231B] hover:text-black rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E6DC] bg-[#F6F7F2] px-6 pt-4 pb-6 flex flex-col gap-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1F3824] flex items-center gap-1.5"
          >
            <span>✻</span>
            <span>AUTOUGC HOME</span>
          </Link>
          <Link
            href="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B]"
          >
            SOLUTIONS
          </Link>
          <Link
            href="/brands"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B]"
          >
            FOR SAAS & PRODUCTS
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B]"
          >
            PRICING
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B]"
          >
            BLOG
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold uppercase tracking-wider text-[#1B231B]"
          >
            DASHBOARD
          </Link>
          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 text-center btn-primary text-xs font-semibold uppercase tracking-wider"
          >
            GET STARTED
          </Link>
        </div>
      )}
    </header>
  );
}
