import { NextRequest, NextResponse } from "next/server";
import { stripe, BILLING_PLANS, SubscriptionTier } from "@/lib/billing/stripe";
import { grantCredits } from "@/lib/billing/credits";
import { prisma } from "@/db/client";
import Stripe from "stripe";

// Deduplication store for processed webhook IDs (prevents double processing)
const processedEventIds = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: Stripe.Event;

    // Verify webhook signature if secret configured
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid signature";
        return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 });
      }
    } else {
      // In dev or testing without webhook secret:
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    // Idempotency check: Deduplicate webhook events
    if (processedEventIds.has(event.id)) {
      return NextResponse.json({ received: true, deduplicated: true });
    }
    processedEventIds.add(event.id);

    // Keep deduplication set memory bounded
    if (processedEventIds.size > 10000) {
      const oldest = Array.from(processedEventIds).slice(0, 5000);
      oldest.forEach((id) => processedEventIds.delete(id));
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.organizationId;
        const planId = (session.metadata?.planId || "starter") as SubscriptionTier;
        const plan = BILLING_PLANS[planId];

        if (orgId && plan) {
          await grantCredits(
            orgId,
            plan.monthlyCredits,
            "subscription_created",
            session.id
          );

          try {
            await prisma.subscription.upsert({
              where: { organizationId: orgId },
              create: {
                organizationId: orgId,
                stripeCustomerId: (session.customer as string) || `cus_${Date.now()}`,
                stripeSubscriptionId: session.subscription as string,
                planTier: planId,
                status: "active",
                creditsMonthlyAllowance: plan.monthlyCredits,
                creditsRemaining: plan.monthlyCredits,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
              },
              update: {
                stripeSubscriptionId: session.subscription as string,
                planTier: planId,
                status: "active",
                creditsMonthlyAllowance: plan.monthlyCredits,
                creditsRemaining: plan.monthlyCredits,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
              },
            });
          } catch (dbErr) {
            console.warn("Prisma subscription update failed during webhook (dev fallback):", dbErr);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        interface InvoiceWithSubscription {
          subscription?: string | { id: string } | null;
        }
        const subField = (invoice as unknown as InvoiceWithSubscription).subscription;
        const subscriptionId = typeof subField === "string" ? subField : subField?.id;

        if (subscriptionId) {
          try {
            const sub = await prisma.subscription.findUnique({
              where: { stripeSubscriptionId: subscriptionId },
            });

            if (sub) {
              await grantCredits(
                sub.organizationId,
                sub.creditsMonthlyAllowance,
                "subscription_renewal",
                invoice.id
              );
            }
          } catch (dbErr) {
            console.warn("Invoice payment credits grant notice:", dbErr);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subObject = event.data.object as Stripe.Subscription;
        try {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subObject.id },
            data: {
              status: "canceled",
            },
          });
        } catch (dbErr) {
          console.warn("Subscription cancellation update notice:", dbErr);
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
