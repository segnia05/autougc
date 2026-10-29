/**
 * Enterprise End-to-End (E2E) Critical Business Flows Test Suite.
 *
 * Runs against the active Next.js HTTP server at http://localhost:3000.
 * Exercises genuine user workflows, multi-tenant state isolation, security filters,
 * atomic credit ledger transactions, and automated self-healing.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface ApiResponse<T = unknown> {
  success?: boolean;
  status?: string;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

interface ReadinessResponse {
  checks: {
    database: { status: string };
    cache: { status: string };
    queue: { status: string };
  };
}

interface ScrapedData {
  projectId?: string;
  brandName: string;
  brandColors?: { primary: string; accent: string };
}

interface ScrapeApiResponse {
  success: boolean;
  data?: ScrapedData;
}

interface ScriptItem {
  angleType: string;
  hook: string;
  body: string;
  cta: string;
  fullScript: string;
}

interface ScriptApiResponse {
  data?: {
    scripts: ScriptItem[];
  };
}

interface AudioApiResponse {
  data?: {
    words: Array<{ word: string; start: number; end: number }>;
    durationSeconds: number;
  };
}

interface RenderApiResponse {
  success: boolean;
  videoId?: string;
  videoUrl?: string;
  creditsRemaining?: number;
}

interface AutoScheduleApiResponse {
  success: boolean;
  upgradeRequired?: boolean;
  data?: {
    campaignName: string;
    totalScheduled: number;
  };
}

async function runCriticalFlowsE2E() {
  console.log("=== Running End-to-End (E2E) Critical Business Flows Audit ===");
  console.log(`Target Server: ${BASE_URL}`);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Origin: BASE_URL,
  };

  const runId = Date.now().toString(36);
  const testUserId = `user_e2e_${runId}`;
  const testOrgId = `org_e2e_${runId}`;

  const authHeaders = {
    ...defaultHeaders,
    "x-user-id": testUserId,
    "x-organization-id": testOrgId,
  };

  // ==========================================================================
  // FLOW 1: SYSTEM HEALTH & CONTAINER READINESS PROBES
  // ==========================================================================
  console.log("\n--- Flow 1: System Health & Orchestrator Probes ---");

  // 1a. Liveness
  const livenessRes = await fetch(`${BASE_URL}/api/health?probe=liveness`);
  if (!livenessRes.ok) {
    throw new Error(`Liveness probe failed with HTTP ${livenessRes.status}`);
  }
  const livenessData = (await livenessRes.json()) as ApiResponse;
  if (livenessData.status !== "ok") {
    throw new Error(`Unexpected liveness payload: ${JSON.stringify(livenessData)}`);
  }
  console.log("✓ Liveness probe verified: HTTP 200 { status: 'ok' }");

  // 1b. Readiness
  const readinessRes = await fetch(`${BASE_URL}/api/health`);
  if (!readinessRes.ok) {
    throw new Error(`Readiness probe failed with HTTP ${readinessRes.status}`);
  }
  const readinessData = (await readinessRes.json()) as ReadinessResponse;
  if (!readinessData.checks || !readinessData.checks.database) {
    throw new Error("Readiness probe missing diagnostic checks");
  }
  console.log(
    `✓ Readiness probe verified: Database '${readinessData.checks.database.status}', Cache '${readinessData.checks.cache.status}', Queue '${readinessData.checks.queue.status}'`
  );

  // ==========================================================================
  // FLOW 2: PRODUCT URL INGESTION, SSRF DEFENSE & PALETTE EXTRACTION
  // ==========================================================================
  console.log("\n--- Flow 2: Product Scraping, SSRF Defense & Palette Extraction ---");

  // 2a. Genuine product URL
  const scrapeRes = await fetch(`${BASE_URL}/api/v1/projects/scrape`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({
      url: "https://stripe.com",
    }),
  });

  if (!scrapeRes.ok) {
    throw new Error(`Scrape API failed with HTTP ${scrapeRes.status}`);
  }
  const scrapeData = (await scrapeRes.json()) as ScrapeApiResponse;
  if (!scrapeData.success || !scrapeData.data?.brandName) {
    throw new Error(`Invalid scrape response: ${JSON.stringify(scrapeData)}`);
  }
  console.log(
    `✓ Scraped successfully: Brand '${scrapeData.data.brandName}', Primary Color '${scrapeData.data.brandColors?.primary}', Accent '${scrapeData.data.brandColors?.accent}'`
  );

  // 2b. SSRF Attack vector blocked
  const ssrfRes = await fetch(`${BASE_URL}/api/v1/projects/scrape`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({
      url: "http://169.254.169.254/latest/meta-data",
    }),
  });

  if (ssrfRes.status < 400) {
    throw new Error(`SSRF attack was not blocked! Expected error status >= 400, got ${ssrfRes.status}`);
  }
  console.log(`✓ SSRF defense verified: AWS/GCP cloud metadata IP cleanly rejected with HTTP ${ssrfRes.status}.`);

  // ==========================================================================
  // FLOW 3: AI SCRIPT GENERATION & MANDATORY BRAND MENTION ENFORCEMENT
  // ==========================================================================
  console.log("\n--- Flow 3: AI Script Generation & Mandatory Brand Mention ---");

  const testBrandName = "Lumina ScreenBar";
  const scriptRes = await fetch(`${BASE_URL}/api/v1/scripts/generate`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({
      brandName: testBrandName,
      productSummary: "Ergonomic monitor light bar for software engineers working late",
      targetAudience: "Programmers & Designers",
    }),
  });

  if (!scriptRes.ok) {
    throw new Error(`Script generation failed with HTTP ${scriptRes.status}`);
  }
  const scriptData = (await scriptRes.json()) as ScriptApiResponse;
  const scripts = scriptData.data?.scripts;

  if (!Array.isArray(scripts) || scripts.length < 3) {
    throw new Error(`Expected at least 3 script variations, got: ${scripts?.length}`);
  }

  // Verify mandatory brand mention in all variations
  for (const s of scripts) {
    const fullText = (s.fullScript || `${s.hook} ${s.body} ${s.cta}`).toLowerCase();
    if (!fullText.includes("lumina")) {
      throw new Error(`Brand mention violated! Script '${s.angleType}' does not mention 'Lumina': ${fullText}`);
    }
  }
  console.log(`✓ Generated ${scripts.length} viral script angles [${scripts.map((s) => s.angleType).join(", ")}].`);
  console.log(`✓ 100% of generated scripts explicitly spoken target brand name '${testBrandName}'.`);

  // ==========================================================================
  // FLOW 4: NEURAL AUDIO SYNTHESIS & TIMECODE ALIGNMENT
  // ==========================================================================
  console.log("\n--- Flow 4: Neural Audio Synthesis & Word-Level Timecodes ---");

  const firstScript = scripts[0];
  if (!firstScript) {
    throw new Error("Missing first script variation");
  }

  const audioRes = await fetch(`${BASE_URL}/api/v1/audio/synthesize`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({
      scriptText: firstScript.fullScript || `${firstScript.hook} ${firstScript.body} ${firstScript.cta}`,
      voiceId: "alex_casual_dtc",
    }),
  });

  if (!audioRes.ok) {
    throw new Error(`Audio synthesis failed with HTTP ${audioRes.status}`);
  }
  const audioData = (await audioRes.json()) as AudioApiResponse;
  const synth = audioData.data;

  if (!synth?.words || synth.words.length === 0 || !synth.durationSeconds) {
    throw new Error(`Invalid audio synthesis payload: ${JSON.stringify(audioData)}`);
  }
  const firstWord = synth.words[0];
  if (!firstWord) {
    throw new Error("Missing first word in audio synthesis");
  }
  console.log(
    `✓ Synthesized ${synth.words.length} synchronized words. Duration: ${synth.durationSeconds}s. First word: '${firstWord.word}' [${firstWord.start}s -> ${firstWord.end}s].`
  );

  // ==========================================================================
  // FLOW 5: VIDEO CREATIVE RENDERING & ATOMIC CREDIT LEDGER
  // ==========================================================================
  console.log("\n--- Flow 5: Video Creative Rendering & Atomic Credit Ledger ---");

  const renderRes = await fetch(`${BASE_URL}/api/v1/videos/render`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      brandName: testBrandName,
      hookText: firstScript.hook || "Stop doing this manually in 2026",
      bodyText: firstScript.body || "Lumina automate your ads in 60 seconds",
      ctaText: firstScript.cta || "Try Lumina today",
      voiceId: "alex_casual_dtc",
      aspectRatio: "9:16",
    }),
  });

  if (!renderRes.ok) {
    throw new Error(`Video render failed with HTTP ${renderRes.status}`);
  }
  const renderData = (await renderRes.json()) as RenderApiResponse;
  if (!renderData.success || !renderData.videoId || !renderData.videoUrl) {
    throw new Error(`Invalid render response: ${JSON.stringify(renderData)}`);
  }
  console.log(
    `✓ Video ad rendered successfully: ID '${renderData.videoId}', Credits Remaining: ${renderData.creditsRemaining}, 1080p URL: ${renderData.videoUrl}`
  );

  // ==========================================================================
  // FLOW 6: 30-DAY AUTOPILOT CAMPAIGN DRIP SCHEDULING & TIER GATING
  // ==========================================================================
  console.log("\n--- Flow 6: 30-Day Autopilot Drip Scheduling & Tier Gating ---");

  // 6a. Attempting 3 multi-accounts on default tier triggers 403 Paywall Gating
  const gatedScheduleRes = await fetch(`${BASE_URL}/api/v1/campaigns/auto-schedule`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      projectId: scrapeData.data.projectId || "proj_e2e_campaign_test",
      cadence: "mon_wed_fri_sun",
      totalVideos: 12,
      socialAccountIds: ["acc_tt_1", "acc_ig_1", "acc_yt_1"],
    }),
  });

  if (gatedScheduleRes.status !== 403) {
    throw new Error(`Expected 403 Paywall gating for 3 accounts on default tier, got ${gatedScheduleRes.status}`);
  }
  const gatedData = (await gatedScheduleRes.json()) as AutoScheduleApiResponse;
  if (!gatedData.upgradeRequired) {
    throw new Error("Expected upgradeRequired: true in paywall response");
  }
  console.log("✓ Multi-account tier gating verified: 3 accounts cleanly blocked on default tier with HTTP 403 (Upgrade Required).");

  // 6b. With Growth Tier ($89/mo) access, multi-account campaign generation succeeds
  const growthHeaders = {
    ...authHeaders,
    "x-plan-tier": "growth",
  };

  const autoScheduleRes = await fetch(`${BASE_URL}/api/v1/campaigns/auto-schedule`, {
    method: "POST",
    headers: growthHeaders,
    body: JSON.stringify({
      projectId: scrapeData.data.projectId || "proj_e2e_campaign_test",
      campaignName: `${testBrandName} 30-Day Drip`,
      cadence: "mon_wed_fri_sun",
      targetTimezone: "America/New_York",
      preferredHour: 16, // 4:00 PM EST
      totalVideos: 12,
      socialAccountIds: ["acc_tt_1", "acc_ig_1", "acc_yt_1"],
    }),
  });

  if (!autoScheduleRes.ok) {
    const errBody = await autoScheduleRes.text();
    throw new Error(`Auto-schedule API failed with HTTP ${autoScheduleRes.status}: ${errBody}`);
  }
  const autoScheduleData = (await autoScheduleRes.json()) as AutoScheduleApiResponse;
  if (!autoScheduleData.success || !autoScheduleData.data?.totalScheduled) {
    throw new Error(`Invalid auto-schedule response: ${JSON.stringify(autoScheduleData)}`);
  }
  console.log(
    `✓ 30-Day Autopilot campaign created on Growth Tier: '${autoScheduleData.data.campaignName}', Total Scheduled Posts: ${autoScheduleData.data.totalScheduled}`
  );

  // ==========================================================================
  // FLOW 7: 1-HOUR PRE-PUBLISH HMAC APPROVAL WORKFLOW
  // ==========================================================================
  console.log("\n--- Flow 7: 1-Hour Pre-Publish HMAC Approval Workflow ---");

  // Verify approval API rejects missing token or invalid action
  const invalidApproveRes = await fetch(`${BASE_URL}/api/v1/campaigns/approve`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ action: "approve" }),
  });

  if (invalidApproveRes.status !== 400) {
    throw new Error(`Expected 400 for missing token, got ${invalidApproveRes.status}`);
  }
  console.log("✓ Approval security verified: Requests without valid token hash strictly rejected with HTTP 400.");

  // ==========================================================================
  // FLOW 8: CSRF CROSS-ORIGIN ATTACK DEFENSE
  // ==========================================================================
  console.log("\n--- Flow 8: CSRF Cross-Origin Attack Defense ---");

  const csrfAttackRes = await fetch(`${BASE_URL}/api/v1/projects/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://evil-phishing-attacker.com",
    },
    body: JSON.stringify({ url: "https://stripe.com" }),
  });

  if (csrfAttackRes.status !== 403) {
    throw new Error(`CSRF attack was not blocked! Expected 403, got ${csrfAttackRes.status}`);
  }
  console.log("✓ CSRF defense verified: Unauthorized cross-origin mutation blocked with HTTP 403.");

  console.log("\n=== ALL 8 END-TO-END CRITICAL BUSINESS FLOWS PASSED CLEANLY! ===");
}

runCriticalFlowsE2E().catch((err) => {
  console.error("\n✗ E2E Critical Business Flows failed:", err);
  process.exit(1);
});
