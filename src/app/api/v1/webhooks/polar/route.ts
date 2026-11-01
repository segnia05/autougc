import { NextRequest, NextResponse } from "next/server";
import { processPolarWebhook } from "@/lib/billing/polarProvider";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers = {
      "webhook-id": req.headers.get("webhook-id"),
      "webhook-timestamp": req.headers.get("webhook-timestamp"),
      "webhook-signature": req.headers.get("webhook-signature"),
    };

    const result = await processPolarWebhook(rawBody, headers);

    if (!result.handled && result.error) {
      const status = result.error.includes("signature") ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ received: true, eventType: result.eventType }, { status: 200 });
  } catch (error: any) {
    console.error("Fatal error in Polar webhook handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal webhook error" },
      { status: 500 }
    );
  }
}
