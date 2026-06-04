"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

export function SpatialIntelligenceStack() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  const { containerRef, visibleItems } = useStaggerReveal(3, 0.05, 150);

  const features = [
    {
      num: "01",
      title: "Hardware Agnostic",
      desc: "Upload photos/videos from any UAV platform from our plug-and-upload device for instant processing.",
    },
    {
      num: "02",
      title: "Autonomous Pipeline",
      desc: "Auto-generates Orthophotos, DEMs, and 3D Point Clouds.",
    },
    {
      num: "03",
      title: "Spatial AI Native",
      desc: "Every map is indexed for Natural Language Querying, segmentation and object detection.",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container max-w-7xl relative z-10" ref={sectionRef}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 md:mb-20">
          <div>
            <span
              className="editorial-number block mb-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              // TECHNOLOGY
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial uppercase tracking-tight leading-[0.9]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              3D SPATIAL
              <br />
              <em className="italic text-primary">INTELLIGENCE STACK</em>
            </h2>
          </div>
        </div>

        <div
          className="h-px bg-white/10 mb-12 md:mb-16"
          style={{
            transform: isVisible ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        />

        <div ref={containerRef} className="space-y-0">
          {features.map((feature, index) => (
            <div
              key={feature.num}
              className={`group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 p-6 sm:p-8 lg:p-10 border border-white/10 glass-card glass-card-hover ${
                index > 0 ? "border-t-0" : ""
              }`}
              style={{
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index]
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="font-mono text-xs text-primary/60 uppercase tracking-widest shrink-0">
                {feature.num}.
              </span>
              <div>
                <h3 className="text-lg lg:text-xl font-editorial uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-300 mb-2">
                  {feature.title}
                </h3>
                <p className="font-mono text-xs text-white/40 leading-relaxed max-w-lg">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
