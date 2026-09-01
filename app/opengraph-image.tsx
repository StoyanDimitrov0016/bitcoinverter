import { ImageResponse } from "next/og";

import { SITE_CONFIG } from "@/lib/site-config";

export const alt = "BitCoinverter — understand how steady Bitcoin accumulation adds up";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#17130f",
        color: "#f7f0e3",
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
            background: "#f59e0b",
            borderRadius: "999px",
            color: "#21170b",
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
            color: "#d7cbbb",
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
