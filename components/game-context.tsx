"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"

type Question = {
  id: number
  prompt: string
  options: string[]
  correctIndex: number
  isTrap: boolean
}

type AnswerLog = {
  room: number
  door: number
  doorGlobalIndex: number
  questionId: number
  prompt: string
  options: string[]
  correctIndex: number
  selectedIndex: number
  correct: boolean
  doorType: "trap" | "normal"
  deltaScore: number
  answeredAt: string
}

type GameState = {
  teamName: string
  startTime?: string
  endTime?: string
  score: number
  answers: AnswerLog[]
  answeredDoorIds: number[]
  maxRoomUnlocked: number
}

type GameContextValue = {
  gameName: string
  tagline: string
  state: GameState
  questions: Question[]
  setTeamName: (name: string) => void
  startGame: () => void
  finishGame: () => void
  answerDoor: (args: { room: number; door: number; doorGlobalIndex: number; selectedIndex: number }) => void
  isDoorAnswered: (doorGlobalIndex: number) => boolean
  resetGame: () => void
  sessionJson: () => any
  maxRoomUnlocked: number
}

const STORAGE_KEY = "fragment-forge-state"
const fetcher = (url: string) => fetch(url).then((r) => r.json())

const defaultState: GameState = {
  teamName: "",
  score: 0,
  answers: [],
  answeredDoorIds: [],
  maxRoomUnlocked: 0,
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { data: questions = [] } = useSWR<Question[]>("/data/questions.json", fetcher)
  const [state, setState] = useState<GameState>(defaultState)
  const loadedRef = useRef(false)

  // Load persisted session
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist session
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const setTeamName = (name: string) => setState((s) => ({ ...s, teamName: name }))

  const startGame = () => {
    setState((s) => ({
      ...s,
      score: 0,
      answers: [],
      answeredDoorIds: [],
      startTime: new Date().toISOString(),
      endTime: undefined,
      maxRoomUnlocked: 1,
    }))
  }

  const finishGame = () => setState((s) => ({ ...s, endTime: new Date().toISOString() }))

  // Scoring:
  // - Correct on any door: +5
  // - Incorrect on trap door: -5
  // - Incorrect on normal door: 0
  const answerDoor: GameContextValue["answerDoor"] = ({ room, door, doorGlobalIndex, selectedIndex }) => {
    if (!questions.length) return
    if (state.answeredDoorIds.includes(doorGlobalIndex)) return
    const q = questions[doorGlobalIndex]
    if (!q) return
    const correct = selectedIndex === q.correctIndex
    const isTrap = q.isTrap
    const delta = correct ? 5 : isTrap ? -5 : 0

    const log: AnswerLog = {
      room,
      door,
      doorGlobalIndex,
      questionId: q.id,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      selectedIndex,
      correct,
      doorType: isTrap ? "trap" : "normal",
      deltaScore: delta,
      answeredAt: new Date().toISOString(),
    }

    setState((s) => {
      const nextAnswered = [...s.answeredDoorIds, doorGlobalIndex]
      const roomStart = (room - 1) * 5
      const completedInRoom = nextAnswered.filter((id) => id >= roomStart && id < roomStart + 5).length === 5
      const nextUnlocked = completedInRoom ? Math.max(s.maxRoomUnlocked, Math.min(10, room + 1)) : s.maxRoomUnlocked

      return {
        ...s,
        score: s.score + delta,
        answers: [...s.answers, log],
        answeredDoorIds: nextAnswered,
        maxRoomUnlocked: nextUnlocked,
      }
    })
  }

  const isDoorAnswered = (doorGlobalIndex: number) => state.answeredDoorIds.includes(doorGlobalIndex)

  const resetGame = () => setState(defaultState)

  const sessionJson = () => ({
    gameName: "Fragment Forge",
    tagline: "Where the first piece of the ultimate code is shaped.",
    teamName: state.teamName,
    startTime: state.startTime,
    endTime: state.endTime,
    totalScore: state.score,
    answers: state.answers,
  })

  const value: GameContextValue = useMemo(
    () => ({
      gameName: "Fragment Forge",
      tagline: "Where the first piece of the ultimate code is shaped.",
      state,
      questions,
      setTeamName,
      startGame,
      finishGame,
      answerDoor,
      isDoorAnswered,
      resetGame,
      sessionJson,
      maxRoomUnlocked: state.maxRoomUnlocked,
    }),
    [state, questions],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used within GameProvider")
  return ctx
}
