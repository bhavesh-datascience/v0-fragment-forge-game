"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useGame } from "@/components/game-context"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()
  const { gameName, tagline, state, setTeamName, startGame } = useGame()
  const [localTeam, setLocalTeam] = useState(state.teamName ?? "")

  const handleStart = () => {
    const name = localTeam.trim()
    if (!name) return
    setTeamName(name)
    startGame()
    router.push("/game/1")
  }

  return (
    <main className="min-h-screen ff-hero-gradient text-foreground relative">
      {/* <TechBg opacity={0.75} /> */}
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card className="relative mx-auto w-full rounded-2xl bg-card/60 backdrop-blur-md ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
          <CardHeader className="text-center">
            {/* badge */}
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[rgba(255,184,0,0.2)] ring-1 ring-[rgba(255,184,0,0.4)] shadow-[0_0_20px_rgba(255,184,0,0.35)]">
              <span className="text-yellow-300 text-lg">✦</span>
            </div>
            {/* use tech heading font via font-serif (Orbitron mapped to --font-playfair) */}
            <CardTitle className="text-3xl font-semibold font-serif tracking-wide">{gameName}</CardTitle>
            <CardDescription className="mt-1 font-medium text-yellow-300/90">
              Where the first piece of the ultimate code is shaped.
            </CardDescription>
            <p className="mt-3 text-sm text-muted-foreground max-w-prose mx-auto">{tagline}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="block text-sm font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="opacity-80">Team Name</span>
              </span>
              <input
                autoFocus
                type="text"
                value={localTeam}
                onChange={(e) => setLocalTeam(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleStart()
                  }
                }}
                placeholder="Enter your team name..."
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(168,85,247,0.6)]"
              />
            </label>
            <Button
              type="button"
              className="ff-btn-primary h-12 w-full cursor-pointer bg-foreground/90 text-background hover:bg-foreground active:bg-foreground/80 font-semibold tracking-wide"
              disabled={!localTeam.trim()}
              onClick={handleStart}
            >
              {/* simple play icon */}
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="mr-2">
                <path fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
              Begin Your Quest
            </Button>

            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-center font-semibold text-yellow-300 mb-2">Game Rules</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Answer correctly: +5 points</li>
                <li>Answer incorrectly on trap doors: -5 points</li>
                <li>50 doors across 10 chambers</li>
                <li>Unlock chambers as you progress</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
