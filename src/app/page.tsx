"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const sampleUrls = [
    { label: "Shopify Lamp", url: "https://luminalight.com/bar", brand: "Lumina" },
    { label: "SaaS CRM", url: "https://leadsync.io/growth", brand: "LeadSync" },
    { label: "Peptide Serum", url: "https://auraskin.com/serum", brand: "AuraSkin" },
  ];

  const sampleHooks = [
    {
      angle: "Pattern Interrupt",
      tag: "Highest CTR",
      hook: "Stop coding under harsh fluorescent lights in 2026.",
      body: "If you get headaches by 3 PM, your monitor setup is ruining your eyes. Lumina auto-matches natural daylight so you stay focused.",
      cta: "Tap the link below for $30 off your desk setup today.",
      retention: "88% Retention",
      brand: "Lumina",
      color: "#F59E0B",
    },
    {
      angle: "Curiosity / Secret Hack",
      tag: "Viral Potential",
      hook: "The $80 desk upgrade that basically eliminated my 3 PM brain fog.",
      body: "I thought I needed more caffeine, but turns out screen glare was triggering eye strain in deep work sprints.",
      cta: "Grab yours before the restock runs out.",
      retention: "84% Retention",
      brand: "Lumina",
      color: "#10B981",
    },
    {
      angle: "Problem → Agitation → Relief",
      tag: "High Conversion",
      hook: "Why does nobody talk about how painful monitor glare actually is?",
      body: "Watch how fast your focus sharpens when your desk temperature adjusts automatically with zero harsh reflections.",
      cta: "Click below to see the difference for yourself.",
      retention: "91% Retention",
      brand: "Lumina",
      color: "#60A5FA",
    },
  ];

  const activeHook = sampleHooks[activeHookIndex] ?? sampleHooks[0]!;

  const handleStartGeneration = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || productUrl;
    if (!targetUrl) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const scrapeRes = await fetch("/api/v1/projects/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const scrapeJson = await scrapeRes.json();
      if (!scrapeRes.ok || !scrapeJson.success) {
        throw new Error(scrapeJson.error?.message || "Failed to analyze URL");
      }

      router.push(
        `/studio?url=${encodeURIComponent(targetUrl)}&brand=${encodeURIComponent(
          scrapeJson.data.brandName
        )}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Scraping failed";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  const handleSampleClick = (sample: typeof sampleUrls[0]) => {
    setProductUrl(sample.url);
    handleStartGeneration(undefined, sample.url);
  };

  const faqs = [
    {
      q: "How does AutoUGC generate a video ad from just a product URL?",
      a: "Our parser extracts your product photos, core value propositions, customer reviews, and brand colors in under 3 seconds. It then generates 3 proven psychological script angles, pairs them with natural AI creator voiceovers, and generates synchronized word-by-word kinetic subtitles inside our 1080p Remotion engine.",
    },
    {
      q: "Can I edit the generated scripts and subtitle styling?",
      a: "Yes. Every element inside AutoUGC Studio is fully editable. You can tweak hook copy, choose from 12 creator voices, adjust kinetic subtitle highlight colors, and select background music tracks.",
    },
    {
      q: "Do I need to download and re-upload files to post on TikTok?",
      a: "No. With our 1-click Social Scheduler, you can authorize TikTok, Instagram Reels, and YouTube Shorts via official OAuth and schedule your campaigns directly onto a unified publishing calendar.",
    },
    {
      q: "Are the generated video ads free of watermarks?",
      a: "Yes. All video exports are 100% watermark-free, rendered in full 1080x1920 9:16 resolution, and include complete commercial usage rights for paid advertising campaigns.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 flex flex-col items-center">
          {/* Top Proof Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-subtle mb-6 text-xs text-[var(--text-secondary)] font-medium">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span>Used by 1,400+ DTC Brands & SaaS Performance Marketers</span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-center tracking-tight max-w-5xl font-[family-name:var(--font-display)] leading-[1.08] mb-6">
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

          {/* Single-Input Generator Form */}
          <div className="w-full max-w-2xl bg-[var(--bg-surface)] p-2.5 rounded-2xl border border-subtle shadow-2xl mb-3">
            <form onSubmit={handleStartGeneration} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  required
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Paste product link (e.g., https://yourbrand.com/item)"
                  className="h-12 border-none bg-[var(--bg-surface-elevated)] focus:ring-0 focus:border-none text-xs sm:text-sm"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="sm:w-auto w-full font-semibold text-xs shadow-glow-amber"
              >
                Generate Free Ad
              </Button>
            </form>
          </div>

          {/* Quick-Test URL Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-[var(--text-muted)]">
            <span className="font-mono text-[11px]">Or try sample:</span>
            {sampleUrls.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-700 transition-colors text-[11px] font-mono"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="mb-6 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-[var(--accent-rose)] font-medium">
              {errorMessage}
            </div>
          )}

          {/* Micro-copy Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-muted)] mb-16">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" /> 3 free video variations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-emerald)]" /> Commercial rights included
            </span>
          </div>

          {/* Interactive Dual-Pane Hero Mockup */}
          <div className="w-full max-w-5xl bg-[var(--bg-surface)] border border-subtle rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-subtle pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono text-[var(--text-muted)]">
                  Live Generator Preview • 1080x1920 9:16 Canvas
                </span>
              </div>
              <Badge variant="amber" size="sm" className="font-mono text-[10px]">
                {activeHook.retention}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: 9:16 Smartphone Mockup (5 cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-[240px] sm:w-[260px] h-[480px] sm:h-[520px] rounded-[36px] bg-black border-4 border-zinc-800 p-3 shadow-2xl flex flex-col justify-between overflow-hidden">
                  {/* Phone Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900 rounded-full z-20" />

                  {/* Video Mockup Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black flex flex-col items-center justify-center p-6 text-center">
                    {/* Simulated Creator Waveform / Sound */}
                    <div className="flex items-center gap-1 mb-6">
                      <Volume2 className="h-3.5 w-3.5 text-[var(--accent-primary)] animate-pulse" />
                      <span className="text-[10px] font-mono text-[var(--accent-primary)]">
                        Voice: Alex (Casual Creator)
                      </span>
                    </div>

                    {/* Word-by-Word Kinetic Subtitle Mockup */}
                    <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 max-w-xs">
                      <span className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white leading-snug">
                        {activeHook.hook.split(" ").map((w, idx) => (
                          <span
                            key={idx}
                            className={
                              idx === 1 || idx === 2
                                ? "text-[var(--accent-primary)] underline decoration-amber-400 font-black px-1"
                                : "text-white px-0.5"
                            }
                          >
                            {w}
                          </span>
                        ))}
                      </span>
                    </div>

                    {/* Sound waves animation */}
                    <div className="flex items-center gap-1 mt-6">
                      {[16, 28, 40, 24, 36, 18, 30, 14].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className="w-1 bg-[var(--accent-primary)]/80 rounded-full"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Social Overlay Icons */}
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-4 z-10 text-white/90">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                      </div>
                      <span className="text-[9px] font-mono font-bold">14.8k</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold">482</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Bookmark className="h-4 w-4 text-amber-400 fill-amber-400" />
                      </div>
                      <span className="text-[9px] font-mono font-bold">3.1k</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        <Share2 className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-mono font-bold">Share</span>
                    </div>
                  </div>

                  {/* Bottom Creator Meta Overlay */}
                  <div className="relative z-10 text-left text-white p-2">
                    <span className="text-xs font-bold font-mono">@{activeHook.brand.toLowerCase()}</span>
                    <p className="text-[10px] text-white/80 line-clamp-2 mt-0.5">
                      {activeHook.cta}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Psychological Hook Switcher (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                  Select Psychological Angle:
                </span>
                <div className="space-y-3">
                  {sampleHooks.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveHookIndex(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        activeHookIndex === idx
                          ? "bg-[var(--bg-surface-elevated)] border-[var(--accent-primary)] shadow-glow-amber/20"
                          : "bg-[var(--bg-app)] border-subtle hover:border-zinc-700 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-[family-name:var(--font-display)]">
                            {sample.angle}
                          </span>
                          <Badge variant={activeHookIndex === idx ? "amber" : "neutral"} size="sm" className="text-[10px] font-mono">
                            {sample.tag}
                          </Badge>
                        </div>
                        <span className="text-[11px] font-mono text-[var(--accent-emerald)] font-semibold">
                          {sample.retention}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                        &ldquo;{sample.hook}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={`/studio?brand=${encodeURIComponent(
                      activeHook.brand
                    )}&hook=${encodeURIComponent(activeHook.hook)}&body=${encodeURIComponent(
                      activeHook.body
                    )}&cta=${encodeURIComponent(activeHook.cta)}`}
                    className="w-full sm:w-auto flex-1"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full font-semibold text-xs justify-center"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Load this Hook in Studio
                    </Button>
                  </Link>
                  <Link href="/templates" className="w-full sm:w-auto">
                    <Button variant="secondary" size="md" className="w-full text-xs justify-center">
                      Browse 6 Industry Blueprints
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Metrics Bar */}
        <section className="border-y border-subtle bg-[var(--bg-surface)] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-display)] text-[var(--accent-primary)] font-mono block">
                60s
              </span>
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                Average Generation Time
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-display)] text-[var(--text-primary)] font-mono block">
                4.2x
              </span>
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                Average Paid Ad ROAS
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-display)] text-[var(--accent-emerald)] font-mono block">
                92%
              </span>
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                Creative Cost Reduction
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-display)] text-[var(--text-primary)] font-mono block">
                140k+
              </span>
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                Video Ads Rendered
              </span>
            </div>
          </div>
        </section>

        {/* 3-Step Autonomous Engine */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="amber" size="sm" className="mb-3 font-mono">
              HOW IT WORKS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-[family-name:var(--font-display)]">
              From Product URL to Live Video Ad in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              Autonomous execution from content extraction to multi-channel scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-subtle flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)]">
                Autonomous Scraper
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Paste your Shopify, Amazon, or custom web link. Our engine extracts product photos, value propositions, and customer reviews in 3 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-subtle flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[var(--accent-emerald)] flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)]">
                Neural Script & Voice Sync
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Generates 3 psychological angles (Pattern Interrupt, Curiosity, Problem-Solution). Synchronizes word-level kinetic captions with 12 creator voices.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-subtle flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)]">
                1-Click Multi-Channel Schedule
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Schedule your rendered 1080p vertical video directly to TikTok, Instagram Reels, and YouTube Shorts via official OAuth or download instant MP4s.
              </p>
            </div>
          </div>
        </section>

        {/* Head-to-Head Comparison Matrix */}
        <section className="border-t border-subtle bg-[var(--bg-surface)] py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge variant="amber" size="sm" className="mb-3 font-mono">
                HEAD-TO-HEAD ECONOMICS
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-[family-name:var(--font-display)]">
                Traditional Agency vs. AutoUGC Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
                Why modern e-commerce brands and SaaS startups are eliminating agency retainers.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-subtle bg-[var(--bg-app)]">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-subtle bg-[var(--bg-surface-elevated)] font-mono text-[var(--text-muted)]">
                    <th className="py-4 px-6 font-semibold">Metric / Capability</th>
                    <th className="py-4 px-6 font-semibold">Creative Agency</th>
                    <th className="py-4 px-6 font-semibold">Freelancer Network</th>
                    <th className="py-4 px-6 font-semibold text-[var(--accent-primary)] font-bold">AutoUGC Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Cost per Video Ad</td>
                    <td className="py-4 px-6 text-rose-400 font-mono">$350 - $600</td>
                    <td className="py-4 px-6 text-yellow-400 font-mono">$150 - $250</td>
                    <td className="py-4 px-6 text-emerald-400 font-mono font-bold">$1.15 / ad</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Turnaround Time</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">10 - 14 Days</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">5 - 7 Days</td>
                    <td className="py-4 px-6 text-[var(--accent-primary)] font-bold font-mono">60 Seconds</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Testing Variations</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">1-2 per batch</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">1 variation</td>
                    <td className="py-4 px-6 text-emerald-400 font-bold">3 angles per URL</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Social Publishing</td>
                    <td className="py-4 px-6 text-[var(--text-muted)]">Manual download/upload</td>
                    <td className="py-4 px-6 text-[var(--text-muted)]">Manual Google Drive</td>
                    <td className="py-4 px-6 text-emerald-400 font-bold">Automated 1-Click Sync</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)]">Commercial Rights</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">Limited (90 days)</td>
                    <td className="py-4 px-6 text-[var(--text-secondary)]">Extra fee required</td>
                    <td className="py-4 px-6 text-emerald-400 font-bold">Perpetual Commercial</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Homepage FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Common questions about automated vertical video generation.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-subtle bg-[var(--bg-surface)] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono text-base text-[var(--text-muted)] ml-4">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-subtle pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 p-8 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-display)] mb-4">
              Start Generating Viral Video Ads Today
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
              Join 1,400+ marketing teams testing high-retention video ads every week. 3 free ad variations ready in 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/studio">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-semibold text-xs shadow-glow-amber"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Launch AutoUGC Studio
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg" className="text-xs">
                  View Transparent Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
