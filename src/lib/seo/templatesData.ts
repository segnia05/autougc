export interface TemplateData {
  slug: string;
  nicheName: string;
  title: string;
  metaDescription: string;
  targetKeywords: string[];
  benchmarkCtr: string;
  averageRoas: string;
  primaryHookAngle: string;
  sampleHook: string;
  sampleBody: string;
  sampleCta: string;
  recommendedVoices: string[];
  faqs: { question: string; answer: string }[];
  frameworkTips: string[];
}

export const TEMPLATES_CATALOG: Record<string, TemplateData> = {
  "ecommerce-shopify": {
    slug: "ecommerce-shopify",
    nicheName: "Shopify E-Commerce Brands",
    title: "TikTok UGC Video Ad Templates for Shopify Stores (2026)",
    metaDescription:
      "Generate high-converting TikTok & Instagram Reels video ads for your Shopify products in 15 seconds. Scrapes product images, writes viral hooks, and syncs voiceovers.",
    targetKeywords: [
      "shopify ugc ads",
      "tiktok ugc ads ecommerce",
      "ai ugc video generator shopify",
      "reels product ad creator",
    ],
    benchmarkCtr: "3.84%",
    averageRoas: "3.4x",
    primaryHookAngle: "The Unboxing Pattern Interrupt",
    sampleHook: "Stop scrolling if your kitchen drawers still look like a junk drawer disaster in 2026.",
    sampleBody:
      "This magnetic modular organizer clicked together in 10 seconds and doubled our usable storage space.",
    sampleCta: "Tap the link below to get 25% off during the spring refresh sale.",
    recommendedVoices: ["Alex (Casual DTC Creator)", "Emma (Energetic Lifestyle)"],
    frameworkTips: [
      "Show the messy drawer problem in the first 0.8 seconds (Pattern Interrupt).",
      "Feature tactile product assembly sounds with lo-fi beats.",
      "End on a direct offer discount with clean arrow callout.",
    ],
    faqs: [
      {
        question: "How do I generate UGC ads from my Shopify store URL?",
        answer:
          "Simply paste any Shopify product page URL into AutoUGC. Our AI extracts product photos, reviews, pricing, and generates 3 viral UGC video variations in 15 seconds.",
      },
      {
        question: "Can I publish directly to TikTok Shop and Instagram Shopping?",
        answer:
          "Yes. AutoUGC connects via official OAuth to TikTok, Instagram Reels, and YouTube Shorts for 1-click publishing or scheduled calendar drops.",
      },
    ],
  },
  "b2b-saas": {
    slug: "b2b-saas",
    nicheName: "B2B SaaS & Tech Startups",
    title: "High-Converting UGC Video Ad Generator for B2B SaaS",
    metaDescription:
      "Turn your SaaS landing page into engaging vertical video ads that tech founders and buyers actually watch. High-retention hooks and kinetic captions.",
    targetKeywords: [
      "b2b saas ugc ads",
      "software demo video ads",
      "tiktok ads for tech startups",
      "founder ugc ads",
    ],
    benchmarkCtr: "2.92%",
    averageRoas: "4.1x Pipeline",
    primaryHookAngle: "The Spreadsheet Agitation",
    sampleHook: "If your sales team is still manually copy-pasting lead data between 4 tabs in 2026, stop.",
    sampleBody:
      "AutoSync enriches inbound leads and triggers personalized Slack alerts in under 60 seconds automatically.",
    sampleCta: "Claim your 14-day unrestricted founder trial at the link below.",
    recommendedVoices: ["Marcus (Authoritative Tech)", "Sophia (Warm Professional)"],
    frameworkTips: [
      "Demonstrate painful manual workflows before revealing the 1-click software solution.",
      "Highlight time-to-value numbers (e.g. 'Saved 12 hours/week').",
      "Use subtle Berlin electronic beats to maintain forward momentum.",
    ],
    faqs: [
      {
        question: "Why does UGC work for B2B software companies?",
        answer:
          "Traditional polished corporate demos get ignored on short-form feeds. Raw screen recordings with casual founder voiceover generate 2.8x higher engagement and lower customer acquisition costs.",
      },
      {
        question: "Does AutoUGC capture our SaaS brand colors?",
        answer:
          "Yes, our scraper extracts your exact CSS hex colors and applies them to kinetic subtitles and UI callouts.",
      },
    ],
  },
  "skincare-beauty": {
    slug: "skincare-beauty",
    nicheName: "Skincare, Beauty & Cosmetics",
    title: "Viral TikTok & Reels UGC Video Generator for Skincare Brands",
    metaDescription:
      "Create aesthetic, high-converting skincare UGC ads with before/after hook frameworks and kinetic caption styling. Tested for TikTok and Meta Ads.",
    targetKeywords: [
      "skincare ugc video ads",
      "beauty ugc creator app",
      "tiktok skincare ads",
      "cosmetics video ad generator",
    ],
    benchmarkCtr: "4.45%",
    averageRoas: "3.7x",
    primaryHookAngle: "The 14-Day Barrier Test",
    sampleHook: "The single ingredient dermatologists wish you'd stop skipping in your morning routine.",
    sampleBody:
      "After just 10 days of using the peptide serum, our redness and dry patches completely vanished.",
    sampleCta: "Shop the restock today and take $15 off your first order.",
    recommendedVoices: ["Emma (Energetic Lifestyle)", "Chloe (Soft Aesthetic Beauty)"],
    frameworkTips: [
      "Lead with close-up texture swatch or droplet application.",
      "Highlight active ingredients in kinetic bold subtitle badges.",
      "Pair with gentle acoustic or lo-fi ambient audio.",
    ],
    faqs: [
      {
        question: "Can I customize the subtitle highlight colors to match my cosmetic line?",
        answer:
          "Absolutely. You can select exact primary and accent hex codes for word-level highlights in the AutoUGC Studio.",
      },
    ],
  },
  "fitness-gym": {
    slug: "fitness-gym",
    nicheName: "Fitness, Workout Apps & Gym Gear",
    title: "High-Energy UGC Ad Creator for Fitness Apps & Gym Gear",
    metaDescription:
      "Drive workout app installs and gym equipment sales with fast-paced, high-energy UGC video ads optimized for TikTok and Reels.",
    targetKeywords: [
      "fitness ugc video ads",
      "workout app ad creator",
      "gym brand tiktok ads",
      "high energy ugc templates",
    ],
    benchmarkCtr: "3.91%",
    averageRoas: "3.2x",
    primaryHookAngle: "The Common Mistake Callout",
    sampleHook: "The #1 reason your bench press progress has been completely stuck for 6 months.",
    sampleBody:
      "This micro-loading barbell system lets you add 0.5 lb increments so you hit a new PR every week without injury.",
    sampleCta: "Grab your set with free shipping while supplies last.",
    recommendedVoices: ["Leo (Energetic Hype)", "Marcus (Authoritative)"],
    frameworkTips: [
      "Cut straight to the heavy rep lockout or form critique in frame 1.",
      "Use fast 118+ BPM tech or trap beat with voiceover ducking.",
      "Clearly display social proof metric (e.g., '14,000+ athletes').",
    ],
    faqs: [
      {
        question: "How long should a fitness UGC video ad be?",
        answer:
          "Data shows 12 to 16 seconds achieves the highest completion and click-through rates on TikTok and Instagram Reels.",
      },
    ],
  },
  "mobile-apps": {
    slug: "mobile-apps",
    nicheName: "Mobile Apps (iOS & Android)",
    title: "App Store UGC Video Ad Generator for iOS & Android Apps",
    metaDescription:
      "Generate viral TikTok & Shorts ads that drive app installs at sub-$1 CPA. Built for indie developers and mobile app publishers.",
    targetKeywords: [
      "app store ugc ads",
      "mobile app install ads",
      "tiktok ads for ios apps",
      "app demo short videos",
    ],
    benchmarkCtr: "4.12%",
    averageRoas: "$0.84 CPI",
    primaryHookAngle: "The Gatekept Secret Hack",
    sampleHook: "The iOS productivity widget that university students have been gatekeeping all semester.",
    sampleBody:
      "It blocks distracting notifications automatically the second you sit down at your study desk.",
    sampleCta: "Download free on the App Store before midterms.",
    recommendedVoices: ["Alex (Casual DTC)", "Chloe (Soft Aesthetic)"],
    frameworkTips: [
      "Show screen recording of the app feature resolving the problem in 2 taps.",
      "Keep text large and centered for vertical phone screens.",
      "Include the official App Store badge in the closing frame.",
    ],
    faqs: [
      {
        question: "Can AutoUGC scrape directly from the Apple App Store URL?",
        answer:
          "Yes. Paste any App Store or Google Play Store link to extract app screenshots, star ratings, and review snippets automatically.",
      },
    ],
  },
  "supplements-dtc": {
    slug: "supplements-dtc",
    nicheName: "DTC Supplements & Wellness",
    title: "Compliant High-Converting UGC Video Ads for DTC Supplements",
    metaDescription:
      "Create high-converting, policy-compliant UGC ads for vitamins, nootropics, and wellness brands. Viral hooks with zero cheesy AI voice artifacts.",
    targetKeywords: [
      "supplement ugc ads",
      "wellness video ads tiktok",
      "dtc supplement advertising",
      "nootropics ugc videos",
    ],
    benchmarkCtr: "4.60%",
    averageRoas: "3.6x",
    primaryHookAngle: "The Morning Routine Contrast",
    sampleHook: "Stop drinking energy drinks that spike your anxiety and crash you by 2 PM.",
    sampleBody:
      "Switching to clean organic matcha with L-theanine gives you 6 hours of clean focus with zero jitters.",
    sampleCta: "Try the 30-day starter tin with our money-back guarantee.",
    recommendedVoices: ["Emma (Energetic Lifestyle)", "Alex (Casual Creator)"],
    frameworkTips: [
      "Contrast the jittery feeling with calm mental clarity.",
      "Display clean ingredient certifications in the top-right overlay.",
      "End with 30-day risk-free guarantee badge.",
    ],
    faqs: [
      {
        question: "Are these video ads compliant with Meta and TikTok advertising policies?",
        answer:
          "Yes, AutoUGC generates compliant experiential language avoiding prohibited medical claims while maximizing viral engagement.",
      },
    ],
  },
};
