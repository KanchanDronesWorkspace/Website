import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"

import { Header } from "@/components/header"
import "./globals.css"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kanchan Drones",
  description: "Aerial Mapping Redefined - Precision. Innovation. Excellence.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  )
}
