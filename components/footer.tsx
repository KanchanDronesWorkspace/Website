import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 border-t border-border relative bg-background">
      <div className="container">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          {["Home", "Services", "Showcase", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-sm text-foreground/60 hover:text-foreground/100 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="text-center font-mono text-sm text-foreground/60">
          © {currentYear} Kanchan Drones. All rights reserved. | Aerial Mapping Redefined
        </div>
      </div>
    </footer>
  )
}
