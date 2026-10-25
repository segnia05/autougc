export interface FaqItem {
  question: string;
  answer: string;
}

export interface VideoMetadata {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  duration?: string; // ISO 8601 e.g. "PT15S"
}

export function buildSoftwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AutoUGC",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    description:
      "Autonomous AI UGC Video Ads & Social Distribution Engine. Generate high-converting vertical video ads from any product URL in 15 seconds.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "49.00",
      highPrice: "199.00",
      priceCurrency: "USD",
      offerCount: 3,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "248",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Instant URL Scraper & Value Prop Ingestion",
      "Gemini 2.5 Flash Viral Hook & Script Engine",
      "1080x1920 9:16 Vertical Remotion Composition",
      "Dynamic Kinetic Word-Level Subtitles",
      "Automated 1-Click Multi-Platform Scheduling for TikTok, Instagram Reels, and YouTube Shorts",
    ],
  };
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildVideoObjectJsonLd(video: VideoMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: [video.thumbnailUrl],
    uploadDate: video.uploadDate,
    duration: video.duration || "PT15S",
    contentUrl: video.contentUrl,
    embedUrl: video.contentUrl,
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
