import { NextRequest, NextResponse } from "next/server";
import { processPaddleWebhook } from "@/lib/billing/paddleProvider";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature");

    const result = await processPaddleWebhook(rawBody, signature);

    if (!result.handled && result.error) {
      const status = result.error.includes("signature") ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ received: true, eventType: result.eventType }, { status: 200 });
  } catch (error: any) {
    console.error("Fatal error in Paddle webhook handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal webhook error" },
      { status: 500 }
    );
  }
}
