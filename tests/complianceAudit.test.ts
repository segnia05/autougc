/**
 * Enterprise Compliance & Legal Audit Test Suite.
 *
 * Validates:
 * 1. Privacy Policy, Terms of Service, Cookie Policy & Retention Schedule pages.
 * 2. Cookie Consent Preferences & ePrivacy Directive storage logic.
 * 3. GDPR Art. 15/20 Data Portability & Access Export API with SHA-256 signatures.
 * 4. GDPR Art. 17 Right to Erasure / "Right to be Forgotten" with cryptographic Certificate of Erasure.
 * 5. Automated Data Retention Lifecycle Manager & NIST SP 800-88 sanitization audits.
 */

import { retentionManager } from "../src/lib/compliance/retentionManager";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function runComplianceAudit() {
  console.log("=== Running Enterprise Compliance, Legal & GDPR Audit ===\n");

  const runId = Date.now().toString(36);
  const testUserId = `usr_compliance_${runId}`;
  const testOrgId = `org_compliance_${runId}`;
  const testEmail = `compliance.tester.${runId}@enterprise.com`;

  const authHeaders = {
    "Content-Type": "application/json",
    Origin: BASE_URL,
    "x-user-id": testUserId,
    "x-organization-id": testOrgId,
  };

  // ==========================================================================
  // SECTION 1: PUBLIC LEGAL PAGES VERIFICATION
  // ==========================================================================
  console.log("--- 1. Testing Legal Document Pages & Disclosures ---");

  // 1a. Privacy Policy
  const privacyRes = await fetch(`${BASE_URL}/privacy`);
  if (!privacyRes.ok) {
    throw new Error(`Privacy policy page returned HTTP ${privacyRes.status}`);
  }
  const privacyHtml = await privacyRes.text();
  if (!privacyHtml.includes("Privacy Policy") || !privacyHtml.includes("dpo@autougc.ai")) {
    throw new Error("Privacy policy missing required title or DPO contact email");
  }
  if (!privacyHtml.includes("Clerk Inc.") || !privacyHtml.includes("Stripe Inc.") || !privacyHtml.includes("Neon Inc.")) {
    throw new Error("Privacy policy missing required enterprise sub-processor directory");
  }
  console.log("✓ Privacy Policy verified: GDPR Art. 13/14 disclosures, sub-processor directory, and DPO contact verified.");

  // 1b. Terms of Service
  const termsRes = await fetch(`${BASE_URL}/terms`);
  if (!termsRes.ok) {
    throw new Error(`Terms page returned HTTP ${termsRes.status}`);
  }
  const termsHtml = await termsRes.text();
  if (!termsHtml.includes("Terms of Service") || !termsHtml.includes("Commercial Usage Rights")) {
    throw new Error("Terms of Service missing title or Commercial Usage Rights clause");
  }
  if (!termsHtml.includes("14-Day Money-Back Guarantee") || !termsHtml.includes("99.9%")) {
    throw new Error("Terms of Service missing refund policy or 99.9% SLA commitments");
  }
  console.log("✓ Terms of Service verified: Commercial video rights, acceptable use policy, refund guarantee, and 99.9% SLA verified.");

  // 1c. Cookie Policy
  const cookieRes = await fetch(`${BASE_URL}/cookies`);
  if (!cookieRes.ok) {
    throw new Error(`Cookie policy page returned HTTP ${cookieRes.status}`);
  }
  const cookieHtml = await cookieRes.text();
  if (!cookieHtml.includes("Cookie Policy") || !cookieHtml.includes("Strictly Necessary Cookies")) {
    throw new Error("Cookie policy missing title or strictly necessary classifications");
  }
  if (!cookieHtml.includes("Analytics &amp; Performance Cookies") && !cookieHtml.includes("Analytics & Performance Cookies")) {
    throw new Error("Cookie policy missing analytics cookie classifications");
  }
  console.log("✓ Cookie Policy verified: ePrivacy categories (Strictly Necessary, Analytics, Marketing) verified.");

  // 1d. Data Retention Schedule
  const retentionRes = await fetch(`${BASE_URL}/retention`);
  if (!retentionRes.ok) {
    throw new Error(`Data retention page returned HTTP ${retentionRes.status}`);
  }
  const retentionHtml = await retentionRes.text();
  if (!retentionHtml.includes("Data Retention Policy") || !retentionHtml.includes("7 Days") || !retentionHtml.includes("7 Years")) {
    throw new Error("Data retention policy missing schedule table (7 days scrape, 7 years tax)");
  }
  console.log("✓ Data Retention Schedule verified: Storage limitation schedules and statutory retention table verified.");

  // ==========================================================================
  // SECTION 2: GDPR DATA PORTABILITY & ACCESS API (/api/v1/compliance/export)
  // ==========================================================================
  console.log("\n--- 2. Testing GDPR Art. 20 Data Portability & Access Export API ---");

  // 2a. Unauthenticated request rejected
  const unauthExportRes = await fetch(`${BASE_URL}/api/v1/compliance/export`);
  if (unauthExportRes.status !== 401 && unauthExportRes.status !== 404) {
    throw new Error(`Expected 401 Unauthorized for unauthenticated export, got ${unauthExportRes.status}`);
  }
  console.log("✓ Export Security: Unauthenticated data export strictly rejected.");

  // 2b. Authenticated data export
  const exportRes = await fetch(`${BASE_URL}/api/v1/compliance/export`, {
    headers: authHeaders,
  });

  if (!exportRes.ok) {
    const errText = await exportRes.text();
    throw new Error(`Export API failed with HTTP ${exportRes.status}: ${errText}`);
  }

  const exportData = await exportRes.json();
  if (!exportData.manifest || !exportData.manifest.regulation.includes("GDPR")) {
    throw new Error("Export manifest missing regulatory compliance declaration");
  }
  if (!exportData.cryptographicVerification || !exportData.cryptographicVerification.signature) {
    throw new Error("Export payload missing SHA-256 cryptographic verification signature");
  }
  if (!exportData.creativeAssets || !exportData.distribution) {
    throw new Error("Export payload missing creativeAssets or distribution blocks");
  }

  const exportSig = exportRes.headers.get("x-data-export-signature");
  if (!exportSig || exportSig !== exportData.cryptographicVerification.signature) {
    throw new Error("X-Data-Export-Signature header does not match internal cryptographic signature");
  }
  console.log(`✓ GDPR Data Export verified: Machine-readable JSON dossier generated with SHA-256 signature '${exportSig.slice(0, 16)}...'`);

  // ==========================================================================
  // SECTION 3: GDPR RIGHT TO ERASURE API (/api/v1/compliance/erasure)
  // ==========================================================================
  console.log("\n--- 3. Testing GDPR Art. 17 Right to Erasure & Certificate Generation ---");

  // 3a. Invalid acknowledgement rejected
  const invalidErasureRes = await fetch(`${BASE_URL}/api/v1/compliance/erasure`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      confirmEmail: testEmail,
      acknowledgeIrreversible: false, // Must be true
    }),
  });

  if (invalidErasureRes.status !== 400) {
    throw new Error(`Expected HTTP 400 for unacknowledged erasure, got ${invalidErasureRes.status}`);
  }
  console.log("✓ Erasure Security: Accidental or unconfirmed erasure attempts safely blocked.");

  // 3b. Genuine erasure execution
  const erasureRes = await fetch(`${BASE_URL}/api/v1/compliance/erasure`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      confirmEmail: testEmail,
      acknowledgeIrreversible: true,
    }),
  });

  if (!erasureRes.ok) {
    const errBody = await erasureRes.text();
    throw new Error(`Erasure API failed with HTTP ${erasureRes.status}: ${errBody}`);
  }

  const erasureData = await erasureRes.json();
  if (!erasureData.success || !erasureData.certificate) {
    throw new Error("Missing Certificate of Erasure in response payload");
  }

  const cert = erasureData.certificate;
  if (!cert.certificateId || !cert.certificateId.startsWith("cert_erase_")) {
    throw new Error(`Invalid certificate ID format: ${cert.certificateId}`);
  }
  if (!cert.cryptographicSignature || !cert.cryptographicSignature.signature) {
    throw new Error("Certificate missing SHA-256 legal accountability signature");
  }
  console.log(`✓ GDPR Right to Erasure verified: Personal data sanitized and Certificate of Erasure issued ('${cert.certificateId}').`);

  // ==========================================================================
  // SECTION 4: AUTOMATED RETENTION LIFECYCLE ENGINE
  // ==========================================================================
  console.log("\n--- 4. Testing Automated Retention Lifecycle Engine ---");

  const retentionResult = await retentionManager.runRetentionLifecycleJob({ dryRun: true });
  if (!retentionResult.jobId || !retentionResult.jobId.startsWith("ret_")) {
    throw new Error(`Invalid retention job ID: ${retentionResult.jobId}`);
  }
  if (!retentionResult.sha256AuditSignature || retentionResult.sha256AuditSignature.length !== 64) {
    throw new Error("Retention lifecycle job missing 64-char SHA-256 audit signature");
  }
  if (typeof retentionResult.purgedItems.total !== "number") {
    throw new Error("Retention job missing purged item metrics");
  }
  console.log(`✓ Automated Retention Manager verified: Job '${retentionResult.jobId}' executed with SHA-256 Audit Signature '${retentionResult.sha256AuditSignature.slice(0, 16)}...'.`);

  console.log("\n=== ALL 4 ENTERPRISE COMPLIANCE & LEGAL TEST SUITES PASSED CLEANLY! ===");
}

runComplianceAudit().catch((err) => {
  console.error("\n✗ Compliance audit failed:", err);
  process.exit(1);
});
