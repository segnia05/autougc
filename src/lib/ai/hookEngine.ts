import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { BrandIntelligenceResult } from "./brandAnalyzer";
import { logger } from "@/lib/observability/logger";

export interface ViralHookVariation {
  id: string;
  angleType: "pattern_interrupt" | "secret_hack" | "problem_agitation" | "myth_buster" | "competitor_comparison";
  hookHeadline: string;
  visualActionPrompt: string;
  spokenBodyText: string;
  spokenCtaText: string;
  fullScript: string;
  captionCopy: string;
  viralHashtags: string[];
  estimatedDurationSeconds: number;
}

export interface GenerateViralHooksInput {
  brandName: string;
  targetUrl: string;
  whatItDoes: string;
  targetAudience: string;
  coreUsp: string;
  competitors: string[];
  count?: number; // Number of distinct hooks to generate (default 5)
}

const ViralHookSchema = z.object({
  angleType: z.enum([
    "pattern_interrupt",
    "secret_hack",
    "problem_agitation",
    "myth_buster",
    "competitor_comparison",
  ]),
  hookHeadline: z.string().min(5),
  visualActionPrompt: z.string().min(5),
  spokenBodyText: z.string().min(10),
  spokenCtaText: z.string().min(5),
  captionCopy: z.string().min(10),
  viralHashtags: z.array(z.string()).min(3),
  estimatedDurationSeconds: z.number().default(18),
});

const HookBatchResponseSchema = z.object({
  hooks: z.array(ViralHookSchema).min(3),
});

export const VIRAL_HOOK_DIRECTOR_SYSTEM_PROMPT = `
You are a world-class Performance UGC Creative Director who has scaled direct-to-consumer and SaaS brands to 50M+ views on TikTok, Instagram Reels, and YouTube Shorts.

Your objective is to craft irresistible, high-retention short-form video hooks based on deep brand positioning intelligence.

CRITICAL HOOK RULES:
1. 0–3 SECOND RETENTION (The "Scroll-Stop"):
   - The opening line must shock, provoke curiosity, or call out a relatable pain point instantly.
   - Ban generic greetings like "Hey guys", "Are you tired of...", or "Check out this app".
   - Start immediately with the pattern interrupt or raw confession.

2. MANDATORY BRAND NAME MENTION:
   - Every single variation MUST clearly speak the brand name in the script body and call-to-action.
   - Viewers must remember the brand name clearly.

3. DIVERSE ANGLES (No Repetitive Clones):
   - Angle 1 (pattern_interrupt): Shocking or contrarian statement challenging conventional wisdom.
   - Angle 2 (secret_hack): The "unfair advantage" or insider study/work shortcut.
   - Angle 3 (problem_agitation): Deep empathy for a painful, stressful problem (e.g. getting falsely flagged by AI detectors).
   - Angle 4 (myth_buster): Busting a myth that competitors or teachers/bosses propagate.
   - Angle 5 (competitor_comparison): Why users are abandoning the major competitor to use this product.

4. SOCIAL CAPTION & VIRAL HASHTAGS:
   - Provide a native, punchy caption with an emoji hook and clear call-to-action ("Link in bio").
   - Include 4-6 high-traffic, niche-specific hashtags (including #brandname).

Output strictly valid JSON matching this schema:
{
  "hooks": [
    {
      "angleType": "pattern_interrupt" | "secret_hack" | "problem_agitation" | "myth_buster" | "competitor_comparison",
      "hookHeadline": "The spoken 0-3 second opening sentence",
      "visualActionPrompt": "Creator action on camera (e.g. leaning in with laptop, looking shocked at screen)",
      "spokenBodyText": "The 6-12 second explanation showing software proof and the mechanism",
      "spokenCtaText": "Clear 3 second action mentioning the brand and link in bio",
      "captionCopy": "Ready-to-post TikTok/Instagram caption",
      "viralHashtags": ["#niche", "#viral", "#brand"],
      "estimatedDurationSeconds": 18
    }
  ]
}
`;

/**
 * Generates high-converting, scroll-stopping UGC video hooks via Gemini 2.5 Flash,
 * with resilient deterministic fallback if API is unconfigured or offline.
 */
