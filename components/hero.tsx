"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";

const videos = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
];

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    video.addEventListener("ended", handleVideoEnd);
    return () => video.removeEventListener("ended", handleVideoEnd);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play();
    }
  }, [currentVideoIndex]);

  return (
    <div
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden pt-20"
    >
      <div className="container relative z-10 flex items-center justify-between py-6 sm:py-12">
        <div
          className={`transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="editorial-number">01 — SPATIAL OVERVIEW</span>
        </div>
        <div
          className={`flex items-center gap-4 transition-all duration-1000 delay-500 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">
              ACTIVE PIPELINE
            </span>
          </div>
        </div>
      </div>

      <main className="container relative z-10 flex-1 flex flex-col items-center justify-center pb-24 text-center">
        <div className="mb-16">
          <h1
            className={`font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] uppercase tracking-tighter leading-[0.8] mb-4 sm:mb-8 transition-all duration-1000 ease-out p-2
              ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
          >
            SPATIAL
            <br />
            <em className="italic text-primary glow-text">INTELLIGENCE</em>
          </h1>
          <p
            className={`font-mono text-xs sm:text-sm uppercase tracking-[0.4em] text-white/40 max-w-2xl mx-auto transition-all duration-1000 delay-500
              ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Converting raw pixel data into queryable 3D environments
          </p>
        </div>

        <div
          className={`w-full max-w-6xl relative transition-all duration-1000 delay-700
            ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl sm:rounded-3xl overflow-hidden glass border border-white/10 group shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            >
              <source src={videos[currentVideoIndex]} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] sm:text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  CURRENT FEED
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-white/70 uppercase tracking-widest">
                  CHANNEL {String(currentVideoIndex + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 hidden md:flex items-center gap-8">
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">
                  PIPELINE PHASE
                </span>
                <span className="text-xs font-mono text-primary uppercase tracking-widest block">
                  RECONSTRUCTION
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="inline-block mt-8">
          <Button
            size="sm"
            className="mt-0"
            onClick={(e) => {
              e.preventDefault();
              const contactSection = document.getElementById("contact");
              if (contactSection) {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo(contactSection);
                } else {
                  contactSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }
            }}
          >
            Request Demo
          </Button>
        </div>
      </main>
    </div>
  );
}
