"use client";

export function WorkBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient orbs - 3 orbs only */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,199,0,0.25) 0%, rgba(255,199,0,0.1) 40%, transparent 70%)",
          top: "-30%",
          left: "-20%",
          animation: "float1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,199,0,0.2) 0%, rgba(255,199,0,0.08) 40%, transparent 70%)",
          bottom: "-15%",
          right: "-10%",
          animation: "float2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[60px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,199,0,0.18) 0%, rgba(255,199,0,0.05) 50%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "pulse 15s ease-in-out infinite",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,199,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,199,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          25% {
            transform: translate(60px, 40px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(30px, 80px) scale(1.05);
            opacity: 1;
          }
          75% {
            transform: translate(-40px, 40px) scale(0.95);
            opacity: 0.9;
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          25% {
            transform: translate(-50px, -40px) scale(1.15);
            opacity: 0.85;
          }
          50% {
            transform: translate(-20px, -60px) scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(30px, -30px) scale(0.9);
            opacity: 0.9;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
