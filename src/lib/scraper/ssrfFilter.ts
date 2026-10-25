import { URL } from "url";

/**
 * Validates a target URL against Server-Side Request Forgery (SSRF) vulnerabilities.
 * Disallows private IP ranges, cloud metadata IPs, and non-http(s) schemes.
 */
export function validateSafeUrl(inputUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  try {
    const parsed = new URL(inputUrl);

    // 1. Enforce HTTP or HTTPS protocol only
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, error: "Only HTTP and HTTPS URLs are supported." };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 2. Reject localhost & loopback
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local")
    ) {
      return { isValid: false, error: "Access to local loopback hosts is restricted." };
    }

    // 3. Reject cloud metadata endpoints (AWS, GCP, Azure, DigitalOcean)
    if (
      hostname === "169.254.169.254" ||
      hostname === "metadata.google.internal" ||
      hostname === "100.100.100.200"
    ) {
      return { isValid: false, error: "Access to internal cloud metadata endpoints is restricted." };
    }

    // 4. Reject private RFC 1918 subnets (IPv4)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const p1 = parseInt(ipMatch[1] ?? "0", 10);
      const p2 = parseInt(ipMatch[2] ?? "0", 10);

      if (p1 === 10) return { isValid: false, error: "Access to private 10.0.0.0/8 networks is restricted." };
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return { isValid: false, error: "Access to private 172.16.0.0/12 networks is restricted." };
      if (p1 === 192 && p2 === 168) return { isValid: false, error: "Access to private 192.168.0.0/16 networks is restricted." };
      if (p1 === 0 || p1 >= 224) return { isValid: false, error: "Access to reserved IP ranges is restricted." };
    }

    return { isValid: true, normalizedUrl: parsed.href };
  } catch {
    return { isValid: false, error: "The provided string is not a valid URL format." };
  }
}
