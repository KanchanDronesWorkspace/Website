import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "@/app/blog-resources/globals.css"
import { Toaster } from "@/components/ui/sonner"
import { BlogHeader } from "@/components/blog/blog-header"
import { Footer } from "@/components/footer"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Blog | Kanchan Drones",
  description: "A blog showcasing drone technology and applications.",
}

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`} suppressHydrationWarning>
       <BlogHeader />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
