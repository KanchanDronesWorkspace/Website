"use client"

import { Hero } from "@/components/hero"
import { WhyChoose } from "@/components/why-choose"
import { Services } from "@/components/services"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Leva } from "leva"

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <Services />
      <ContactSection />
      <Footer />
      <Leva hidden />
    </>
  )
}
