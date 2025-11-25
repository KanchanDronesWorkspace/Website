"use client"

import Link from "next/link"
import { MobileMenu } from "@/components/mobile-menu"

export const BlogHeader = () => {
  const navItems = [
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contact",
      href: "/#contact",
    },
  ]

  return (
    <div className="z-50 pt-2 w-full pointer-events-none no-grain">
      <header className="flex justify-between items-center transition-all duration-300 ease-out pointer-events-auto mx-auto  bg-background/80 backdrop-blur-md px-6 py-3 ">
        <Link href="/">
          <div className=" text-2xl font-bold text-white font-mono uppercase tracking-tight">Kanchan Drones</div>
        </Link>
        <nav className="max-lg:hidden flex items-center gap-x-10">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <MobileMenu />
      </header>
    </div>
  )
}
