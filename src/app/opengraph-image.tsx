import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #06111f 0%, #1e3a8a 50%, #06111f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #1e3a8a, #06b6d4)",
            marginBottom: 24,
            fontSize: 32,
            fontWeight: 900,
            color: "white",
            boxShadow: "0 20px 60px rgba(6,182,212,0.4)",
          }}
        >
          GV
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          VowLMS
        </div>
        {/* Tagline */}
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          Africa&apos;s Learn → Practice → Apply Ecosystem
        </div>
        {/* Stats row */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 32,
          }}
        >
          {[["614", "Courses"], ["6", "Academies"], ["500K+", "Learners"]].map(([val, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "16px 28px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: "#f5c542" }}>{val}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{label}</span>
            </div>
          ))}
        </div>
        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
          }}
        >
          goalvow.com · vowlms.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
