import {
  generateDistributionPlan,
  ConnectedAccountInput,
} from "../src/lib/social/distributionEngine";

async function runTests() {
  console.log("=== Running Distribution Engine Automated Test Suite ===");

  const mockAccounts: ConnectedAccountInput[] = [
    {
      id: "acc_main",
      accountHandle: "@lumina_official",
      accountNickname: "Main Brand",
      platform: "tiktok",
      isBurner: false,
    },
    {
      id: "acc_burner_1",
      accountHandle: "@desk_hacks",
      accountNickname: "Burner #1",
      platform: "tiktok",
      isBurner: true,
    },
    {
      id: "acc_burner_2",
      accountHandle: "@focus_tools",
      accountNickname: "Burner #2",
      platform: "instagram",
      isBurner: true,
    },
  ];

  // Test 1: Mon/Wed/Fri Cadence (20 Videos)
  {
    const plan = generateDistributionPlan({
      projectId: "proj_test_1",
      totalVideos: 20,
      cadence: "mon_wed_fri",
      targetTimezone: "America/New_York",
      preferredHour: 16,
      startDate: new Date("2026-11-01T00:00:00Z"), // Sunday
      connectedAccounts: mockAccounts,
    });

    if (plan.totalScheduled !== 20) {
      throw new Error(`Expected 20 scheduled slots, got ${plan.totalScheduled}`);
    }

    // Verify all slots fall on Mon (1), Wed (3), or Fri (5)
    for (const slot of plan.slots) {
      const day = slot.utcScheduledFor.getUTCDay();
      if (day !== 1 && day !== 3 && day !== 5) {
        throw new Error(`Slot scheduled on invalid day ${day} for mon_wed_fri cadence`);
      }
    }
    console.log("✓ Test 1 Passed: Mon/Wed/Fri cadence dates accurately calculated");
  }

  // Test 2: Multi-Account Distribution Balance (60 Videos across 3 Accounts)
  {
    const plan = generateDistributionPlan({
      projectId: "proj_test_2",
      totalVideos: 60,
      cadence: "daily_30",
      targetTimezone: "America/New_York",
      preferredHour: 16,
      startDate: new Date("2026-11-01T00:00:00Z"),
      connectedAccounts: mockAccounts,
    });

    if (plan.totalScheduled !== 60) {
      throw new Error(`Expected 60 scheduled slots, got ${plan.totalScheduled}`);
    }

    const counts = plan.accountBreakdown;
    if (counts["acc_main"]?.count !== 20 || counts["acc_burner_1"]?.count !== 20 || counts["acc_burner_2"]?.count !== 20) {
      throw new Error(`Accounts not evenly distributed: ${JSON.stringify(counts)}`);
    }
    console.log("✓ Test 2 Passed: 60 videos evenly balanced (20/account) across 3 multi-accounts");
  }

  // Test 3: Anti-Shadowban Creative Permutation Variety
  {
    const plan = generateDistributionPlan({
      projectId: "proj_test_3",
      totalVideos: 10,
      cadence: "daily_30",
      targetTimezone: "America/New_York",
      preferredHour: 16,
      startDate: new Date("2026-11-01T00:00:00Z"),
      connectedAccounts: mockAccounts,
    });

    // Verify creative angles cycle and diversify
    const distinctHooks = new Set(plan.slots.map((s) => s.hookAngle));
    const distinctVoices = new Set(plan.slots.map((s) => s.voiceId));
    const distinctStyles = new Set(plan.slots.map((s) => s.subtitleStyle));

    if (distinctHooks.size < 3 || distinctVoices.size < 3 || distinctStyles.size < 3) {
      throw new Error("Permutation matrix failed to produce adequate creative diversity");
    }
    console.log("✓ Test 3 Passed: Creative permutation produced diverse hooks, voices, and subtitle styles");
  }

  // Test 4: Timezone Peak Hour Conversion
  {
    // US Eastern EST is UTC-5. Local 16:00 (4:00 PM) should correspond to 21:00 UTC
    const mainAcc = mockAccounts[0];
    if (!mainAcc) throw new Error("Missing mock account");

    const planEST = generateDistributionPlan({
      projectId: "proj_test_4",
      totalVideos: 3,
      cadence: "daily_30",
      targetTimezone: "America/New_York",
      preferredHour: 16,
      startDate: new Date("2026-11-01T00:00:00Z"),
      connectedAccounts: [mainAcc],
    });

    const firstSlot = planEST.slots[0];
    if (!firstSlot) throw new Error("Missing scheduled slot");
    const utcHour = firstSlot.utcScheduledFor.getUTCHours();
    if (utcHour !== 21) {
      throw new Error(`Expected UTC hour 21 for 16:00 EST, got ${utcHour}`);
    }
    console.log("✓ Test 4 Passed: Local 4:00 PM EST converted accurately to 21:00 UTC");
  }

  // Test 5: Scale Plan Blitz (180 Videos across 15 Accounts = 12 videos/account, 6 posts/day)
  {
    const fifteenAccounts: ConnectedAccountInput[] = Array.from({ length: 15 }, (_, i) => ({
      id: `acc_scale_${i + 1}`,
      accountHandle: `@scale_brand_${i + 1}`,
      accountNickname: i === 0 ? "Main Agency Brand" : `Satellite Army #${i}`,
      platform: "tiktok",
      isBurner: i > 0,
    }));

    const scalePlan = generateDistributionPlan({
      projectId: "proj_test_scale",
      totalVideos: 180,
      cadence: "daily_30",
      targetTimezone: "America/New_York",
      preferredHour: 10,
      startDate: new Date("2026-11-01T00:00:00Z"),
      connectedAccounts: fifteenAccounts,
    });

    if (scalePlan.totalScheduled !== 180) {
      throw new Error(`Expected 180 scheduled slots for Scale tier, got ${scalePlan.totalScheduled}`);
    }

    // Verify all 15 accounts received exactly 12 posts (180 / 15 = 12)
    for (const acc of fifteenAccounts) {
      const count = scalePlan.accountBreakdown[acc.id]?.count;
      if (count !== 12) {
        throw new Error(`Expected exactly 12 posts for account ${acc.id}, got ${count}`);
      }
    }

    console.log("✓ Test 5 Passed: Scale Plan blitz correctly generated 180 slots across 15 accounts (12/account)");
  }

  console.log("=== ALL 5 DISTRIBUTION ENGINE TESTS PASSED CLEANLY! ===");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
