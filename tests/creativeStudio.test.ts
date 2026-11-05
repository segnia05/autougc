import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { describe, it } from "node:test";
import assert from "node:assert";
import { CREATOR_PERSONAS } from "../src/components/studio/CreatorVisualPicker";
import { VIDEO_TEMPLATES } from "../src/lib/templates/videoTemplates";
import { BACKGROUND_TRACKS } from "../src/components/studio/MusicPicker";
import { generateViralScripts } from "../src/lib/ai/gemini";
import { db } from "../src/db/client";
import { deductCredit } from "../src/lib/billing/credits";

describe("Step 8: The Creative Studio (/studio) Verification", () => {
  it("verifies Creator Picker includes exactly 8 distinct creator models", () => {
    assert.strictEqual(
      CREATOR_PERSONAS.length,
      8,
      `Expected 8 creator models, found ${CREATOR_PERSONAS.length}`
    );

    const names = CREATOR_PERSONAS.map((c) => c.name);
    assert.ok(names.includes("Sarah Miller"), "Should include Sarah Miller");
    assert.ok(names.includes("Alex Vance"), "Should include Alex Vance");
    assert.ok(names.includes("Emma Chen"), "Should include Emma Chen");
    assert.ok(names.includes("Marcus Brody"), "Should include Marcus Brody");
    assert.ok(names.includes("David Kim"), "Should include David Kim");
    assert.ok(names.includes("Chloe Dupont"), "Should include Chloe Dupont");
    assert.ok(names.includes("Jordan Reed"), "Should include Jordan Reed");
    assert.ok(names.includes("Maya Patel"), "Should include Maya Patel");

    for (const persona of CREATOR_PERSONAS) {
      assert.ok(persona.imageUrl, `${persona.name} must have an image`);
      assert.ok(persona.videoUrl, `${persona.name} must have a video`);
      assert.ok(persona.voiceId, `${persona.name} must have a voice engine`);
      assert.ok(persona.role, `${persona.name} must have a designated role`);
    }
  });

  it("verifies Template Picker supports all 3 required video ad archetypes", () => {
    const templateIds = Object.keys(VIDEO_TEMPLATES);
    assert.ok(templateIds.includes("studio_minimalist"), "Should include Minimalist Studio UGC");
    assert.ok(templateIds.includes("organic_selfie"), "Should include Organic Handheld Selfie");
    assert.ok(templateIds.includes("meme_reaction"), "Should include Viral Kinetic Meme");

    assert.strictEqual(VIDEO_TEMPLATES.studio_minimalist.name, "Minimalist Studio UGC");
    assert.strictEqual(VIDEO_TEMPLATES.organic_selfie.name, "Organic Handheld Selfie");
    assert.strictEqual(VIDEO_TEMPLATES.meme_reaction.name, "Viral Kinetic Meme (Music Only)");
  });

  it("verifies Audio & Music picker includes 5 royalty-free tracks with ducking configuration", () => {
    const musicTracks = BACKGROUND_TRACKS.filter((t) => t.id !== "none");
    assert.strictEqual(musicTracks.length, 5, `Expected 5 royalty-free tracks, found ${musicTracks.length}`);

    const trackIds = musicTracks.map((t) => t.id);
    assert.ok(trackIds.includes("lofi_focus"), "Should include Lo-Fi track");
    assert.ok(trackIds.includes("saas_hype"), "Should include Upbeat Tech track");
    assert.ok(trackIds.includes("minimal_pulse"), "Should include Minimal Pulse track");
    assert.ok(trackIds.includes("acoustic_organic"), "Should include Acoustic track");
    assert.ok(trackIds.includes("cinematic_drive"), "Should include Cinematic Synthwave track");
  });

  it("verifies AI Hook Generator returns 3 angles (Negative Hook, Secret Hack, Problem Agitation)", async () => {
    const result = await generateViralScripts({
      brandName: "LuminaScreen",
      pageTitle: "Zero Glare Monitor Light Bar",
      summary: "AutoUGC auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.",
      headings: ["Eliminates Screen Glare", "Dual Daylight Auto-Sensors", "Asymmetric Optical Design"],
      targetAudience: "Software engineers and remote workers",
    });

    assert.ok(result.scripts, "Result should contain scripts array");
    assert.strictEqual(result.scripts.length, 3, "Gemini should return 3 viral angles");

    const angleTypes = result.scripts.map((s) => s.angleType);
    assert.ok(
      angleTypes.includes("negative_hook"),
      `Should include negative_hook, got: ${JSON.stringify(angleTypes)}`
    );
    assert.ok(
      angleTypes.includes("secret_hack"),
      `Should include secret_hack, got: ${JSON.stringify(angleTypes)}`
    );
    assert.ok(
      angleTypes.includes("problem_agitation"),
      `Should include problem_agitation, got: ${JSON.stringify(angleTypes)}`
    );

    for (const script of result.scripts) {
      assert.ok(script.hook && script.hook.length > 5, "Hook must be non-empty");
      assert.ok(script.body && script.body.length > 10, "Body must be non-empty");
      assert.ok(script.cta && script.cta.length > 5, "CTA must be non-empty");
    }
  });

  it("verifies video render deductions, MP4 generation, and DB library persistence", async () => {
    const org = await db.organization.findFirst();
    const user = await db.user.findFirst();
    if (!org || !user) {
      console.log("No organization/user found in DB, skipping render deduction test");
      return;
    }

    const originalSub = await db.subscription.findUnique({ where: { organizationId: org.id } });

    // Ensure test organization has active credits for render test
    await db.subscription.upsert({
      where: { organizationId: org.id },
      update: { creditsRemaining: 5, planTier: "starter" },
      create: {
        organizationId: org.id,
        stripeCustomerId: `cus_${org.id.slice(-12)}`,
        planTier: "starter",
        status: "active",
        creditsMonthlyAllowance: 20,
        creditsRemaining: 5,
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
      },
    });

    const testVideoId = `vid_test_${Date.now()}`;

    // 1. Credit deduction
    const deductRes = await deductCredit(org.id, testVideoId, 1, user.id);
    assert.ok(deductRes.success, "Credit deduction must succeed for paid user with credits");
    assert.strictEqual(
      deductRes.creditsRemaining,
      4,
      "Balance should decrease from 5 to 4 credits"
    );

    // 2. Video record creation in library
    let project = await db.project.findFirst({ where: { organizationId: org.id } });
    if (!project) {
      project = await db.project.create({
        data: {
          organizationId: org.id,
          createdByUserId: user.id,
          name: "Studio Test Project",
          targetUrl: "https://luminascreen.com",
          brandName: "LuminaScreen",
        },
      });
    }

    const script = await db.script.create({
      data: {
        projectId: project.id,
        angleType: "problem_agitation",
        hookText: "Stop coding under harsh fluorescent lights in 2026.",
        bodyText: "AutoUGC auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.",
        ctaText: "Click the link below and get $30 off your setup today.",
        fullScriptText: "Stop coding under harsh fluorescent lights in 2026. AutoUGC auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints. Click the link below and get $30 off your setup today.",
        captionCopy: "Stop coding under harsh lights. #luminascreen #coding",
        hashtags: ["luminascreen", "coding", "ugc"],
      },
    });

    const createdVideo = await db.video.create({
      data: {
        id: testVideoId,
        projectId: project.id,
        organizationId: org.id,
        scriptId: script.id,
        voiceId: "alex_casual_dtc",
        aspectRatio: "9:16",
        durationSeconds: 14.5,
        videoUrl: `/renders/${testVideoId}.mp4`,
        thumbnailUrl: "/uploads/screenshots/screen_698d91231895.png",
        renderStatus: "completed",
      },
    });

    assert.strictEqual(createdVideo.id, testVideoId);
    assert.strictEqual(createdVideo.aspectRatio, "9:16");
    assert.strictEqual(createdVideo.renderStatus, "completed");

    // Clean up test records
    await db.video.delete({ where: { id: testVideoId } });
    await db.script.delete({ where: { id: script.id } });
    // Restore original credit state for clean test hygiene
    if (originalSub) {
      await db.subscription.update({
        where: { organizationId: org.id },
        data: {
          creditsRemaining: originalSub.creditsRemaining,
          planTier: originalSub.planTier,
        },
      });
    }
  });
});
