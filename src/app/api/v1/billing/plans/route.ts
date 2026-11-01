import { NextResponse } from "next/server";
import { fetchActiveBillingPlans } from "@/lib/billing/paymentProvider";

/**
 * GET /api/v1/billing/plans
 * Dynamically fetches billing plan details (names, descriptions, prices, currency, allowances)
 * directly from the active Merchant of Record (Polar by default, Paddle fallback).
 */
export async function GET() {
  try {
    const { provider, plans } = await fetchActiveBillingPlans();
    return NextResponse.json({
      success: true,
      provider,
      plans,
    });
  } catch (error: any) {
    console.error("Failed to dynamically fetch billing plans:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch dynamic billing plans",
      },
      { status: 500 }
    );
  }
}

