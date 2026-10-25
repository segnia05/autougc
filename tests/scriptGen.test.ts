import { generateViralScripts } from "../src/lib/ai/gemini";

async function runTests() {
  console.log("--- Running Viral Script Generator Unit Tests ---");

  const input = {
    brandName: "Lumina",
    pageTitle: "Smart Desk Lamp for Deep Focus & Productivity",
    summary: "AI-powered adaptive lighting designed for developers and deep-work professionals.",
    headings: [
      "Stop Eye Strain at 3 PM",
      "Adapts Color Temperature Automatically",
      "Built for 10-Hour Deep Work Sprints",
    ],
    targetAudience: "Software engineers, remote workers, creators",
  };

  const result = await generateViralScripts(input);

  console.log(`Generated ${result.scripts.length} script variations.`);

  if (result.scripts.length !== 3) {
    console.error("✗ Test failed: Expected exactly 3 scripts.");
    process.exit(1);
  }

  const angles = result.scripts.map((s) => s.angleType);
  console.log("Angles generated:", angles);

  if (
    !angles.includes("negative_hook") ||
    !angles.includes("secret_hack") ||
    !angles.includes("problem_agitation")
  ) {
    console.error("✗ Test failed: Missing required viral angles.");
    process.exit(1);
  }

  for (let i = 0; i < result.scripts.length; i++) {
    const s = result.scripts[i]!;
    const wordCount = (s.hook + " " + s.body + " " + s.cta).split(/\s+/).length;
    console.log(`Script ${i + 1} (${s.angleType}): ${wordCount} words, Duration ~${s.estimatedDurationSeconds}s`);
    console.log(`  Hook: "${s.hook}"`);
  }

  console.log("\n✓ All Script Generator tests passed successfully!");
}

runTests();
