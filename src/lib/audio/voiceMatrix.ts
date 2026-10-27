/**
 * Neural Voice Matrix & Audio Ducking Engine
 * Provides 16 hyper-realistic neural voice profiles across global accents
 * with automatic -22dB background music ducking.
 */

export interface VoiceProfile {
  id: string;
  name: string;
  gender: "female" | "male";
  accent: "US" | "UK" | "EU" | "AU" | "CA";
  energyLevel: "High" | "Conversational" | "Deep Authority" | "Warm Storyteller";
  vibe: string;
  recommendedNiches: string[];
}

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: "sarah_dtc_founder",
    name: "Sarah (US)",
    gender: "female",
    accent: "US",
    energyLevel: "Conversational",
    vibe: "Natural vocal fry, punchy pacing, relatable founder",
    recommendedNiches: ["DTC", "SaaS", "Productivity"],
  },
  {
    id: "alex_casual_dtc",
    name: "Alex (US)",
    gender: "male",
    accent: "US",
    energyLevel: "Conversational",
    vibe: "Casual, candid, developer-turned-founder cadence",
    recommendedNiches: ["Dev Tools", "B2B SaaS", "Tech"],
  },
  {
    id: "emma_storyteller",
    name: "Emma (UK)",
    gender: "female",
    accent: "UK",
    energyLevel: "Warm Storyteller",
    vibe: "Soft spoken, Scandinavian aesthetic, deep trust",
    recommendedNiches: ["Mobile Apps", "Lifestyle", "EdTech"],
  },
  {
    id: "marcus_deep_auth",
    name: "Marcus (US)",
    gender: "male",
    accent: "US",
    energyLevel: "Deep Authority",
    vibe: "Rich resonant timbre, authoritative, decisive",
    recommendedNiches: ["FinTech", "Enterprise B2B", "Infrastructure"],
  },
  {
    id: "elena_euro_accent",
    name: "Elena (EU)",
    gender: "female",
    accent: "EU",
    energyLevel: "Conversational",
    vibe: "Crisp international European English, intellectual",
    recommendedNiches: ["AI Agents", "Data Science", "Analytics"],
  },
  {
    id: "david_australian",
    name: "David (AU)",
    gender: "male",
    accent: "AU",
    energyLevel: "Conversational",
    vibe: "Grounded Aussie tone, approachable, consultative",
    recommendedNiches: ["Sales Tools", "CRM", "E-Commerce"],
  },
  {
    id: "chloe_viral_tiktok",
    name: "Chloe (US)",
    gender: "female",
    accent: "US",
    energyLevel: "High",
    vibe: "Fast Gen-Z TikTok cadence, expressive micro-pauses",
    recommendedNiches: ["Viral UGC", "Creator Economy", "Social Apps"],
  },
  {
    id: "liam_tech_review",
    name: "Liam (CA)",
    gender: "male",
    accent: "CA",
    energyLevel: "Conversational",
    vibe: "Enthusiastic Canadian tech reviewer, sincere and clear",
    recommendedNiches: ["Chrome Extensions", "No-Code", "Automation"],
  },
  {
    id: "maya_expressive_us",
    name: "Maya (US)",
    gender: "female",
    accent: "US",
    energyLevel: "High",
    vibe: "Vibrant and upbeat, perfect for product announcements",
    recommendedNiches: ["Growth Marketing", "DTC", "Consumer Apps"],
  },
  {
    id: "oliver_british_tech",
    name: "Oliver (UK)",
    gender: "male",
    accent: "UK",
    energyLevel: "Conversational",
    vibe: "Polished London tech founder with subtle wry humor",
    recommendedNiches: ["B2B SaaS", "Developer Platforms", "Security"],
  },
  {
    id: "clara_french_accent",
    name: "Clara (EU)",
    gender: "female",
    accent: "EU",
    energyLevel: "Warm Storyteller",
    vibe: "Refined continental accent, high design credibility",
    recommendedNiches: ["Design Tools", "Luxury DTC", "Creative SaaS"],
  },
  {
    id: "jack_aussie_builder",
    name: "Jack (AU)",
    gender: "male",
    accent: "AU",
    energyLevel: "High",
    vibe: "High-octane Sydney growth marketer, no fluff",
    recommendedNiches: ["Marketing Automations", "Lead Gen", "Shopify"],
  },
  {
    id: "zara_fast_talker",
    name: "Zara (US)",
    gender: "female",
    accent: "US",
    energyLevel: "High",
    vibe: "Relatable workplace secret confessor (video123.mp4 style)",
    recommendedNiches: ["Viral Confessions", "Workplace Tools", "AI Apps"],
  },
  {
    id: "ben_deep_voice",
    name: "Ben (US)",
    gender: "male",
    accent: "US",
    energyLevel: "Deep Authority",
    vibe: "Radio-grade deep resonance for enterprise positioning",
    recommendedNiches: ["Enterprise Security", "Cloud DBs", "Fintech"],
  },
  {
    id: "hannah_welcoming_uk",
    name: "Hannah (UK)",
    gender: "female",
    accent: "UK",
    energyLevel: "Warm Storyteller",
    vibe: "Friendly customer success onboarding tone",
    recommendedNiches: ["Customer Success", "HR Tech", "Support Tools"],
  },
  {
    id: "ryan_toronto_tech",
    name: "Ryan (CA)",
    gender: "male",
    accent: "CA",
    energyLevel: "Conversational",
    vibe: "Pragmatic startup engineer walking through features",
    recommendedNiches: ["DevOps", "APIs", "Open Source Tools"],
  },
];

/**
 * Calculates ducked background music volume when narration is active.
 * Standard broadcast target: -22dB ducking (~0.08 linear amplitude).
 */
export function calculateAudioDucking(
  baseMusicVolume = 0.35,
  isVoiceActive = true,
  duckingDb = -22
): number {
  if (!isVoiceActive) return baseMusicVolume;

  // Convert dB reduction to linear multiplier
  const multiplier = Math.pow(10, duckingDb / 20);
  const ducked = baseMusicVolume * multiplier;

  // Ensure minimum audible bed without masking vocals
  return Math.max(0.04, Math.min(ducked, baseMusicVolume));
}

export function getVoiceById(id: string): VoiceProfile | undefined {
  return VOICE_PROFILES.find((v) => v.id === id);
}

export function getVoicesByAccent(accent: VoiceProfile["accent"]): VoiceProfile[] {
  return VOICE_PROFILES.filter((v) => v.accent === accent);
}
