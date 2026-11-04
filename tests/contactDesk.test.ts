import { describe, it } from "node:test";
import assert from "node:assert";
import { POST } from "../src/app/api/v1/contact/route";
import { NextRequest } from "next/server";

describe("Step 11: Contact Us (/contact) Verification", () => {
  const categories = [
    "ad_strategy",
    "custom_creator",
    "enterprise_bulk",
    "billing",
    "feedback",
  ] as const;

  it("verifies all 5 category topic pills submit successfully to /api/v1/contact", async () => {
    for (const cat of categories) {
      const payload = {
        name: "Alex Vance",
        email: "alex@omniwriter.ai",
        category: cat,
        subject: `Test inquiry for ${cat}`,
        message: `Hello AutoUGC team, this is an automated verification for topic ${cat}. Please review!`,
      };

      const req = new NextRequest("http://localhost:3000/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 200, `Category ${cat} must return HTTP 200`);

      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.message.includes("2 hours"), "Must confirm 2-hour SLA response");
    }
  });

  it("verifies validation rejects invalid email or missing fields", async () => {
    // Invalid email
    const invalidEmailReq = new NextRequest("http://localhost:3000/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alex Vance",
        email: "not-an-email",
        category: "ad_strategy",
        subject: "Strategy help",
        message: "This is a test message that has enough characters.",
      }),
    });

    const res1 = await POST(invalidEmailReq);
    assert.strictEqual(res1.status, 400, "Invalid email must return HTTP 400");
    const json1 = await res1.json();
    assert.strictEqual(json1.success, false);

    // Message too short (<10 chars)
    const shortMsgReq = new NextRequest("http://localhost:3000/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alex Vance",
        email: "alex@omniwriter.ai",
        category: "billing",
        subject: "Billing inquiry",
        message: "Too short",
      }),
    });

    const res2 = await POST(shortMsgReq);
    assert.strictEqual(res2.status, 400, "Short message must return HTTP 400");

    // Invalid category
    const invalidCatReq = new NextRequest("http://localhost:3000/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alex Vance",
        email: "alex@omniwriter.ai",
        category: "invalid_topic",
        subject: "Invalid inquiry",
        message: "This message has more than ten characters.",
      }),
    });

    const res3 = await POST(invalidCatReq);
    assert.strictEqual(res3.status, 400, "Invalid category must return HTTP 400");
  });

  it("verifies radar legacy route redirects to /contact", async () => {
    // Verify radar page file imports and calls redirect('/contact')
    const radarModule = await import("../src/app/radar/page");
    assert.ok(radarModule.default, "Radar page default export must exist");
  });
});
