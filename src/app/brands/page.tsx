"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  TrendingUp,
  Layers,
  Laptop,
} from "lucide-react";

export default function BrandsPage() {
  const comparisonRows = [
    {
      metric: "Cost Per 9:16 Video Ad",
      agency: "$250 – $500 / video",
      freelance: "$150 – $300 / video",
      autougc: "$1.15 / video (Growth Tier)",
    },
    {
      metric: "Time to First Video Ad",
      agency: "2 – 4 Weeks",
      freelance: "5 – 10 Days",
      autougc: "Instant (< 60 Seconds)",
    },
    {
      metric: "SaaS & Product Feature Extraction",
      agency: "Manual brief meetings",
      freelance: "Frequently misunderstands product",
      autougc: "Autonomous URL parsing & hook synthesis",
    },
    {
      metric: "Volume Guarantees",
      agency: "4 – 8 Videos / month",
      freelance: "Pay per ad / unreliable",
      autougc: "Contracted 20 – 180 / month",
    },
    {
      metric: "Automated Multi-Account Drip",
      agency: "Manual spreadsheets / client",
      freelance: "None (Raw asset only)",
      autougc: "Autonomous peak-hour dispatch",
    },
    {
      metric: "Commercial Usage Rights",
      agency: "30–90 day limits / extra royalties",
      freelance: "Extra licensing fee required",
      autougc: "100% Perpetual Worldwide Rights",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2E9DC] text-[#1F3824] border border-[#CBD5C4] mb-6 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-[#1F3824] animate-pulse" />
            <span>Digital Marketing Tool for SaaS & Digital Products</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight font-[family-name:var(--font-serif)] text-[#1B231B] mb-5 leading-[1.12]">
            Autonomous UGC ads for SaaS. <br />
            <span className="italic">Without hiring creators.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#4A544A] max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn your software URL, web app, or digital product into high-converting 9:16 vertical video ads. No camera gear, no influencer outreach, and no $3,500/mo creative agency retainers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/studio"
              className="px-8 py-3.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              Generate SaaS Ad in Studio
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 rounded-full border border-[#1F3824] text-[#1F3824] hover:bg-[#1F3824] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              View Guaranteed Volume Plans
            </Link>
          </div>
        </section>

        {/* 3 Pillars */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-white border border-[#CBD5C4]/70 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center mb-4">
                  <Laptop className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B231B] mb-2">
                  URL to Viral UGC Ad in 60s
                </h3>
                <p className="text-xs text-[#4A544A] leading-relaxed">
                  Simply paste your SaaS landing page. AutoUGC parses your value propositions, generates 3 proven psychological hooks, syncs kinetic captions, and renders realistic AI actor demos.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[#CBD5C4]/70 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B231B] mb-2">
                  Multi-Account Satellite Army
                </h3>
                <p className="text-xs text-[#4A544A] leading-relaxed">
                  Scale signups across TikTok, Instagram Reels, and YouTube Shorts. Our anti-duplicate permutation engine spaces videos across multiple brand and satellite handles without shadowbans.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-[#CBD5C4]/70 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-full bg-[#E2E9DC] text-[#1F3824] flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B231B] mb-2">
                  Beat Creative Fatigue & Lower CAC
                </h3>
                <p className="text-xs text-[#4A544A] leading-relaxed">
                  SaaS ads burn out fast when running the same video. With contracted allotments of 20 to 180 video ads per month, your paid campaigns always have fresh converting angles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Head-to-Head Comparison Table */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#1F3824] font-bold block mb-2">
              Performance Economics
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Why SaaS founders replace agencies with AutoUGC
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[650px] bg-white border border-[#CBD5C4]/70 rounded-3xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-4 p-5 bg-[#EEF1EA] border-b border-[#CBD5C4]/70 text-xs font-bold uppercase tracking-wider text-[#1B231B]">
                <div>Capability / Metric</div>
                <div className="text-[#717E6C]">Traditional Agency</div>
                <div className="text-[#717E6C]">Freelance Creators</div>
                <div className="text-[#1F3824] font-extrabold">AutoUGC Software</div>
              </div>

              <div className="divide-y divide-[#CBD5C4]/60 text-xs">
                {comparisonRows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-4 p-5 items-center hover:bg-[#FAFBF9] transition-colors">
                    <div className="font-semibold text-[#1B231B]">{row.metric}</div>
                    <div className="text-[#717E6C]">{row.agency}</div>
                    <div className="text-[#717E6C]">{row.freelance}</div>
                    <div className="font-bold text-[#1F3824] bg-[#E2E9DC]/60 px-3 py-1 rounded-full w-fit">
                      {row.autougc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
          <div className="rounded-3xl bg-[#1F3824] text-white p-8 sm:p-14 text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-normal font-[family-name:var(--font-serif)]">
              Ready to automate customer acquisition for your software?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Generate high-retention 9:16 vertical video ads for your SaaS or digital product in seconds. Zero filming required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/studio"
                className="px-8 py-3.5 rounded-full bg-white text-[#1F3824] hover:bg-[#F6F7F2] text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
              >
                Launch Studio Now
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3.5 rounded-full border border-white/60 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Book 15-Min Walkthrough
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
