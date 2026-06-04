"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function MappingAsAService() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-10 md:py-16 relative">
      <div className="container max-w-7xl relative z-10" ref={sectionRef}>
        <div
          className="relative overflow-hidden border border-white/10 transition-all duration-500 hover:border-primary/20 p-6 sm:p-10 md:p-16 lg:p-20 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, border-color 0.5s ease",
          }}
        >
          <span className="editorial-number block mb-4">STRATEGIC PIVOT</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial uppercase tracking-tight text-primary leading-[0.95] mb-6">
            MAPPING-AS-A-SERVICE
          </h2>
          <p className="font-mono text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl mx-auto mb-8">
            We don&apos;t build the drones. We build the brains.
          </p>

          <div className="w-16 h-px bg-white/20 mx-auto mb-8" />

          <p className="font-mono text-xs sm:text-sm text-white/40 leading-relaxed max-w-xl mx-auto">
            Kanchan Drones is a software-first 3D Intelligence layer. We process
            mission data into photorealistic, AI-queryable digital twins.
          </p>
        </div>
      </div>
    </section>
  );
}
