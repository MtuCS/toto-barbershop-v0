import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "ToTo Barbershop — Barber. Culture. Craft."
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050c0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(121, 184, 167, 0.25) 0%, rgba(5, 12, 10, 0) 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Top Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#79b8a7",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          <span>Est. 2013 · Sài Gòn</span>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: "76px",
            fontWeight: 900,
            color: "#f2f5f3",
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          ToTo Barbershop
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: "#79b8a7",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "16px",
          }}
        >
          Barber · Culture · Craft
        </div>

        {/* Bottom Description */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255, 255, 255, 0.7)",
            marginTop: "32px",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Cắt tóc chuẩn Barber · Sáp vuốt tóc chính hãng · Streetwear Merchandise
        </div>

        {/* Address */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          85 Đồng Đen, Phường 12, Quận Tân Bình, TP. Hồ Chí Minh
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
