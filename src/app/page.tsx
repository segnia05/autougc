"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";
import { Sparkles, ArrowRight, Video, Zap, CheckCircle2, Play, Shield, BarChart3 } from "lucide-react";

export default function Home() {
  const [productUrl, setProductUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeHook, setActiveHook] = useState(0);

  const sampleHooks = [
    {
      angle: "Pattern Interrupt / Negative Hook",
      tag: "Highest CTR",
      hook: "Stop coding under harsh fluorescent lights in 2026.",
      body: "If you get headaches by 3 PM, your monitor setup is ruining your eyes. Lumina auto-matches natural daylight...",
      retention: "84% Completion Rate",
    },
    {
      angle: "Secret Hack / Curiosity",
      tag: "Viral Potential",
      hook: "The $80 desk upgrade that basically eliminated my 3 PM brain fog.",
      body: "I thought I needed more caffeine, but turns out lighting was triggering eye strain in deep work sprints...",
      retention: "79% Completion Rate",
    },
    {
      angle: "Problem → Agitation → Relief",
      tag: "High Conversion",
      hook: "Why does nobody talk about how painful monitor glare actually is?",
      body: "Watch how fast your focus sharpens when your desk temperature adjusts automatically...",
      retention: "88% Completion Rate",
    },
  ];

  const [errorMessage, setErrorMessage] = useState("");

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Scrape URL
      const scrapeRes = await fetch("/api/v1/projects/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });

      const scrapeJson = await scrapeRes.json();
      if (!scrapeRes.ok || !scrapeJson.success) {
        throw new Error(scrapeJson.error?.message || "Failed to analyze URL");
      }

      // 2. Navigate straight into Studio
      window.location.href = `/studio?url=${encodeURIComponent(productUrl)}&brand=${encodeURIComponent(
        scrapeJson.data.brandName
      )}`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Scraping failed";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-subtle bg-[var(--bg-app)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-glow-amber">
              <Video className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-display)]">
              Auto<span className="text-[var(--accent-primary)]">UGC</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
              Features
            </a>
            <a href="#hooks" className="hover:text-[var(--text-primary)] transition-colors">
              Viral Hooks
            </a>
            <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Link href="/studio">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center">
        {/* Social Proof Badge */}
        <Badge variant="amber" size="md" pulse className="mb-6">
          <Sparkles className="h-3 w-3" />
          <span>Used by 1,400+ E-Commerce Brands & SaaS Founders</span>
        </Badge>

        {/* H1 Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center tracking-tight max-w-4xl font-[family-name:var(--font-display)] leading-[1.1] mb-6">
          Turn Any Product URL into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
            Viral Video Ads
          </span>{" "}
          in 60 Seconds
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[var(--text-secondary)] text-center max-w-2xl font-normal leading-relaxed mb-10">
          Zero camera time. Zero $2,000 agency retainers. Export high-converting 9:16 TikTok, Reels & Shorts ads backed by proven viral hook formulas.
        </p>

        {/* The 3-Second Single-Input Form */}
        <div className="w-full max-w-2xl bg-[var(--bg-surface)] p-2.5 rounded-2xl border border-subtle shadow-2xl mb-4">
          <form onSubmit={handleStartGeneration} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                type="url"
                required
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://yourproduct.com/item..."
                className="h-12 border-none bg-[var(--bg-surface-elevated)] focus:ring-0 focus:border-none text-base"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="sm:w-auto w-full font-semibold"
            >
              Generate Free Ad
            </Button>
          </form>
        </div>

        {errorMessage && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-[var(--accent-rose)] font-medium">
            {errorMessage}
          </div>
        )}

        {/* Micro-copy Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-muted)] mb-16">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" /> 3 free video renders
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" /> Ready in under 60 seconds
          </span>
        </div>

        {/* Live Hook Preview Showcase */}
        <div id="hooks" className="w-full mt-4">
          <div className="flex flex-col items-center mb-8 text-center">
            <Badge variant="neutral" size="sm" className="mb-2 font-mono">
              PROVEN FORMULAS
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">
              The 3 Viral Hooks Generated for Every URL
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Every campaign tests 3 distinct psychological angles to guarantee ad fatigue resistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleHooks.map((sample, idx) => (
              <Card
                key={idx}
                hoverEffect
                onClick={() => setActiveHook(idx)}
                className={`cursor-pointer transition-all ${
                  activeHook === idx
                    ? "border-[var(--accent-primary)] bg-[var(--bg-surface-elevated)] shadow-glow-amber/20"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={activeHook === idx ? "amber" : "neutral"} size="sm">
                      {sample.tag}
                    </Badge>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {sample.retention}
                    </span>
                  </div>
                  <CardTitle className="text-base text-[var(--text-primary)]">
                    {sample.angle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-[var(--bg-app)] border border-subtle">
                    <p className="text-xs font-semibold text-[var(--accent-primary)] mb-1 font-mono">
                      HOOK (0:00 - 0:03)
                    </p>
                    <p className="text-sm font-medium leading-snug">
                      &ldquo;{sample.hook}&rdquo;
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-app)]/50 border border-subtle">
                    <p className="text-xs font-semibold text-[var(--text-muted)] mb-1 font-mono">
                      BODY (0:03 - 0:12)
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {sample.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="w-full mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-subtle">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[var(--accent-primary)]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
                Autonomous Scraper
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Extracts your value proposition, high-res product photos, and brand colors in 3 seconds flat.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-subtle">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[var(--accent-emerald)]">
                <Play className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
                Kinetic Subtitles & Voice
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Word-by-word highlighted captions synchronized to conversational 24-year-old creator voices.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-subtle">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
                1-Click Auto-Scheduler
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Push directly to TikTok, Instagram Reels, and YouTube Shorts or export crystal-clear 1080p MP4s.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-subtle py-10 bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-[var(--accent-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">AutoUGC</span>
            <span>&copy; 2026 All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">
              Pricing
            </a>
            <a href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
