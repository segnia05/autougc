import { WordTimestamp } from "@/lib/audio/types";

export interface SubtitleStyleConfig {
  fontSize?: number;
  primaryColor?: string;
  highlightColor?: string;
  strokeColor?: string;
  fontFamily?: string;
}

export interface UgcAdCompositionProps {
  [key: string]: unknown;
  brandName: string;
  hookText: string;
  bodyText?: string;
  ctaText?: string;
  brandColor?: string;
  logoUrl?: string;
  productImageUrl?: string;
  words: WordTimestamp[];
  subtitleStyle?: SubtitleStyleConfig;
  hasWatermark?: boolean;
}

export const DEFAULT_COMPOSITION_PROPS: UgcAdCompositionProps = {
  brandName: "Lumina",
  hookText: "Stop coding under harsh fluorescent lights in 2026.",
  bodyText: "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour sprints.",
  ctaText: "Click the link below and get $30 off your setup today.",
  brandColor: "#F59E0B",
  hasWatermark: false,
  words: [
    { word: "Stop", start: 0.15, end: 0.45 },
    { word: "coding", start: 0.48, end: 0.85 },
    { word: "under", start: 0.88, end: 1.15 },
    { word: "harsh", start: 1.18, end: 1.55 },
    { word: "fluorescent", start: 1.58, end: 2.15 },
    { word: "lights", start: 2.18, end: 2.65 },
    { word: "in", start: 2.68, end: 2.85 },
    { word: "2026", start: 2.88, end: 3.45 },
  ],
  subtitleStyle: {
    fontSize: 54,
    primaryColor: "#FFFFFF",
    highlightColor: "#F59E0B",
    strokeColor: "#000000",
  },
};
