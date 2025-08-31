"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useGame } from "./game-context"
import { NeonQuestion } from "./neon-question"

const DOOR_OPEN_MS = 300
const RAYS_HOLD_MS = 400 // extra time to showcase the light burst before the question appears

type DoorProps = {
  room: number
  indexInRoom: number // 0..4
  doorGlobalIndex: number // 0..49
  colorHex?: string
}

export default function Door({ room, indexInRoom, doorGlobalIndex, colorHex }: DoorProps) {
  const { questions, isDoorAnswered, answerDoor } = useGame()
  const q = questions[doorGlobalIndex]
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [opening, setOpening] = useState(false) // door animation state
  const [showRays, setShowRays] = useState(false) // control light rays visibility
  const [showParticles, setShowParticles] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const answered = isDoorAnswered(doorGlobalIndex)

  const [result, setResult] = useState<null | "correct" | "wrong">(null)

  /** Precompute a small set of randomized particle vectors each burst */
  const particles = useMemo(() => {
    const N = 22
    return Array.from({ length: N }, () => {
      const dist = 70 + Math.random() * 110 // px radial distance
      const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6 // spread roughly ±30deg upward-right
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist * 0.6
      const size = 3 + Math.random() * 6
      const dur = 650 + Math.random() * 650
      const delay = Math.random() * 120
      const rot = (Math.random() - 0.5) * 120
      const colorVar = Math.random() > 0.6 ? "var(--color-secondary)" : "var(--color-primary)"
      return { tx, ty, size, dur, delay, rot, colorVar }
    })
  }, [burstKey])

  const handleSubmit = () => {
    if (selected == null) return
    const correctIdx =
      (q as any)?.answerIndex ??
      (q as any)?.correctIndex ??
      (typeof (q as any)?.answer === "number" ? (q as any).answer : undefined)

    const isCorrect = typeof correctIdx === "number" ? selected === correctIdx : undefined
    if (isCorrect === true) setResult("correct")
    else if (isCorrect === false) setResult("wrong")

    answerDoor({ room, door: indexInRoom + 1, doorGlobalIndex, selectedIndex: selected })
    setOpen(false)
  }

  const handleOpenDoor = () => {
    if (!q || answered || opening) return
    setOpening(true)
    setShowRays(true)
    setShowParticles(true)
    setBurstKey((k) => k + 1)

    setOpen(true)

    // finish hinge rotation timing (visual only)
    setTimeout(() => {
      setOpening(false)
    }, DOOR_OPEN_MS)

    // hide rays a bit after open so they don't persist under dialog
    setTimeout(() => {
      setShowRays(false)
    }, DOOR_OPEN_MS + RAYS_HOLD_MS)

    // hide particles after a moment
    setTimeout(() => setShowParticles(false), DOOR_OPEN_MS + RAYS_HOLD_MS + 900)
  }

  const onDialogChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setSelected(null)
    }
  }

  return (
    <div
      className="relative"
      style={result == null && colorHex ? ({ ["--color-primary" as any]: colorHex } as React.CSSProperties) : undefined}
      data-result={result ?? undefined}
    >
      <Dialog open={open} onOpenChange={onDialogChange}>
        {/* Door block with 3D opening animation */}
        <button
          disabled={!q}
          onClick={handleOpenDoor}
          className={[
            "group relative rounded-lg overflow-visible bg-card/60 backdrop-blur ff-door-hoverable",
            "transition-shadow duration-200 will-change-transform",
            answered
              ? "opacity-70 cursor-not-allowed"
              : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--color-primary)_70%,white_30%)]",
          ].join(" ")}
          aria-label={`Door ${indexInRoom + 1}${answered ? " (answered)" : ""}`}
          aria-disabled={answered ? "true" : undefined}
          style={{ perspective: "1200px", border: "none" }} // force borderless container
        >
          <div className="relative h-56 w-36 sm:h-64 sm:w-40" aria-hidden>
            <div className={["ff-door-bg", open || opening ? "ff-door-bg-open" : ""].join(" ")} />

            <div
              className="ff-rays"
              style={{
                opacity: showRays || opening ? undefined : 0,
                animation: showRays || opening ? "ff-rays-burst 700ms ease-out both" : "none",
                color: result ? undefined : colorHex, // base color only before result
              }}
            />
            <div
              className="ff-floor-glow"
              style={{
                animation: showRays || opening ? "ff-floor-pulse 600ms ease-out both" : "none",
                color: result ? undefined : colorHex,
              }}
            />
            {(showParticles || opening) && (
              <div key={burstKey} className="ff-particles">
                {particles.map((p, i) => (
                  <span
                    key={i}
                    className="ff-particle"
                    style={
                      {
                        "--tx": `${Math.round(p.tx)}px`,
                        "--ty": `${Math.round(p.ty)}px`,
                        "--size": `${p.size}px`,
                        "--dur": `${Math.round(p.dur)}ms`,
                        "--delay": `${Math.round(p.delay)}ms`,
                        "--rot": `${Math.round(p.rot)}deg`,
                        "--part-color": p.colorVar,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}

            {/* Techy ambient glow behind the door */}
            <div className="absolute inset-0 rounded-lg bg-primary/10 blur-xl" />

            {/* Floor shadow that stretches as the door opens */}
            <div
              className="absolute -bottom-2 left-4 right-4 h-2 rounded-full bg-black/50 transition-all"
              style={{
                filter: "blur(6px)",
                opacity: open || opening ? 0.5 : 0.25,
                transform: open || opening ? "scaleX(1.1)" : "scaleX(0.9)",
                transformOrigin: "center",
              }}
            />

            {/* Door leaf that rotates open */}
            <div
              className={[
                "absolute inset-0 origin-left rounded-lg bg-card shadow-xl",
                "transition-transform ease-out will-change-transform",
                answered ? "saturate-0" : "group-hover:brightness-105",
              ].join(" ")}
              style={{
                transform: open || opening ? "rotateY(-70deg)" : "rotateY(0deg)",
                transformStyle: "preserve-3d",
                transitionDuration: `${DOOR_OPEN_MS}ms`,
                border: "none",
              }}
            >
              {/* SVG neon door rendering */}
              <svg viewBox="0 0 180 280" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="ffDoorSurface" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                    <stop offset="35%" stopColor="rgba(0,0,0,0.0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                  </linearGradient>
                </defs>
                <rect x="10" y="10" width="160" height="260" rx="10" fill="url(#ffDoorSurface)" />
                <rect x="6" y="6" width="168" height="268" rx="12" className="ff-neon-stroke" />
                <rect x="20" y="20" width="140" height="240" rx="8" className="ff-neon-stroke" />
                <rect x="38" y="34" width="104" height="90" rx="6" className="ff-panel-stroke" />
                <rect x="38" y="156" width="104" height="90" rx="6" className="ff-panel-stroke" />
                <g className="ff-knob-glow">
                  <circle cx="54" cy="142" r="4.5" fill="currentColor" style={{ color: "var(--color-primary)" }} />
                </g>
              </svg>
            </div>

            {/* Door label */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-center">
              <span
                className={[
                  "inline-block rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground shadow",
                  answered ? "bg-secondary text-secondary-foreground" : "",
                ].join(" ")}
              >
                Door {indexInRoom + 1}
              </span>
            </div>

            {/* Answered badge */}
            {answered && (
              <div className="absolute top-2 right-2 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-0.5 shadow">
                Done
              </div>
            )}
          </div>
        </button>

        {!!q && (
          <DialogContent
            className="sm:max-w-2xl bg-transparent border border-[color-mix(in_oklab,var(--color-primary)_45%,black_55%)] shadow-[0_0_30px_rgba(6,182,212,0.35)] backdrop-blur-md"
            style={
              result == null && colorHex
                ? ({ ["--color-primary" as any]: colorHex } as React.CSSProperties)
                : ({} as React.CSSProperties)
            }
          >
            <NeonQuestion
              question={q.prompt}
              options={q.options}
              selectedIndex={selected}
              onSelect={(i) => setSelected(i)}
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} className="ff-btn-primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={selected == null} className="ff-btn-primary">
                Submit Answer
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
