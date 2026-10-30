import { generateViralScripts, GenerateScriptsInput } from "./gemini";
import { CREATOR_PERSONAS } from "@/components/studio/CreatorVisualPicker";

export interface BlitzAdVariation {
  id: string;
  angleTitle: string;
  angleType: "negative_hook" | "secret_hack" | "pov_discovery" | "costly_mistake" | "honest_review";
  hook: string;
  body: string;
  cta: string;
  creatorPersona: {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
    videoUrl: string;
    voiceId: string;
  };
  hookStickerType: "tiktok_question" | "tweet_card" | "pov_badge" | "bold_warning";
  benchmarkCtr: string;
  approved: boolean;
}

export async function generateBlitzCampaign(
  input: GenerateScriptsInput
): Promise<BlitzAdVariation[]> {
  const brand = input.brandName || "My Brand";
  const context = input.summary || input.pageTitle || "high-performance software";

  // Generate scripts via Gemini or fallback
  const baseScripts = await generateViralScripts(input);
  const rawList = baseScripts.scripts;

  const defaultTemplates: Array<{
    angleTitle: string;
    angleType: BlitzAdVariation["angleType"];
    hook: string;
    body: string;
    cta: string;
    personaIndex: number;
    stickerType: BlitzAdVariation["hookStickerType"];
    benchmarkCtr: string;
  }> = [
    {
      angleTitle: "The Secret Hack",
      angleType: "secret_hack",
      hook: `3 websites that feel completely illegal to know in 2026. Number 1 is ${brand}.`,
      body: `Instead of spending $3,000 a month on agencies, ${brand} automatically handles ${context} with zero manual work.`,
      cta: `Check out ${brand} at the link in bio before everyone finds out.`,
      personaIndex: 0, // Sarah
      stickerType: "tiktok_question",
      benchmarkCtr: "4.82% CTR",
    },
    {
      angleTitle: "The Pattern Interrupt",
      angleType: "negative_hook",
      hook: `Stop manually struggling with ${brand.toLowerCase()} tasks in 2026.`,
      body: `If you are still wasting 15 hours every week on this, you are burning cash. ${brand} does it in 30 seconds.`,
      cta: `Claim your free trial of ${brand} today.`,
      personaIndex: 1, // Alex
      stickerType: "bold_warning",
      benchmarkCtr: "4.15% CTR",
    },
    {
      angleTitle: "The POV Discovery",
      angleType: "pov_discovery",
      hook: `POV: You just discovered ${brand} and your entire workflow got 10x faster.`,
      body: `I was skeptical at first, but ${brand} replaced three separate tools we were paying $400/month for. Look at this.`,
      cta: `Tap below to see how ${brand} works for yourself.`,
      personaIndex: 2, // Emma
      stickerType: "tweet_card",
      benchmarkCtr: "3.94% CTR",
    },
    {
      angleTitle: "The $5,000 Mistake",
      angleType: "costly_mistake",
      hook: `The biggest mistake founders make when scaling ${context}.`,
      body: `They hire expensive freelancers when they could just set up ${brand} and run autonomous campaigns 24/7.`,
      cta: `Save thousands this quarter with ${brand} at the link below.`,
      personaIndex: 1, // Alex
      stickerType: "bold_warning",
      benchmarkCtr: "3.78% CTR",
    },
    {
      angleTitle: "The Honest Review",
      angleType: "honest_review",
      hook: `An honest review of ${brand} after running it for 30 days straight.`,
      body: `Our engagement jumped 340% and we didn't have to touch a single video editing timeline. ${brand} is genuinely cracked.`,
      cta: `Link is in my bio, try ${brand} right now.`,
      personaIndex: 0, // Sarah
      stickerType: "tiktok_question",
      benchmarkCtr: "4.41% CTR",
    },
  ];

  return defaultTemplates.map((item, index) => {
    // If Gemini provided a matching script, mix it in
    const geminiScript = rawList[index];
    const hook = geminiScript?.hook || item.hook;
    const body = geminiScript?.body || item.body;
    const cta = geminiScript?.cta || item.cta;

    const persona = CREATOR_PERSONAS[item.personaIndex] || CREATOR_PERSONAS[0];

    return {
      id: `blitz_ad_${Date.now()}_${index}`,
      angleTitle: item.angleTitle,
      angleType: item.angleType,
      hook,
      body,
      cta,
      creatorPersona: {
        id: persona.id,
        name: persona.name,
        role: persona.role,
        imageUrl: persona.imageUrl,
        videoUrl: persona.videoUrl,
        voiceId: persona.voiceId,
      },
      hookStickerType: item.stickerType,
      benchmarkCtr: item.benchmarkCtr,
      approved: true, // Approved by default in Blitz mode
    };
  });
}
