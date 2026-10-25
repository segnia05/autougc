import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  // Only available in development mode for safety
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Dev login is disabled in production." } },
      { status: 403 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || "founder@autougc.com";
    const orgId = body.organizationId || "d3b07384-d113-46fb-a029-4a92c10b77a1";
    const userId = body.userId || "8f3e2b9c-5e4a-4d22-92a1-cf819e917d42";

    const sessionPayload = {
      userId,
      organizationId: orgId,
      role: "owner" as const,
      email,
      fullName: "Alex Founder",
    };

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      data: {
        message: "Dev session active",
        session: sessionPayload,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: String(error) },
      },
      { status: 500 }
    );
  }
}
