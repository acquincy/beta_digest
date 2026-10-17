import React from "react";

export interface CanvasBProps {
  showConcentricCircles?: boolean;
}

export const CanvasB: React.FC<CanvasBProps> = ({ showConcentricCircles = true }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0a0a0a]"
    >
      {/* Ambient Horizon & Dusk Spotlight Glow */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(120% 60% at 50% -10%, rgba(107, 98, 242, 0.22) 0%, rgba(79, 70, 229, 0.12) 35%, rgba(6, 182, 212, 0.04) 55%, transparent 75%),
            radial-gradient(75% 50% at 85% 25%, rgba(107, 98, 242, 0.14) 0%, transparent 60%),
            radial-gradient(60% 60% at 15% 65%, rgba(107, 98, 242, 0.07) 0%, transparent 70%)
          `,
        }}
      />

      {/* Subtle hairline geometric arcs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "1400px",
          height: "1400px",
          left: "-500px",
          top: "-200px",
          border: "1px solid rgba(255, 255, 255, 0.03)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "1000px",
          height: "1000px",
          left: "-300px",
          top: "0px",
          border: "1px solid rgba(255, 255, 255, 0.025)",
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
          background: "radial-gradient(circle, rgba(107, 98, 242, 0.08) 0%, transparent 70%)",
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
              border: "1px solid rgba(255, 255, 255, 0.04)",
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
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          />
        </div>
      )}
    </div>
  );
};
