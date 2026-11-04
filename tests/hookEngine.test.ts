import test from "node:test";
import assert from "node:assert/strict";
import {
  generateViralHooksWithAi,
  generateDeterministicViralHooks,
} from "../src/lib/ai/hookEngine";

test("Gemini Dedicated Viral Hook Engine", async (t) => {
  await t.test("generates scroll-stopping viral UGC hooks for HumanifyLab", async () => {
    const hooks = await generateViralHooksWithAi({
      brandName: "HumanifyLab",
      targetUrl: "https://humanifyai.io",
      whatItDoes: "AI text humanizer that rewrites AI essays to bypass Turnitin, GPTZero, and Canvas",
      targetAudience: "College students, academic essay writers, and bloggers",
      coreUsp: "Bypass all AI detectors with 0% AI detection score and natural human rhythm",
      competitors: ["Undetectable AI", "QuillBot", "HideMyAI"],
      count: 4,
    });

    assert.ok(hooks.length >= 3, `Expected at least 3 hooks, got ${hooks.length}`);

    // Verify angles are diverse
    const angleTypes = hooks.map((h) => h.angleType);
    const uniqueAngles = new Set(angleTypes);
    assert.ok(uniqueAngles.size >= 2, `Expected diverse angles, got: ${Array.from(uniqueAngles)}`);

    // Verify mandatory brand mention in 100% of generated scripts
    for (const h of hooks) {
      const fullText = (h.fullScript || `${h.hookHeadline} ${h.spokenBodyText} ${h.spokenCtaText}`).toLowerCase();
      assert.ok(
        fullText.includes("humanifylab"),
        `Mandatory brand mention failed in hook angle '${h.angleType}': ${fullText}`
      );

      // Verify captions and hashtags
      assert.ok(h.captionCopy.length > 5, "Missing caption copy");
      assert.ok(h.viralHashtags.length >= 3, "Missing viral hashtags");
      assert.ok(
        h.viralHashtags.some((tag) => tag.toLowerCase().includes("humanifylab") || tag.toLowerCase().includes("ai")),
        "Hashtags should contain relevant tags"
      );
    }
  });

  await t.test("deterministic fallback produces instant high-converting hooks", () => {
    const fallbackHooks = generateDeterministicViralHooks({
      brandName: "HumanifyLab",
      targetUrl: "https://humanifyai.io",
      whatItDoes: "AI text humanizer that rewrites AI text",
      targetAudience: "College students and writers",
      coreUsp: "Score 0% on Turnitin and GPTZero",
      competitors: ["Undetectable AI"],
      count: 4,
    });

    assert.ok(fallbackHooks.length >= 4);
    assert.equal(fallbackHooks[0]!.angleType, "pattern_interrupt");
    assert.ok(fallbackHooks[0]!.fullScript.includes("HumanifyLab"));
    assert.ok(fallbackHooks[1]!.fullScript.includes("Turnitin") || fallbackHooks[1]!.fullScript.includes("HumanifyLab"));
  });
});
