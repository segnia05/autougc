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
        backgroundColor: "#09090B",
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
        /* Sleek Ambient Mesh Canvas Fallback */
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 30%, ${brandColor}22 0%, #09090B 70%)`,
          }}
        >
          {/* Subtle geometric grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      )}

      {/* Dark Vignette & Readability Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(9, 9, 11, 0.7) 0%, rgba(9, 9, 11, 0.3) 40%, rgba(9, 9, 11, 0.9) 85%, #09090B 100%)",
        }}
      />
    </div>
  );
};
