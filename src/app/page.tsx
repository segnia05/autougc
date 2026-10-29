"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Volume2,
  ArrowUp,
  ArrowDown,
  FileText,
  ThumbsUp,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  Home as HomeIcon,
  MessageSquare,
  Send,
  CreditCard,
  ChevronRight,
  Globe,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Declined">("All");

  const sampleUrls = [
    { label: "AI Humanizer SaaS", url: "https://humanizeai.io", brand: "HumanizeAI" },
    { label: "DTC Ergonomic Desk", url: "https://luminalight.com/bar", brand: "Lumina" },
    { label: "B2B Lead CRM", url: "https://leadsync.io/growth", brand: "LeadSync" },
  ];

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
        `/dashboard?tab=calendar&launchAutopilot=true&url=${encodeURIComponent(
          targetUrl
        )}&brand=${encodeURIComponent(
          scrapeJson.data.brandName || "My Brand"
        )}&projectId=${encodeURIComponent(scrapeJson.data.id || "")}`
      );
    } catch {
      // In offline/dev fallback, still route cleanly to dashboard autopilot
      router.push(
        `/dashboard?tab=calendar&launchAutopilot=true&url=${encodeURIComponent(targetUrl)}&brand=MyBrand`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const creatorCards = [
    {
      id: 1,
      image: "/images/creator-male.jpg",
      status: "Pending" as const,
      name: "Marcus V.",
      hook: "Why 90% of students fail...",
    },
    {
      id: 2,
      image: "/images/creator-glasses.jpg",
      status: "Approved" as const,
      name: "Sarah E.",
      hook: "The study hack no one talks about",
    },
    {
      id: 3,
      image: "/images/study-creator.jpg",
      status: "Approved" as const,
      name: "Chloe M.",
      hook: "How school felt before this tool",
    },
    {
      id: 4,
      image: "/images/creator-glasses.jpg",
      status: "Declined" as const,
      name: "Jessica K.",
      hook: "Testing AI in 30 seconds",
    },
    {
      id: 5,
      image: "/images/creator-male.jpg",
      status: "Approved" as const,
      name: "David L.",
      hook: "Stop manual outreach now",
    },
    {
      id: 6,
      image: "/images/study-creator.jpg",
      status: "Pending" as const,
      name: "Elena R.",
      hook: "My viral TikTok strategy",
    },
  ];

  const filteredCards = activeTab === "All"
    ? creatorCards
    : creatorCards.filter((c) => c.status === activeTab);

  const faqs = [
    {
      q: "How does AutoUGC replace an entire creator marketing agency?",
      a: "Agencies charge 20–40% markups, take weeks to deliver, and hand you a spreadsheet at month-end. AutoUGC is software-powered: you enter your product URL once, and our engine automatically scrapes your value propositions, writes 3 proven psychological script angles, synthesizes ultra-realistic creator voiceovers, and generates 1080p vertical video ads with kinetic bouncing subtitles. Plus, our Autopilot engine schedules and posts them across up to 15 accounts automatically.",
    },
    {
      q: "What is the Multi-Account Satellite Army feature?",
      a: "Instead of posting once a day on a single official brand account, our Growth ($89/mo) and Scale ($199/mo) plans allow you to link up to 15 accounts (1 official brand account + 4 to 14 niche burner satellite channels). AutoUGC automatically distributes unique creative permutations across all accounts on a 30-day drip, maximizing organic algorithmic reach while preventing duplicate content penalties.",
    },
    {
      q: "Can I use the generated videos for paid TikTok and Meta ads?",
      a: "Yes. Every video rendered through AutoUGC comes with 100% full commercial usage rights and zero watermarks. You can download the uncompressed 1080x1920 MP4 files directly from your Video Vault and upload them into TikTok Ads Manager, Meta Ads Manager, or YouTube Shorts campaigns.",
    },
    {
      q: "How does quality review work?",
      a: "Every video is programmatically checked against performance ad standards: product value proposition established in the first 3 seconds, word-level synchronized kinetic typography, audio ducking (music lowered by 80% during speech), and 60 FPS vertical video rendering. You can preview, edit script copy, swap voiceovers, or schedule with 1 click.",
    },
    {
      q: "What happens if I run out of monthly video credits?",
      a: "You can instantly upgrade your plan tier or purchase additional credit allotments directly from your billing command center. Upgrades take effect immediately with zero downtime.",
    },
    {
      q: "How does pricing and the volume floor work?",
      a: "You pay one predictable monthly allotment: Starter ($49/mo for 20 videos), Growth ($89/mo for 60 videos), or Scale ($199/mo for 180 videos). There are no hidden per-video markups, no retainers, and no agency coordination fees. You get predictable creative volume delivered automatically.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
        {/* ========================================================= */}
        {/* HERO SECTION - Fluencify Precision Matching Screenshot 1 & 2 */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
          {/* Main Editorial Serif Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] leading-[1.08] mb-6 max-w-4xl">
            Creator marketing
            <br />
            <span className="italic font-normal">without the operations</span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-[#4A544A] max-w-2xl leading-relaxed mb-8 font-normal">
            The autonomous digital marketing tool for SaaS companies and digital product sellers. Turn your software URL into high-converting 9:16 video ads without hiring creators, camera crews, or agencies.
          </p>

          {/* Primary Action - Website URL Paste Box to Dashboard Autopilot */}
          <form
            onSubmit={(e) => handleStartGeneration(e)}
            className="w-full max-w-xl mx-auto mb-5 flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-[#CBD5C4] rounded-full shadow-md hover:border-[#1F3824] transition-all"
          >
            <div className="flex items-center gap-2.5 px-4 flex-1 w-full text-xs">
              <Globe className="h-4 w-4 text-[#717E6C] shrink-0" />
              <input
                type="url"
                required
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="Enter your SaaS or digital product URL (e.g. https://mysoftware.com)"
                aria-label="Enter your SaaS or digital product URL"
                className="w-full py-2.5 bg-transparent text-xs text-[#1B231B] placeholder-[#717E6C] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-[11px] font-semibold tracking-widest uppercase transition-all shadow-sm cursor-pointer shrink-0 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Analyzing URL...</span>
              ) : (
                <>
                  <span>Launch Autopilot</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Preset Sample URLs for 1-Click Testing */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#717E6C] flex-wrap mb-14">
            <span>Or test with live URL:</span>
            {sampleUrls.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setProductUrl(sample.url);
                  handleStartGeneration(undefined, sample.url);
                }}
                className="px-3 py-1 rounded-full bg-[#ECEFE7] hover:bg-[#E2E9DC] text-[#1B231B] transition-colors cursor-pointer border border-[#CBD5C4]/60 font-medium"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="p-3 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-center gap-2 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* HERO MOCKUP: Painterly Landscape + Dashboard + Phone Preview */}
          {/* ========================================================= */}
          <div className="w-full relative rounded-3xl overflow-hidden border border-[#CBD5C4]/50 shadow-xl bg-[#E8EDE4]">
            {/* Background Landscape Art */}
            <div className="relative w-full h-[540px] sm:h-[620px] md:h-[680px]">
              <Image
                src="/images/hero-landscape.jpg"
                alt="Atmospheric Landscape Background"
                fill
                priority
                className="object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F6F7F2]/40 via-transparent to-transparent pointer-events-none" />

              {/* Centered Dashboard Mockup Window */}
              <div className="absolute inset-4 sm:inset-8 md:inset-12 flex items-center justify-center">
                <div className="w-full max-w-4xl h-full bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xl flex flex-col overflow-hidden text-left">
                  {/* Dashboard Top Navigation Bar */}
                  <div className="h-12 border-b border-[#CBD5C4]/50 px-4 sm:px-6 flex items-center justify-between bg-white/70">
                    <div className="flex items-center gap-3 text-xs text-[#717E6C]">
                      <span className="font-semibold text-[#1B231B]">Campaigns</span>
                      <span>&gt;</span>
                      <span className="text-[#1B231B] font-medium">Soundscape sleep</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-[#4A544A] bg-[#F6F7F2] border border-[#CBD5C4]/60 font-medium hover:bg-[#ECEFE7] transition-colors">
                        <Share2 className="h-3 w-3" />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-[#4A544A] bg-[#F6F7F2] border border-[#CBD5C4]/60 font-medium hover:bg-[#ECEFE7] transition-colors">
                        <SlidersHorizontal className="h-3 w-3" />
                        <span>Filters</span>
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Body: Mini Sidebar + Grid + Review Stream */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Mini Sidebar */}
                    <div className="w-40 border-r border-[#CBD5C4]/40 bg-[#FAFBF9] p-3 hidden md:flex flex-col justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#1F3824] bg-[#E2E9DC] font-semibold">
                          <HomeIcon className="h-3.5 w-3.5" />
                          <span>Home</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#4A544A] hover:bg-[#ECEFE7] transition-colors font-medium cursor-pointer">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Messages</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#4A544A] hover:bg-[#ECEFE7] transition-colors font-medium cursor-pointer">
                          <FileText className="h-3.5 w-3.5" />
                          <span>Apply</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#4A544A] hover:bg-[#ECEFE7] transition-colors font-medium cursor-pointer">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Payouts</span>
                        </div>
                      </div>

                      {/* User Mini Profile */}
                      <div className="pt-3 border-t border-[#CBD5C4]/40 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-[#1F3824] text-white flex items-center justify-center text-[10px] font-bold">
                          IR
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[11px] font-semibold text-[#1B231B] truncate">Isabelle Rae</div>
                          <div className="text-[10px] text-[#717E6C] truncate">@isabellerae</div>
                        </div>
                      </div>
                    </div>

                    {/* Center Creator Cards Grid */}
                    <div className="flex-1 p-3 sm:p-5 overflow-y-auto">
                      {/* Filter Tabs */}
                      <div className="flex items-center gap-1.5 mb-4 border-b border-[#CBD5C4]/40 pb-2">
                        {(["All", "Pending", "Approved", "Declined"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              activeTab === tab
                                ? "bg-[#1F3824] text-white"
                                : "text-[#4A544A] hover:bg-[#ECEFE7]"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Video Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredCards.map((card) => (
                          <div
                            key={card.id}
                            className="group relative rounded-xl overflow-hidden aspect-[9/13] bg-[#ECEFE7] border border-[#CBD5C4]/50 shadow-sm"
                          >
                            <Image
                              src={card.image}
                              alt={card.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

                            {/* Status Badge */}
                            <div className="absolute top-2 left-2 z-10">
                              <span
                                className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full backdrop-blur-sm ${
                                  card.status === "Approved"
                                    ? "bg-emerald-500/90 text-white"
                                    : card.status === "Pending"
                                    ? "bg-amber-500/90 text-white"
                                    : "bg-rose-500/90 text-white"
                                }`}
                              >
                                {card.status}
                              </span>
                            </div>

                            {/* Center Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-8 w-8 rounded-full bg-white/90 text-[#1B231B] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Play className="h-3.5 w-3.5 fill-[#1B231B] ml-0.5" />
                              </div>
                            </div>

                            {/* Card Footer Info */}
                            <div className="absolute bottom-2 left-2 right-2 text-white">
                              <div className="text-[11px] font-semibold drop-shadow-sm">{card.name}</div>
                              <div className="text-[9px] text-white/80 line-clamp-1 drop-shadow-sm">
                                {card.hook}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Feedback Panel */}
                    <div className="w-56 border-l border-[#CBD5C4]/40 bg-[#FAFBF9] p-3 hidden lg:flex flex-col justify-between text-xs">
                      <div>
                        <div className="text-[11px] font-bold text-[#1B231B] uppercase tracking-wider mb-3">
                          Review Feedback
                        </div>
                        <div className="space-y-2.5">
                          <div className="p-2.5 rounded-xl bg-white border border-[#CBD5C4]/60 text-[11px] text-[#4A544A] leading-relaxed shadow-2xs">
                            <span className="font-semibold text-[#1B231B] block mb-1">Brand Director</span>
                            &ldquo;Great execution! We prefer a lifestyle shot showing product in use around 0:04.&rdquo;
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#E2E9DC] border border-[#CBD5C4]/60 text-[11px] text-[#1F3824] leading-relaxed">
                            <span className="font-semibold text-[#1F3824] block mb-1">Creator Chloe</span>
                            &ldquo;Uploaded v2 with the natural desk scene and kinetic subtitles synced!&rdquo;
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-3 py-2 rounded-xl bg-[#1F3824] hover:bg-[#162B1B] text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                        <Send className="h-3 w-3" />
                        <span>Send feedback</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating iPhone Mobile Preview Overlapping Bottom-Right */}
                <div className="absolute -bottom-4 right-2 sm:right-6 md:right-10 w-48 sm:w-56 md:w-64 rounded-[32px] p-2 bg-[#1F241F] border-2 border-[#333C33] shadow-2xl z-20 hidden sm:block transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="relative rounded-[26px] overflow-hidden bg-white text-[#1B231B] p-3">
                    {/* Speaker Notch */}
                    <div className="h-4 w-20 bg-[#1F241F] rounded-full mx-auto mb-2" />

                    <div className="flex items-center justify-between text-[10px] text-[#717E6C] mb-2">
                      <span className="font-bold text-[#1B231B]">Autumn vibes</span>
                      <Share2 className="h-2.5 w-2.5" />
                    </div>

                    <div className="relative h-28 rounded-lg overflow-hidden mb-2 bg-[#ECEFE7]">
                      <Image
                        src="/images/study-creator.jpg"
                        alt="Mobile Campaign Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-white/90 text-black flex items-center justify-center shadow">
                          <Play className="h-2.5 w-2.5 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-[#1B231B] mb-0.5">About this campaign</div>
                    <p className="text-[9px] text-[#4A544A] leading-tight line-clamp-2">
                      Autonomous SaaS campaign. Short-form vertical UGC highlighting software workflow & student productivity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BRAND LOGOS STRIP - ASUS, Shield, Wise, Notion, Apple, LG */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 py-8 mb-16">
          <div className="flex items-center justify-between gap-6 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all text-[#2B332B]">
            {/* ASUS */}
            <div className="text-xl sm:text-2xl font-black tracking-widest uppercase font-mono">
              ASUS
            </div>

            {/* Shield / Security Brand */}
            <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
              <ShieldCheck className="h-6 w-6 text-[#1F3824]" />
              <span className="font-serif">Guardian</span>
            </div>

            {/* Wise / W */}
            <div className="text-2xl font-bold font-serif italic tracking-tight">
              W<span className="not-italic">ise</span>
            </div>

            {/* Notion */}
            <div className="flex items-center gap-1 font-semibold text-lg">
              <div className="h-5 w-5 rounded border-2 border-[#1B231B] flex items-center justify-center font-bold text-xs">
                N
              </div>
              <span>Notion</span>
            </div>

            {/* Apple */}
            <div className="flex items-center gap-1 text-xl font-medium tracking-tight">
              <span className="text-2xl leading-none"></span>
              <span className="font-semibold text-base">Apple</span>
            </div>

            {/* LG */}
            <div className="flex items-center gap-1 font-bold text-xl tracking-wider">
              <span className="h-6 w-6 rounded-full border-2 border-[#1B231B] flex items-center justify-center text-xs">
                LG
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MANIFESTO SECTION - "Agencies are slow and opaque..." */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center sm:text-left">
          {/* Editorial Headline */}
          <h2 className="text-3xl sm:text-5xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] leading-[1.15] mb-8 text-center">
            Agencies are <span className="italic font-normal">slow and</span>
            <br />
            <span className="italic font-normal">opaque.</span> Platforms
            <br />
            make <span className="italic font-normal">you</span> do the work.
          </h2>

          {/* 3 Editorial Paragraphs */}
          <div className="space-y-5 text-sm sm:text-base text-[#4A544A] leading-relaxed max-w-2xl mx-auto mb-14 text-left">
            <p>
              Agencies charge 20–40% markups, take weeks to deliver, and send you a spreadsheet at the end of the month. Self-serve platforms hand you a login and a to-do list: write briefs, chase creators, review queues, coordinate posting.
            </p>
            <p>
              AutoUGC is neither. A full-service creator engine powered by software that handles briefing, matching, quality control, distribution, and payouts. You get the service of an agency without the markup, the wait, or the workload, at a volume no agency can deliver.
            </p>
            <p className="font-medium text-[#1B231B]">
              Your job is one strategy call. Ours is everything after it.
            </p>
          </div>

          {/* 2-Column 8-Row Checklist with Dashed Green Borders */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 text-xs sm:text-sm text-[#1B231B] font-medium">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Campaigns launched for you</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Videos scored against your guidelines</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>10 to 5,000+ videos per month</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Global audience reach across 180+ countries</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Posting & accounts fully handled</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Payouts fully automated and compliant</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>View all your analytics in real-time</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#CBD5C4]">
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>700K+ videos indexed for trend insight</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE BLOCK 1: "Content that actually converts." */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Soft Sage Card with iPhone & Kinetic TikTok Subtitles */}
            <div className="rounded-3xl bg-[#ECEFE7] p-6 sm:p-10 border border-[#CBD5C4]/60 flex flex-col items-center justify-center relative shadow-sm">
              {/* Phone Controls Header */}
              <div className="flex items-center gap-3 mb-4 text-[#717E6C]">
                <div className="h-7 w-7 rounded-full bg-white shadow-xs flex items-center justify-center">
                  <ArrowUp className="h-3.5 w-3.5" />
                </div>
                <div className="h-7 w-7 rounded-full bg-white shadow-xs flex items-center justify-center">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* iPhone Mockup with TikTok Creator Video */}
              <div className="w-64 sm:w-72 rounded-[36px] p-2.5 bg-[#1F241F] shadow-xl border border-[#333C33]">
                <div className="relative rounded-[28px] overflow-hidden aspect-[9/16] bg-[#ECEFE7]">
                  <Image
                    src="/images/study-creator.jpg"
                    alt="TikTok Creator Study UGC"
                    fill
                    className="object-cover"
                  />

                  {/* Sound Toggle Icon */}
                  <div className="absolute top-4 right-4 z-10 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center">
                    <Volume2 className="h-3.5 w-3.5" />
                  </div>

                  {/* TikTok Kinetic Subtitle Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                    <div className="text-center font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] uppercase text-base sm:text-lg leading-tight">
                      <span className="bg-black/60 px-2 py-0.5 rounded inline-block mb-1">
                        How school felt
                      </span>
                      <br />
                      <span className="bg-[#FFE600] text-black px-2 py-0.5 rounded inline-block font-extrabold shadow-sm">
                        before I found
                      </span>
                      <br />
                      <span className="bg-black/60 px-2 py-0.5 rounded inline-block">
                        good study tools like this.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Typography */}
            <div className="space-y-6">
              <h3 className="text-3xl sm:text-5xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] leading-[1.12]">
                Content that
                <br />
                actually converts.
              </h3>

              <p className="text-sm sm:text-base text-[#4A544A] leading-relaxed">
                700,000+ short-form videos indexed across your category. We track what competitors run, which hooks hold attention, and which trends are rising. That intelligence becomes your briefs, and every video creators produce gets scored against your guidelines and the patterns that actually convert, before it reaches you.
              </p>

              <p className="text-xs sm:text-sm text-[#717E6C] leading-relaxed">
                FinTech, consumer app, DTC, Ed-Tech, AI SaaS. Tell us your product once. The playbook adapts, the work stays ours.
              </p>

              <div className="pt-2">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F3824] hover:underline"
                >
                  <span>Explore category intelligence</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE BLOCK 2: "Any campaign type. Zero management." */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Editorial Typography */}
            <div className="space-y-6">
              <h3 className="text-3xl sm:text-5xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] leading-[1.12]">
                Any campaign type.
                <br />
                <span className="italic font-normal">Zero management.</span>
              </h3>

              <p className="text-sm sm:text-base text-[#4A544A] leading-relaxed">
                AutoUGC handles everything. Product launches, always-on programs, paid ad pipelines, whatever you need. Full usage rights built in, so deploy clever across paid ads and organic social. No coordinating creators, no managing workflows. Our team runs it all.
              </p>

              <div className="pt-2">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F3824] hover:underline"
                >
                  <span>View campaign tiers</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: Soft Sage Card with 4-Step Vertical Connected Pills */}
            <div className="rounded-3xl bg-[#ECEFE7] p-8 sm:p-10 border border-[#CBD5C4]/60 shadow-sm">
              <div className="flex flex-col items-center space-y-0">
                {/* Step 1 */}
                <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#CBD5C4]/40 flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1B231B]">
                    Upload content brief
                  </span>
                </div>

                {/* Vertical Connector */}
                <div className="h-8 w-0.5 bg-[#CBD5C4]" />

                {/* Step 2 */}
                <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#CBD5C4]/40 flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1B231B]">
                    Autonomous AI renders video ads
                  </span>
                </div>

                {/* Vertical Connector */}
                <div className="h-8 w-0.5 bg-[#CBD5C4]" />

                {/* Step 3 */}
                <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#CBD5C4]/40 flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1B231B]">
                    Approve videos
                  </span>
                </div>

                {/* Vertical Connector */}
                <div className="h-8 w-0.5 bg-[#CBD5C4]" />

                {/* Step 4 */}
                <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#CBD5C4]/40 flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center shrink-0">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1B231B]">
                    Videos get posted automatically
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE URL TEST SECTION (Fluencify Re-Skin) */}
        {/* ========================================================= */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="rounded-3xl bg-white p-8 sm:p-12 border border-[#CBD5C4]/60 shadow-lg text-center">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold block mb-3">
              Try It Instantly
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] mb-4">
              Enter your website URL to test your brief.
            </h2>
            <p className="text-xs sm:text-sm text-[#4A544A] max-w-xl mx-auto mb-8">
              Our autonomous scraper extracts your product hooks, generates 3 psychological scripts, and prepares 1080p preview videos in under 60 seconds.
            </p>

            <form onSubmit={handleStartGeneration} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 mb-4">
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://yourbrand.com"
                className="flex-1 bg-[#F6F7F2] border border-[#CBD5C4] px-4 py-3 rounded-full text-sm text-[#1B231B] placeholder-[#717E6C] focus:outline-none focus:border-[#1F3824]"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSubmitting ? "Scraping..." : "Generate Brief"}
              </button>
            </form>

            {errorMessage && (
              <p className="text-xs text-rose-600 font-mono mb-4">{errorMessage}</p>
            )}

            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-[#717E6C]">
              <span>Or click a sample:</span>
              {sampleUrls.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => {
                    setProductUrl(sample.url);
                    handleStartGeneration(undefined, sample.url);
                  }}
                  className="px-3 py-1 rounded-full bg-[#ECEFE7] border border-[#CBD5C4]/60 hover:border-[#1F3824] hover:text-[#1F3824] transition-colors cursor-pointer text-[11px] font-medium"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CREATIVE VOLUME GUARANTEE FLOOR & PRICING PREVIEW */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold block mb-2">
              Transparent Model
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Predictable volume. Zero agency retainers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="rounded-3xl bg-white p-8 border border-[#CBD5C4]/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#717E6C] mb-2">
                  Starter Pipeline
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold font-sans text-[#1B231B]">$49</span>
                  <span className="text-xs text-[#717E6C]">/ month</span>
                </div>
                <p className="text-xs text-[#4A544A] mb-6">
                  Perfect for indie hackers and early stage SaaS launching their first creator ad tests.
                </p>
                <div className="space-y-3 text-xs text-[#1B231B] font-medium mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>20 high-retention 1080p videos / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>3 TikTok psychological script angles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>1 Brand Account Autopilot</span>
                  </div>
                </div>
              </div>

              <Link
                href="/pricing"
                className="w-full py-3 rounded-full border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white text-center text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth (Featured) */}
            <div className="rounded-3xl bg-[#ECEFE7] p-8 border-2 border-[#1F3824] shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1F3824] text-white text-[10px] font-bold uppercase tracking-widest">
                Most Popular
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#1F3824] mb-2">
                  Growth Autopilot
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold font-sans text-[#1B231B]">$89</span>
                  <span className="text-xs text-[#717E6C]">/ month</span>
                </div>
                <p className="text-xs text-[#4A544A] mb-6">
                  For scaling DTC, e-commerce, and SaaS brands ready to deploy multi-account reach.
                </p>
                <div className="space-y-3 text-xs text-[#1B231B] font-medium mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>60 high-retention 1080p videos / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>Multi-Account Army (1 Main + 4 Satellites)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>100% Commercial Usage Rights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>Priority Rendering & Voice Synthesis</span>
                  </div>
                </div>
              </div>

              <Link
                href="/pricing"
                className="w-full py-3 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-center text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
              >
                Choose Growth
              </Link>
            </div>

            {/* Scale */}
            <div className="rounded-3xl bg-white p-8 border border-[#CBD5C4]/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#717E6C] mb-2">
                  Scale Dominance
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold font-sans text-[#1B231B]">$199</span>
                  <span className="text-xs text-[#717E6C]">/ month</span>
                </div>
                <p className="text-xs text-[#4A544A] mb-6">
                  For enterprise brands and media houses requiring continuous creative volume.
                </p>
                <div className="space-y-3 text-xs text-[#1B231B] font-medium mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>180 high-retention 1080p videos / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>15 Connected Brand & Satellite Channels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1F3824]" />
                    <span>Instant Webhook & Zapier Automation</span>
                  </div>
                </div>
              </div>

              <Link
                href="/pricing"
                className="w-full py-3 rounded-full border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white text-center text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Choose Scale
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FAQ ACCORDION (Fluencify Re-Skin) */}
        {/* ========================================================= */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 mb-16">
          <div className="text-center mb-10">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold block mb-2">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white border border-[#CBD5C4]/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    id={`faq-question-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#1B231B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3824] focus-visible:ring-inset"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#717E6C] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className="px-5 pb-5 text-xs sm:text-sm text-[#4A544A] leading-relaxed border-t border-[#CBD5C4]/30 pt-3"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
