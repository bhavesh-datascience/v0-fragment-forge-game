import { GameProvider } from "@/components/game-context"
import { Suspense } from "react"
import { Orbitron, Rajdhani } from "next/font/google"
import TechBg from "@/components/tech-bg"
import BackgroundVideo from "@/components/background-video"

export const metadata: Metadata = {
@@ -37,8 +36,17 @@ export default function RootLayout({
<html lang="en" className={`dark antialiased ${sourceSans.variable} ${playfair.variable} ${GeistMono.variable}`}>
<body className="font-sans">
<BackgroundVideo />
        <TechBg opacity={0.85} />
        {/* The main div that creates the grid background */}
<div className="ff-hud-bg min-h-screen">
          {/* --- NEW HUD OVERLAY ELEMENTS --- */}
          <div className="hud-overlay">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
          </div>
          {/* --- END OF NEW ELEMENTS --- */}

<Suspense fallback={<div>Loading...</div>}>
<GameProvider>{children}</GameProvider>
</Suspense>
