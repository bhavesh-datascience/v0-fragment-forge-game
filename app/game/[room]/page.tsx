"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Door from "@/components/door"
import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import TechBg from "@/components/tech-bg"

const DOOR_COLORS = ["#00e5ff", "#39ff14", "#ff4dff", "#ff2b2b", "#ffa600"] as const

export default function RoomPage() {
  const params = useParams<{ room: string }>()
  const roomNum = Math.max(1, Math.min(10, Number(params.room || 1)))
  const { state, questions, finishGame, maxRoomUnlocked } = useGame()
  const router = useRouter()

  useEffect(() => {
    if (!state.teamName || !state.startTime) {
      router.replace("/")
    }
  }, [router, state.teamName, state.startTime])

  useEffect(() => {
    if (maxRoomUnlocked > 0 && roomNum > maxRoomUnlocked) {
      router.replace(`/game/${maxRoomUnlocked}`)
    }
  }, [maxRoomUnlocked, roomNum, router])

  const startIndex = (roomNum - 1) * 5
  const answeredCountInRoom = state.answeredDoorIds.filter((id) => id >= startIndex && id < startIndex + 5).length
  const allAnsweredInRoom = answeredCountInRoom === 5
  const allAnsweredOverall = state.answeredDoorIds.length === 50

  useEffect(() => {
    if (allAnsweredOverall) {
      finishGame()
      router.replace("/results")
    }
  }, [allAnsweredOverall, finishGame, router])

  return (
    <main className="min-h-screen ff-room-ambient text-foreground relative">
      {/* <TechBg opacity={0.8} /> */}
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[160px_1fr]">
          <aside aria-label="Rooms" className="rounded-xl bg-card/40 p-3 backdrop-blur-sm ring-1 ring-white/10">
            <nav className="flex flex-col gap-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const n = i + 1
                const isActive = n === roomNum
                const isUnlocked = n <= Math.max(1, maxRoomUnlocked)
                return (
                  <Link key={n} href={isUnlocked ? `/game/${n}` : "#"} aria-disabled={!isUnlocked}>
                    <Button
                      variant="outline"
                      className={[
                        "w-full justify-start rounded-lg border-white/10 bg-black/20 hover:bg-black/30 transition",
                        isActive ? "ring-2 ring-[color-mix(in_oklab,var(--primary)_70%,white_30%)]" : "",
                      ].join(" ")}
                      disabled={!isUnlocked}
                      tabIndex={isUnlocked ? 0 : -1}
                    >
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-sm bg-primary/15 ring-1 ring-primary/35">
                        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M12 3l2.5 2.5-2.5 2.5L9.5 5.5 12 3Zm0 7l4 4-4 4-4-4 4-4Z"
                            fill="currentColor"
                            className="text-primary"
                          />
                        </svg>
                      </span>
                      R{n}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div>
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold">Room {roomNum}</h2>
              <p className="text-muted-foreground">Choose a door to reveal its challenge.</p>
            </div>

            {/* Doors grid */}
            <div className="mt-6 grid grid-cols-2 justify-items-center gap-10 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => {
                const doorGlobalIndex = startIndex + i
                const colorHex = DOOR_COLORS[i % DOOR_COLORS.length]
                return (
                  <div key={i} style={{ ["--color-primary" as any]: colorHex }}>
                    <Door room={roomNum} indexInRoom={i} doorGlobalIndex={doorGlobalIndex} colorHex={colorHex} />
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex items-center gap-2">
              <Link href={roomNum > 1 ? `/game/${roomNum - 1}` : "#"}>
                <Button variant="outline" disabled={roomNum === 1} className="bg-transparent hover:bg-primary/10">
                  Previous Room
                </Button>
              </Link>
              <Link href={roomNum < 10 && roomNum < maxRoomUnlocked ? `/game/${roomNum + 1}` : "#"}>
                <Button
                  variant="outline"
                  disabled={!(roomNum < 10 && roomNum < maxRoomUnlocked)}
                  className="bg-transparent hover:bg-primary/10"
                >
                  Next Room
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              Answered in this room: {answeredCountInRoom} / 5 • Total answered: {state.answeredDoorIds.length} /{" "}
              {questions.length || 50}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
