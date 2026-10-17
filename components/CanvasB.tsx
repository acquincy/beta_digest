import React from "react";

export interface CanvasBProps {
  showConcentricCircles?: boolean;
}

export const CanvasB: React.FC<CanvasBProps> = ({ showConcentricCircles = true }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* Dimension Dawn / Sunrise Sky Gradient */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(130% 95% at 8% 8%, rgba(56, 110, 228, 0.95) 0%, rgba(42, 86, 194, 0.72) 32%, transparent 72%),
            radial-gradient(115% 95% at 92% 92%, rgba(218, 140, 98, 0.95) 0%, rgba(198, 120, 84, 0.78) 30%, rgba(158, 96, 76, 0.45) 58%, transparent 85%),
            radial-gradient(85% 65% at 76% 62%, rgba(238, 164, 122, 0.45) 0%, transparent 58%),
            radial-gradient(100% 80% at 46% 46%, rgba(126, 116, 150, 0.55) 0%, transparent 68%),
            linear-gradient(140deg, #2a54b8 0%, #3a68ca 20%, #5d74ae 38%, #857593 55%, #ad7c7b 72%, #c98868 88%, #b57457 100%)
          `,
        }}
      />

      {/* Subtle atmospheric dawn dither & warmth overlay */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 80%)",
        }}
      />

      {/* Subtle hairline geometric arcs catching morning light */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "1400px",
          height: "1400px",
          left: "-500px",
          top: "-200px",
          border: "1px solid rgba(255, 255, 255, 0.10)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "1000px",
          height: "1000px",
          left: "-300px",
          top: "0px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      />

      {/* Right side ambient circle */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "900px",
          height: "900px",
          right: "-300px",
          top: "-100px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "radial-gradient(circle, rgba(238, 164, 122, 0.14) 0%, transparent 70%)",
        }}
      />

      {/* 2 concentric hairline rings centered behind hero mockup */}
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
          {/* Outer hairline ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "1040px",
              height: "1040px",
              top: "-520px",
              left: "-520px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
            }}
          />
          {/* Inner hairline ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "760px",
              height: "760px",
              top: "-380px",
              left: "-380px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          />
        </div>
      )}
    </div>
  );
};
