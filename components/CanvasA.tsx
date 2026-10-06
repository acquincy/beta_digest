import React from "react";

export const CanvasA: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        backgroundColor: "#F2F3F8",
      }}
    >
      {/* Radial Gradient Layers */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(60% 55% at 100% 35%, #DDA6DC 0%, rgba(221,166,220,0) 100%),
            radial-gradient(50% 40% at 95% 100%, #E4F29A 0%, rgba(228,242,154,0) 100%),
            radial-gradient(70% 90% at 0% 40%, #FFFFFF 0%, rgba(255,255,255,0) 100%)
          `,
        }}
      />

      {/* Left-side huge soft grey arcs: 1500px circle behind at 40% opacity, 1100px circle in front */}
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
    </div>
  );
};
