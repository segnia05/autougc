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
        padding: "170px 52px 140px 52px",
      }}
    >
      {/* Top Header Brand Badge - Modern Frosted Luxury Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          alignSelf: "flex-start",
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(27, 35, 27, 0.12)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
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
            color: "#18181B",
            fontSize: "20px",
            fontWeight: 800,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {brandName}
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "#D95D39",
            fontWeight: 700,
            backgroundColor: "#FFF9F6",
            padding: "2px 8px",
            borderRadius: "9999px",
            letterSpacing: "0.04em",
          }}
        >
          UGC AD
        </span>
      </div>

      {/* Preview Watermark */}
      {hasWatermark && (
        <div
          style={{
            alignSelf: "flex-end",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(27, 35, 27, 0.15)",
            padding: "8px 16px",
            borderRadius: "9999px",
            color: "#18181B",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "Geist Mono, monospace",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          Made with AutoUGC.com
        </div>
      )}
    </div>
  );
};
