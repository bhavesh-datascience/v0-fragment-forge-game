"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGame } from "@/components/game-context"
import { cn } from "@/lib/utils"

export function RoomNavigator({ totalRooms = 10 }: { totalRooms?: number }) {
  const { maxRoomUnlocked } = useGame()
  const pathname = usePathname()

  return (
    <nav aria-label="Rooms" className="w-full">
      <ul className="flex flex-wrap items-center gap-2">
        {Array.from({ length: totalRooms }).map((_, idx) => {
          const href = `/game/${idx + 1}`
          const isActive = pathname?.startsWith(href)
          const isUnlocked = idx <= maxRoomUnlocked
          return (
            <li key={idx}>
              {isUnlocked ? (
                <Link
                  href={href}
                  className={cn(
                    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-3 text-sm",
                    "transition-colors",
                    isActive
                      ? "border-cyan-500 bg-cyan-600/20 text-cyan-200"
                      : "border-gray-700 bg-gray-800 text-gray-300 hover:border-cyan-500 hover:text-cyan-200",
                  )}
                >
                  R{idx + 1}
                </Link>
              ) : (
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-gray-800 bg-gray-900/60 px-3 text-sm text-gray-600">
                  R{idx + 1}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
