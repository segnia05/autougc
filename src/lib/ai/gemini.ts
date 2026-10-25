import { GoogleGenAI } from "@google/genai";
import { VIRAL_UGC_SYSTEM_PROMPT, buildScriptPrompt } from "./prompts";
import {
  ViralScriptsResponseSchema,
  type ViralScriptsResponse,
  type ViralScriptItem,
} from "./schema";

export interface GenerateScriptsInput {
  brandName: string;
  pageTitle: string;
  summary: string;
  headings: string[];
  targetAudience?: string;
}

export async function generateViralScripts(
  input: GenerateScriptsInput
): Promise<ViralScriptsResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Production Google Gemini 2.5 Flash invocation
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildScriptPrompt(input);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          systemInstruction: VIRAL_UGC_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        const validated = ViralScriptsResponseSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, switching to high-converting template engine:", err);
    }
  }

  // 2. High-Converting Deterministic Fallback Engine (Runs when no API key is set or on API degradation)
  return getFallbackScripts(input);
}

function getFallbackScripts(input: GenerateScriptsInput): ViralScriptsResponse {
  const brand = input.brandName;
  const highlight = input.headings[0] || input.summary || "your daily productivity";

  const scripts: ViralScriptItem[] = [
    {
      angleType: "negative_hook",
      hook: `Stop manually struggling with ${brand.toLowerCase()} tasks in 2026.`,
      body: `If you're still wasting hours on this, you're doing it wrong. ${brand} automates the entire workflow in two clicks with zero learning curve.`,
      cta: `Try ${brand} free today and get your first results in under 60 seconds.`,
      estimatedDurationSeconds: 14.2,
      caption: `Why are we still doing this manually in 2026? Here is the exact fix. #${brand.toLowerCase().replace(/\s+/g, "")} #productivity #lifehack #techtok #workflow`,
      hashtags: [brand.toLowerCase().replace(/\s+/g, ""), "productivity", "lifehack", "techtok", "workflow"],
      suggestedVisualCues: [
        "Frustrated person looking at screen",
        `Clean split screen showing ${brand} dashboard`,
        "Fast 1-click execution overlay",
      ],
    },
    {
      angleType: "secret_hack",
      hook: `The simple ${brand} hack that basically saved me 10 hours this week.`,
      body: `Nobody talks about how easily you can scale results once you eliminate this bottleneck. ${brand} does all the heavy lifting automatically.`,
      cta: `Click the link below and unlock your setup before the current promo ends.`,
      estimatedDurationSeconds: 13.8,
      caption: `The one growth framework nobody is sharing right now. #${brand.toLowerCase().replace(/\s+/g, "")} #growthhack #techtools #business #automation`,
      hashtags: [brand.toLowerCase().replace(/\s+/g, ""), "growthhack", "techtools", "business", "automation"],
      suggestedVisualCues: [
        "Excited creator whisper hook to camera",
        "Screen recording showing instant results",
        "Callout sticker pointing to CTA link",
      ],
    },
    {
      angleType: "problem_agitation",
      hook: `Why does nobody talk about how painful ${highlight.toLowerCase().slice(0, 40)} actually is?`,
      body: `I tried fixing this with three different tools until I found ${brand}. It solves the root problem instantly without breaking your budget.`,
      cta: `Check out ${brand} right now—you'll wonder how you ever managed without it.`,
      estimatedDurationSeconds: 14.8,
      caption: `The struggle was real until I found this. Full breakdown in this clip. #${brand.toLowerCase().replace(/\s+/g, "")} #entrepreneur #tools #hacks #trending`,
      hashtags: [brand.toLowerCase().replace(/\s+/g, ""), "entrepreneur", "tools", "hacks", "trending"],
      suggestedVisualCues: [
        "Head-shake reaction with dynamic kinetic subtitles",
        "Before vs After comparative layout",
        "Upbeat celebratory reaction finish",
      ],
    },
  ];

  return { scripts };
}
