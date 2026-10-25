/**
 * Extracts brand colors from HTML meta tags or falls back to curated high-converting palettes.
 */
export function extractBrandColors(html: string): { primary: string; accent: string } {
  // 1. Look for <meta name="theme-color" content="#...">
  const themeColorMatch = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i);
  let primaryColor = themeColorMatch?.[1]?.trim();

  // Validate hex format
  if (primaryColor && !/^#([0-9A-F]{3}){1,2}$/i.test(primaryColor)) {
    primaryColor = undefined;
  }

  // 2. High-converting defaults if no clean theme color found
  const fallbackPalettes = [
    { primary: "#10B981", accent: "#F59E0B" }, // Emerald & Electric Amber
    { primary: "#3B82F6", accent: "#F59E0B" }, // Cobalt Blue & Amber
    { primary: "#6366F1", accent: "#EC4899" }, // Indigo & Neon Pink
    { primary: "#0EA5E9", accent: "#F97316" }, // Ocean Blue & Orange
  ];

  const defaultPalette = fallbackPalettes[0]!;

  return {
    primary: primaryColor || defaultPalette.primary,
    accent: defaultPalette.accent,
  };
}
