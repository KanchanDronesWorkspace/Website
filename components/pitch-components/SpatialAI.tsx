"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

export function SpatialAI() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  const { containerRef, visibleItems } = useStaggerReveal(3, 0.05, 150);

  const capabilities = [
    {
      icon: "",
      title: "NATURAL QUERY",
      description:
        '"Locate all cars in Zone B." AI segments objects directly within the 3DGS environment.',
    },
    {
      icon: "",
      title: "AUTO-DETECTION",
      description:
        '"Draw bounding boxes over solar panels." 2D/3D dual-layer annotation for rapid logistics.',
    },
    {
      icon: "",
      title: "ANOMALY DETECTION",
      description:
        "Identify what changed in the scene in time-critical scenarios.",
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
            SPATIAL AI:
            <br />
            <em className="italic text-primary">THE TALKING MAP</em>
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-white/10"
          ref={containerRef}
        >
          {capabilities.map((item, index) => (
            <div
              key={item.title}
              className={`group relative p-6 sm:p-8 lg:p-10 glass-card glass-card-hover
                ${index < 2 ? "sm:border-r border-white/10" : ""}
                ${index < 2 ? "border-b sm:border-b-0 border-white/10" : ""}
              `}
              style={{
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index]
                  ? "translateY(0)"
                  : "translateY(30px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="text-2xl mb-4 block">{item.icon}</span>
              <h3 className="text-sm lg:text-base font-mono uppercase tracking-widest text-white group-hover:text-primary transition-colors duration-300 mb-3 font-semibold">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-white/40 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
