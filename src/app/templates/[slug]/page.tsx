import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { TEMPLATES_CATALOG } from "@/lib/seo/templatesData";
import {
  buildSoftwareAppJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo/schema";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Film,
  HelpCircle,
} from "lucide-react";

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(TEMPLATES_CATALOG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = TEMPLATES_CATALOG[slug];

  if (!template) {
    return { title: "Template Not Found" };
  }

  const canonicalUrl = `https://autougc.ai/templates/${slug}`;

  return {
    title: `${template.title} | AutoUGC`,
    description: template.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: template.title,
      description: template.metaDescription,
      url: canonicalUrl,
      siteName: "AutoUGC",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: template.title,
      description: template.metaDescription,
    },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const template = TEMPLATES_CATALOG[slug];

  if (!template) {
    notFound();
  }

  const appJsonLd = buildSoftwareAppJsonLd();
  const faqJsonLd = buildFaqJsonLd(template.faqs);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://autougc.ai" },
    { name: "Templates", url: "https://autougc.ai/templates" },
    { name: template.nicheName, url: `https://autougc.ai/templates/${slug}` },
  ]);

  const studioUrl = `/studio?hook=${encodeURIComponent(
    template.sampleHook
  )}&body=${encodeURIComponent(template.sampleBody)}&cta=${encodeURIComponent(
    template.sampleCta
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] selection:bg-[#D95D39] selection:text-white">
      {/* Structured Data Scripts for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <div className="border-b border-[#E5E0D8]/60 bg-[#F4F1EA] py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#8E8B85]">
            <Link href="/templates" className="hover:text-[#D95D39] font-medium transition-colors">
              Templates
            </Link>
            <span>/</span>
            <span className="text-[#18181B] font-semibold">{slug}</span>
          </div>

          <Link href={studioUrl}>
            <button className="px-4 py-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer">
              <span>Open in Studio</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F4F1EA] text-[#D95D39]">
              {template.nicheName}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F4F1EA] text-[#D95D39]">
              Avg. CTR: {template.benchmarkCtr}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-[#E5E0D8] text-[#52525B]">
              Avg. Return: {template.averageRoas}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-normal font-[family-name:var(--font-display)] text-[#18181B] leading-[1.15]">
            {template.title}
          </h1>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed max-w-3xl">
            {template.metaDescription}
          </p>
        </div>

        {/* Live Interactive Script Preview Card */}
        <div className="bg-white border border-[#E5E0D8]/70 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E0D8]/60 pb-4">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-[#D95D39]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                Tested UGC Script Framework: {template.primaryHookAngle}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#D95D39] bg-[#F4F1EA] px-2.5 py-0.5 rounded-full">
              Verified 15s Retention
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60">
              <span className="text-xs font-bold text-[#D95D39]">
                [00:00 - 00:03] Viral Hook
              </span>
              <p className="text-sm font-semibold text-[#18181B]">
                &ldquo;{template.sampleHook}&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60">
              <span className="text-xs font-bold text-[#8E8B85]">
                [00:03 - 00:11] Problem & Relief
              </span>
              <p className="text-xs text-[#52525B] leading-relaxed">
                {template.sampleBody}
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]/60">
              <span className="text-xs font-bold text-[#D95D39]">
                [00:11 - 00:15] Call to Action
              </span>
              <p className="text-xs text-[#18181B] font-semibold">
                {template.sampleCta}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E0D8]/60">
            <div className="flex items-center gap-2 text-xs text-[#8E8B85]">
              <span>Best paired with:</span>
              <span className="font-semibold text-[#18181B]">
                {template.recommendedVoices.join(", ")}
              </span>
            </div>

            <Link href={studioUrl} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                <span>Launch in AutoUGC Studio</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Framework Production Tips */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-normal font-[family-name:var(--font-display)] text-[#18181B]">
            How to win with short-form video in {template.nicheName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {template.frameworkTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8]/70 flex flex-col gap-2 shadow-xs"
              >
                <div className="h-6 w-6 rounded-full bg-[#F4F1EA] text-[#D95D39] text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </div>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col gap-6 pt-8 border-t border-[#E5E0D8]/60">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#D95D39]" />
            <h2 className="text-xl sm:text-2xl font-normal font-[family-name:var(--font-display)] text-[#18181B]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-[#E5E0D8]/60 border border-[#E5E0D8]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
            {template.faqs.map((faq, i) => (
              <div key={i} className="p-6 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-[#18181B]">
                  {faq.question}
                </h3>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Popular Industry Templates */}
        <div className="flex flex-col gap-4 pt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8B85]">
            Explore More Niche Video Ad Templates
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.values(TEMPLATES_CATALOG)
              .filter((t) => t.slug !== slug)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="p-4 rounded-2xl border border-[#E5E0D8]/70 bg-white hover:border-[#D95D39] transition-all flex flex-col gap-1 shadow-xs"
                >
                  <span className="text-xs font-semibold text-[#18181B] group-hover:text-[#D95D39] transition-colors">
                    {t.nicheName}
                  </span>
                  <span className="text-[11px] text-[#8E8B85]">
                    Avg CTR: {t.benchmarkCtr}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
