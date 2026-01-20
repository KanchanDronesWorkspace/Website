"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // const navItems = ["Resources", "Platform", "Solution", "Work", "Pricing"];
  const navItems = ["Platform", "Solution", "Work", "Pricing"]; 

  const sectionMap: Record<string, string> = {
    solution: "services",
    platform: "features",
    pricing: "contact",
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetSection = sessionStorage.getItem("scrollToSection");
    if (targetSection && pathname === "/") {
      sessionStorage.removeItem("scrollToSection");
      setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: string
  ) => {
    const lowerItem = item.toLowerCase();

    if (lowerItem === "resources" || lowerItem === "work") {
      return;
    }

    e.preventDefault();
    const sectionId = sectionMap[lowerItem] || lowerItem;

    if (pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      sessionStorage.setItem("scrollToSection", sectionId);
      router.push("/");
    }
  };

  const getHref = (item: string) => {
    const lowerItem = item.toLowerCase();

    if (lowerItem === "resources") {
      return "/blog-resources";
    }
    if (lowerItem === "work") {
      return "/work";
    }

    const sectionId = sectionMap[lowerItem] || lowerItem;

    if (pathname !== "/") {
      return `/#${sectionId}`;
    }
    return `#${sectionId}`;
  };

  return (
    <div className="fixed z-50 pt-4 md:pt-10 top-0 left-0 w-full pointer-events-none">
      <header
        className={`grid grid-cols-[auto_1fr_auto] items-center transition-all duration-300 ease-out pointer-events-auto ${
          scrolled
            ? "mx-auto max-w-7xl backdrop-blur-3xl border border-border rounded-2xl px-6 py-3 shadow-lg"
            : "container"
        }`}
      >
        <Link href="/" className="flex items-center gap-x-4">
          <Image
            src="/assets/kd-logo.svg"
            alt="Kanchan Drones"
            width={60}
            height={60}
            className="w-12 h-12"
          />
          <span className=" text-2xl font-bold text-white font-mono uppercase tracking-tight">
            Kanchan Drones
          </span>
        </Link>
        <nav className="max-lg:hidden flex items-center justify-end gap-x-10">
          {navItems.map((item) => (
            <Link
              className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out"
              href={getHref(item)}
              key={item}
              onClick={(e) => handleNavClick(e, item)}
            >
              {item}
            </Link>
          ))}
          <Link href="/">
            <Button size="sm">Login</Button>
          </Link>
        </nav>
        <MobileMenu className="ml-auto lg:hidden cursor-pointer" />
      </header>
    </div>
  );
};
