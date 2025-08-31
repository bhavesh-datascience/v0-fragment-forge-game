"use client"

import { useEffect, useMemo } from "react"
import Header from "@/components/header"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

function download(filename: string, data: string) {
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function ResultsPage() {
  const { state, sessionJson, resetGame } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!state.teamName || !state.startTime) {
      router.replace("/")
    }
  }, [router, state.teamName, state.startTime])

  const duration = useMemo(() => {
    if (!state.startTime) return 0
    const start = new Date(state.startTime).getTime()
    const end = state.endTime ? new Date(state.endTime).getTime() : Date.now()
    return Math.max(0, end - start)
  }, [state.startTime, state.endTime])

  const hms = (() => {
    const sec = Math.floor(duration / 1000)
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  })()

  const handleDownload = () => {
    const json = sessionJson()
    download(`fragment-forge-session-${state.teamName || "team"}.json`, JSON.stringify(json, null, 2))
  }

  const handleNewGame = () => {
    resetGame()
    router.replace("/")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-semibold font-serif">Results</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-muted-foreground text-sm">Team</div>
            <div className="text-lg font-medium">{state.teamName || "-"}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-muted-foreground text-sm">Score</div>
            <div className="text-lg font-medium">{state.score}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-muted-foreground text-sm">Duration</div>
            <div className="text-lg font-medium tabular-nums">{hms}</div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button onClick={handleDownload}>Download Session JSON</Button>
          <Button variant="outline" onClick={handleNewGame} className="hover:bg-primary/10 bg-transparent">
            New Game
          </Button>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold font-serif">Answer Summary</h3>
          <div className="mt-3 grid gap-2">
            {state.answers.map((a, idx) => {
              const label = `Room ${a.room} • Door ${a.door}`
              return (
                <div key={idx} className="rounded border border-border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{label}</div>
                    <div
                      className={[
                        "font-semibold",
                        a.correct ? "text-green-400" : a.doorType === "trap" ? "text-red-400" : "text-foreground",
                      ].join(" ")}
                    >
                      {a.correct ? "+5" : a.doorType === "trap" ? "-5" : "0"}
                    </div>
                  </div>
                  <div className="mt-1">{a.prompt}</div>
                  <ul className="mt-1 list-disc pl-5">
                    {a.options.map((opt, i) => {
                      const isCorrect = i === a.correctIndex
                      const isSelected = i === a.selectedIndex
                      return (
                        <li key={i}>
                          <span className={isCorrect ? "font-medium text-primary" : ""}>{opt}</span>
                          {isSelected && (
                            <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                              chosen
                            </span>
                          )}
                          {isCorrect && (
                            <span className="ml-2 rounded bg-green-400/30 px-1.5 py-0.5 text-xs text-foreground">
                              correct
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
