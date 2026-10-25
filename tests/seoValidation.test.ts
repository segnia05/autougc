import { TEMPLATES_CATALOG } from "../src/lib/seo/templatesData";
import {
  buildSoftwareAppJsonLd,
  buildFaqJsonLd,
  buildVideoObjectJsonLd,
} from "../src/lib/seo/schema";

async function runSeoTests() {
  console.log("--- Running Technical SEO & Schema.org JSON-LD Unit Tests ---");

  // 1. Verify Templates Catalog
  const templateKeys = Object.keys(TEMPLATES_CATALOG);
  if (templateKeys.length < 5) {
    console.error("✗ Failed: Less than 5 pSEO niche templates defined.");
    process.exit(1);
  }
  console.log(`✓ Verified ${templateKeys.length} programmatic niche templates in catalog.`);

  for (const slug of templateKeys) {
    const t = TEMPLATES_CATALOG[slug]!;
    if (!t.title || !t.metaDescription || !t.sampleHook || !t.sampleCta) {
      console.error(`✗ Failed: Incomplete template content for slug: ${slug}`);
      process.exit(1);
    }
    if (t.faqs.length === 0) {
      console.error(`✗ Failed: Missing FAQ rich snippet schema for slug: ${slug}`);
      process.exit(1);
    }
  }
  console.log("✓ All pSEO templates conform to metadata, hook, and rich FAQ schema rules.");

  // 2. Verify SoftwareApplication Schema
  const appLd = buildSoftwareAppJsonLd();
  if (appLd["@type"] !== "SoftwareApplication" || !appLd.offers || !appLd.aggregateRating) {
    console.error("✗ Failed SoftwareApplication schema validation:", appLd);
    process.exit(1);
  }
  console.log(`✓ SoftwareApplication schema verified (Rating: ${appLd.aggregateRating.ratingValue}/5 from ${appLd.aggregateRating.reviewCount} reviews).`);

  // 3. Verify FAQPage Schema
  const sampleFaqs = [
    { question: "How fast is video rendering?", answer: "Under 15 seconds." },
    { question: "Is commercial license included?", answer: "Yes, 100% royalty-free." },
  ];
  const faqLd = buildFaqJsonLd(sampleFaqs);
  if (faqLd["@type"] !== "FAQPage" || faqLd.mainEntity.length !== 2) {
    console.error("✗ Failed FAQPage schema validation:", faqLd);
    process.exit(1);
  }
  console.log("✓ FAQPage schema verified with valid Q&A entities.");

  // 4. Verify VideoObject Schema
  const videoLd = buildVideoObjectJsonLd({
    name: "Sample TikTok UGC Ad",
    description: "High converting vertical ad demo",
    thumbnailUrl: "https://assets.autougc.ai/thumbnails/ad_01.jpg",
    uploadDate: "2026-10-25T00:00:00Z",
    duration: "PT15S",
  });
  if (videoLd["@type"] !== "VideoObject" || videoLd.duration !== "PT15S") {
    console.error("✗ Failed VideoObject schema validation:", videoLd);
    process.exit(1);
  }
  console.log("✓ VideoObject schema verified with ISO 8601 duration.");

  console.log("✓ All Technical SEO & Schema.org tests passed cleanly!");
}

runSeoTests();
