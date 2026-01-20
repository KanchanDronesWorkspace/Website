"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu = ({ className }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    "Home",
    // "Resources",
    "Solution",
    "Platform",
    "Work",
    "Pricing",
  ];

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
    setIsOpen(false);

    if (lowerItem === "resources" || lowerItem === "work") {
      return;
    }

    e.preventDefault();
    const sectionId = sectionMap[lowerItem] || lowerItem;

    if (pathname === "/") {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
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
    <Dialog.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "group lg:hidden p-2 text-foreground transition-colors",
            className
          )}
          aria-label="Open menu"
        >
          <Menu className="group-[[data-state=open]]:hidden" size={24} />
          <X className="hidden group-[[data-state=open]]:block" size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div
          data-overlay="true"
          className="fixed z-30 inset-0 bg-black/50 backdrop-blur-sm"
        />

        <Dialog.Content
          onInteractOutside={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.dataset.overlay !== "true"
            ) {
              e.preventDefault();
            }
          }}
          className="fixed top-0 left-0 w-full z-40 py-28 md:py-40"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <nav className="flex flex-col space-y-6 container mx-auto">
            {navItems.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                onClick={(e) => handleNavClick(e, item)}
                className="text-xl font-mono uppercase text-foreground/60 transition-colors ease-out duration-150 hover:text-foreground/100 py-2"
              >
                {item}
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
