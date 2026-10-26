import { prisma } from "../src/db/client";

async function testConnection() {
  console.log("=== Querying Neon Database Live Entities ===");
  try {
    const users = await prisma.user.findMany();
    console.log(`✓ Users in Neon: ${users.length}`);
    for (const u of users) {
      console.log(`  - User: ${u.id} | ${u.email} | ${u.fullName}`);
    }

    const orgs = await prisma.organization.findMany({
      include: {
        subscription: true,
      },
    });
    console.log(`✓ Organizations in Neon: ${orgs.length}`);
    for (const o of orgs) {
      console.log(`  - Org: ${o.id} | Slug: ${o.slug} | Plan: ${o.subscription?.planTier} | Remaining Credits: ${o.subscription?.creditsRemaining}`);
    }
  } catch (err) {
    console.error("Direct connection error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
