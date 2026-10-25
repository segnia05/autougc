import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for AES-GCM
const TAG_LENGTH = 16; // 128-bit authentication tag

function getSecretKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || "autougc_dev_aes_secret_key_32bytes_long!!";
  // Always derive a strict 32-byte key via SHA-256
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts sensitive OAuth access and refresh tokens using AES-256-GCM.
 * Output format: base64(iv:tag:ciphertext)
 */
export function encryptToken(plaintext: string): string {
  if (!plaintext) {
    throw new Error("Cannot encrypt empty token string");
  }

  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Combine iv, tag, and ciphertext into colon-delimited string then base64 encode
  const combined = `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext}`;
  return Buffer.from(combined, "utf8").toString("base64");
}

/**
 * Decrypts AES-256-GCM encrypted OAuth token string.
 * Verifies the authentication tag to ensure data integrity and authenticity.
 */
export function decryptToken(encryptedBase64: string): string {
  if (!encryptedBase64) {
    throw new Error("Cannot decrypt empty ciphertext string");
  }

  const combined = Buffer.from(encryptedBase64, "base64").toString("utf8");
  const parts = combined.split(":");

  if (parts.length !== 3) {
    throw new Error("Malformed encrypted token payload: missing required IV/Tag components");
  }

  const [ivHex, tagHex, ciphertextHex] = parts;
  if (!ivHex || !tagHex || !ciphertextHex) {
    throw new Error("Invalid token components");
  }

  const key = getSecretKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");

  if (authTag.length !== TAG_LENGTH) {
    throw new Error("Invalid authentication tag length");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decryptedChunk = decipher.update(ciphertextHex, "hex", "utf8");
  const finalChunk = decipher.final("utf8");

  return decryptedChunk + finalChunk;
}
