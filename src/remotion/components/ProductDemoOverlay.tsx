import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Img } from "remotion";

interface ProductDemoOverlayProps {
  productImageUrl?: string;
  brandName: string;
  totalDurationSeconds?: number;
}

export const ProductDemoOverlay: React.FC<ProductDemoOverlayProps> = ({
  productImageUrl,
  brandName,
  totalDurationSeconds = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If no specific image or if it's the same as creator background, don't overlay
  if (!productImageUrl || productImageUrl.includes("creator-") || productImageUrl.endsWith(".mp4")) {
    return null;
  }

  const currentTime = frame / fps;
  // Dynamic Proof Phase: In short previews (<= 5s), shows from 1.0s to duration-0.4s.
  // In full 12-15s ads, slides in during the middle USP proof window from 3.5s to 9.5s.
  const isShortPreview = totalDurationSeconds <= 5.0;
  const showStart = isShortPreview ? 1.0 : 3.5;
  const showEnd = isShortPreview ? Math.max(1.8, totalDurationSeconds - 0.5) : Math.min(10.5, totalDurationSeconds - 3.5);

  if (currentTime < showStart || currentTime > showEnd) {
    return null;
  }

  const entrance = spring({
    frame: Math.max(0, frame - Math.floor(showStart * fps)),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "30%",
        left: "10%",
        right: "10%",
        zIndex: 26,
        transform: `scale(${Math.min(entrance, 1)})`,
        transformOrigin: "center center",
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderRadius: "28px",
        padding: "16px",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.8)",
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
            color: "#1F3824",
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
          src={productImageUrl}
          alt="Product Demo Screen"
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

