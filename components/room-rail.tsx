"use client"

import { useRouter, usePathname } from "next/navigation"
import { useMemo } from "react"

function RoomIcon({ active }: { active?: boolean }) {
  const c = active ? "fill-primary/80" : "fill-primary/30"
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className={`mr-2 ${c}`}>
      <circle cx="12" cy="12" r="6" opacity="0.35" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function RoomRail() {
  const router = useRouter()
  const pathname = usePathname()
  const current = useMemo(() => {
    const m = pathname?.match(/\/game\/(\d+)/)
    return m ? Number(m[1]) : 1
  }, [pathname])

  return (
    <nav aria-label="Rooms" className="fixed left-3 top-24 z-20 hidden md:flex flex-col gap-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
        const active = current === num
        return (
          <button
            key={num}
            type="button"
            onClick={() => router.push(`/game/${num}`)}
            aria-current={active ? "page" : undefined}
            className={`group inline-flex items-center rounded-md px-3 py-2 text-sm transition
              ${active ? "bg-primary/10 text-primary ring-1 ring-primary" : "bg-black/40 text-foreground/80 hover:text-foreground"}
              border border-border/60 shadow-[inset_0_0_8px_rgba(0,200,255,0.15),0_0_12px_rgba(0,200,255,0.08)]`}
          >
            <RoomIcon active={active} />
            {`R${num}`}
          </button>
        )
      })}
    </nav>
  )
}
