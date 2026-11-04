"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TEMPLATES_CATALOG } from "@/lib/seo/templatesData";
import {
  ArrowRight,
  TrendingUp,
  Search,
  Video,
} from "lucide-react";

export default function TemplatesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const templatesList = Object.values(TEMPLATES_CATALOG);

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "ecommerce", label: "E-Commerce & DTC" },
    { id: "saas", label: "SaaS & Tech" },
    { id: "wellness", label: "Beauty & Health" },
    { id: "mobile", label: "Mobile Apps" },
  ];

  const filteredTemplates = templatesList.filter((tpl) => {
    const matchesSearch =
      tpl.nicheName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.sampleHook.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "all") return true;
    if (selectedCategory === "ecommerce") return tpl.slug === "ecommerce-shopify";
    if (selectedCategory === "saas") return tpl.slug === "b2b-saas";
    if (selectedCategory === "wellness")
      return tpl.slug === "skincare-beauty" || tpl.slug === "supplements-dtc" || tpl.slug === "fitness-gym";
    if (selectedCategory === "mobile") return tpl.slug === "mobile-apps";

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] selection:bg-[#D95D39] selection:text-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full focus:outline-none">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F1EA] text-[#D95D39] border border-[#E5E0D8] mb-4 text-xs font-semibold uppercase tracking-wider">
            Proven High-Retention Frameworks
          </div>
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-[family-name:var(--font-display)] text-[#18181B] mb-4">
            Tested 9:16 video ad templates for <span className="italic">every industry.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
            Engineered using TikTok and Meta Ads performance data. Tested for 0.8s pattern interrupts and 80%+ hook retention.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
          {/* Category Tabs */}
          <div role="tablist" aria-label="Template categories" className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#18181B] text-white shadow-sm"
                    : "bg-white border border-[#E5E0D8]/70 text-[#52525B] hover:text-[#18181B] hover:border-[#D95D39]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8B85]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hooks or industries..."
              aria-label="Search templates by hook or industry"
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E5E0D8] rounded-full text-[#18181B] placeholder-[#8E8B85] focus:outline-none focus:border-[#D95D39]"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {filteredTemplates.map((template) => (
            <div
              key={template.slug}
              className="flex flex-col justify-between border border-[#E5E0D8]/70 hover:border-[#D95D39]/60 transition-all bg-white rounded-3xl p-6 shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4F1EA] text-[#D95D39]">
                    {template.nicheName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D95D39]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{template.benchmarkCtr} CTR</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#18181B] group-hover:text-[#D95D39] transition-colors mb-4">
                  {template.title}
                </h3>

                {/* Benchmark Metrics Bar */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]/60 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-[#8E8B85] block">Avg ROAS:</span>
                    <span className="font-bold text-[#18181B]">{template.averageRoas}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8E8B85] block">Angle:</span>
                    <span className="font-bold text-[#D95D39] truncate block">
                      {template.primaryHookAngle}
                    </span>
                  </div>
                </div>

                {/* Sample Hook Box */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]/60 mb-4">
                  <span className="text-[10px] font-semibold text-[#D95D39] uppercase tracking-wider block mb-1">
                    Sample Hook (0:00 - 0:03):
                  </span>
                  <p className="text-xs text-[#52525B] italic leading-relaxed">
                    &ldquo;{template.sampleHook}&rdquo;
                  </p>
                </div>

                {/* Framework Highlights */}
                <div className="text-[11px] text-[#8E8B85] space-y-1 mb-6">
                  <span className="font-semibold text-[#18181B] block">Key Execution:</span>
                  <p className="line-clamp-2 leading-relaxed">
                    {template.frameworkTips[0] ?? ""}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center gap-2 border-t border-[#E5E0D8]/60">
                <Link
                  href={`/studio?brand=${encodeURIComponent(
                    template.nicheName
                  )}&hook=${encodeURIComponent(template.sampleHook)}&body=${encodeURIComponent(
                    template.sampleBody
                  )}&cta=${encodeURIComponent(template.sampleCta)}`}
                  className="flex-1"
                >
                  <button className="w-full py-2.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs">
                    Use in Studio
                  </button>
                </Link>
                <Link href={`/templates/${template.slug}`}>
                  <button className="p-2.5 rounded-full border border-[#E5E0D8] text-[#D95D39] hover:bg-[#FAF8F5] transition-colors cursor-pointer" title="View Full Blueprint">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-[#FAF8F5] border border-[#E5E0D8]/70 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <div className="h-10 w-10 rounded-full bg-[#F4F1EA] text-[#D95D39] flex items-center justify-center mx-auto mb-4 border border-[#E5E0D8]">
            <Video className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal font-[family-name:var(--font-display)] text-[#18181B] mb-3">
            Want to generate custom templates from your website?
          </h2>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-xl mx-auto mb-6">
            Paste any Shopify, Amazon, or SaaS URL. Our autonomous parser extracts your best hooks and formats them for immediate export.
          </p>
          <Link href="/studio">
            <button className="px-8 py-3.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
              <span>Start Video Ad Generation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
