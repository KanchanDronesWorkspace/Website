"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

export function DroneAnalyticsBoom() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  const { containerRef, visibleItems } = useStaggerReveal(3, 0.05, 150);

  const stats = [
    { value: "25%", label: "Analytics CAGR" },
    { value: "75%", label: "Domestic Reservation" },
    { value: "3X", label: "Faster than Global Avg." },
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
            // MARKET
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial uppercase tracking-tight leading-[0.9]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            INDIA&apos;S DRONE
            <br />
            <em className="italic text-primary">ANALYTICS BOOM</em>
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
          className="relative overflow-hidden border border-white/10 bg-black p-6 sm:p-8 md:p-12 lg:p-16 mb-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-mono text-[10px] sm:text-xs text-white/50 uppercase tracking-widest w-24 sm:w-32 shrink-0">
                India TAM (2025):
              </span>
              <span className="font-mono text-xs text-primary font-semibold">
                US$ 3.1 Billion
              </span>
            </div>
            <div className="w-full bg-white/5 h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-[1.5s] ease-out"
                style={{
                  width: isVisible ? "50%" : "0%",
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="font-mono text-[10px] sm:text-xs text-white/50 uppercase tracking-widest w-24 sm:w-32 shrink-0">
                India TAM (2030):
              </span>
              <span className="font-mono text-xs text-primary font-semibold">
                US$ 6.2 Billion
              </span>
            </div>
            <div className="w-full bg-white/5 h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-[2s] ease-out delay-300"
                style={{
                  width: isVisible ? "100%" : "0%",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-white/10"
          ref={containerRef}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group text-center p-6 sm:p-8 lg:p-10 glass-card glass-card-hover
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
              <span className="text-3xl sm:text-4xl md:text-5xl font-editorial text-primary block mb-3">
                {stat.value}
              </span>
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
