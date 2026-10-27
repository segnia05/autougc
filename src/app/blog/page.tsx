"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Search } from "lucide-react";

export default function BlogIndexPage() {
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      id: "08-second-pattern-interrupt",
      title: "The 0.8-Second Pattern Interrupt: Why 80% of Short-Form Video Ads Fail on Meta & TikTok",
      excerpt:
        "Analyzing 45,000 video ad impressions reveals why standard corporate intro title cards cause 78% immediate drop-off, and how raw handheld creator selfies solve first-second retention.",
      date: "Oct 24, 2026",
      readTime: "6 min read",
      category: "Performance Creative",
      highlight: true,
      author: "Alex Rivers",
      authorRole: "Head of Creative Research",
    },
    {
      id: "multi-account-satellite-army",
      title: "Multi-Account Satellite Scaling: How SaaS & Digital Brands Reach 5M Organic Views Without Shadowbans",
      excerpt:
        "The mathematical framework behind rotating hook variants, background audio stems, and device fingerprint variance across 10+ social handles.",
      date: "Oct 19, 2026",
      readTime: "8 min read",
      category: "Distribution Strategy",
      highlight: false,
      author: "Marcus Vance",
      authorRole: "Infrastructure Lead",
    },
    {
      id: "ugc-economics-2026",
      title: "The Economics of UGC in 2026: Why $3,500 Agency Retainers Are Being Replaced by Software",
      excerpt:
        "A financial breakdown of cost per video ad ($250 agency cost vs $1.15 autonomous pipeline) and why high-velocity testing always beats single high-production bets.",
      date: "Oct 14, 2026",
      readTime: "5 min read",
      category: "Growth Economics",
      highlight: false,
      author: "Elena Rostova",
      authorRole: "Growth & Economics",
    },
    {
      id: "kinetic-subtitles-retention-study",
      title: "Kinetic Subtitles vs Static Captions: Analyzing 45,000 Ads for Watch-Time Retention",
      excerpt:
        "Word-by-word bouncing TikTok subtitles increase average video completion rate from 23% to 61% by maintaining visual motion every 0.3 seconds.",
      date: "Oct 08, 2026",
      readTime: "4 min read",
      category: "Video Editing",
      highlight: false,
      author: "Sarah Chen",
      authorRole: "Creative Director",
    },
    {
      id: "ai-voice-synthesis-flags",
      title: "Conversational Voice Synthesis: What Converts and What Triggers AI Detection Flags",
      excerpt:
        "How neural breath modeling, natural pitch variation, and micro-hesitations prevent robotic speech patterns while passing platform automated spam filters.",
      date: "Sep 29, 2026",
      readTime: "7 min read",
      category: "Audio Synthesis",
      highlight: false,
      author: "Alex Rivers",
      authorRole: "Head of Creative Research",
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTag === "all") return true;
    return art.category.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-4 text-xs font-semibold uppercase tracking-wider">
            AutoUGC Performance Journal
          </div>
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-4">
            Field notes on <span className="italic">algorithmic distribution</span> and ad creative.
          </h1>
          <p className="text-sm sm:text-base text-[#4A544A] leading-relaxed">
            Data-backed breakdowns of viral hook mechanics, auction psychology, video retention math, and autonomous multi-account growth.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Insights" },
              { id: "performance", label: "Performance" },
              { id: "distribution", label: "Distribution" },
              { id: "economics", label: "Economics" },
              { id: "audio", label: "Audio & AI" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTag(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedTag === tab.id
                  ? "bg-[#1F3824] text-white shadow-sm"
                  : "bg-white border border-[#CBD5C4]/70 text-[#4A544A] hover:text-[#1B231B] hover:border-[#1F3824]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#717E6C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research notes..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#CBD5C4] rounded-full text-[#1B231B] placeholder-[#717E6C] focus:outline-none focus:border-[#1F3824]"
            />
          </div>
        </div>

        {/* Featured Top Article */}
        {filteredArticles.length > 0 && selectedTag === "all" && searchQuery === "" && (() => {
          const featured = filteredArticles[0];
          if (!featured) return null;
          return (
            <div className="max-w-5xl mx-auto mb-14">
              <div className="rounded-3xl bg-white border border-[#CBD5C4]/70 p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row gap-8 items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824]">
                      Featured Research
                    </span>
                    <span className="text-xs text-[#717E6C]">•</span>
                    <span className="text-xs text-[#717E6C] font-mono">{featured.readTime}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] hover:text-[#1F3824] transition-colors">
                    {featured.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4A544A] leading-relaxed">
                    {featured.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#CBD5C4]/60">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#1F3824] text-white flex items-center justify-center font-bold text-xs">
                        AR
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1B231B]">{featured.author}</div>
                        <div className="text-[10px] text-[#717E6C]">{featured.authorRole}</div>
                      </div>
                    </div>

                    <Link
                      href="/tools"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F3824] hover:underline"
                    >
                      <span>Read Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 items-stretch">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="rounded-3xl bg-white border border-[#CBD5C4]/70 p-7 shadow-sm flex flex-col justify-between hover:border-[#1F3824]/60 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ECEFE7] text-[#4A544A]">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-[#717E6C] font-mono">{art.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-[#1B231B] group-hover:text-[#1F3824] transition-colors mb-3 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-[#4A544A] leading-relaxed mb-6">
                  {art.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#CBD5C4]/60 text-xs text-[#717E6C]">
                <span>{art.author}</span>
                <span className="font-semibold text-[#1F3824] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup in Organic Sage Container */}
        <section className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-[#ECEFE7] border border-[#CBD5C4] p-8 sm:p-12 text-center space-y-4">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold block">
              Bi-Weekly Ad Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Get the top 3 converting UGC hooks sent to your inbox
            </h2>
            <p className="text-xs sm:text-sm text-[#4A544A] max-w-md mx-auto">
              Every other Tuesday, we break down high-performing video ads across TikTok and Meta with exact retention curves.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="founder@yourcompany.com"
                className="flex-1 bg-white border border-[#CBD5C4] px-4 py-2.5 rounded-full text-xs text-[#1B231B] focus:outline-none focus:border-[#1F3824]"
              />
              <button
                type="button"
                className="px-6 py-2.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
