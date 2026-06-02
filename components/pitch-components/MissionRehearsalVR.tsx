"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

export function MissionRehearsalVR() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  const { containerRef, visibleItems } = useStaggerReveal(2, 0.05, 200);

  const vrFeatures = [
    {
      icon: "",
      title: "VR EXPLORATION",
      description: "Immersive 1:1 scale terrain walk-through",
    },
    {
      icon: "",
      title: "ARTILLERY SIM",
      description: "Calculate fire trajectories in 3D",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container max-w-7xl relative z-10" ref={sectionRef}>
        <div className="mb-12 md:mb-20">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial uppercase tracking-tight leading-[0.9]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            MISSION REHEARSAL
            <br />
            <em className="italic text-primary">IN VR</em>
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
          className="relative overflow-hidden border border-white/10 transition-all duration-500 hover:border-primary/20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, border-color 0.5s ease",
          }}
        >
          <div className="p-6 sm:p-8 md:p-12 lg:p-16 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-editorial uppercase tracking-tight text-white mb-6">
              SIMULATE BEFORE DRONE STRIKE
            </h3>

            <p className="font-mono text-xs sm:text-sm text-white/50 leading-relaxed md:leading-loose max-w-2xl mx-auto mb-10">
              Our maps open in VR headsets, allowing commanders to fly drones
              through the battlefield virtually. Soldiers can simulate drone
              visibility and calculate line-of-artillery fire inside the
              photorealistic model.
            </p>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-white/10 max-w-lg mx-auto"
              ref={containerRef}
            >
              {vrFeatures.map((item, index) => (
                <div
                  key={item.title}
                  className={`group p-6 glass-card glass-card-hover
                    ${index === 0 ? "sm:border-r border-white/10 border-b sm:border-b-0" : ""}
                  `}
                  style={{
                    opacity: visibleItems[index] ? 1 : 0,
                    transform: visibleItems[index]
                      ? "translateY(0)"
                      : "translateY(20px)",
                    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <span className="text-xl mb-3 block">{item.icon}</span>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white group-hover:text-primary transition-colors duration-300 mb-2 font-semibold">
                    {item.title}
                  </h4>
                  <p className="font-mono text-[10px] text-white/40 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
