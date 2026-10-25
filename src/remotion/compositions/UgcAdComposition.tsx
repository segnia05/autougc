import React from "react";
import { AbsoluteFill } from "remotion";
import { UgcAdCompositionProps, DEFAULT_COMPOSITION_PROPS } from "../types";
import { DynamicBackground } from "../components/DynamicBackground";
import { KineticSubtitles } from "../components/KineticSubtitles";
import { BrandOverlay } from "../components/BrandOverlay";

export const UgcAdComposition: React.FC<UgcAdCompositionProps> = (props) => {
  const mergedProps = { ...DEFAULT_COMPOSITION_PROPS, ...props };

  return (
    <AbsoluteFill style={{ backgroundColor: "#09090B", overflow: "hidden" }}>
      {/* Track 1: Dynamic Visual Background */}
      <DynamicBackground
        productImageUrl={mergedProps.productImageUrl}
        brandColor={mergedProps.brandColor}
      />

      {/* Track 2: Kinetic Synchronized Subtitles */}
      <KineticSubtitles
        words={mergedProps.words}
        styleConfig={mergedProps.subtitleStyle}
      />

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
