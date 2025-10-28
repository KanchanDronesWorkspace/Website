"use client"

import { Hero } from "@/components/hero"
import { WhyChoose } from "@/components/why-choose"
import { Services } from "@/components/services"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Leva } from "leva"
import { Header } from "@/components/header"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Reset CSS variables to main route values
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      
      // Reset to main route color scheme
      root.style.setProperty('--background', '#000000')
      root.style.setProperty('--foreground', '#ffffff')
      root.style.setProperty('--primary', '#FFC700')
      root.style.setProperty('--primary-foreground', '#ffffff')
      root.style.setProperty('--border', '#424242')
      
      // Remove any blog-specific CSS variables
      root.style.removeProperty('--muted')
      root.style.removeProperty('--muted-foreground')
      root.style.removeProperty('--accent')
      root.style.removeProperty('--accent-foreground')
      root.style.removeProperty('--card')
      root.style.removeProperty('--card-foreground')
    }
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <WhyChoose />
      <Services />
      <ContactSection />
      <Footer />
      <Leva hidden />
    </>
  )
}
