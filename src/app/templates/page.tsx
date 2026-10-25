"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="amber" size="sm" className="mb-4 font-mono">
            PROVEN HIGH-RETENTION FRAMEWORKS
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-display)] mb-4">
            Tested 9:16 Video Ad Templates for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              Every Industry
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Engineered using TikTok and Meta Ads performance data. Tested for 0.8s pattern interrupts and 80%+ hook retention.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[var(--accent-primary)] text-black shadow-glow-amber"
                    : "bg-[var(--bg-surface)] border border-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hooks or industries..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-subtle rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {filteredTemplates.map((template) => (
            <Card
              key={template.slug}
              hoverEffect
              className="flex flex-col justify-between border border-subtle hover:border-[var(--accent-primary)]/50 transition-all bg-[var(--bg-surface)] group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="amber" size="sm" className="font-mono text-[10px]">
                    {template.nicheName}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent-emerald)]">
                    <TrendingUp className="h-3 w-3" />
                    <span>{template.benchmarkCtr} CTR</span>
                  </div>
                </div>
                <CardTitle className="text-base font-bold font-[family-name:var(--font-display)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {template.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Benchmark Metrics Bar */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[var(--bg-app)] border border-subtle text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Avg ROAS:</span>
                    <span className="font-bold text-[var(--text-primary)]">{template.averageRoas}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Angle:</span>
                    <span className="font-bold text-[var(--accent-primary)] truncate block">
                      {template.primaryHookAngle}
                    </span>
                  </div>
                </div>

                {/* Sample Hook Box */}
                <div className="p-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-subtle">
                  <span className="text-[10px] font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider block mb-1">
                    Sample Hook (0:00 - 0:03):
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                    &ldquo;{template.sampleHook}&rdquo;
                  </p>
                </div>

                {/* Framework Highlights */}
                <div className="text-[11px] text-[var(--text-muted)] space-y-1">
                  <span className="font-semibold text-[var(--text-secondary)] block">Key Execution:</span>
                  <p className="line-clamp-2 leading-relaxed">
                    {template.frameworkTips[0] ?? ""}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2 border-t border-subtle">
                  <Link
                    href={`/studio?brand=${encodeURIComponent(
                      template.nicheName
                    )}&hook=${encodeURIComponent(template.sampleHook)}&body=${encodeURIComponent(
                      template.sampleBody
                    )}&cta=${encodeURIComponent(template.sampleCta)}`}
                    className="flex-1"
                  >
                    <Button variant="primary" size="sm" className="w-full text-xs justify-center font-semibold">
                      Use in Studio
                    </Button>
                  </Link>
                  <Link href={`/templates/${template.slug}`}>
                    <Button variant="secondary" size="sm" className="text-xs px-2.5" title="View Full Blueprint">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-[var(--accent-primary)] flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <Video className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-display)] mb-3">
            Want to Generate Custom Templates from Your Store?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
            Paste any Shopify, Amazon, or website URL. Our autonomous parser extracts your best hooks and formats them for immediate export.
          </p>
          <Link href="/studio">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-xs shadow-glow-amber"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Start Free Video Ad Now
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
