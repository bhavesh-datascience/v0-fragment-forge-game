import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { GameProvider } from "@/components/game-context"
import { Suspense } from "react"
import { Orbitron, Rajdhani } from "next/font/google"
import TechBg from "@/components/tech-bg"
import BackgroundVideo from "@/components/background-video"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

const playfair = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
})
const sourceSans = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-sans",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark antialiased ${sourceSans.variable} ${playfair.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <BackgroundVideo />
        <TechBg opacity={0.85} />
        <div className="ff-hud-bg min-h-screen">
          <Suspense fallback={<div>Loading...</div>}>
            <GameProvider>{children}</GameProvider>
          </Suspense>
          <Analytics />
        </div>
      </body>
    </html>
  )
}
