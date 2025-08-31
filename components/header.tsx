"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useGame } from "./game-context"
import { Button } from "@/components/ui/button"

function formatDuration(ms: number) {
  const sec = Math.floor(ms / 1000)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function Header() {
  const { gameName, tagline, state } = useGame()
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const elapsed = useMemo(() => {
    if (!state.startTime) return "00:00:00"
    const start = new Date(state.startTime).getTime()
    const end = state.endTime ? new Date(state.endTime).getTime() : now
    return formatDuration(end - start)
  }, [state.startTime, state.endTime, now])

  return (
    <header className="w-full border-b border-border bg-background/80 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="group">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-md bg-card ring-2 ring-primary/40 shadow-sm">
              <span className="absolute inset-0 rounded-md" aria-hidden />
              <span
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow"
                aria-hidden
              />
            </div>
            <div>
              <div className="font-semibold text-balance font-serif">{gameName}</div>
              <div className="text-xs text-muted-foreground">{tagline}</div>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <div className="text-sm">
            <div className="text-muted-foreground">Team</div>
            <div className="font-medium">{state.teamName || "-"}</div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Timer</div>
            <div className="font-medium tabular-nums">{elapsed}</div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Score</div>
            <div className="font-medium">{state.score}</div>
          </div>
          <Link href="/results">
            <Button variant="outline" className="border-primary text-foreground hover:bg-primary/10 bg-transparent">
              Results
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
