import React from "react";

export const CanvasA: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#0a0a0a]"
    >
      {/* Radial Gradient Ambient Highlights */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(80% 50% at 50% 0%, rgba(107, 98, 242, 0.16) 0%, transparent 60%),
            radial-gradient(60% 45% at 90% 80%, rgba(107, 98, 242, 0.08) 0%, transparent 60%),
            radial-gradient(50% 40% at 10% 40%, rgba(107, 98, 242, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Hairline geometric background arcs */}
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
          top: "50px",
          border: "1px solid rgba(255, 255, 255, 0.025)",
        }}
      />

      {/* Right side ambient hairline circle */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "800px",
          height: "800px",
          right: "-200px",
          top: "10%",
          border: "1px solid rgba(255, 255, 255, 0.03)",
          background: "radial-gradient(circle, rgba(107, 98, 242, 0.05) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};
