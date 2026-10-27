import React from "react";
import { interpolate, useCurrentFrame, Img } from "remotion";

interface DynamicBackgroundProps {
  productImageUrl?: string;
  brandColor?: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  productImageUrl,
  brandColor = "#F59E0B",
}) => {
  const frame = useCurrentFrame();

  // Slow smooth Ken Burns zoom effect (1.00 -> 1.12 over 450 frames / 15 seconds)
  const scale = interpolate(frame, [0, 450], [1.0, 1.12], {
    extrapolateRight: "clamp",
  });

  const panY = interpolate(frame, [0, 450], [0, -30], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#F6F7F2",
        overflow: "hidden",
      }}
    >
      {productImageUrl ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${scale}) translateY(${panY}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={productImageUrl}
            alt="Product B-Roll"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        /* Modern Editorial Canvas Fallback in Fluencify Organic Palette */
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 25%, ${brandColor}22 0%, #ECEFE7 50%, #D8DFD2 100%)`,
          }}
        >
          {/* Subtle tactile grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(31, 56, 36, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 56, 36, 0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      )}

      {/* Cinematic Ambient Scrim - Light & Crisp for Optimal Text Readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.05) 22%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.65) 100%)",
        }}
      />
    </div>
  );
};
