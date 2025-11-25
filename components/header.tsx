"use client"

import Link from "next/link"
import { MobileMenu } from "@/components/mobile-menu"
import { useEffect, useState } from "react"

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  const navItems = ["Home", "Blog", "Services", "Features", "Contact"]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed z-50 pt-4 md:pt-10 top-0 left-0 w-full pointer-events-none">
      <header
        className={`grid grid-cols-[auto_1fr_auto] items-center transition-all duration-300 ease-out pointer-events-auto ${scrolled
            ? "mx-auto max-w-4xl  backdrop-blur-3xl border border-border rounded-2xl px-6 py-3 shadow-lg"
            : "container"
          }`}
      >
        <Link href="/">
          <div className=" text-2xl font-bold text-white font-mono uppercase tracking-tight">Kanchan Drones</div>
        </Link>
        <nav className="max-lg:hidden flex items-center justify-center gap-x-10">
          {navItems.map((item) => (
            <Link
              className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out"
              href={`${item.toLowerCase() === "blog" ? "/blog" : `#${item.toLowerCase()}`}`}
              key={item}
            >
              {item}
            </Link>
          ))}
        </nav>
        <MobileMenu />
      </header>
    </div>
  )
}
