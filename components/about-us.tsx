"use client";

import Image from "next/image";
import { useScrollReveal, useStaggerReveal } from "@/hooks/use-scroll-reveal";

export function AboutSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);
  const { containerRef, visibleItems } = useStaggerReveal(3, 0.1, 150);

  const partnerships = [
    {
      name: "IIT Delhi",
      logo: "/iitd-logo.png",
      description: "Incubated at India's premier technology institute",
    },
    {
      name: "University of Maryland",
      logo: "/umd-logo.png",
      description: "Core team expertise from UMD, USA",
    },
    {
      name: "Boeing",
      logo: "/boieng-logo.png",
      description: "Industry experience from global aerospace leader",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 relative">
      <div className="container max-w-7xl relative" ref={sectionRef}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <span
              className="editorial-number block mb-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              04 — ABOUT
            </span>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial uppercase tracking-tight leading-[0.9]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              ABOUT
              <br />
              <em className="italic text-primary">US</em>
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

        <div
          className="relative overflow-hidden border border-white/10 bg-black transition-all duration-500 hover:border-primary/20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, border-color 0.5s ease",
          }}
        >
          <div className="p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="relative mb-16 max-w-3xl">
              <p className="font-mono text-sm sm:text-base text-white/60 leading-relaxed md:leading-loose">
                We are a{" "}
                <span className="text-primary font-semibold">
                  deep-tech startup
                </span>{" "}
                from <span className="text-white">IIT Delhi</span>, with core
                team from{" "}
                <span className="text-white">
                  IIT, UMD (University of Maryland, USA) and Boeing.
                </span>{" "}
                Our focus is on advancing the{" "}
                <span className="text-primary font-semibold">
                  state of the art
                </span>{" "}
                in aerial photogrammetry, powered by our proprietary AI-driven
                algorithms. By leveraging cutting-edge artificial intelligence,
                we aim to deliver precise, scalable, and innovative geospatial
                solutions.
              </p>
            </div>

            <div className="h-px bg-white/10 mb-12" />

            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-0"
              ref={containerRef}
            >
              {partnerships.map((partner, index) => (
                <div
                  key={partner.name}
                  className={`group/card flex flex-col items-center p-6 sm:p-8 lg:p-10 glass-card glass-card-hover ${
                    index < 2 ? "sm:border-r border-white/10" : ""
                  } ${index < 2 ? "border-b sm:border-b-0 border-white/10" : ""}`}
                  style={{
                    opacity: visibleItems[index] ? 1 : 0,
                    transform: visibleItems[index]
                      ? "translateY(0)"
                      : "translateY(20px)",
                    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-5 flex items-center justify-center bg-white border border-white/20 transition-all duration-300 group-hover/card:border-primary/40">
                    <Image
                      src={partner.logo}
                      height={80}
                      width={80}
                      alt={`${partner.name} Logo`}
                      className="object-contain w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 transition-transform duration-300 group-hover/card:scale-105"
                    />
                  </div>

                  <h3 className="font-mono text-xs lg:text-sm text-white/70 font-medium text-center uppercase tracking-widest transition-colors duration-300 group-hover/card:text-primary">
                    {partner.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
