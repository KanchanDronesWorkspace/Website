"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

  const footerItems = [
    "Home",
    // "Resources",
    "Platform",
    "Solution",
    "Work",
    "Pricing",
  ];

  // Map nav items to actual section IDs (same as header)
  const sectionMap: Record<string, string> = {
    home: "home",
    solution: "services",
    platform: "features",
    pricing: "contact",
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: string
  ) => {
    const lowerItem = item.toLowerCase();

    // Skip for page routes
    if (lowerItem === "resources" || lowerItem === "work") {
      return;
    }

    e.preventDefault();
    const sectionId = sectionMap[lowerItem] || lowerItem;

    if (pathname === "/") {
      // Same page - smooth scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Different route - store target and navigate
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
    <footer className="py-12 border-t border-border relative bg-background">
      <div className="container">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          {footerItems.map((item) => (
            <Link
              key={item}
              href={getHref(item)}
              onClick={(e) => handleNavClick(e, item)}
              className="font-mono text-sm text-foreground/60 hover:text-foreground/100 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="text-center font-mono text-sm text-foreground/60">
          © {currentYear} Kanchan Drones |{" "}
          <a href="mailto:info@kanchandrones.com">info@kanchandrones.com</a> |
          All rights reserved | Made in India
        </div>
      </div>
    </footer>
  );
}
