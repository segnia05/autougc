import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Img } from "remotion";

interface ProductDemoOverlayProps {
  productImageUrl?: string;
  screenshotUrl?: string;
  brandName: string;
  totalDurationSeconds?: number;
}

export const ProductDemoOverlay: React.FC<ProductDemoOverlayProps> = ({
  productImageUrl,
  screenshotUrl,
  brandName,
  totalDurationSeconds = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve target software UI screenshot proof
  const effectiveScreenshotUrl =
    screenshotUrl ||
    (productImageUrl && !productImageUrl.includes("creator-") && !productImageUrl.endsWith(".mp4")
      ? productImageUrl
      : "/uploads/screenshots/screen_698d91231895.png");

  const currentTime = frame / fps;
  // Dynamic Proof Phase: In short previews (<= 5s), shows from 0.8s to duration-0.4s.
  // In full 12-15s ads, slides in during the middle USP proof window from 2.0s to 11.5s.
  const isShortPreview = totalDurationSeconds <= 5.0;
  const showStart = isShortPreview ? 0.8 : 2.0;
  const showEnd = isShortPreview ? Math.max(1.8, totalDurationSeconds - 0.4) : Math.min(12.0, totalDurationSeconds - 1.5);

  if (currentTime < showStart || currentTime > showEnd) {
    return null;
  }

  const entrance = spring({
    frame: Math.max(0, frame - Math.floor(showStart * fps)),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Dynamic floating physics: subtle bobbing and tilt simulating dynamic UI float over video
  const floatY = Math.sin(frame / 20) * 8;
  const floatRotate = Math.sin(frame / 35) * 1.4;

  return (
    <div
      style={{
        position: "absolute",
        top: "28%",
        left: "8%",
        right: "8%",
        zIndex: 26,
        transform: `scale(${Math.min(entrance, 1)}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
        transformOrigin: "center center",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderRadius: "28px",
        padding: "16px",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          padding: "0 8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#D95D39",
          }}
        >
          LIVE DEMO · {brandName}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#EF4444" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#F59E0B" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#10B981" }} />
        </div>
      </div>

      <div
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          maxHeight: "380px",
          backgroundColor: "#000000",
        }}
      >
        <Img
          src={effectiveScreenshotUrl}
          alt={`${brandName} Software UI Proof`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

