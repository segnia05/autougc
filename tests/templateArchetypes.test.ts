import {
  VIDEO_TEMPLATES,
  VideoTemplateArchetype,
} from "../src/lib/templates/videoTemplates";

async function runTemplateArchetypeTests() {
  console.log("=== Running Video Template Archetypes Automated Test Suite ===");

  const archetypes: VideoTemplateArchetype[] = [
    "studio_minimalist",
    "organic_selfie",
    "meme_reaction",
  ];

  // Test 1: Verify all 3 core archetypes are configured
  for (const arch of archetypes) {
    const config = VIDEO_TEMPLATES[arch];
    if (!config) {
      throw new Error(`Missing configuration for template: ${arch}`);
    }
    if (!config.name || !config.description || !config.tagline) {
      throw new Error(`Incomplete metadata for template: ${arch}`);
    }
  }
  console.log("✓ Test 1 Passed: All 3 core template archetypes verified.");

  // Test 2: Minimalist Studio UGC configuration
  {
    const studio = VIDEO_TEMPLATES.studio_minimalist;
    if (studio.audioMode !== "narration_ducked" || !studio.hasVoiceover) {
      throw new Error("Minimalist Studio UGC must feature ducked narration voiceover.");
    }
    console.log("✓ Test 2 Passed: Minimalist Studio UGC verified (High-authority voiceover & desk setup).");
  }

  // Test 3: Organic Handheld Selfie configuration
  {
    const selfie = VIDEO_TEMPLATES.organic_selfie;
    if (selfie.audioMode !== "narration_ducked" || !selfie.hasVoiceover) {
      throw new Error("Organic Handheld Selfie must feature ducked vocal narration.");
    }
    console.log("✓ Test 3 Passed: Organic Handheld Selfie verified (video123 relatable confession style).");
  }

  // Test 4: Viral Kinetic Meme (Music Only) configuration
  {
    const meme = VIDEO_TEMPLATES.meme_reaction;
    if (meme.audioMode !== "music_only" || meme.hasVoiceover !== false) {
      throw new Error("Viral Kinetic Meme must be strictly music_only with zero voiceover speech.");
    }
    console.log("✓ Test 4 Passed: Viral Kinetic Meme verified (Music Only • Silent Character Reaction).");
  }

  console.log("=== ALL TEMPLATE ARCHETYPE TESTS PASSED CLEANLY! ===");
}

runTemplateArchetypeTests().catch((err) => {
  console.error("Template archetype test failed:", err);
  process.exit(1);
});
