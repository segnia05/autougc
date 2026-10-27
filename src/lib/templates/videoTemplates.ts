/**
 * 3 Core Video Marketing Templates & Brand Mention Enforcement
 */

export type VideoTemplateArchetype =
  | "studio_minimalist"
  | "organic_selfie"
  | "meme_reaction";

export interface VideoTemplateConfig {
  id: VideoTemplateArchetype;
  name: string;
  tagline: string;
  description: string;
  audioMode: "narration_ducked" | "music_only";
  hasVoiceover: boolean;
  visualVibe: string;
  recommendedCreatorVibe: string;
  defaultMusicTrack: string;
  defaultSubtitleTheme: string;
}

export const VIDEO_TEMPLATES: Record<VideoTemplateArchetype, VideoTemplateConfig> = {
  studio_minimalist: {
    id: "studio_minimalist",
    name: "Minimalist Studio UGC",
    tagline: "High-Authority Desk & Studio Breakdown",
    description: "Ultra-clean workspace setup with genuine founder breakdown. Focuses on product credibility, software interface walkthroughs, and high-trust B2B positioning.",
    audioMode: "narration_ducked",
    hasVoiceover: true,
    visualVibe: "Architectural, clean desk lighting, studio microphone, subtle interface overlays.",
    recommendedCreatorVibe: "Direct, founder-to-founder authority (Alex Chen, Marcus Vance).",
    defaultMusicTrack: "lofi_focus",
    defaultSubtitleTheme: "minimal_white",
  },
  organic_selfie: {
    id: "organic_selfie",
    name: "Organic Handheld Selfie",
    tagline: "Real User Relatable Confession",
    description: "Front-facing mobile selfie with authentic micro-movements (matching video123.mp4). The creator shares a candid workplace secret where your SaaS is the punchline.",
    audioMode: "narration_ducked",
    hasVoiceover: true,
    visualVibe: "Natural ambient lighting, handheld camera breathing, raw unpolished authenticity.",
    recommendedCreatorVibe: "Witty, high-energy, relatable bestie (Sarah Miller, Chloe Kim).",
    defaultMusicTrack: "chill_beats",
    defaultSubtitleTheme: "hormozi_amber",
  },
  meme_reaction: {
    id: "meme_reaction",
    name: "Viral Kinetic Meme (Music Only)",
    tagline: "High-Engagement Punchline + Silent Reaction",
    description: "Viral short-form format with zero voiceover. Uses relatable viral text hooks paired with trending lo-fi beats while the creator performs expressive silent reactions.",
    audioMode: "music_only",
    hasVoiceover: false,
    visualVibe: "Bold kinetic text banner top-centered, expressive character reaction, maximum watch-time loopability.",
    recommendedCreatorVibe: "Expressive comedic timing (Emma Davis, Sarah Miller, Chloe Kim).",
    defaultMusicTrack: "upbeat_vibes",
    defaultSubtitleTheme: "beast_cyan",
  },
};

/**
 * Non-negotiable brand mention rule:
 * Guarantees that the target brand or website name (e.g. HumanifyLab, Lumina)
 * is explicitly spoken in the script or featured prominently in the meme punchline.
 */
export function enforceMandatoryBrandMention(
  brandName: string,
  hookText: string,
  bodyText: string,
  ctaText: string
): { hookText: string; bodyText: string; ctaText: string; brandIncluded: boolean } {
  if (!brandName || brandName.trim().length === 0) {
    brandName = "this tool";
  }

  const cleanBrand = brandName.trim();
  const lowerBrand = cleanBrand.toLowerCase();

  const inHook = hookText.toLowerCase().includes(lowerBrand);
  const inBody = bodyText.toLowerCase().includes(lowerBrand);
  const inCta = ctaText.toLowerCase().includes(lowerBrand);

  const updatedHook = hookText;
  let updatedBody = bodyText;
  let updatedCta = ctaText;

  // If brand is not mentioned anywhere, seamlessly inject it as the core punchline
  if (!inHook && !inBody && !inCta) {
    if (updatedBody.length > 0) {
      updatedBody = `That's why I switched to ${cleanBrand}. ` + updatedBody;
    } else {
      updatedBody = `Everything changed when I found ${cleanBrand}. It handles everything automatically.`;
    }
  }

  // Ensure CTA explicitly mentions brand if not in hook
  if (!inHook && !updatedCta.toLowerCase().includes(lowerBrand)) {
    updatedCta = `Check out ${cleanBrand} today and see the difference.`;
  }

  return {
    hookText: updatedHook,
    bodyText: updatedBody,
    ctaText: updatedCta,
    brandIncluded: true,
  };
}
