import { z } from "zod";

export const ViralScriptItemSchema = z.object({
  angleType: z.enum(["negative_hook", "secret_hack", "problem_agitation"]),
  hook: z
    .string()
    .describe("High-retention 0-3 second opening sentence designed to stop the thumb scroll immediately."),
  body: z
    .string()
    .describe("The meat of the ad (3-11s): agitates the problem and introduces the product solution with zero fluff."),
  cta: z
    .string()
    .describe("Urgent 11-15s call to action encouraging direct click or profile visit."),
  estimatedDurationSeconds: z.number().default(14.5),
  caption: z
    .string()
    .describe("Engaging TikTok/Reels caption with natural tone and 5 targeted niche hashtags."),
  hashtags: z.array(z.string()).default([]),
  suggestedVisualCues: z
    .array(z.string())
    .default([])
    .describe("Visual direction for B-roll or dynamic screenshot zoom for each section."),
});

export const ViralScriptsResponseSchema = z.object({
  scripts: z
    .array(ViralScriptItemSchema)
    .min(3)
    .max(3)
    .describe("Exactly 3 distinct creative angles: Pattern Interrupt, Secret Hack, and Problem-Agitation."),
});

export type ViralScriptItem = z.infer<typeof ViralScriptItemSchema>;
export type ViralScriptsResponse = z.infer<typeof ViralScriptsResponseSchema>;
