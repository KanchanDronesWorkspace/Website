"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function PhotorealisticMaps() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

  const bulletPoints = [
    "1:1 Scale Accuracy",
    "Light-field preservation",
    "Immersive tactical rehearsal",
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
            PHOTOREALISTIC
            <br />
            <em className="italic text-primary">MAPS</em>
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
          <div className="p-6 sm:p-8 md:p-12 lg:p-16">
            <h3 className="text-lg sm:text-xl md:text-2xl font-mono text-primary mb-6 tracking-wide">
              High-fidelity with Millions of Gaussians
            </h3>

            <p className="font-mono text-xs sm:text-sm text-white/50 leading-relaxed md:leading-loose max-w-2xl mb-8">
              Move beyond clinical wireframes. Our pipeline uses proprietary
              research in Gaussian Splatting Scene Representation to create
              &quot;film-quality&quot; digital twins of target areas.
            </p>

            <ul className="space-y-3 mb-8">
              {bulletPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 font-mono text-xs text-white/50"
                >
                  <span className="text-primary">—</span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 pt-6 mt-8">
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest text-center">
                This is not a drone video! It&apos;s 3D rendering of these
                millions of gaussian primitives
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