export async function generateViralHooksWithAi(
  input: GenerateViralHooksInput
): Promise<ViralHookVariation[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const userPrompt = `
BRAND POSITIONING INTELLIGENCE:
- Brand Name: ${input.brandName}
- Target URL: ${input.targetUrl}
- What It Does: ${input.whatItDoes}
- Target Audience: ${input.targetAudience}
- Core USP: ${input.coreUsp}
- Competitors on TikTok: ${input.competitors.join(", ") || "Industry alternatives"}
- Requested Hook Count: ${input.count || 5}

Generate ${input.count || 5} distinct, high-converting TikTok/Reels scroll-stopping UGC hooks now in valid JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        config: {
          systemInstruction: VIRAL_HOOK_DIRECTOR_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.35, // Balanced between creative flair and structured discipline
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        const validated = HookBatchResponseSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data.hooks.map((h, i) => ({
            id: `hook_${Date.now()}_${i + 1}`,
            angleType: h.angleType,
            hookHeadline: h.hookHeadline,
            visualActionPrompt: h.visualActionPrompt,
            spokenBodyText: h.spokenBodyText,
            spokenCtaText: h.spokenCtaText,
            fullScript: `${h.hookHeadline} ${h.spokenBodyText} ${h.spokenCtaText}`,
            captionCopy: h.captionCopy,
            viralHashtags: h.viralHashtags,
            estimatedDurationSeconds: h.estimatedDurationSeconds || 18,
          }));
        }
      }
    } catch (err) {
      logger.warn("Gemini viral hook generation failed, falling back to deterministic template engine:", { error: String(err) });
    }
  }

  // Deterministic Fallback Engine
  return generateDeterministicViralHooks(input);
}

/**
 * Resilient deterministic fallback generator when Gemini API key is unset or offline.
 */
export function generateDeterministicViralHooks(
  input: GenerateViralHooksInput
): ViralHookVariation[] {
  const brand = input.brandName;
  const competitor = input.competitors[0] || "traditional tools";
  const audience = input.targetAudience;

  const isHumanizer =
    input.whatItDoes.toLowerCase().includes("humaniz") ||
    input.whatItDoes.toLowerCase().includes("turnitin") ||
    input.whatItDoes.toLowerCase().includes("ai text");

  if (isHumanizer) {
    return [
      {
        id: `hook_det_1`,
        angleType: "pattern_interrupt",
        hookHeadline: `Stop manually rewriting your essays at 2 AM in 2026.`,
        visualActionPrompt: "Creator leaning into camera looking exasperated with an open laptop in background",
        spokenBodyText: `I used to spend 4 hours tweaking every sentence to dodge AI flags. Then I tested ${brand}. It rewrote my entire 2,000-word draft in 5 seconds and scored zero percent on Turnitin and GPTZero.`,
        spokenCtaText: `Don't risk your GPA. Tap the link in bio to test ${brand} for free.`,
        fullScript: `Stop manually rewriting your essays at 2 AM in 2026. I used to spend 4 hours tweaking every sentence to dodge AI flags. Then I tested ${brand}. It rewrote my entire 2,000-word draft in 5 seconds and scored zero percent on Turnitin and GPTZero. Don't risk your GPA. Tap the link in bio to test ${brand} for free.`,
        captionCopy: `How I scored 0% AI detection on my paper with zero stress 🤫 Link in bio to try ${brand}!`,
        viralHashtags: ["#collegelife", "#studyhacks", "#studentlife", `#${brand.replace(/\s+/g, "")}`, "#essaytips"],
        estimatedDurationSeconds: 19,
      },
      {
        id: `hook_det_2`,
        angleType: "secret_hack",
        hookHeadline: `Watch how ${brand} bypasses every major AI detector in 3 seconds flat.`,
        visualActionPrompt: "Creator pointing camera directly at screen showing software UI text transformation",
        spokenBodyText: `Look at this: here's raw ChatGPT text flagged as 100% AI. Paste it into ${brand}, click humanize, and check the score. Completely undetected with natural human sentence structure.`,
        spokenCtaText: `Try it on your own draft right now—link is in my bio.`,
        fullScript: `Watch how ${brand} bypasses every major AI detector in 3 seconds flat. Look at this: here's raw ChatGPT text flagged as 100% AI. Paste it into ${brand}, click humanize, and check the score. Completely undetected with natural human sentence structure. Try it on your own draft right now—link is in my bio.`,
        captionCopy: `The 3-second study hack that professors don't want you to see 🚀 Link in bio!`,
        viralHashtags: ["#studywithme", "#aitools", "#writingtips", `#${brand.replace(/\s+/g, "")}`, "#gpa"],
        estimatedDurationSeconds: 18,
      },
      {
        id: `hook_det_3`,
        angleType: "problem_agitation",
        hookHeadline: `Why is nobody talking about how unfair false AI detector flags actually are?!`,
        visualActionPrompt: "Creator holding head in hands looking genuinely frustrated",
        spokenBodyText: `You write an original paper, turn it in, and Canvas or Turnitin flags it as 60% AI. It's ridiculous. That's why ${brand} is an absolute must-have. It normalizes your sentence flow so you never get flagged again.`,
        spokenCtaText: `Protect your grades today—check out ${brand} in my bio.`,
        fullScript: `Why is nobody talking about how unfair false AI detector flags actually are?! You write an original paper, turn it in, and Canvas or Turnitin flags it as 60% AI. It's ridiculous. That's why ${brand} is an absolute must-have. It normalizes your sentence flow so you never get flagged again. Protect your grades today—check out ${brand} in my bio.`,
        captionCopy: `False AI detection flags are out of control. Protect yourself with ${brand}! Link in bio ✍️`,
        viralHashtags: ["#turnitin", "#collegeproblems", "#university", `#${brand.replace(/\s+/g, "")}`, "#studygram"],
        estimatedDurationSeconds: 21,
      },
      {
        id: `hook_det_4`,
        angleType: "competitor_comparison",
        hookHeadline: `I canceled my ${competitor} subscription the second I found ${brand}.`,
        visualActionPrompt: "Creator holding phone, tapping screen with a knowing smile",
        spokenBodyText: `Other tools give you robotic, awkward grammar that still triggers GPTZero. ${brand} actually sounds like a real human student wrote it. Plus, it's 10 times faster.`,
        spokenCtaText: `Make the switch and test ${brand} free via the link in bio!`,
        fullScript: `I canceled my ${competitor} subscription the second I found ${brand}. Other tools give you robotic, awkward grammar that still triggers GPTZero. ${brand} actually sounds like a real human student wrote it. Plus, it's 10 times faster. Make the switch and test ${brand} free via the link in bio!`,
        captionCopy: `Why I ditched ${competitor} for ${brand} 🤫 Test it yourself with the link in bio!`,
        viralHashtags: ["#productivity", "#writingcommunity", "#studenthacks", `#${brand.replace(/\s+/g, "")}`, "#aiwriter"],
        estimatedDurationSeconds: 17,
      },
    ];
  }

  // Generic High-Converting Product Hooks
  return [
    {
      id: `hook_gen_1`,
      angleType: "pattern_interrupt",
      hookHeadline: `Stop doing this manually in 2026.`,
      visualActionPrompt: "Creator waving hand at camera with laptop open on desk",
      spokenBodyText: `If you are in ${audience}, ${brand} completely automates what used to take 3 hours into 30 seconds. Here is the exact proof on screen.`,
      spokenCtaText: `Check the link in bio to try ${brand} right now!`,
      fullScript: `Stop doing this manually in 2026. If you are in ${audience}, ${brand} completely automates what used to take 3 hours into 30 seconds. Here is the exact proof on screen. Check the link in bio to try ${brand} right now!`,
      captionCopy: `Automate your workflow in seconds with ${brand} 🚀 Link in bio!`,
      viralHashtags: ["#productivityhacks", "#techtools", `#${brand.replace(/\s+/g, "")}`, "#workflow"],
      estimatedDurationSeconds: 16,
    },
    {
      id: `hook_gen_2`,
      angleType: "secret_hack",
      hookHeadline: `The secret tool that saved me 10 hours this week...`,
      visualActionPrompt: "Creator leaning into microphone excitedly",
      spokenBodyText: `I stumbled across ${brand} and it completely changed how I work. Look how smooth this interface is and how fast it delivers results.`,
      spokenCtaText: `Don't sleep on this—test ${brand} with the link in bio.`,
      fullScript: `The secret tool that saved me 10 hours this week... I stumbled across ${brand} and it completely changed how I work. Look how smooth this interface is and how fast it delivers results. Don't sleep on this—test ${brand} with the link in bio.`,
      captionCopy: `The game-changing tool you need in 2026 🤯 Check ${brand} at link in bio!`,
      viralHashtags: ["#productivity", "#software", `#${brand.replace(/\s+/g, "")}`, "#growth"],
      estimatedDurationSeconds: 15,
    },
    {
      id: `hook_gen_3`,
      angleType: "problem_agitation",
      hookHeadline: `Why is nobody talking about how frustrating this problem is?!`,
      visualActionPrompt: "Creator pointing at screen with exasperated expression",
      spokenBodyText: `Everyone talks about scaling, but nobody mentions the clunky tools that slow you down. ${brand} was built specifically to fix this for ${audience}.`,
      spokenCtaText: `Try ${brand} today—link in bio!`,
      fullScript: `Why is nobody talking about how frustrating this problem is?! Everyone talks about scaling, but nobody mentions the clunky tools that slow you down. ${brand} was built specifically to fix this for ${audience}. Try ${brand} today—link in bio!`,
      captionCopy: `Fixing the most frustrating part of your workday with ${brand}. Link in bio! 🔥`,
      viralHashtags: ["#automation", "#efficiency", `#${brand.replace(/\s+/g, "")}`, "#dailyhacks"],
      estimatedDurationSeconds: 17,
    },
  ];
}

