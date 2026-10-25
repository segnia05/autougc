import React from "react";
import { Img } from "remotion";

interface BrandOverlayProps {
  brandName: string;
  logoUrl?: string;
  brandColor?: string;
  hasWatermark?: boolean;
}

export const BrandOverlay: React.FC<BrandOverlayProps> = ({
  brandName,
  logoUrl,
  brandColor = "#F59E0B",
  hasWatermark = false,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 48px",
      }}
    >
      {/* Top Header Brand Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          alignSelf: "flex-start",
          background: "rgba(18, 18, 21, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "10px 20px",
          borderRadius: "9999px",
        }}
      >
        {logoUrl ? (
          <Img
            src={logoUrl}
            alt={brandName}
            style={{
              height: "28px",
              width: "auto",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
        ) : (
          <div
            style={{
              height: "12px",
              width: "12px",
              borderRadius: "9999px",
              backgroundColor: brandColor,
            }}
          />
        )}
        <span
          style={{
            color: "#F4F4F6",
            fontSize: "20px",
            fontWeight: 700,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {brandName}
        </span>
      </div>

      {/* Free Tier Watermark */}
      {hasWatermark && (
        <div
          style={{
            alignSelf: "flex-end",
            background: "rgba(9, 9, 11, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: "Geist Mono, monospace",
          }}
        >
          Made with AutoUGC.com
        </div>
      )}
    </div>
  );
};
