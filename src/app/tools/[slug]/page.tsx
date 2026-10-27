import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ToolInteractive, ToolConfig } from "@/components/tools/ToolInteractive";
import { buildSoftwareAppJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/schema";

const TOOLS_CONFIG: Record<string, ToolConfig> = {
  "tiktok-hook-generator": {
    slug: "tiktok-hook-generator",
    name: "TikTok Hook Generator",
    title: "AI TikTok UGC Hook Generator (2026)",
    subtitle:
      "Generate high-retention pattern interrupt hooks engineered to stop users scrolling in the first 0.8 seconds.",
    metaDescription:
      "Generate 3 viral TikTok hooks for any product or software in seconds. Built for SaaS founders, product teams, and performance marketers.",
  },
  "instagram-reels-script-generator": {
    slug: "instagram-reels-script-generator",
    name: "Instagram Reels Script Generator",
    title: "Instagram Reels UGC Script Generator",
    subtitle:
      "Turn your product value propositions into high-converting 15-second vertical script structures.",
    metaDescription:
      "AI script generator for Instagram Reels ads. Generate high-converting hook, body, and CTA copy instantly.",
  },
  "ugc-video-cost-calculator": {
    slug: "ugc-video-cost-calculator",
    name: "UGC Video Cost & ROI Calculator",
    title: "UGC Ad Agency Cost vs. AI Generator ROI Calculator",
    subtitle:
      "Calculate exactly how much money and time your team saves by automating UGC ads with AutoUGC.",
    metaDescription:
      "Calculate your cost per UGC video ad. Compare traditional creative agency retainers ($3,500/mo) vs AutoUGC autonomous video pipeline.",
  },
};

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(TOOLS_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS_CONFIG[slug];

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const canonicalUrl = `https://autougc.ai/tools/${slug}`;

  return {
    title: `${tool.title} | AutoUGC Tools`,
    description: tool.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.title,
      description: tool.metaDescription,
      url: canonicalUrl,
      siteName: "AutoUGC",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = TOOLS_CONFIG[slug];

  if (!tool) {
    notFound();
  }

  const appJsonLd = buildSoftwareAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://autougc.ai" },
    { name: "Tools", url: "https://autougc.ai/tools" },
    { name: tool.name, url: `https://autougc.ai/tools/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ToolInteractive slug={slug} tool={tool} />
    </>
  );
}
