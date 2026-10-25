import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/billing/stripe";
import { prisma } from "@/db/client";

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-organization-id") || "org_dev_default_123";
    const origin = request.nextUrl.origin;

    const isMock =
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock");

    if (isMock) {
      return NextResponse.json({
        url: `${origin}/studio?portal=mock_preview`,
      });
    }

    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
    });

    if (!sub || !sub.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active Stripe customer found for organization" },
        { status: 404 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${origin}/studio`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to open Stripe billing portal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
