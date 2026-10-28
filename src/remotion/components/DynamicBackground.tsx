import React from "react";
import { interpolate, useCurrentFrame, Img, Video } from "remotion";

interface DynamicBackgroundProps {
  productImageUrl?: string;
  videoUrl?: string;
  brandColor?: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  productImageUrl,
  videoUrl,
  brandColor = "#1F3824",
}) => {
  const frame = useCurrentFrame();

  // Determine if we have an active video asset (either explicit videoUrl or productImageUrl is an mp4)
  const activeVideoUrl =
    videoUrl ||
    (productImageUrl && productImageUrl.endsWith(".mp4") ? productImageUrl : undefined);

  // Organic Handheld Selfie Camera Physics (sine/cosine micro-movement simulating real iPhone hand-holding)
  const handheldPanX = Math.sin(frame / 32) * 12 + Math.cos(frame / 70) * 8;
  const handheldPanY = Math.cos(frame / 38) * 16 + Math.sin(frame / 85) * 6;
  const handheldRotate = Math.sin(frame / 50) * 0.45; // Subtle micro-tilt

  // Smooth cinematic breathing zoom
  const scale = interpolate(frame, [0, 225, 450], [1.04, 1.09, 1.05], {
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
      {activeVideoUrl ? (
        /* Real Video Layer with high-performance native Remotion Video */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={activeVideoUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loop
          />
        </div>
      ) : productImageUrl ? (
        /* Photo Layer with Organic Handheld Camera Float & Micro-Movement */
        <div
          style={{
            position: "absolute",
            inset: -40, // 40px bleed margin so handheld pan never exposes canvas edges
            transform: `scale(${scale}) translate(${handheldPanX}px, ${handheldPanY}px) rotate(${handheldRotate}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center center",
            transition: "transform 0.05s ease-out",
          }}
        >
          <Img
            src={productImageUrl}
            alt="Creator Visual Persona"
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

      {/* Cinematic Ambient Scrim - Protects text legibility while preserving vibrant background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.05) 25%, rgba(0, 0, 0, 0.15) 55%, rgba(0, 0, 0, 0.75) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
