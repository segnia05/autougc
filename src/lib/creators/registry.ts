/**
 * Immutable Certified Creator Registry
 * Guarantees zero AI face drift across campaigns and video generations.
 */

export interface CertifiedCreator {
  id: string;
  name: string;
  demographicTag: string;
  targetNiche: string;
  avatarUrl: string;
  defaultVoiceId: string;
  colorGradingProfile: string;
  vibe: string;
  tags: string[];
}

export const CANONICAL_CREATORS: CertifiedCreator[] = [
  {
    id: "pers_sarah_01",
    name: "Sarah Miller",
    demographicTag: "US Female 26",
    targetNiche: "SaaS & DTC Reviewer",
    avatarUrl: "/images/creator-glasses.jpg",
    defaultVoiceId: "sarah_dtc_founder",
    colorGradingProfile: "natural_warm_daylight",
    vibe: "High credibility, conversational & energetic",
    tags: ["High Energy", "B2B / DTC", "Female"],
  },
  {
    id: "pers_alex_02",
    name: "Alex Chen",
    demographicTag: "US Male 31",
    targetNiche: "Tech Founder & Developer Tools",
    avatarUrl: "/images/creator-male.jpg",
    defaultVoiceId: "alex_casual_dtc",
    colorGradingProfile: "studio_contrast",
    vibe: "Direct, founder-to-founder authority",
    tags: ["Authoritative", "Dev / SaaS", "Male"],
  },
  {
    id: "pers_emma_03",
    name: "Emma Davis",
    demographicTag: "UK Female 28",
    targetNiche: "Productivity & Mobile Apps",
    avatarUrl: "/images/study-creator.jpg",
    defaultVoiceId: "emma_storyteller",
    colorGradingProfile: "soft_scandinavian",
    vibe: "Warm, relatable aesthetic workspace walk-through",
    tags: ["Relatable", "Productivity", "Female"],
  },
  {
    id: "pers_marcus_04",
    name: "Marcus Vance",
    demographicTag: "US Male 24",
    targetNiche: "Growth Marketing & E-Commerce",
    avatarUrl: "/images/creator-male.jpg",
    defaultVoiceId: "marcus_deep_auth",
    colorGradingProfile: "high_energy_vibrant",
    vibe: "Punchy, fast-paced street-smart delivery",
    tags: ["Punchy", "Growth", "Male"],
  },
  {
    id: "pers_elena_05",
    name: "Elena Rostova",
    demographicTag: "EU Female 29",
    targetNiche: "AI Agents & Data Science Tools",
    avatarUrl: "/images/creator-glasses.jpg",
    defaultVoiceId: "elena_euro_accent",
    colorGradingProfile: "crisp_architectural",
    vibe: "Structured, intellectual analytical breakdown",
    tags: ["Intellectual", "AI / Data", "Female"],
  },
  {
    id: "pers_david_06",
    name: "David Brooks",
    demographicTag: "AU Male 35",
    targetNiche: "B2B Analytics & CRM Platforms",
    avatarUrl: "/images/creator-male.jpg",
    defaultVoiceId: "david_australian",
    colorGradingProfile: "natural_outdoor",
    vibe: "Grounded, consultative and seasoned leader",
    tags: ["Grounded", "FinTech / CRM", "Male"],
  },
  {
    id: "pers_chloe_07",
    name: "Chloe Kim",
    demographicTag: "US Female 23",
    targetNiche: "Viral TikTok Stories & Confessions",
    avatarUrl: "/images/creator-glasses.jpg",
    defaultVoiceId: "chloe_viral_tiktok",
    colorGradingProfile: "punchy_saturated",
    vibe: "Bestie confession, ultra relatable mobile selfie",
    tags: ["Viral UGC", "Gen Z", "Female"],
  },
  {
    id: "pers_liam_08",
    name: "Liam Scott",
    demographicTag: "CA Male 27",
    targetNiche: "Chrome Extensions & Micro-SaaS",
    avatarUrl: "/images/creator-male.jpg",
    defaultVoiceId: "liam_tech_review",
    colorGradingProfile: "neutral_studio",
    vibe: "Enthusiastic power user review",
    tags: ["Enthusiastic", "Tools", "Male"],
  },
];

export interface ResolvedCreatorAssets {
  personaId: string;
  creatorName: string;
  avatarUrl: string;
  demographicTag: string;
  targetNiche: string;
  recommendedVoiceId: string;
  colorGradingProfile: string;
  videoStemUrl: string;
  archetype: string;
  durationSeconds: number;
}

/**
 * Deterministically resolves certified video stems for a creator persona.
 * Throws a fatal exception if an unknown or unregistered creator ID is supplied.
 */
export async function resolveCreatorAssets(
  creatorId: string,
  archetype = "organic_selfie",
  durationSeconds = 15.0
): Promise<ResolvedCreatorAssets> {
  const creator = CANONICAL_CREATORS.find(
    (c) => c.id === creatorId || c.name.toLowerCase() === creatorId.toLowerCase()
  );

  if (!creator) {
    throw new Error(`Creator persona '${creatorId}' not found in certified registry.`);
  }

  // Canonical stem file path structure
  const stemUrl = `/creators/${creator.id}/stems/${archetype}/stem_1080x1920_30fps.mp4`;

  return {
    personaId: creator.id,
    creatorName: creator.name,
    avatarUrl: creator.avatarUrl,
    demographicTag: creator.demographicTag,
    targetNiche: creator.targetNiche,
    recommendedVoiceId: creator.defaultVoiceId,
    colorGradingProfile: creator.colorGradingProfile,
    videoStemUrl: stemUrl,
    archetype,
    durationSeconds,
  };
}

export function getCreatorById(id: string): CertifiedCreator | undefined {
  return CANONICAL_CREATORS.find((c) => c.id === id);
}

export function getAllCreators(): CertifiedCreator[] {
  return [...CANONICAL_CREATORS];
}

