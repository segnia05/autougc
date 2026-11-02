import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/observability/logger";
import { datadog } from "@/lib/observability/datadog";
import { getAuthContext } from "@/lib/auth/getAuthContext";

const ContactRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid work email"),
  category: z.enum([
    "ad_strategy",
    "custom_creator",
    "enterprise_bulk",
    "billing",
    "feedback",
  ]),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const authCtx = await getAuthContext(req);
    const body = await req.json().catch(() => null);

    const parsed = ContactRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, category, subject, message } = parsed.data;

    // Log contact request for team notifications
    logger.info("New founder contact inquiry received", {
      name,
      email,
      category,
      subject,
      userId: authCtx?.userId,
      orgId: authCtx?.orgId,
    });

    datadog.increment("contact_form.submitted", 1, { category });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Our founding team will get back to you within 2 hours.",
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    logger.error("Failed handling contact request", { error: errorMsg });
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

