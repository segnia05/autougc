import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/billing/stripe";
import { prisma } from "@/db/client";
import { getAuthContext } from "@/lib/auth/getAuthContext";

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");
    const origin = request.nextUrl.origin;

    if (!orgId) {
      return NextResponse.redirect(`${origin}/sign-in`);
    }

    const isMock =
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock");

    if (isMock) {
      return NextResponse.redirect(`${origin}/dashboard?tab=billing&portal=mock_preview`);
    }

    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
    });

    if (!sub || !sub.stripeCustomerId) {
      return NextResponse.redirect(`${origin}/pricing`);
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/dashboard?tab=billing`);
  }
}
