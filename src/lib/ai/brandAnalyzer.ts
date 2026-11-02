import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export interface BrandIntelligenceInput {
  brandName: string;
  url: string;
  pageTitle: string;
  summary: string;
  headings: string[];
  bodySnippet?: string;
}

export interface BrandIntelligenceResult {
  brandName: string;
  whatItDoes: string;
  targetAudience: string;
  coreUsp: string;
  primaryGoal: string;
  category: string;
  competitors: string[];
}

const BrandIntelligenceSchema = z.object({
  brandName: z.string().default(""),
  whatItDoes: z.string().min(5),
  targetAudience: z.string().min(5),
  coreUsp: z.string().min(5),
  primaryGoal: z.string().min(5),
  category: z.string().min(3),
  competitors: z.array(z.string()).min(1),
});

export const BRAND_INTELLIGENCE_SYSTEM_PROMPT = `
You are an expert product marketing strategist, market research intelligence analyst, and performance creative director.
Your mission is to analyze a website's scraped information (brand name, URL, page title, meta description, key headings, and body text) and synthesize high-precision market positioning intelligence.

CRITICAL POSITIONING GUIDELINES:
1. WHAT IT DOES ('whatItDoes'):
   - Provide a crystal-clear, plain-English 1-sentence description of the product's actual function and core mechanism.
   - Example (AI text humanizer): "An AI text humanizer that rewrites AI-generated essays and articles into natural human writing to score 0% on AI detectors."
   - Avoid vague marketing buzzwords ("the ultimate solution to revolutionize your workflow"). Be specific.

2. TARGET AUDIENCE ('targetAudience'):
   - Accurately determine the REAL, specific human end-users who need this product.
   - Look closely at domain keywords and mentions (e.g. Turnitin, Canvas, essays, academic, GPA -> College students, academic essay writers, bloggers, and content creators).
   - If it is for developers (APIs, Git, Docker, Kubernetes) -> "Software engineers, DevOps architects, and technical teams".
   - If it is for e-commerce (Shopify, checkout, cart) -> "E-commerce founders, Shopify store owners, and DTC marketers".
   - NEVER lazily default to "Tech founders, developers, and product teams" unless the product is specifically a developer tool.

3. CORE VALUE PROPOSITION ('coreUsp'):
   - The single sharpest, highest-converting hook or value proposition explaining why a user must use this tool instead of doing it manually or using generic alternatives.

4. PRIMARY GROWTH GOAL ('primaryGoal'):
   - A realistic, action-oriented business growth goal.
   - Example: "Convert students and writers needing to bypass Turnitin and GPTZero into paying subscribers."

5. REAL-WORLD COMPETITORS ('competitors'):
   - List 3 to 5 real-world direct market competitors in the exact same niche.
   - Example for AI Humanizers: ["Undetectable AI", "QuillBot", "HideMyAI", "StealthWriter", "Phrasly"]
   - Example for Project Management: ["Linear", "Jira", "Asana", "Monday.com"]
   - Example for Developer Analytics: ["Datadog", "Sentry", "New Relic"]

6. CATEGORY ('category'):
   - A 2-4 word market category (e.g. "AI Text Humanizer & Writing", "Developer Tooling", "E-commerce & Conversion", "Video Creation & UGC").

You MUST respond strictly with valid JSON conforming to this schema:
{
  "whatItDoes": "...",
  "targetAudience": "...",
  "coreUsp": "...",
  "primaryGoal": "...",
  "category": "...",
  "competitors": ["...", "...", "..."]
}
`;

/**
 * Analyzes scraped website information using Gemini 2.5 Flash to extract
 * true target audience, real-world competitors, core functionality, and growth goals.
 */
