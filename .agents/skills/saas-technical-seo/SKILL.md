---
name: saas-technical-seo
description: Master playbook for architecting technical SEO, programmatic SEO (pSEO), Core Web Vitals optimization, semantic schema markup, and crawl efficiency for high-converting SaaS applications.
---

# SaaS Technical & Programmatic SEO Playbook

## 1. Information Architecture & URL Strategy
Organize public-facing SaaS routes into clean, hierarchical, intent-driven directories:

```
/ (Homepage: Core brand positioning & highest-converting CTA)
/features/[feature-slug] (Feature landing pages targeting solution queries)
/templates/[niche-slug] (Programmatic UGC template directory)
/examples/[category]/[slug] (High-converting real UGC examples & case studies)
/tools/[free-tool-slug] (High-volume lead magnet utilities e.g. /tools/ugc-script-generator)
/blog/[category]/[article-slug] (In-depth editorial content & cluster pages)
/compare/[competitor-vs-brand] (High-intent alternative & comparison pages)
```

### URL Rules:
- All lowercase, hyphen-separated, zero trailing slash inconsistencies.
- Permanent 301 redirects from non-canonical formats (`www` vs `non-www`, `http` vs `https`).
- Strict self-referencing canonical tag `<link rel="canonical" href="https://example.com/canonical-path" />` on every indexable page.

---

## 2. Rendering & Indexation Engine
- **Public & High-Value Crawl Paths**:
  - MUST use Server-Side Rendering (SSR) or Static Site Generation (SSG) / Incremental Static Regeneration (ISR).
  - Crawlers (Googlebot, Bingbot) must receive complete HTML content with zero dependency on client-side JavaScript execution.
- **App & Authenticated Routes**:
  - Authenticated dashboards (`/dashboard/*`, `/settings/*`, `/projects/*`) must emit `X-Robots-Tag: noindex, nofollow` and be excluded in `robots.txt` to preserve crawl budget.

---

## 3. Structured Data & Schema.org JSON-LD Implementation
Every public page must inject semantic JSON-LD microdata into `<head>`:

### A. SaaS Organization & Software Application:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "UGC Platform Name",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "128"
  }
}
</script>
```

### B. FAQ Schema (Rich Snippet Capture):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How fast can I generate UGC video ads?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our platform renders tested UGC ad variations in under 60 seconds directly to your dashboard."
      }
    }
  ]
}
</script>
```

---

## 4. Programmatic SEO (pSEO) Matrix for UGC
To capture thousands of long-tail search queries without thin content penalties:
1. **Identify the Pattern Matrix**:
   - `[Format]` + `[Industry/Niche]` + `UGC Ads` (e.g., "TikTok UGC Ads for Skincare Brands", "Reels UGC Video for Fitness Apps").
2. **Dynamic Data Enrichment (Avoid Thin Content)**:
   - Each generated programmatic page MUST include:
     - Real curated video examples or verified hook scripts.
     - Benchmarked CTR and conversion rate metrics for that specific niche.
     - Specific script formulas tailored to the industry.
     - Interactive free preview or calculator widget.
3. **Crawl Budget & Sitemap Strategy**:
   - Split sitemaps into index maps: `/sitemap.xml` pointing to `/sitemap-core.xml`, `/sitemap-templates.xml`, `/sitemap-tools.xml`.
   - Update `lastmod` timestamps only when meaningful content changes occur.

---

## 5. Core Web Vitals (CWV) Optimization Checklist
- **LCP (< 1.8s)**:
  - Hero image or preview video poster must use `priority` or `fetchpriority="high"`.
  - Serve modern image formats (AVIF/WebP) with `srcset` responsiveness.
- **CLS (< 0.05)**:
  - Every image, video, and banner container must have explicit `width` and `height` or CSS `aspect-ratio`.
  - Reserve space for dynamic widgets and banners to prevent layout jumps.
- **INP (< 150ms)**:
  - Defer non-critical scripts (Google Tag Manager, analytics, live chat) using dynamic imports or `strategy="lazyOnload"`.
