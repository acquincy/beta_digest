import React from "react";

export interface CanvasBProps {
  showConcentricCircles?: boolean;
}

export const CanvasB: React.FC<CanvasBProps> = ({ showConcentricCircles = true }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        backgroundColor: "#F2F3F8",
      }}
    >
      {/* Lime glow & pink wash */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(70% 80% at 60% 45%, #E9FF9E 0%, #DDFB6E 45%, #D3F566 100%),
            radial-gradient(40% 30% at 100% 100%, rgba(230, 180, 230, 0.6), transparent),
            radial-gradient(70% 90% at 0% 40%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)
          `,
        }}
      />

      {/* Left side grey arcs: 1500px at 40% opacity, 1100px circle */}
      <div
        className="absolute rounded-full"
        style={{
          width: "1500px",
          height: "1500px",
          left: "-620px",
          top: "calc(10% - 200px)",
          background: "linear-gradient(160deg, #E4E4E8, #F7F7FA)",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "1100px",
          height: "1100px",
          left: "-420px",
          top: "10%",
          background: "linear-gradient(160deg, #E4E4E8, #F7F7FA)",
        }}
      />

      {/* Right side circle: 900px at right:-300px, top:-100px */}
      <div
        className="absolute rounded-full"
        style={{
          width: "900px",
          height: "900px",
          right: "-300px",
          top: "-100px",
          background: "rgba(255, 255, 255, 0.18)",
        }}
      />

      {/* 2 concentric white circles (radius 520px at 18% opacity, radius 380px at 22%) centered behind message cards */}
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
          {/* Outer circle: radius 520px -> diameter 1040px */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "1040px",
              height: "1040px",
              top: "-520px",
              left: "-520px",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
            }}
          />
          {/* Inner circle: radius 380px -> diameter 760px */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "760px",
              height: "760px",
              top: "-380px",
              left: "-380px",
              border: "1.5px solid rgba(255, 255, 255, 0.22)",
            }}
          />
        </div>
      )}
    </div>
  );
};
