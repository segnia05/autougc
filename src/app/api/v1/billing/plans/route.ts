import { NextResponse } from "next/server";
import { fetchActiveBillingPlans, getActiveConfigurationStatus } from "@/lib/billing/paymentProvider";

/**
 * GET /api/v1/billing/plans
 * Dynamically fetches billing plan details (names, descriptions, prices, currency, allowances)
 * directly from the active Merchant of Record (Polar by default, Paddle fallback).
 * If product IDs or API keys are not provided, returns configured: false with missing keys.
 */
export async function GET() {
  try {
    const configStatus = getActiveConfigurationStatus();
    if (!configStatus.isConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        provider: configStatus.provider,
        error: "Need product id and api key",
        message: `Payment provider (${configStatus.provider.toUpperCase()}) is not configured. Live pricing and plan names cannot be displayed without product IDs and API key.`,
        missingKeys: configStatus.missing,
        plans: [],
      });
    }

    const { provider, plans, isConfigured, missing } = await fetchActiveBillingPlans();
    if (!isConfigured || plans.length === 0) {
      return NextResponse.json({
        success: false,
        configured: false,
        provider,
        error: "Need product id and api key",
        message: `No active products returned from ${provider.toUpperCase()}. Please check your product IDs and API credentials.`,
        missingKeys: missing,
        plans: [],
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      provider,
      plans,
    });
  } catch (error: any) {
    console.error("Failed to dynamically fetch billing plans:", error);
    return NextResponse.json(
      {
        success: false,
        configured: false,
        error: error instanceof Error ? error.message : "Failed to fetch dynamic billing plans",
        plans: [],
      },
      { status: 500 }
    );
  }
}

