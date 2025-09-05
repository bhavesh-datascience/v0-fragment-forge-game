import { useGame } from "@/components/game-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import TechBg from "@/components/tech-bg"

const DOOR_COLORS = ["#00e5ff", "#39ff14", "#ff4dff", "#ff2b2b", "#ffa600"] as const

@@ -42,12 +41,12 @@ export default function RoomPage() {
}, [allAnsweredOverall, finishGame, router])

return (
    <main className="min-h-screen ff-room-ambient text-foreground relative">
      {/* <TechBg opacity={0.8} /> */}
    <main className="min-h-screen text-foreground relative">
<Header />
<section className="mx-auto max-w-6xl px-4 py-8">
<div className="grid gap-6 md:grid-cols-[160px_1fr]">
          <aside aria-label="Rooms" className="rounded-xl bg-card/40 p-3 backdrop-blur-sm ring-1 ring-white/10">
          {/* --- CHANGE 1: Increased the blur effect on the sidebar --- */}
          <aside aria-label="Rooms" className="rounded-xl bg-card/50 p-3 backdrop-blur-lg ring-1 ring-white/10">
<nav className="flex flex-col gap-2">
{Array.from({ length: 10 }).map((_, i) => {
const n = i + 1
@@ -81,7 +80,8 @@ export default function RoomPage() {
</nav>
</aside>

          <div>
          {/* --- CHANGE 2: Converted the main panel to a blurred "frosted glass" panel --- */}
          <div className="flex flex-col items-center rounded-xl bg-card/50 p-6 backdrop-blur-lg ring-1 ring-white/10">
<div className="mb-4">
<h2 className="font-serif text-2xl font-semibold">Room {roomNum}</h2>
<p className="text-muted-foreground">Choose a door to reveal its challenge.</p>
