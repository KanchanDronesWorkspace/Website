"use client";

import { Hero } from "@/components/hero";
import { PitchDeck } from "@/components/pitch-deck";
import { WhyChoose } from "@/components/why-choose";
import { Services } from "@/components/services";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Leva } from "leva";
import { Header } from "@/components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AboutSection } from "@/components/about-us";
import { SmoothScroll } from "../components/smooth-scroll";
import { WorkBackground } from "@/components/work-background";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      root.style.setProperty("--background", "#000000");
      root.style.setProperty("--foreground", "#ffffff");
      root.style.setProperty("--primary", "#FFC700");
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.style.setProperty("--border", "#424242");

      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--card");
      root.style.removeProperty("--card-foreground");
    }
  }, []);

  return (
    <SmoothScroll>
      <WorkBackground/>
      <Header />
      <main>
        <Hero />
        <PitchDeck />
        <WhyChoose />
        <Services />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <Leva hidden />
    </SmoothScroll>
  );
}
