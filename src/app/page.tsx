"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NormalizedPlan } from "@/lib/billing/types";
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
  Zap,
} from "lucide-react";

const CANONICAL_PLANS: NormalizedPlan[] = [
  {
    planTier: "starter",
    name: "Starter",
    description: "For solo founders testing high-converting UGC video ad angles.",
    amountCents: 4900,
    formattedPrice: "$49",
    currency: "USD",
    billingInterval: "month",
    creditsMonthlyAllowance: 20,
    features: [
      "20 video ad credits per month",
      "1 connected official brand account",
      "Remotion 1080x1920 high-res rendering",
      "Drop Concierge package with viral captions & hashtags",
      "Full commercial usage rights & zero watermarks",
      "Standard email support",
    ],
    popular: false,
    provider: "polar",
    productId: "prod_starter",
    priceId: "price_starter",
  },
  {
    planTier: "growth",
    name: "Growth",
    description: "For scaling SaaS businesses ready to dominate short-form feeds.",
    amountCents: 8900,
    formattedPrice: "$89",
    currency: "USD",
    billingInterval: "month",
    creditsMonthlyAllowance: 60,
    features: [
      "60 video ad credits per month",
      "Up to 5 multi-account satellite channels",
      "30-day autopilot drip scheduling",
      "Anti-fatigue creator persona & angle rotation",
      "1-hour pre-publish email approval workflow",
      "Priority background rendering queue",
    ],
    popular: true,
    provider: "polar",
    productId: "prod_growth",
    priceId: "price_growth",
  },
  {
    planTier: "scale",
    name: "Scale",
    description: "For high-velocity growth teams blitzing TikTok and Meta.",
    amountCents: 19900,
    formattedPrice: "$199",
    currency: "USD",
    billingInterval: "month",
    creditsMonthlyAllowance: 150,
    features: [
      "150 video ad credits per month",
      "Up to 15 multi-account satellite channels",
      "Full campaign blitz & multi-creator diversity",
      "Custom voice cloning & studio script editor",
      "Dedicated account strategist & Slack channel",
      "99.9% uptime SLA & custom webhook exports",
    ],
    popular: false,
    provider: "polar",
    productId: "prod_scale",
    priceId: "price_scale",
  },
];

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [productUrl, setProductUrl] = useState("");
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Declined">("All");
  const [dynamicPlans, setDynamicPlans] = useState<NormalizedPlan[]>(CANONICAL_PLANS);
  const [providerName, setProviderName] = useState<string>("polar");
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/v1/billing/plans")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setIsLoadingPlans(false);
        if (data.provider) {
          setProviderName(data.provider);
        }
        if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          setDynamicPlans(data.plans);
        } else {
          setDynamicPlans(CANONICAL_PLANS);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Failed to load dynamic plans on homepage:", err);
        setIsLoadingPlans(false);
        setDynamicPlans(CANONICAL_PLANS);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const starterPlan = dynamicPlans.find((p) => p.planTier === "starter") || CANONICAL_PLANS[0]!;
  const growthPlan = dynamicPlans.find((p) => p.planTier === "growth") || CANONICAL_PLANS[1]!;
  const scalePlan = dynamicPlans.find((p) => p.planTier === "scale") || CANONICAL_PLANS[2]!;

  const sampleUrls = [
    { label: "AI Humanizer SaaS", url: "https://humanizeai.io", brand: "HumanizeAI" },
    { label: "DTC Ergonomic Desk", url: "https://luminalight.com", brand: "Lumina" },
    { label: "B2B Lead CRM", url: "https://leadsync.io", brand: "LeadSync" },
  ];

  const handleStartGeneration = (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const rawUrl = (customUrl || productUrl).trim();

    // Strict validation
    if (!rawUrl) {
      setUrlValidationError("Please enter your website URL before starting.");
      return;
    }

    if (!rawUrl.includes(".") || rawUrl.length < 4) {
      setUrlValidationError("Please enter a valid website domain (e.g. https://yourbrand.com).");
      return;
    }

    setUrlValidationError(null);
    const formattedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const targetOnboarding = `/onboarding?url=${encodeURIComponent(formattedUrl)}`;

    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(targetOnboarding)}`);
    } else {
      router.push(targetOnboarding);
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
      a: `Instead of posting once a day on a single official brand account, our ${growthPlan?.name || "Growth"} (${growthPlan?.formattedPrice || "$89"}/mo) and ${scalePlan?.name || "Scale"} (${scalePlan?.formattedPrice || "$199"}/mo) plans allow you to link up to 15 accounts (1 official brand account + 4 to 14 niche burner satellite channels). AutoUGC automatically distributes unique creative permutations across all accounts on a 30-day drip, maximizing organic algorithmic reach while preventing duplicate content penalties.`,
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
      a: `You pay one predictable monthly allotment: ${starterPlan?.name || "Starter"} (${starterPlan?.formattedPrice || "$49"}/mo for ${starterPlan?.creditsMonthlyAllowance ?? 20} videos), ${growthPlan?.name || "Growth"} (${growthPlan?.formattedPrice || "$89"}/mo for ${growthPlan?.creditsMonthlyAllowance ?? 60} videos), or ${scalePlan?.name || "Scale"} (${scalePlan?.formattedPrice || "$199"}/mo for ${scalePlan?.creditsMonthlyAllowance ?? 150} videos). There are no hidden per-video markups, no retainers, and no agency coordination fees. You get predictable creative volume delivered automatically.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] selection:bg-[#D95D39] selection:text-white fastlane-grid-bg">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
        {/* ========================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] text-[10px] font-bold tracking-widest text-[#D95D39] uppercase mb-4 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#D95D39]" />
            <span>Autonomous AI Video Ads for SaaS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold tracking-tight text-[#18181B] leading-[1.08] mb-6 max-w-4xl">
            Automate your short-form video ads
            <br />
            <span className="text-[#D95D39]">end-to-end</span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-[#52525B] max-w-2xl leading-relaxed mb-8 font-normal">
            Turn your software URL into high-converting 9:16 vertical video ads. AI-written scripts, kinetic subtitles, floating UI proof, and automated multi-channel scheduling without hiring creators or agencies.
          </p>

          {/* Primary Action - Website URL Paste Box */}
          <form
            onSubmit={(e) => handleStartGeneration(e)}
            className="w-full max-w-xl mx-auto mb-2 flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-[#E5E0D8] rounded-full shadow-md hover:border-[#D95D39] transition-all"
          >
            <div className="flex items-center gap-2.5 px-4 flex-1 w-full text-xs">
              <Globe className="h-4 w-4 text-[#8E8B85] shrink-0" />
              <input
                type="text"
                required
                value={productUrl}
                onChange={(e) => {
                  setProductUrl(e.target.value);
                  if (urlValidationError) setUrlValidationError(null);
                }}
                placeholder="https://yourbrand.com"
                aria-label="Enter your SaaS or product URL"
                className="w-full py-2.5 bg-transparent text-xs text-[#18181B] placeholder-[#8E8B85] focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={!productUrl.trim()}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#18181B] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Build My Creator Engine</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Validation Error Message */}
          {urlValidationError && (
            <div className="text-xs text-red-600 font-semibold mb-3 animate-in fade-in">
              {urlValidationError}
            </div>
          )}

          {/* Preset Sample URLs for 1-Click Testing */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E8B85] flex-wrap mb-14 mt-2">
            <span>Or test with live demo:</span>
            {sampleUrls.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setProductUrl(sample.url);
                  handleStartGeneration(undefined, sample.url);
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#FAF8F5] text-[#18181B] transition-colors cursor-pointer border border-[#E5E0D8] font-medium shadow-2xs"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* HERO MOCKUP: Dashboard + Creative Previews */}
          <div className="w-full relative rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-xl bg-[#FAF8F5]">
            <div className="relative w-full h-[500px] sm:h-[580px] md:h-[640px]">
              <Image
                src="/images/hero-landscape.jpg"
                alt="AutoUGC Creative Command Center"
                fill
                priority
                className="object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/80 via-transparent to-transparent pointer-events-none" />

              {/* Centered Dashboard Mockup Window */}
              <div className="absolute inset-4 sm:inset-8 md:inset-12 flex items-center justify-center">
                <div className="w-full max-w-4xl h-full bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xl flex flex-col overflow-hidden text-left">
                  {/* Dashboard Top Navigation Bar */}
                  <div className="h-12 border-b border-[#EFECE6] px-4 sm:px-6 flex items-center justify-between bg-white/80">
                    <div className="flex items-center gap-3 text-xs text-[#8E8B85]">
                      <span className="font-semibold text-[#18181B]">Campaigns</span>
                      <span>&gt;</span>
                      <span className="text-[#D95D39] font-medium">AutoUGC 30-Day Blitz</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDF3EF] border border-[#F3CEBE] text-[10px] font-bold text-[#D95D39] uppercase tracking-wider">
                        Remotion 1080x1920
                      </span>
                    </div>
                  </div>

                  {/* Dashboard Body */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Mini Sidebar */}
                    <div className="w-40 border-r border-[#EFECE6] bg-[#FAF8F5] p-3 hidden md:flex flex-col justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#18181B] bg-white border border-[#EFECE6] font-semibold shadow-2xs">
                          <HomeIcon className="h-3.5 w-3.5 text-[#D95D39]" />
                          <span>Home</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#52525B] hover:bg-white transition-colors font-medium cursor-pointer">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Campaigns</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#52525B] hover:bg-white transition-colors font-medium cursor-pointer">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Studio</span>
                        </div>
                      </div>

                      {/* User Mini Profile */}
                      <div className="pt-3 border-t border-[#EFECE6] flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px] font-bold">
                          AU
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[11px] font-semibold text-[#18181B] truncate">AutoUGC User</div>
                          <div className="text-[10px] text-[#8E8B85] truncate">50 credits</div>
                        </div>
                      </div>
                    </div>

                    {/* Creative Review Stream */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-[#18181B]">Creator Video Pipeline</h4>
                          <p className="text-[11px] text-[#8E8B85]">Generated from live software URL</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {["All", "Approved", "Pending"].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab as any)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                activeTab === tab
                                  ? "bg-[#18181B] text-white"
                                  : "bg-[#FAF8F5] text-[#52525B] hover:text-[#18181B]"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredCards.slice(0, 3).map((card) => (
                          <div
                            key={card.id}
                            className="rounded-xl border border-[#E5E0D8] overflow-hidden bg-[#FAF8F5] p-2.5 space-y-2 shadow-2xs"
                          >
                            <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black">
                              <Image
                                src={card.image}
                                alt={card.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                                {card.status}
                              </div>
                            </div>
                            <div className="text-[11px] font-bold text-[#18181B] truncate">
                              &ldquo;{card.hook}&rdquo;
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE BLOCK 1: Content that converts */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-[#EFECE6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Phone Preview with Kinetic Subtitles */}
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E5E0D8] flex flex-col items-center justify-center relative shadow-sm">
              <div className="w-64 sm:w-72 rounded-[36px] p-2.5 bg-[#18181B] shadow-xl border border-[#27272A]">
                <div className="relative rounded-[28px] overflow-hidden aspect-[9/16] bg-black">
                  <Image
                    src="/images/study-creator.jpg"
                    alt="TikTok Creator Study UGC"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 z-10 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center">
                    <Volume2 className="h-3.5 w-3.5" />
                  </div>
                  {/* Kinetic Subtitle Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                    <div className="text-center font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] uppercase text-base sm:text-lg leading-tight">
                      <span className="bg-black/60 px-2 py-0.5 rounded inline-block mb-1">
                        How school felt
                      </span>
                      <br />
                      <span className="bg-[#D95D39] text-white px-2 py-0.5 rounded inline-block font-extrabold shadow-sm">
                        before I found
                      </span>
                      <br />
                      <span className="bg-black/60 px-2 py-0.5 rounded inline-block">
                        tools like this.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="space-y-6">
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#D95D39] font-bold block">
                0–3 Second Hook Science
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B] leading-[1.12]">
                Video ads engineered
                <br />
                to convert viewers.
              </h2>
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                Gemini 2.5 Flash analyzes your competitors, uncovers emotional customer pain points, and drafts 5 high-converting hook angles. Remotion renders 1080x1920 vertical video with bouncing kinetic subtitles, audio ducking, and floating UI proof.
              </p>
              <div className="pt-2">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D95D39] hover:underline"
                >
                  <span>Explore Creative Studio</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE BLOCK 2: 4-Step Process */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-[#EFECE6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#D95D39] font-bold block">
                Hands-Off Growth
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B] leading-[1.12]">
                Autonomous publishing.
                <br />
                <span className="text-[#D95D39]">Zero agency retainers.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                AutoUGC handles your creative pipeline from URL to post. Connect your TikTok and Instagram accounts, or use the Drop Concierge to download final MP4s with tested viral captions and peak posting times.
              </p>
              <div className="pt-2">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D95D39] hover:underline"
                >
                  <span>View Pricing Plans</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#E5E0D8] shadow-sm">
              <div className="flex flex-col items-center space-y-0">
                <div className="w-full bg-[#FAF8F5] rounded-2xl p-4 shadow-2xs border border-[#EFECE6] flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF3EF] text-[#D95D39] flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#18181B]">
                    1. Enter your SaaS website URL
                  </span>
                </div>
                <div className="h-6 w-0.5 bg-[#E5E0D8]" />

                <div className="w-full bg-[#FAF8F5] rounded-2xl p-4 shadow-2xs border border-[#EFECE6] flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF3EF] text-[#D95D39] flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#18181B]">
                    2. AI writes hooks &amp; extracts UI screenshot
                  </span>
                </div>
                <div className="h-6 w-0.5 bg-[#E5E0D8]" />

                <div className="w-full bg-[#FAF8F5] rounded-2xl p-4 shadow-2xs border border-[#EFECE6] flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF3EF] text-[#D95D39] flex items-center justify-center shrink-0">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#18181B]">
                    3. 1-Click approve or edit in Studio
                  </span>
                </div>
                <div className="h-6 w-0.5 bg-[#E5E0D8]" />

                <div className="w-full bg-[#FAF8F5] rounded-2xl p-4 shadow-2xs border border-[#EFECE6] flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#FDF3EF] text-[#D95D39] flex items-center justify-center shrink-0">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#18181B]">
                    4. Drip post or download Drop Package
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LIVE PRICING SECTION */}
        {/* ========================================================= */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-[#EFECE6]">
          <div className="text-center mb-12">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#D95D39] font-bold block mb-2">
              Predictable Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
              Predictable volume. Zero agency retainers.
            </h2>
            <p className="text-xs sm:text-sm text-[#52525B] mt-2">
              All plans include commercial rights, 1080p vertical rendering, and Drop Concierge packages.
            </p>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dynamicPlans.map((plan) => {
              const isPopular = plan.popular || plan.planTier === "growth";
              return (
                <div
                  key={plan.planTier}
                  className={`fastlane-card p-8 flex flex-col justify-between relative bg-white transition-all ${
                    isPopular
                      ? "border-2 border-[#D95D39] shadow-md ring-4 ring-[#D95D39]/10"
                      : "border border-[#E5E0D8]"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#D95D39] text-white text-[10px] font-bold uppercase tracking-widest shadow-2xs">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isPopular ? "text-[#D95D39]" : "text-[#8E8B85]"
                      }`}
                    >
                      {plan.name} Pipeline
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-black text-[#18181B]">
                        {plan.formattedPrice}
                      </span>
                      <span className="text-xs text-[#8E8B85]">
                        / {plan.billingInterval || "month"}
                      </span>
                    </div>
                    <p className="text-xs text-[#52525B] mb-6 min-h-[32px]">
                      {plan.description}
                    </p>
                    <div className="space-y-3 text-xs text-[#18181B] font-medium mb-8">
                      {plan.features?.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#D95D39] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/onboarding?plan=${plan.planTier}`}
                    className={`w-full py-3 rounded-full text-center text-xs font-semibold tracking-wider uppercase transition-all shadow-sm ${
                      isPopular
                        ? "btn-fastlane-black bg-[#18181B] text-white hover:bg-black"
                        : "btn-fastlane-white border border-[#E5E0D8] text-[#18181B] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    Get Started with {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* FAQ ACCORDION */}
        {/* ========================================================= */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 mb-16 border-t border-[#EFECE6]">
          <div className="text-center mb-10">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#D95D39] font-bold block mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    id={`faq-question-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#18181B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D39]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#8E8B85] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#D95D39]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className="px-5 pb-5 text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#EFECE6] pt-3"
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
