"use client"

import { useEffect, useRef } from "react"

type TechBgProps = {
  opacity?: number
  className?: string
}

export default function TechBg({ opacity = 0.85, className = "" }: TechBgProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Respect reduced motion — render a static frame and stop animating
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let raf = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)

    const resize = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth
      const h = canvas.parentElement?.clientHeight || window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const gridGap = 40
    const hud = "rgba(0,200,255,0.6)"
    const hudSoft = "rgba(0,200,255,0.12)"

    const nodes = Array.from({ length: 28 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.1,
    }))

    const segments = Array.from({ length: 14 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: prefersReduced ? 0 : -0.03 - Math.random() * 0.04,
      vy: prefersReduced ? 0 : 0.02 + Math.random() * 0.03,
      len: 80 + Math.random() * 100,
      w: 2 + Math.random() * 2,
      alpha: 0.28 + Math.random() * 0.4,
    }))

    let scanlineY = 0

    const drawFrame = (dt: number) => {
      const W = canvas.width / dpr
      const H = canvas.height / dpr

      // vignette background
      const rad = ctx.createRadialGradient(
        W * 0.5,
        H * 0.5,
        Math.min(W, H) * 0.1,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.7,
      )
      rad.addColorStop(0, `rgba(5,10,20,${opacity})`)
      rad.addColorStop(1, `rgba(2,4,10,${opacity})`)
      ctx.fillStyle = rad
      ctx.fillRect(0, 0, W, H)

      // grid
      ctx.lineWidth = 1
      ctx.strokeStyle = hudSoft
      ctx.beginPath()
      for (let x = 0; x <= W; x += gridGap) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
      }
      for (let y = 0; y <= H; y += gridGap) {
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
      }
      ctx.stroke()

      // flowing segments
      segments.forEach((s) => {
        s.x += s.vx * dt
        s.y += s.vy * dt
        if (s.x < -0.2 || s.y > 1.2) {
          s.x = 1.15
          s.y = -0.1 + Math.random() * 0.2
        }
        const x = s.x * W
        const y = s.y * H
        const dx = s.len * 0.7
        const dy = -s.len * 0.3
        const grad = ctx.createLinearGradient(x, y, x + dx, y + dy)
        grad.addColorStop(0, "rgba(0,200,255,0)")
        grad.addColorStop(0.4, `rgba(0,200,255,${s.alpha})`)
        grad.addColorStop(1, "rgba(0,200,255,0)")
        ctx.strokeStyle = grad
        ctx.lineWidth = s.w
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + dx, y + dy)
        ctx.stroke()
      })

      // pulsing nodes
      nodes.forEach((n) => {
        n.phase += dt * n.speed
        const pulse = 0.5 + 0.5 * Math.sin(n.phase)
        const x = n.x * W
        const y = n.y * H
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 16)
        glow.addColorStop(0, "rgba(0,200,255,0.35)")
        glow.addColorStop(1, "rgba(0,200,255,0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, 16 + pulse * 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = hud
        ctx.beginPath()
        ctx.arc(x, y, n.r + pulse * 0.8, 0, Math.PI * 2)
        ctx.fill()
      })

      // scanline
      scanlineY = (scanlineY + (prefersReduced ? 0 : Math.max(40, (canvas.height / dpr) * 0.12) * dt)) % (H + 40)
      const slGrad = ctx.createLinearGradient(0, scanlineY - 20, 0, scanlineY + 20)
      slGrad.addColorStop(0, "rgba(0,0,0,0)")
      slGrad.addColorStop(0.5, "rgba(0,200,255,0.08)")
      slGrad.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = slGrad
      ctx.fillRect(0, scanlineY - 20, W, 40)
    }

    let t0 = performance.now()
    const loop = (t: number) => {
      const dt = (t - t0) / 1000
      t0 = t
      drawFrame(dt)
      raf = requestAnimationFrame(loop)
    }

    if (prefersReduced) {
      // Render one static frame
      drawFrame(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [opacity])

  return <canvas ref={ref} aria-hidden className={`ff-tech-bg ${className}`} />
}
