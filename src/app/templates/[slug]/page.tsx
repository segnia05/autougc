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
    <div className="min-h-screen bg-[#F6F7F2] text-[#1B231B] selection:bg-[#1F3824] selection:text-white">
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

      <div className="border-b border-[#CBD5C4]/60 bg-[#EEF1EA] py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#717E6C]">
            <Link href="/templates" className="hover:text-[#1F3824] font-medium transition-colors">
              Templates
            </Link>
            <span>/</span>
            <span className="text-[#1B231B] font-semibold">{slug}</span>
          </div>

          <Link href={studioUrl}>
            <button className="px-4 py-1.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer">
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
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824]">
              {template.nicheName}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E2E9DC] text-[#1F3824]">
              Avg. CTR: {template.benchmarkCtr}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-[#CBD5C4] text-[#4A544A]">
              Avg. Return: {template.averageRoas}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B] leading-[1.15]">
            {template.title}
          </h1>

          <p className="text-base sm:text-lg text-[#4A544A] leading-relaxed max-w-3xl">
            {template.metaDescription}
          </p>
        </div>

        {/* Live Interactive Script Preview Card */}
        <div className="bg-white border border-[#CBD5C4]/70 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#CBD5C4]/60 pb-4">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-[#1F3824]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B231B]">
                Tested UGC Script Framework: {template.primaryHookAngle}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#1F3824] bg-[#E2E9DC] px-2.5 py-0.5 rounded-full">
              Verified 15s Retention
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60">
              <span className="text-xs font-bold text-[#1F3824]">
                [00:00 - 00:03] Viral Hook
              </span>
              <p className="text-sm font-semibold text-[#1B231B]">
                &ldquo;{template.sampleHook}&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60">
              <span className="text-xs font-bold text-[#717E6C]">
                [00:03 - 00:11] Problem & Relief
              </span>
              <p className="text-xs text-[#4A544A] leading-relaxed">
                {template.sampleBody}
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-[#F6F7F2] border border-[#CBD5C4]/60">
              <span className="text-xs font-bold text-[#1F3824]">
                [00:11 - 00:15] Call to Action
              </span>
              <p className="text-xs text-[#1B231B] font-semibold">
                {template.sampleCta}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#CBD5C4]/60">
            <div className="flex items-center gap-2 text-xs text-[#717E6C]">
              <span>Best paired with:</span>
              <span className="font-semibold text-[#1B231B]">
                {template.recommendedVoices.join(", ")}
              </span>
            </div>

            <Link href={studioUrl} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1F3824] hover:bg-[#162B1B] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                <span>Launch in AutoUGC Studio</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Framework Production Tips */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
            How to win with short-form video in {template.nicheName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {template.frameworkTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#CBD5C4]/70 flex flex-col gap-2 shadow-xs"
              >
                <div className="h-6 w-6 rounded-full bg-[#E2E9DC] text-[#1F3824] text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </div>
                <p className="text-xs text-[#4A544A] leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col gap-6 pt-8 border-t border-[#CBD5C4]/60">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#1F3824]" />
            <h2 className="text-xl sm:text-2xl font-normal font-[family-name:var(--font-serif)] text-[#1B231B]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-[#CBD5C4]/60 border border-[#CBD5C4]/70 rounded-2xl overflow-hidden bg-white shadow-xs">
            {template.faqs.map((faq, i) => (
              <div key={i} className="p-6 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-[#1B231B]">
                  {faq.question}
                </h3>
                <p className="text-xs text-[#4A544A] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Popular Industry Templates */}
        <div className="flex flex-col gap-4 pt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#717E6C]">
            Explore More Niche Video Ad Templates
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.values(TEMPLATES_CATALOG)
              .filter((t) => t.slug !== slug)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="p-4 rounded-2xl border border-[#CBD5C4]/70 bg-white hover:border-[#1F3824] transition-all flex flex-col gap-1 shadow-xs"
                >
                  <span className="text-xs font-semibold text-[#1B231B] group-hover:text-[#1F3824] transition-colors">
                    {t.nicheName}
                  </span>
                  <span className="text-[11px] text-[#717E6C]">
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
