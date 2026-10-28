import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { UgcAdCompositionProps, DEFAULT_COMPOSITION_PROPS } from "../types";
import { DynamicBackground } from "../components/DynamicBackground";
import { KineticSubtitles } from "../components/KineticSubtitles";
import { BrandOverlay } from "../components/BrandOverlay";

export const UgcAdComposition: React.FC<UgcAdCompositionProps> = (props) => {
  const mergedProps = { ...DEFAULT_COMPOSITION_PROPS, ...props };
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isMemeMode =
    mergedProps.archetype === "meme_reaction" ||
    mergedProps.hasVoiceover === false ||
    mergedProps.audioMode === "music_only";

  // Smooth pop-in animation for meme punchline card
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#F6F7F2", overflow: "hidden" }}>
      {/* Track 1: Dynamic Visual Background / Creator Reaction */}
      <DynamicBackground
        productImageUrl={mergedProps.productImageUrl}
        videoUrl={mergedProps.videoUrl}
        brandColor={mergedProps.brandColor}
      />

      {/* Track 2: Subtitles or Kinetic Viral Meme Card */}
      {isMemeMode ? (
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "6%",
            right: "6%",
            zIndex: 25,
            transform: `scale(${Math.min(cardScale, 1)})`,
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            borderRadius: "28px",
            padding: "36px 32px",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.35)",
            border: "2px solid rgba(255, 255, 255, 0.8)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#1F3824",
              marginBottom: "12px",
            }}
          >
            POV: Finding {mergedProps.brandName}
          </div>
          <div
            style={{
              fontSize: "38px",
              fontWeight: 900,
              lineHeight: 1.25,
              color: "#111827",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            {`"${mergedProps.hookText}"`}
          </div>
          <div
            style={{
              marginTop: "16px",
              fontSize: "20px",
              fontWeight: 600,
              color: "#4B5563",
            }}
          >
            {mergedProps.ctaText || `Check out ${mergedProps.brandName} before everyone else does.`}
          </div>
        </div>
      ) : (
        <KineticSubtitles
          words={mergedProps.words}
          styleConfig={mergedProps.subtitleStyle}
        />
      )}

      {/* Track 3: Top Brand Mark & Watermark Overlay */}
      <BrandOverlay
        brandName={mergedProps.brandName}
        logoUrl={mergedProps.logoUrl}
        brandColor={mergedProps.brandColor}
        hasWatermark={mergedProps.hasWatermark}
      />
    </AbsoluteFill>
  );
};
