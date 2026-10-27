import { enforceMandatoryBrandMention } from "../src/lib/templates/videoTemplates";
import { generateViralScripts } from "../src/lib/ai/gemini";

async function runBrandMentionTests() {
  console.log("=== Running Mandatory Brand Mention Automated Test Suite ===");

  // Test 1: Inject brand when completely omitted
  {
    const brand = "HumanifyLab";
    const res = enforceMandatoryBrandMention(
      brand,
      "Stop manually typing replies in 2026.",
      "This workflow saves 15 hours every week with zero effort.",
      "Click the link to get started."
    );

    if (!res.brandIncluded) {
      throw new Error("Brand mention flag was false");
    }
    const fullText = `${res.hookText} ${res.bodyText} ${res.ctaText}`.toLowerCase();
    if (!fullText.includes("humanifylab")) {
      throw new Error(`Script failed to include brand name: ${fullText}`);
    }
    console.log("✓ Test 1 Passed: Brand name successfully injected when omitted from input script.");
  }

  // Test 2: Preserve brand when already present
  {
    const brand = "Lumina";
    const res = enforceMandatoryBrandMention(
      brand,
      "Stop coding under harsh lights when Lumina exists.",
      "Lumina auto-matches natural daylight.",
      "Get Lumina today."
    );

    const fullText = `${res.hookText} ${res.bodyText} ${res.ctaText}`;
    if (!fullText.includes("Lumina")) {
      throw new Error("Brand was accidentally stripped");
    }
    console.log("✓ Test 2 Passed: Existing brand mentions safely preserved.");
  }

  // Test 3: Generated scripts from AI engine strictly mention brand name
  {
    const brand = "AutoPilotMarketing";
    const output = await generateViralScripts({
      brandName: brand,
      pageTitle: "Autonomous Social Growth Engine",
      summary: "Turns website URLs into high-converting 9:16 video ads.",
      headings: ["Automate TikTok", "Schedule 30 Days", "Zero Creator Hiring"],
    });

    for (const item of output.scripts) {
      const combined = `${item.hook} ${item.body} ${item.cta}`.toLowerCase();
      if (!combined.includes(brand.toLowerCase())) {
        throw new Error(`Generated script for angle ${item.angleType} failed to mention brand name '${brand}': ${combined}`);
      }
    }
    console.log("✓ Test 3 Passed: 100% of AI-generated scripts explicitly speak the target brand name.");
  }

  console.log("=== ALL BRAND MENTION TESTS PASSED CLEANLY! ===");
}

runBrandMentionTests().catch((err) => {
  console.error("Brand mention test failed:", err);
  process.exit(1);
});