export async function analyzeBrandIntelligence(
  input: BrandIntelligenceInput
): Promise<BrandIntelligenceResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const userPrompt = `
WEBSITE INFORMATION TO ANALYZE:
- Brand Name: ${input.brandName}
- Target URL: ${input.url}
- Page Title: ${input.pageTitle}
- Meta Description / Summary: ${input.summary}
- Key Headings: ${input.headings.slice(0, 6).join(" | ")}
${input.bodySnippet ? `- Page Content Snippet: ${input.bodySnippet.slice(0, 1500)}` : ""}

Synthesize the target audience, what it actually does, core USP, primary goal, category, and 3-5 real competitors now in JSON.
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
          systemInstruction: BRAND_INTELLIGENCE_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.2, // Low temperature for factual precision
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        const validated = BrandIntelligenceSchema.safeParse(parsed);
        if (validated.success) {
          return {
            brandName: input.brandName || validated.data.brandName,
            whatItDoes: validated.data.whatItDoes,
            targetAudience: validated.data.targetAudience,
            coreUsp: validated.data.coreUsp,
            primaryGoal: validated.data.primaryGoal,
            category: validated.data.category,
            competitors: validated.data.competitors,
          };
        }
      }
    } catch (err) {
      console.warn("Gemini brand intelligence extraction failed, falling back to heuristic engine:", err);
    }
  }

  // Resilient Heuristic Extraction Fallback (deterministic keyword matching)
  return getHeuristicBrandIntelligence(input);
}

/**
 * Deterministic heuristic engine that accurately classifies products when
 * offline, in testing environments, or when GEMINI_API_KEY is not configured.
 */
export function getHeuristicBrandIntelligence(
  input: BrandIntelligenceInput
): BrandIntelligenceResult {
  const textCorpus = [
    input.brandName,
    input.url,
    input.pageTitle,
    input.summary,
    ...input.headings,
    input.bodySnippet || "",
  ]
    .join(" ")
    .toLowerCase();

  // 1. AI Text Humanizer / Academic Writing
  if (
    textCorpus.includes("humaniz") ||
    textCorpus.includes("turnitin") ||
    textCorpus.includes("gptzero") ||
    textCorpus.includes("bypass") ||
    textCorpus.includes("undetectable") ||
    textCorpus.includes("essay") ||
    textCorpus.includes("plagiarism") ||
    textCorpus.includes("paraphras") ||
    textCorpus.includes("quillbot") ||
    textCorpus.includes("ai text") ||
    textCorpus.includes("ai detection")
  ) {
    return {
      brandName: input.brandName,
      whatItDoes: "AI text humanizer that transforms AI-generated content into natural human writing to bypass Turnitin, GPTZero, and Canvas.",
      targetAudience: "College students, academic essay writers, bloggers, freelance copywriters, and anyone using AI for writing",
      coreUsp: input.summary || "Bypass all AI detectors with 0% AI detection and natural human phrasing",
      primaryGoal: `Help students and writers bypass AI detection on Turnitin and GPTZero without getting flagged`,
      category: "AI Text Humanizer & Academic Writing",
      competitors: ["Undetectable AI", "QuillBot", "HideMyAI", "StealthWriter", "Phrasly"],
    };
  }

  // 2. Developer Tools, APIs, & Cloud Infrastructure
  if (
    textCorpus.includes("developer") ||
    textCorpus.includes(" api ") ||
    textCorpus.includes("sdk") ||
    textCorpus.includes("github") ||
    textCorpus.includes("cli") ||
    textCorpus.includes("database") ||
    textCorpus.includes("docker") ||
    textCorpus.includes("kubernetes") ||
    textCorpus.includes("devops") ||
    textCorpus.includes("code") ||
    textCorpus.includes("terminal")
  ) {
    return {
      brandName: input.brandName,
      whatItDoes: "Developer platform and tooling infrastructure designed to accelerate engineering workflows.",
      targetAudience: "Software engineers, DevOps architects, and technical product builders",
      coreUsp: input.summary || "High-performance developer infrastructure built for modern engineering teams",
      primaryGoal: `Drive developer adoption and API usage across engineering teams`,
      category: "Developer Tools & Cloud Infrastructure",
      competitors: ["Linear", "Raycast", "Supabase", "Datadog", "Postman"],
    };
  }

  // 3. E-Commerce & Retail DTC
  if (
    textCorpus.includes("shopify") ||
    textCorpus.includes("ecommerce") ||
    textCorpus.includes("e-commerce") ||
    textCorpus.includes("store") ||
    textCorpus.includes("cart") ||
    textCorpus.includes("checkout") ||
    textCorpus.includes("clothing") ||
    textCorpus.includes("apparel") ||
    textCorpus.includes("shipping")
  ) {
    return {
      brandName: input.brandName,
      whatItDoes: "E-commerce and DTC consumer shopping platform offering direct-to-consumer goods.",
      targetAudience: "Online shoppers, DTC brand buyers, and modern consumers looking for quality products",
      coreUsp: input.summary || "Premium quality and rapid delivery directly from the brand",
      primaryGoal: `Increase store conversion rates and scale online order volume`,
      category: "E-Commerce & DTC Retail",
      competitors: ["Shopify Plus", "Klaviyo", "Triple Whale", "Gorgias"],
    };
  }

  // 4. Video & UGC Creation
  if (
    textCorpus.includes("video") ||
    textCorpus.includes("ugc") ||
    textCorpus.includes("tiktok") ||
    textCorpus.includes("reels") ||
    textCorpus.includes("creator")
  ) {
    return {
      brandName: input.brandName,
      whatItDoes: "Autonomous AI video and creative engine that produces viral short-form social video ads.",
      targetAudience: "Performance marketers, DTC founders, growth operators, and digital advertisers",
      coreUsp: input.summary || "Turn any product URL into viral TikTok and Reels video ads in seconds",
      primaryGoal: `Scale ad creative volume and reduce customer acquisition costs`,
      category: "Video Creation & UGC Automation",
      competitors: ["CapCut", "HeyGen", "Submagic", "Opus Clip", "Creatify"],
    };
  }

  // 5. Intelligent Generic Fallback based on Page Title & Summary
  const cleanSummary = input.summary || (input.headings[0] ?? `${input.brandName} digital platform`);
  return {
    brandName: input.brandName,
    whatItDoes: cleanSummary,
    targetAudience: `Users, professionals, and customers looking for ${input.brandName}`,
    coreUsp: cleanSummary,
    primaryGoal: `Grow paying customers and scale user acquisition for ${input.brandName}`,
    category: "Digital Product & Software",
    competitors: [`${input.brandName} Alternative A`, "Market Leader B", "Popular Competitor C"],
  };
}

