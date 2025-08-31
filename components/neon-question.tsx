"use client"
import { useEffect, useMemo, useState, useCallback } from "react"
import type React from "react"
import { cn } from "@/lib/utils"

type NeonQuestionProps = {
  question: string
  options: string[]
  onSelect: (index: number) => void
  selectedIndex?: number | null
}

export function NeonQuestion({ question, options, onSelect, selectedIndex }: NeonQuestionProps) {
  const [showParticles, setShowParticles] = useState(false)
  const [burstKey, setBurstKey] = useState(0)

  useEffect(() => {
    setShowParticles(true)
    setBurstKey((k) => k + 1)
    const t = setTimeout(() => setShowParticles(false), 900)
    return () => clearTimeout(t)
  }, [])

  const particles = useMemo(() => {
    const N = 14
    return Array.from({ length: N }, () => {
      const dist = 80 + Math.random() * 120
      const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist * 0.6
      const size = 2 + Math.random() * 5
      const dur = 600 + Math.random() * 700
      const delay = Math.random() * 100
      const rot = (Math.random() - 0.5) * 120
      const colorVar = Math.random() > 0.7 ? "var(--color-secondary)" : "var(--color-primary)"
      return { tx, ty, size, dur, delay, rot, colorVar }
    })
  }, [burstKey])

  const handleKeySelect = useCallback(
    (i: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect(i)
      }
    },
    [onSelect],
  )

  return (
    <div className="relative ff-neon-panel p-4 md:p-6">
      <div className="ff-halo" aria-hidden="true" />
      <div className="ff-question-rays" aria-hidden="true" />

      {showParticles && (
        <div key={burstKey} className="ff-question-particles ff-particles" aria-hidden="true">
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

      <div className="relative z-[2] flex items-start gap-3">
        <div
          aria-hidden="true"
          className="h-8 w-8 shrink-0 rounded-full border-2 flex items-center justify-center font-semibold"
          style={{
            borderColor: "color-mix(in oklab, var(--color-primary) 80%, white 20%)",
            boxShadow:
              "0 0 12px color-mix(in oklab, var(--color-primary) 70%, black 30%), inset 0 0 8px color-mix(in oklab, var(--color-primary) 30%, black 70%)",
            color: "color-mix(in oklab, var(--color-primary) 85%, white 15%)",
          }}
        >
          ?
        </div>
        <div
          className="ff-neon-bubble grow text-sm md:text-base"
          style={{ color: "color-mix(in oklab, white 92%, var(--color-primary) 8%)" }}
        >
          <p className="text-pretty">{question}</p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Answer options"
        className="relative z-[2] mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {options.slice(0, 4).map((opt, i) => {
          const isSelected = selectedIndex === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              onKeyDown={(e) => handleKeySelect(i, e)}
              role="radio"
              aria-checked={isSelected}
              className={cn(
                "ff-neon-option w-full px-4 py-3 text-left focus:outline-none",
                isSelected && "ff-option-selected",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className="ff-opt-letter font-semibold"
                  style={{ color: "color-mix(in oklab, var(--color-primary) 70%, white 30%)" }}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                <span style={{ color: "color-mix(in oklab, white 95%, var(--color-primary) 5%)" }}>{opt}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
