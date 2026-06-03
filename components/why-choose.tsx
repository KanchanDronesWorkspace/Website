"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function WhyChoose() {
  const { ref: sectionRef, isVisible } = useScrollReveal(0.1);

  return (
    <section id="features" className="py-16 sm:py-24 md:py-40 relative">
      <div className="container max-w-7xl relative z-10" ref={sectionRef}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 md:mb-20">
          <div>
            <span
              className="editorial-number block mb-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              02 — PLATFORM
            </span>
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial uppercase tracking-tight leading-[0.9]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              OUR
              <br />
              <em className="italic text-primary">PLATFORM</em>
            </h2>
          </div>
          <div
            className="hidden md:block max-w-xs text-right"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest leading-relaxed">
              Proprietary AI-driven photogrammetry engine powering the next
              generation of spatial computing
            </p>
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
          className="relative overflow-hidden border border-white/10 bg-black transition-all duration-500 hover:border-primary/30"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, border-color 0.5s ease",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="relative">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-editorial uppercase tracking-tight text-white mb-6 leading-[0.95]">
                  AI FUSION
                  <br />
                  <em className="italic text-primary">MAPPER™</em>
                </h3>

                <p className="font-mono text-xs sm:text-sm text-white/50 leading-relaxed md:leading-loose max-w-md">
                  Our AI Fusion Mapper™ transforms raw pixels with our SOTA
                  photogrammetry algorithm to produce visually stunning 3D maps
                  with the sharpest details and highest accuracy.
                </p>
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[220px] sm:min-h-[320px] lg:min-h-[450px] overflow-hidden">
              <video
                src="/assets/red_rock.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute bottom-4 right-4 z-10">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Real-time render
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6 md:p-8 flex items-center justify-between">
            <span className="font-mono text-xs text-white/30 uppercase tracking-widest hidden sm:block">
              Explore our work
            </span>
            <Link href="/work">
              <Button size="sm">See Other Works</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
