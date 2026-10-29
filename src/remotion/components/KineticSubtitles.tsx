import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { WordTimestamp } from "@/lib/audio/types";
import { SubtitleStyleConfig } from "../types";

interface KineticSubtitlesProps {
  words: WordTimestamp[];
  styleConfig?: SubtitleStyleConfig;
}

export const KineticSubtitles: React.FC<KineticSubtitlesProps> = ({
  words,
  styleConfig = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;

  const fontSize = styleConfig.fontSize || 54;
  const primaryColor = styleConfig.primaryColor || "#FFFFFF";
  const highlightColor = styleConfig.highlightColor || "#FFE600";

  // Group words into short 3-4 word readable kinetic chunks
  const CHUNK_SIZE = 3;
  const chunks: WordTimestamp[][] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE));
  }

  // Find active chunk for the current timestamp
  const activeChunk =
    chunks.find((chunk) => {
      const firstWord = chunk[0];
      const lastWord = chunk[chunk.length - 1];
      if (!firstWord || !lastWord) return false;
      return currentTime >= firstWord.start - 0.1 && currentTime <= lastWord.end + 0.35;
    }) || chunks[0] || [];

  const isInitialState = currentTime === 0;

  const topPosition =
    styleConfig.position === "top"
      ? "28%"
      : styleConfig.position === "bottom"
      ? "68%"
      : "50%";

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        // Safe Zone positioning
        top: topPosition,
        transform: "translateY(-50%)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "14px 18px",
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      {activeChunk.map((item, idx) => {
        const isActive = !isInitialState && currentTime >= item.start && currentTime <= item.end;
        const isPast = !isInitialState && currentTime > item.end;

        const scale = isActive
          ? spring({
              frame: frame - Math.floor(item.start * fps),
              fps,
              config: { damping: 12, stiffness: 220 },
            }) * 0.12 + 1.08
          : 1.0;

        const wordColor = isActive
          ? highlightColor
          : isPast || isInitialState
          ? primaryColor
          : "rgba(255, 255, 255, 0.7)";

        return (
          <span
            key={`${item.word}-${idx}`}
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              transform: `scale(${scale})`,
              display: "inline-block",
              color: wordColor,
              backgroundColor: styleConfig.backgroundPill
                ? "rgba(0, 0, 0, 0.75)"
                : undefined,
              padding: styleConfig.backgroundPill ? "4px 16px" : undefined,
              borderRadius: styleConfig.backgroundPill ? "16px" : undefined,
              textShadow:
                "0 4px 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.85), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              transition: "color 0.05s ease-out",
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
