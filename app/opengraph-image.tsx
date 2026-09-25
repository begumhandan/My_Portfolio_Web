import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#09090B",
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 85% 85%, rgba(16,185,129,0.25), transparent 45%)",
        color: "white",
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>{siteConfig.logo}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 34, color: "#a1a1aa" }}>
          Full-Stack · Mobile · AI Software Engineer
        </div>
      </div>
      <div
        style={{
          height: 6,
          width: 240,
          borderRadius: 999,
          backgroundImage: "linear-gradient(90deg, #3B82F6, #10B981)",
        }}
      />
    </div>,
    size,
  );
}
