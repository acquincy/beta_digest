import React from "react";

export interface CanvasBProps {
  showConcentricCircles?: boolean;
}

export const CanvasB: React.FC<CanvasBProps> = ({ showConcentricCircles = true }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Base Gradient with OKLCH + sRGB fallback */}
      <div className="absolute inset-0 w-full h-full site-bg-gradient" />

      {/* 2. Soft Ambient Mesh Glows (Accent dusk violet top-left, dusty plum bottom-right) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(107, 98, 242, 0.14) 0%, transparent 65%),
            radial-gradient(circle at 85% 85%, rgba(155, 75, 127, 0.12) 0%, transparent 65%),
            radial-gradient(ellipse at 50% 50%, rgba(107, 98, 242, 0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* 3. Faint Grain Overlay (2.5% opacity) to prevent 8-bit banding */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* 4. Subtle Hairline Geometric Background Arcs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "1400px",
          height: "1400px",
          left: "-500px",
          top: "-200px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "1000px",
          height: "1000px",
          left: "-300px",
          top: "0px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "900px",
          height: "900px",
          right: "-300px",
          top: "-100px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      />

      {/* 5. Concentric Hairline Rings (Centered behind Hero Mockup on Desktop) */}
      {showConcentricCircles && (
        <div
          className="hidden md:block absolute"
          style={{
            top: "400px",
            right: "220px",
            width: "0",
            height: "0",
          }}
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "1040px",
              height: "1040px",
              top: "-520px",
              left: "-520px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "760px",
              height: "760px",
              top: "-380px",
              left: "-380px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
            }}
          />
        </div>
      )}
    </div>
  );
};
