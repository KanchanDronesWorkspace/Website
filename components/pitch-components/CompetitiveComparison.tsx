"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CompetitiveComparison() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

  const capabilities = [
    "Photo-realistic Maps",
    "GPS-Denied Mapping",
    "Spatial AI Querying",
    "VR Simulation",
  ];

  const competitors = [
    { name: "KANCHAN DRONES", values: [true, true, true, true] },
    { name: "Pix4D (GLOBAL)", values: [false, false, false, false] },
    { name: "IdeaForge (LOCAL)", values: [false, false, false, false] },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container max-w-7xl relative z-10" ref={sectionRef}>
        <div className="mb-12 md:mb-20">
          <span
            className="editorial-number block mb-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            // COMPETITIVE EDGE
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial uppercase tracking-tight leading-[0.9]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            WHERE WE
            <br />
            <em className="italic text-primary">STAND APART</em>
          </h2>
        </div>

        <div
          className="h-px bg-white/10 mb-12 md:mb-16"
          style={{
            transform: isVisible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        />

        <div
          className="relative overflow-hidden border border-white/10 bg-black overflow-x-auto"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <table className="w-full min-w-[420px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 md:p-6 font-mono text-[10px] sm:text-xs text-white/30 uppercase tracking-widest">
                  Capability
                </th>
                {competitors.map((comp) => (
                  <th
                    key={comp.name}
                    className={`text-center p-4 md:p-6 font-mono text-[10px] sm:text-xs uppercase tracking-widest ${
                      comp.name === "KANCHAN DRONES"
                        ? "text-primary"
                        : "text-white/30"
                    }`}
                  >
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((cap, capIndex) => (
                <tr
                  key={cap}
                  className={`${
                    capIndex < capabilities.length - 1
                      ? "border-b border-white/10"
                      : ""
                  } transition-colors duration-300 hover:bg-white/[0.02]`}
                >
                  <td className="p-4 md:p-6 font-mono text-xs text-white/50">
                    {cap}
                  </td>
                  {competitors.map((comp) => (
                    <td key={comp.name} className="text-center p-4 md:p-6">
                      {comp.values[capIndex] ? (
                        <span className="text-primary text-xs font-bold font-mono tracking-tighter">
                          YES
                        </span>
                      ) : (
                        <span className="text-red-500/60 text-xs font-bold font-mono tracking-tighter">
                          NO
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
