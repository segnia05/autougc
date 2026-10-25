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

  const fontSize = styleConfig.fontSize || 52;
  const primaryColor = styleConfig.primaryColor || "#FFFFFF";
  const highlightColor = styleConfig.highlightColor || "#F59E0B";

  // Group words into short 3-5 word readable chunks
  const CHUNK_SIZE = 4;
  const chunks: WordTimestamp[][] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE));
  }

  // Find active chunk for the current timestamp
  const activeChunk = chunks.find((chunk) => {
    const firstWord = chunk[0];
    const lastWord = chunk[chunk.length - 1];
    if (!firstWord || !lastWord) return false;
    return currentTime >= firstWord.start - 0.1 && currentTime <= lastWord.end + 0.3;
  }) || chunks[0] || [];

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 380, // Positioned safely above TikTok profile & caption UI
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px 16px",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {activeChunk.map((item, idx) => {
        const isActive = currentTime >= item.start && currentTime <= item.end;
        const isPast = currentTime > item.end;

        const scale = isActive
          ? spring({
              frame: frame - Math.floor(item.start * fps),
              fps,
              config: { damping: 12, stiffness: 200 },
            }) * 0.1 + 1.05
          : 1.0;

        return (
          <span
            key={`${item.word}-${idx}`}
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              transform: `scale(${scale})`,
              display: "inline-block",
              color: isActive ? highlightColor : isPast ? primaryColor : "rgba(255, 255, 255, 0.45)",
              textShadow:
                "0 2px 4px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
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
