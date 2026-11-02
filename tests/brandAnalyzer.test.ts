import { describe, it } from "node:test";
import assert from "node:assert";
import {
  analyzeBrandIntelligence,
  getHeuristicBrandIntelligence,
} from "../src/lib/ai/brandAnalyzer";
import { analyzeCompetitorLandscape } from "../src/lib/intelligence/competitorRadarService";

describe("Brand & Market Intelligence Engine", () => {
  it("accurately classifies AI Text Humanizer (e.g. HumanifyLab) for students and writers", async () => {
    const input = {
      brandName: "HumanifyLab",
      url: "https://humanifylab.com",
      pageTitle: "Humanify AI text with HumanifyLab. Bypass AI detection & score 0% AI.",
      summary: "humanizer trusted by 500K+ writers to bypass Turnitin, GPTZero, and Canvas with zero sign-up required.",
      headings: [
        "Humanify AI text with HumanifyLab",
        "Bypass AI detection & score 0% AI",
        "Trusted by 500,000+ Students and Content Writers",
      ],
      bodySnippet: "Bypass Turnitin plagiarism detectors. Perfect for college essays, blogs, and marketing copy.",
    };

    const result = await analyzeBrandIntelligence(input);

    // Target audience must be students/writers, NOT tech founders/developers
    const lowerAudience = result.targetAudience.toLowerCase();
    const hasStudentOrWriter =
      lowerAudience.includes("student") ||
      lowerAudience.includes("writer") ||
      lowerAudience.includes("essay") ||
      lowerAudience.includes("blogger");

    assert.ok(
      hasStudentOrWriter,
      `Expected targetAudience to mention students/writers/bloggers, got: "${result.targetAudience}"`
    );
    assert.ok(
      !lowerAudience.includes("tech founder"),
      `Audience should not default to tech founders for an academic tool: "${result.targetAudience}"`
    );

    // Core functionality
    assert.ok(
      result.whatItDoes.toLowerCase().includes("humaniz") ||
      result.whatItDoes.toLowerCase().includes("bypass") ||
      result.whatItDoes.toLowerCase().includes("ai"),
      `Expected whatItDoes to explain text humanization, got: "${result.whatItDoes}"`
    );

    // Competitors must be relevant real-world rivals
    assert.ok(Array.isArray(result.competitors) && result.competitors.length >= 2);
    const competitorString = result.competitors.join(" ").toLowerCase();
    const hasKnownRival =
      competitorString.includes("undetectable") ||
      competitorString.includes("quillbot") ||
      competitorString.includes("hidemyai") ||
      competitorString.includes("stealth");

    assert.ok(
      hasKnownRival,
      `Expected competitors to include real humanizer rivals, got: ${JSON.stringify(result.competitors)}`
    );
  });

  it("accurately classifies Developer Tooling (e.g. Linear/Supabase)", async () => {
    const input = {
      brandName: "DevPulse",
      url: "https://devpulse.io",
      pageTitle: "Fast CLI and API Observability for Modern Microservices",
      summary: "Debug Kubernetes, Docker containers, and REST APIs directly from your terminal.",
      headings: ["Automated CLI Profiling", "Zero-Latency API Telemetry"],
      bodySnippet: "Built for software engineers, DevOps architects, and backend engineering teams.",
    };

    const result = getHeuristicBrandIntelligence(input);

    const lowerAudience = result.targetAudience.toLowerCase();
    assert.ok(
      lowerAudience.includes("engineer") ||
      lowerAudience.includes("devops") ||
      lowerAudience.includes("developer"),
      `Expected dev audience, got: "${result.targetAudience}"`
    );
    assert.ok(
      result.competitors.includes("Linear") ||
      result.competitors.includes("Raycast") ||
      result.competitors.includes("Datadog"),
      `Expected developer tool competitors, got: ${JSON.stringify(result.competitors)}`
    );
  });

  it("dynamically injects AI-discovered competitors into Competitor Radar", () => {
    const competitors = ["Undetectable AI", "QuillBot", "HideMyAI"];
    const radar = analyzeCompetitorLandscape(
      "AI Text Humanizer & Academic Writing",
      "HumanifyLab",
      "https://example.com/shot.png",
      competitors
    );

    // The top competitor name must be the AI discovered rival
    assert.strictEqual(radar.topCompetitorName, "Undetectable AI");
    assert.strictEqual(radar.longestRunningAd.brandName, "Undetectable AI");
    assert.ok(radar.suggestedFirstAds[0]?.title.includes("Undetectable AI"));
  });
});

