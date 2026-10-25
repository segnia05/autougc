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
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Film,
  HelpCircle,
  ArrowLeft,
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
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
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

      {/* Navigation Header */}
      <header className="border-b border-subtle bg-[var(--bg-app)]/80 backdrop-blur-md sticky top-0 z-40 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>AutoUGC</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            /templates/{slug}
          </span>
        </div>

        <Link href={studioUrl}>
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Use This Template Free
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="amber" size="sm">
              {template.nicheName}
            </Badge>
            <Badge variant="emerald" size="sm">
              Avg. CTR: {template.benchmarkCtr}
            </Badge>
            <Badge variant="neutral" size="sm">
              Avg. Return: {template.averageRoas}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-display)] leading-[1.15]">
            {template.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {template.metaDescription}
          </p>
        </div>

        {/* Live Interactive Script Preview Card */}
        <div className="bg-[var(--bg-surface)] border border-subtle rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-subtle pb-4">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Tested UGC Script Framework: {template.primaryHookAngle}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded">
              Verified 15s Retention
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <span className="text-xs font-mono text-[var(--accent-primary)] font-semibold">
                [00:00 - 00:03] Viral Hook
              </span>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                &ldquo;{template.sampleHook}&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <span className="text-xs font-mono text-[var(--text-muted)] font-semibold">
                [00:03 - 00:11] Problem & Relief
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {template.sampleBody}
              </p>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-app)] border border-subtle">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                [00:11 - 00:15] Call to Action
              </span>
              <p className="text-xs text-[var(--text-primary)] font-medium">
                {template.sampleCta}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-subtle">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span>Best paired with:</span>
              <span className="font-mono text-[var(--text-primary)]">
                {template.recommendedVoices.join(", ")}
              </span>
            </div>

            <Link href={studioUrl} className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Launch in AutoUGC Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Framework Production Tips */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">
            How to Win with Short-Form Video in {template.nicheName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {template.frameworkTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[var(--bg-surface)] border border-subtle flex flex-col gap-2"
              >
                <div className="h-6 w-6 rounded-full bg-[var(--accent-glow)] text-[var(--accent-primary)] text-xs font-mono font-bold flex items-center justify-center">
                  0{idx + 1}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Rich Snippets Section */}
        <div className="flex flex-col gap-6 pt-8 border-t border-subtle">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-subtle border border-subtle rounded-xl overflow-hidden bg-[var(--bg-surface)]">
            {template.faqs.map((faq, i) => (
              <div key={i} className="p-6 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {faq.question}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Popular Industry Templates */}
        <div className="flex flex-col gap-4 pt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Explore More Niche Video Ad Templates
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.values(TEMPLATES_CATALOG)
              .filter((t) => t.slug !== slug)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="p-3.5 rounded-lg border border-subtle bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-all flex flex-col gap-1 group"
                >
                  <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {t.nicheName}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    Avg CTR: {t.benchmarkCtr}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
