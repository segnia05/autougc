import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { createActivePortalSession, getActivePaymentProviderName } from "@/lib/billing/paymentProvider";

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const origin = request.nextUrl.origin;
    const provider = getActivePaymentProviderName();

    const isPolar = provider === "polar";
    const polarKey = process.env.POLAR_ACCESS_TOKEN || "";
    const paddleKey = process.env.PADDLE_API_KEY || "";

    const isMock = isPolar
      ? !polarKey || polarKey.startsWith("polar_at_mock") || polarKey.startsWith("polar_at_sandbox_test")
      : !paddleKey || paddleKey.startsWith("pdl_nt_sandbox_test") || paddleKey.startsWith("pdl_mock");

    if (isMock) {
      return NextResponse.json({
        url: `${origin}/dashboard?tab=billing&portal=mock_preview`,
        provider,
      });
    }

    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
    });

    const portalResult = await createActivePortalSession({
      orgId,
      userId: authContext?.userId || "user_anonymous",
      customerId: sub?.stripeCustomerId || undefined,
      returnUrl: `${origin}/dashboard?tab=billing`,
    });

    return NextResponse.json({ url: portalResult.portalUrl, provider: portalResult.provider });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to open billing customer portal";
    console.error("Portal route error:", error);
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

    const provider = getActivePaymentProviderName();
    const isPolar = provider === "polar";
    const polarKey = process.env.POLAR_ACCESS_TOKEN || "";
    const paddleKey = process.env.PADDLE_API_KEY || "";

    const isMock = isPolar
      ? !polarKey || polarKey.startsWith("polar_at_mock") || polarKey.startsWith("polar_at_sandbox_test")
      : !paddleKey || paddleKey.startsWith("pdl_nt_sandbox_test") || paddleKey.startsWith("pdl_mock");

    if (isMock) {
      return NextResponse.redirect(`${origin}/dashboard?tab=billing&portal=mock_preview`);
    }

    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
    });

    const portalResult = await createActivePortalSession({
      orgId,
      userId: authContext?.userId || "user_anonymous",
      customerId: sub?.stripeCustomerId || undefined,
      returnUrl: `${origin}/dashboard?tab=billing`,
    });

    return NextResponse.redirect(portalResult.portalUrl);
  } catch {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/dashboard?tab=billing`);
  }
}
