import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 border-t border-border relative bg-background">
      <div className="container">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          {["Home", "Services", "Blog", "Contact"].map((item) => (
            <Link
              key={item}
              href={`${item.toLowerCase() === "blog" ? "/blog" : `#${item.toLowerCase()}`}`}
              className="font-mono text-sm text-foreground/60 hover:text-foreground/100 transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="text-center font-mono text-sm text-foreground/60">
          © {currentYear} Kanchan Drones | <a href="mailto:info@kanchandrones.com">info@kanchandrones.com</a> | All rights reserved | Made in India
        </div>
      </div>
    </footer>
  )
}
