"use client"

import { usePathname } from "next/navigation"

export default function BackgroundVideo() {
  const pathname = usePathname()
  const show = pathname === "/" || pathname?.startsWith("/game/")
  if (!show) return null

  return (
    <div className="ff-bg-video" aria-hidden="true">
      <video
        className="h-full w-full object-cover"
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/700_F_1642857695_IGqHn4CofTWj0wlvpNMn1F9fOjAx3zbM_ST-0h3vtYmDYVpsiOFN49ZDpi1UHsrEYT.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* gradient vignette + scanline for readability and motion */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,0,0,0.25),rgba(0,0,0,0.8))]" />
      <div className="ff-video-scan" />
    </div>
  )
}
