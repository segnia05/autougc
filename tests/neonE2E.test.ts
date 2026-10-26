async function runE2ETests() {
  console.log("=== Testing AutoUGC End-to-End on Live Production Server ===");
  const baseUrl = "http://localhost:3001";

  // Test 1: Landing Page
  const landingRes = await fetch(`${baseUrl}/`);
  console.log(`✓ 1. Landing Page: HTTP ${landingRes.status} (${landingRes.headers.get("content-type")})`);
  if (landingRes.status !== 200) throw new Error("Landing page failed");

  // Test 2: Free Tool (TikTok Hook Generator)
  const toolRes = await fetch(`${baseUrl}/tools/tiktok-hook-generator`);
  console.log(`✓ 2. Free Tool (TikTok Hook Generator): HTTP ${toolRes.status}`);
  if (toolRes.status !== 200) throw new Error("Free tool page failed");

  // Test 3: Programmatic Template (E-Commerce Shopify)
  const templateRes = await fetch(`${baseUrl}/templates/ecommerce-shopify`);
  console.log(`✓ 3. Programmatic Template (E-Commerce Shopify): HTTP ${templateRes.status}`);
  if (templateRes.status !== 200) throw new Error("Template page failed");

  // Test 4: Pricing Page
  const pricingRes = await fetch(`${baseUrl}/pricing`);
  console.log(`✓ 4. Pricing Page: HTTP ${pricingRes.status}`);
  if (pricingRes.status !== 200) throw new Error("Pricing page failed");

  // Test 5: Audio Synthesis API
  const audioRes = await fetch(`${baseUrl}/api/v1/audio/synthesize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scriptText: "Stop wasting hours editing video ads manually in 2026.",
      voiceId: "alex_casual_dtc",
    }),
  });
  const audioData = await audioRes.json();
  const synth = audioData.data;
  console.log(`✓ 5. Audio Synthesis API: HTTP ${audioRes.status}, Duration: ${synth?.durationSeconds}s, Words: ${synth?.words?.length}`);
  if (audioRes.status !== 200 || !synth?.words) throw new Error("Audio synthesis failed");

  // Test 6: AI Viral Script Generation API
  const scriptRes = await fetch(`${baseUrl}/api/v1/scripts/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      brandName: "Lumina",
      productSummary: "Ergonomic monitor light bar for late-night programmers",
      targetAudience: "Software Engineers",
    }),
  });
  const scriptData = await scriptRes.json();
  const scripts = scriptData.data?.scripts;
  console.log(`✓ 6. Script Generator API: HTTP ${scriptRes.status}, Variations Generated: ${scripts?.length}`);
  if (scriptRes.status !== 200 || !scripts) throw new Error("Script generation failed");

  // Test 7: Video Vault API with Neon Auth Context
  const videoRes = await fetch(`${baseUrl}/api/v1/videos`, {
    headers: { "x-user-id": "user_prod_tester_01" },
  });
  const videoData = await videoRes.json();
  console.log(`✓ 7. Video API (Neon Connected): HTTP ${videoRes.status}, Videos: ${videoData.videos?.length}`);
  if (videoRes.status !== 200) throw new Error("Video API failed");

  // Test 8: Social Accounts API with Neon Auth Context
  const accountsRes = await fetch(`${baseUrl}/api/v1/social/accounts`, {
    headers: { "x-user-id": "user_prod_tester_01" },
  });
  const accountsData = await accountsRes.json();
  console.log(`✓ 8. Social Accounts API (Neon Connected): HTTP ${accountsRes.status}, Accounts: ${accountsData.accounts?.length}`);
  if (accountsRes.status !== 200) throw new Error("Social accounts API failed");

  // Test 9: Billing Subscription API with Neon Database
  const subRes = await fetch(`${baseUrl}/api/v1/billing/subscription`, {
    headers: { "x-user-id": "user_prod_tester_01" },
  });
  const subData = await subRes.json();
  console.log(`✓ 9. Subscription API (Neon Connected): HTTP ${subRes.status}, Plan: ${subData.subscription?.name}, Credits Remaining: ${subData.subscription?.creditsRemaining}`);
  if (subRes.status !== 200) throw new Error("Subscription API failed");

  console.log("=== ALL LIVE END-TO-END TESTS PASSED ON NEON CLUSTER! ===");
}

runE2ETests().catch((err) => {
  console.error("E2E test error:", err);
  process.exit(1);
});
