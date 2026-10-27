import { resolveCreatorAssets, CANONICAL_CREATORS, getCreatorById, getAllCreators } from "../src/lib/creators/registry";

async function runCreatorDeterminismTests() {
  console.log("=== Running Creator Persona Determinism & Asset Resolution Tests ===");

  // Test 1: Resolves certified assets for Sarah Miller without hallucination
  {
    const assets = await resolveCreatorAssets("pers_sarah_01", "organic_selfie", 15.0);

    if (assets.personaId !== "pers_sarah_01") {
      throw new Error(`Expected personaId pers_sarah_01 but got ${assets.personaId}`);
    }
    if (assets.creatorName !== "Sarah Miller") {
      throw new Error(`Expected creatorName Sarah Miller but got ${assets.creatorName}`);
    }
    if (!assets.videoStemUrl.includes("/creators/pers_sarah_01/stems/organic_selfie/")) {
      throw new Error(`Invalid stem url: ${assets.videoStemUrl}`);
    }
    if (assets.recommendedVoiceId !== "sarah_dtc_founder") {
      throw new Error(`Expected voice sarah_dtc_founder but got ${assets.recommendedVoiceId}`);
    }
    console.log("✓ Test 1 Passed: Certified assets resolved for Sarah Miller with zero drift.");
  }

  // Test 2: Rejects unregistered or corrupted creator IDs with fatal error
  {
    let threw = false;
    try {
      await resolveCreatorAssets("invalid_persona_999", "organic_selfie", 15.0);
    } catch (err: unknown) {
      threw = true;
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("Creator persona 'invalid_persona_999' not found in certified registry.")) {
        throw new Error(`Unexpected error message: ${msg}`);
      }
    }
    if (!threw) {
      throw new Error("Expected resolveCreatorAssets to throw for invalid ID, but it passed.");
    }
    console.log("✓ Test 2 Passed: Unregistered creator IDs strictly rejected.");
  }

  // Test 3: Catalog completeness
  {
    if (CANONICAL_CREATORS.length < 8) {
      throw new Error(`Expected at least 8 creators, got ${CANONICAL_CREATORS.length}`);
    }
    const names = CANONICAL_CREATORS.map((c) => c.name);
    for (const expected of ["Sarah Miller", "Alex Chen", "Emma Davis", "Marcus Vance", "Elena Rostova", "David Brooks", "Chloe Kim", "Liam Scott"]) {
      if (!names.includes(expected)) {
        throw new Error(`Missing canonical creator: ${expected}`);
      }
    }
    console.log("✓ Test 3 Passed: Canonical creator registry contains all 8 certified profiles.");
  }

  // Test 4: Helper lookups
  {
    const alex = getCreatorById("pers_alex_02");
    if (!alex || alex.name !== "Alex Chen") {
      throw new Error("getCreatorById failed to retrieve Alex Chen");
    }
    const all = getAllCreators();
    if (all.length !== CANONICAL_CREATORS.length) {
      throw new Error("getAllCreators returned incorrect count");
    }
    console.log("✓ Test 4 Passed: Helper lookups function deterministically.");
  }

  console.log("=== All Creator Determinism Tests Passed Successfully ===");
}

runCreatorDeterminismTests().catch((err) => {
  console.error("Creator determinism test failed:", err);
  process.exit(1);
});
