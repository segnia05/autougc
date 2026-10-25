import { encryptToken, decryptToken } from "../src/lib/social/crypto";
import {
  generateOAuthState,
  verifyOAuthState,
  exchangeCodeForTokens,
  buildAuthRedirectUrl,
  SocialPlatform,
} from "../src/lib/social/oauth";

async function runSocialOAuthTests() {
  console.log("--- Running Social OAuth & AES-256 Crypto Unit Tests ---");

  // 1. Test AES-256-GCM encryption and decryption roundtrip
  const sensitiveToken = "ya29.a0AfH6SMD_secret_tiktok_live_token_99818274";
  const encrypted = encryptToken(sensitiveToken);

  console.log("Encrypted base64 token payload:", encrypted.substring(0, 30) + "...");

  if (encrypted === sensitiveToken) {
    console.error("✗ Failed: Ciphertext equals plaintext!");
    process.exit(1);
  }

  const decrypted = decryptToken(encrypted);
  if (decrypted !== sensitiveToken) {
    console.error(`✗ Failed: Decrypted text '${decrypted}' does not match original token.`);
    process.exit(1);
  }
  console.log("✓ AES-256-GCM encryption and decryption roundtrip verified.");

  // 2. Test tampering detection with GCM auth tag
  try {
    // Tamper with the base64 string
    const decoded = Buffer.from(encrypted, "base64").toString("utf8");
    const tampered = Buffer.from(decoded.replace("a", "b"), "utf8").toString("base64");
    decryptToken(tampered);
    console.error("✗ Failed: Tampered ciphertext was accepted without authentication tag error.");
    process.exit(1);
  } catch {
    console.log("✓ Tampering correctly detected and rejected by AES-GCM authentication tag.");
  }

  // 3. Test OAuth state generation and HMAC validation
  const orgId = "org_venture_test_001";
  const state = generateOAuthState(orgId, "tiktok");
  const verifiedState = verifyOAuthState(state);

  if (verifiedState.orgId !== orgId || verifiedState.platform !== "tiktok") {
    console.error("✗ Failed: State verification returned wrong orgId or platform:", verifiedState);
    process.exit(1);
  }
  console.log("✓ HMAC-signed OAuth state verified successfully.");

  // 4. Test platform redirect URLs
  const platforms: SocialPlatform[] = ["tiktok", "instagram", "youtube"];
  for (const p of platforms) {
    const authUrl = buildAuthRedirectUrl(p, state, "http://localhost:3000/callback");
    if (!authUrl.startsWith("http")) {
      console.error(`✗ Failed: Invalid auth URL for ${p}: ${authUrl}`);
      process.exit(1);
    }
  }
  console.log("✓ Validated authorization redirect URLs for TikTok, Instagram, and YouTube Shorts.");

  // 5. Test mock token exchange
  const exchanged = await exchangeCodeForTokens("tiktok", "mock_code_test_123", "http://localhost:3000/callback");
  if (!exchanged.accessToken || !exchanged.accountHandle) {
    console.error("✗ Failed: Token exchange did not yield access token or handle:", exchanged);
    process.exit(1);
  }
  console.log(`✓ Exchanged OAuth code for handle: ${exchanged.accountHandle} (Expires in: ${exchanged.expiresIn}s)`);

  console.log("✓ All Social OAuth & Crypto tests passed cleanly!");
}

runSocialOAuthTests();
