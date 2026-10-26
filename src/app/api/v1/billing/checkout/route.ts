import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe, BILLING_PLANS } from "@/lib/billing/stripe";
import { getAuthContext } from "@/lib/auth/getAuthContext";

const CheckoutRequestSchema = z.object({
  planId: z.enum(["starter", "growth", "scale"]),
});

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const parsed = CheckoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid plan selection", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { planId } = parsed.data;
    const plan = BILLING_PLANS[planId];
    const origin = request.nextUrl.origin;

    // Check if live Stripe credentials are configured
    const isMock =
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock");

    if (isMock) {
      // In local dev/mock mode, return instant success simulation URL
      return NextResponse.json({
        url: `${origin}/studio?upgraded=true&plan=${planId}&credits=${plan.monthlyCredits}`,
        isMock: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        organizationId: orgId,
        planId,
      },
      subscription_data: {
        metadata: {
          organizationId: orgId,
          planId,
        },
      },
      success_url: `${origin}/studio?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initiate Stripe checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
