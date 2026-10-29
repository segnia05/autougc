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
  const position = styleConfig.position || "center";
  const backgroundPill = styleConfig.backgroundPill || false;

  // Vertical anchor based on user preference, calibrated strictly to Safe Zones
  const topPosition =
    position === "top" ? "26%" : position === "bottom" ? "62%" : "46%";

  // Group words into short 3-word punchy kinetic chunks
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

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: topPosition,
        transform: "translateY(-50%)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px 18px",
          ...(backgroundPill
            ? {
                backgroundColor: "rgba(18, 24, 18, 0.88)",
                backdropFilter: "blur(16px)",
                padding: "16px 32px",
                borderRadius: "28px",
                border: "1.5px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65)",
              }
            : {}),
        }}
      >
        {activeChunk.map((item, idx) => {
          const isActive = currentTime >= item.start && currentTime <= item.end;
          const isPast = currentTime > item.end;

          const scale = isActive
            ? spring({
                frame: frame - Math.floor(item.start * fps),
                fps,
                config: { damping: 12, stiffness: 220 },
              }) * 0.12 + 1.08
            : 1.0;

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
                color: isActive ? highlightColor : isPast ? primaryColor : "rgba(255, 255, 255, 0.5)",
                textShadow:
                  "0 4px 14px rgba(0, 0, 0, 0.95), 0 0 28px rgba(0, 0, 0, 0.9), -2.5px -2.5px 0 #000, 2.5px -2.5px 0 #000, -2.5px 2.5px 0 #000, 2.5px 2.5px 0 #000",
                WebkitTextStroke: "1px rgba(0, 0, 0, 0.85)",
                transition: "color 0.05s ease-out",
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
