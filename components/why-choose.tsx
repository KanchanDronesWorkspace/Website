"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export function WhyChoose() {
  return (
    <section id="features" className="py-20 md:py-32 relative bg-black">
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            Our Platform
          </h2>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-lg transition-all duration-500 hover:border-primary/40 hover:bg-background/70 hover:shadow-[0_20px_60px_rgba(255,199,0,0.1)] p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 rounded-xl overflow-hidden">
            <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg transition-all duration-300 group-hover:border-primary/60" />

                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-sentient text-foreground transition-colors duration-300 group-hover:text-primary/90">
                    AI Fusion Mapper™
                  </h3>

                  <p className="font-mono text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed md:leading-loose">
                    Our AI Fusion Mapper™ transforms raw pixels with our SOTA
                    photogrammetry algorithm to produce visually stunning 3D
                    maps with the sharpest details and highest accuracy.
                  </p>
                </div>

                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-lg transition-all duration-300 group-hover:border-primary/60" />
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[320px] lg:min-h-[450px] overflow-hidden rounded-xl border border-border/30">
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent z-10 lg:block hidden" />

              <video
                src="/assets/red_rock.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent z-10" />
            </div>
          </div>

          <div className="flex justify-center mt-8 md:mt-10">
            <Link href="/work">
              <Button className="px-8">See Other Works</Button>
            </Link>
          </div>

          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
