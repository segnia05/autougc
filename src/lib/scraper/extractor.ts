import * as cheerio from "cheerio";
import { validateSafeUrl } from "./ssrfFilter";
import { extractBrandColors } from "./colorExtractor";

export interface ScrapedAssetItem {
  type: "logo" | "image";
  url: string;
  aspectRatio: number;
}

export interface ScrapedProductData {
  brandName: string;
  pageTitle: string;
  summary: string;
  headings: string[];
  brandColors: {
    primary: string;
    accent: string;
  };
  assets: ScrapedAssetItem[];
}

/**
 * Scrapes product data, value propositions, high-res images, and brand colors from a validated URL.
 */
export async function scrapeUrl(targetUrl: string): Promise<ScrapedProductData> {
  const safety = validateSafeUrl(targetUrl);
  if (!safety.isValid || !safety.normalizedUrl) {
    throw new Error(safety.error || "Invalid target URL.");
  }

  const url = safety.normalizedUrl;

  // 1. Fetch HTML with timeout and Chrome User-Agent
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  let html: string;
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Target website responded with HTTP ${response.status}`);
    }

    html = await response.text();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(`Unable to reach target URL: ${errorMsg}`);
  }

  // 2. Parse HTML with Cheerio
  const $ = cheerio.load(html);

  // 3. Extract Titles & Descriptions
  const ogTitle = $('meta[property="og:title"]').attr("content") || $('meta[name="twitter:title"]').attr("content");
  const pageTitle = (ogTitle || $("title").text() || "").trim();

  const ogDesc = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content");
  const summary = (ogDesc || "").trim();

  // 4. Extract Brand Name
  const siteName = $('meta[property="og:site_name"]').attr("content");
  let brandName = siteName?.trim();
  if (!brandName) {
    const hostParts = new URL(url).hostname.replace(/^www\./, "").split(".");
    brandName = (hostParts[0] ?? "Brand").charAt(0).toUpperCase() + (hostParts[0] ?? "Brand").slice(1);
  }

  // 5. Extract Key Value Proposition Headings (H1 & H2)
  const headings: string[] = [];
  $("h1, h2").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text.length > 10 && text.length < 140 && !headings.includes(text)) {
      headings.push(text);
    }
  });

  // 6. Extract High-Res Product Images & Logos
  const assets: ScrapedAssetItem[] = [];

  // Check OpenGraph Image
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) {
    const absoluteOgImage = resolveAbsoluteUrl(ogImage, url);
    if (absoluteOgImage) {
      assets.push({ type: "image", url: absoluteOgImage, aspectRatio: 1.0 });
    }
  }

  // Check Favicon / Logo
  const iconHref =
    $('link[rel="apple-touch-icon"]').attr("href") ||
    $('link[rel="icon"]').attr("href") ||
    $('meta[property="og:image:logo"]').attr("content");
  if (iconHref) {
    const absoluteLogo = resolveAbsoluteUrl(iconHref, url);
    if (absoluteLogo) {
      assets.push({ type: "logo", url: absoluteLogo, aspectRatio: 1.0 });
    }
  }

  // Check in-page images (filter out tiny icons/spacers)
  $("img").each((_, el) => {
    if (assets.length >= 8) return false; // Cap at 8 high-res assets
    const src = $(el).attr("src") || $(el).attr("data-src");
    if (!src) return;

    // Filter out common tracking pixels and tiny icons
    if (src.includes("data:image") || src.includes("1x1") || src.includes("pixel")) return;

    const absoluteSrc = resolveAbsoluteUrl(src, url);
    if (absoluteSrc && !assets.some((a) => a.url === absoluteSrc)) {
      assets.push({ type: "image", url: absoluteSrc, aspectRatio: 1.0 });
    }
  });

  // 7. Extract Brand Colors
  const brandColors = extractBrandColors(html);

  return {
    brandName,
    pageTitle: pageTitle || brandName,
    summary: summary || (headings[0] ?? "High-performance digital product."),
    headings: headings.slice(0, 5),
    brandColors,
    assets,
  };
}

function resolveAbsoluteUrl(relativeUrl: string, baseUrl: string): string | null {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return null;
  }
}
