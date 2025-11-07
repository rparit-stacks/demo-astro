import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { MobileCheck } from "@/components/mobile-check"
import { LocationSelector } from "@/components/location-selector"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Anytime Pooja - Your Spiritual Companion",
  description: "Connect with professional astrologers through chat, audio, and video consultations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <MobileCheck />
        <LocationSelector />
        {children}
        <Toaster position="top-center" richColors={true} />
        <Analytics />
      </body>
    </html>
  )
}
