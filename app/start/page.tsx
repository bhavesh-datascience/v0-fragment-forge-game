"use client"

import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StartPage() {
  const router = useRouter()
  const { state } = useGame()

  // If the user lands here without a team name, redirect them back to the home page.
  useEffect(() => {
    if (!state.teamName) {
      router.replace("/")
    }
  }, [state.teamName, router])

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      {/* This panel is inspired by the game page UI. 
        It uses the "frosted glass" effect with a semi-transparent background and backdrop blur.
      */}
      <div className="relative w-full max-w-2xl text-center rounded-2xl bg-card/50 p-8 backdrop-blur-lg ring-1 ring-white/10 shadow-2xl shadow-primary/10">
        
        {/* We use the 'font-serif' class which maps to the Orbitron "tech" font for the main title */}
        <h1 className="font-serif text-4xl font-bold tracking-widest text-primary animate-pulse">
          MISSION BRIEFING
        </h1>

        <p className="mt-4 text-lg text-yellow-300/90">
          Welcome, Team <span className="font-bold">{state.teamName || "Valiant"}</span>
        </p>

        <p className="mt-6 max-w-prose mx-auto text-muted-foreground">
          Your objective is critical. You must navigate through 10 chambers and solve the challenges behind 50 doors to assemble the key fragments. The fate of the system rests on your ability to forge the ultimate code. Prepare for your quest.
        </p>

        <div className="mt-8">
          <Link href="/game/1" legacyBehavior>
            <Button
              size="lg"
              className="ff-btn-primary h-14 cursor-pointer bg-foreground/90 px-10 text-lg font-semibold tracking-wide text-background shadow-lg shadow-primary/20 hover:bg-foreground active:bg-foreground/80"
            >
              Start Mission
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
