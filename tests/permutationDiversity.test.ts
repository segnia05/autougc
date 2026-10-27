import { CANONICAL_CREATORS } from "../src/lib/creators/registry";
import { VIDEO_TEMPLATES, VideoTemplateArchetype } from "../src/lib/templates/videoTemplates";
import { VOICE_PROFILES } from "../src/lib/audio/voiceMatrix";

async function runPermutationDiversityTests() {
  console.log("=== Running Campaign Permutation Diversity & Anti-Fatigue Tests ===");

  const HOOK_ANGLES = [
    "relatable_punchline",
    "contrarian_truth",
    "before_after_demonstration",
    "screen_recording_proof",
    "founder_confession",
    "micro_skit_reaction",
  ];

  function simulate30DayCampaign() {
    const posts = [];
    const templateKeys = Object.keys(VIDEO_TEMPLATES) as VideoTemplateArchetype[];
    const creatorKeys = CANONICAL_CREATORS.map((c) => c.id);
    const voiceKeys = VOICE_PROFILES.map((v) => v.id);

    let lastCreator = "";
    let lastHookAngle = "";
    let lastTemplate = "";

    for (let day = 1; day <= 30; day++) {
      // Pick template ensuring rotation
      const availableTemplates = templateKeys.filter((t) => t !== lastTemplate);
      const chosenTemplate: string = availableTemplates[(day * 3) % availableTemplates.length] ?? templateKeys[0] ?? "";
      lastTemplate = chosenTemplate;

      // Pick creator ensuring no back-to-back repeats
      const availableCreators = creatorKeys.filter((c) => c !== lastCreator);
      const chosenCreator: string = availableCreators[(day * 3 + 1) % availableCreators.length] ?? creatorKeys[0] ?? "";
      lastCreator = chosenCreator;

      // Pick hook angle
      const availableHooks = HOOK_ANGLES.filter((h) => h !== lastHookAngle);
      const chosenHook: string = availableHooks[(day * 5) % availableHooks.length] ?? HOOK_ANGLES[0] ?? "";
      lastHookAngle = chosenHook;

      // Voice
      const chosenVoice: string = voiceKeys[day % voiceKeys.length] ?? voiceKeys[0] ?? "";

      posts.push({
        day,
        template: chosenTemplate,
        creatorId: chosenCreator,
        hookAngle: chosenHook,
        voiceId: chosenVoice,
      });
    }

    return posts;
  }

  // Test 1: No consecutive duplicate creators
  {
    const schedule = simulate30DayCampaign();
    if (schedule.length !== 30) {
      throw new Error(`Expected 30 posts, got ${schedule.length}`);
    }

    for (let i = 1; i < schedule.length; i++) {
      const prev = schedule[i - 1];
      const curr = schedule[i];
      if (curr && prev && curr.creatorId === prev.creatorId) {
        throw new Error(`Consecutive duplicate creator detected on day ${curr.day}`);
      }
    }
    console.log("✓ Test 1 Passed: Zero back-to-back duplicate creators across 30 days.");
  }

  // Test 2: No consecutive duplicate hook angles
  {
    const schedule = simulate30DayCampaign();
    for (let i = 1; i < schedule.length; i++) {
      const prev = schedule[i - 1];
      const curr = schedule[i];
      if (curr && prev && curr.hookAngle === prev.hookAngle) {
        throw new Error(`Consecutive duplicate hook angle detected on day ${curr.day}`);
      }
    }
    console.log("✓ Test 2 Passed: Zero back-to-back duplicate hook angles across 30 days.");
  }

  // Test 3: Covers all 3 core templates
  {
    const schedule = simulate30DayCampaign();
    const usedTemplates = new Set(schedule.map((p) => p.template));

    if (!usedTemplates.has("studio_minimalist")) throw new Error("Missing studio_minimalist template");
    if (!usedTemplates.has("organic_selfie")) throw new Error("Missing organic_selfie template");
    if (!usedTemplates.has("meme_reaction")) throw new Error("Missing meme_reaction template");

    console.log("✓ Test 3 Passed: All 3 core video templates rotated throughout the campaign.");
  }

  // Test 4: High persona entropy
  {
    const schedule = simulate30DayCampaign();
    const distinctCreators = new Set(schedule.map((p) => p.creatorId));

    if (distinctCreators.size < 5) {
      throw new Error(`Expected at least 5 distinct creators, got ${distinctCreators.size}`);
    }
    console.log(`✓ Test 4 Passed: High persona entropy with ${distinctCreators.size} distinct creators in 30 days.`);
  }

  console.log("=== All Permutation Diversity Tests Passed Successfully ===");
}

runPermutationDiversityTests().catch((err) => {
  console.error("Permutation diversity test failed:", err);
  process.exit(1);
});
