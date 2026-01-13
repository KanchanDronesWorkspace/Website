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
  const [hovering, setHovering] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    video.addEventListener("ended", handleVideoEnd);
    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
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
      className="flex flex-col h-svh justify-between relative overflow-hidden"
    >
    <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{
            imageRendering: "auto",
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="pb-16 mt-auto text-center relative z-10 bg-gradient-to-b from-muted/80 to-transparent">
        <h1 className="text-7xl sm:text-6xl md:text-7xl font-sentient text-white">
          Spatial Intelligence <br />
          <i className="font-sentient not-italic">Redefined</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-white/80 text-balance mt-4 max-w-[700px] mx-auto">
          Transform pixels into survey-grade spatial 3D models with AI insights.
        </p>
        <div
          className="inline-block max-sm:hidden"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Link href="/#contact">
            <Button className="mt-14">Request Demo</Button>
          </Link>
        </div>
        <div
          className="inline-block sm:hidden"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Link href="/#contact">
            <Button size="sm" className="mt-14">
              Request Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
