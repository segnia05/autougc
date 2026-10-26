"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/studio", label: "Studio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/templates", label: "Templates" },
    { href: "/tools", label: "Free Tools" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-subtle bg-[var(--bg-app)]/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          aria-label="AutoUGC Home"
        >
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-amber transition-transform duration-200 group-hover:scale-105">
            <Video className="h-5 w-5 text-black" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)] text-[var(--text-primary)]">
              Auto<span className="text-[var(--accent-primary)]">UGC</span>
            </span>
            <Badge variant="neutral" size="sm" className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5">
              v2.4
            </Badge>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] border border-subtle"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Suspense fallback={<div className="h-8 w-20 bg-zinc-800 rounded animate-pulse" />}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs font-medium cursor-pointer"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs font-semibold shadow-glow-amber cursor-pointer"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Get Started
                </Button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs font-semibold"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/studio">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs font-semibold shadow-glow-amber"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Launch Studio
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-1 ring-zinc-700",
                  },
                }}
              />
            </Show>
          </Suspense>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/studio">
            <Button variant="primary" size="sm" className="text-xs px-3">
              Studio
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-subtle bg-[var(--bg-surface)] px-4 pt-3 pb-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--accent-primary)] bg-[var(--bg-surface-elevated)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="h-[1px] bg-[var(--border-subtle)] my-2" />
          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full"
          >
            <Button variant="primary" size="md" className="w-full justify-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Free Video Ad
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
