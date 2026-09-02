import { ImageResponse } from "next/og";

import { SITE_CONFIG } from "@/lib/site-config";
import { STATIC_THEME_COLORS } from "@/lib/theme/theme.constants";

export const alt = "BitCoinverter — understand how steady Bitcoin accumulation adds up";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: STATIC_THEME_COLORS.darkBackground,
        color: STATIC_THEME_COLORS.darkForeground,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: STATIC_THEME_COLORS.accent,
            borderRadius: "999px",
            color: STATIC_THEME_COLORS.accentForeground,
            display: "flex",
            fontSize: "48px",
            fontWeight: 700,
            height: "160px",
            justifyContent: "center",
            letterSpacing: "-2px",
            width: "160px",
          }}
        >
          BTC
        </div>
        <div style={{ display: "flex", fontSize: "72px", fontWeight: 700 }}>{SITE_CONFIG.name}</div>
        <div
          style={{
            color: STATIC_THEME_COLORS.darkMuted,
            display: "flex",
            fontSize: "34px",
            maxWidth: "900px",
          }}
        >
          Understand how steady Bitcoin accumulation adds up.
        </div>
      </div>
    </div>,
    size
  );
}
