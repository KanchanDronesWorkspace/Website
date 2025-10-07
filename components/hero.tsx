"use client"

import Link from "next/link"
import { GL } from "./gl"
import { Button } from "./ui/button"
import { useState } from "react"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  return (
    <div id="home" className="flex flex-col h-svh justify-between relative">
      <GL hovering={hovering} />

      <div className="pb-16 mt-auto text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Aerial Mapping <br />
          <i className="font-light">Redefined</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[600px] mx-auto">
          Precision. Innovation. Excellence.
        </p>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-4 max-w-[700px] mx-auto">
          Transform your projects with cutting-edge drone technology. We deliver professional 3D reconstruction, aerial
          mapping, and photogrammetry services that redefine what's possible from above.
        </p>

        <Link className="contents max-sm:hidden" href="/#contact">
          <Button className="mt-14" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            Contact us
          </Button>
        </Link>
        <Link className="contents sm:hidden" href="/#contact">
          <Button
            size="sm"
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            Contact us
          </Button>
        </Link>
      </div>
    </div>
  )
}
