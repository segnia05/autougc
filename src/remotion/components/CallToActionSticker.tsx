import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CallToActionStickerProps {
  ctaText: string;
  brandName: string;
  brandColor?: string;
  totalDurationSeconds?: number;
}

export const CallToActionSticker: React.FC<CallToActionStickerProps> = ({
  ctaText,
  brandName,
  brandColor = "#1F3824",
  totalDurationSeconds = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;
  // Activate during the final 4.5 seconds of the video ad
  const triggerTime = Math.max(0, totalDurationSeconds - 4.5);
  const isCtaPhase = currentTime >= triggerTime;

  const entrance = spring({
    frame: Math.max(0, frame - Math.floor(triggerTime * fps)),
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  if (!isCtaPhase) return null;

  // Gentle looping pulse
  const pulseScale = 1 + Math.sin(frame / 6) * 0.035;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "8%",
        left: "8%",
        right: "8%",
        zIndex: 32,
        transform: `scale(${Math.min(entrance, 1) * pulseScale})`,
        transformOrigin: "center center",
        backgroundColor: brandColor,
        borderRadius: "9999px",
        padding: "20px 28px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.45), 0 0 0 4px rgba(255, 230, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFE600"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
      <span
        style={{
          color: "#FFFFFF",
          fontSize: "22px",
          fontWeight: 900,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {ctaText || `Try ${brandName} Today (Link in Bio)`}
      </span>
    </div>
  );
};

