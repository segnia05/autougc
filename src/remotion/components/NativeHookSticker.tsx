import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export type HookStickerType = "tiktok_question" | "tweet_card" | "pov_badge" | "bold_warning";

interface NativeHookStickerProps {
  hookText: string;
  brandName: string;
  stickerType?: HookStickerType;
  creatorHandle?: string;
}

export const NativeHookSticker: React.FC<NativeHookStickerProps> = ({
  hookText,
  brandName,
  stickerType = "tiktok_question",
  creatorHandle = "@tech_insider",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth bouncy spring entrance at frame 0
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Stay visible strongly during first 6 seconds (hook phase), then gently fade to subtle or persist
  const timeInSeconds = frame / fps;
  const opacity = timeInSeconds < 5.5 ? 1 : Math.max(0.85 - (timeInSeconds - 5.5) * 0.15, 0.7);

  if (stickerType === "tiktok_question") {
    return (
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "8%",
          right: "8%",
          zIndex: 28,
          transform: `scale(${Math.min(entrance, 1)})`,
          transformOrigin: "center top",
          opacity,
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "20px 24px",
          boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.06)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Reply tag header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#6B7280",
            }}
          >
            Replying to <strong style={{ color: "#111827" }}>{creatorHandle}</strong>
          </span>
        </div>

        {/* Question hook */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 800,
            lineHeight: 1.25,
            color: "#111827",
            letterSpacing: "-0.02em",
          }}
        >
          {`"${hookText}"`}
        </div>
      </div>
    );
  }

  if (stickerType === "tweet_card") {
    return (
      <div
        style={{
          position: "absolute",
          top: "13%",
          left: "7%",
          right: "7%",
          zIndex: 28,
          transform: `scale(${Math.min(entrance, 1)})`,
          transformOrigin: "center top",
          opacity,
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "24px 28px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "9999px",
              backgroundColor: "#D95D39",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "18px",
            }}
          >
            {brandName.charAt(0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "17px", fontWeight: 800, color: "#111827" }}>
              {brandName}
            </span>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#6B7280" }}>
              @{brandName.toLowerCase().replace(/\s+/g, "")} · 2h
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#1F2937",
            letterSpacing: "-0.02em",
          }}
        >
          {hookText}
        </div>
      </div>
    );
  }

  // Default: POV Badge / High-Contrast Warning Banner
  return (
    <div
      style={{
        position: "absolute",
        top: "14%",
        left: "6%",
        right: "6%",
        zIndex: 28,
        transform: `scale(${Math.min(entrance, 1)})`,
        transformOrigin: "center top",
        opacity,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
        borderRadius: "22px",
        padding: "20px 24px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        border: "2px solid rgba(255, 230, 0, 0.8)",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#FFE600",
          marginBottom: "8px",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFE600"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>URGENT NOTICE · {brandName.toUpperCase()}</span>
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 900,
          lineHeight: 1.25,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
        }}
      >
        {hookText}
      </div>
    </div>
  );
};

