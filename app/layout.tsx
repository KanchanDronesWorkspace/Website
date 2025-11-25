import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { NotificationProvider } from "@/lib/contexts/notification-context"
import AuthGuard from "@/components/auth/auth-guard"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kanchan Drones",
  description: "Aerial Mapping Redefined - Precision. Innovation. Excellence.",
  icons: {
    icon: [`/kd.ico`],
    shortcut: [`/kd.ico`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <NotificationProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
