"use client"

import { ReactNode, createContext, useContext, useEffect, useMemo, useReducer, useState } from "react"

// UPDATED: This type now matches your new questions.json format
export type Question = {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  isTrap: boolean;
};

export type GameState = {
  teamName: string | null
  startTime: number | null
  endTime: number | null
  answeredDoorIds: number[]
  score: number
  results: { [doorId: number]: 'correct' | 'wrong' }
}

type GameContextType = {
  state: GameState
  questions: Question[]
  isLoading: boolean
  maxRoomUnlocked: number
  setTeamName: (name: string) => void
  startGame: () => void
  finishGame: () => void
  submitAnswer: (doorId: number, isCorrect: boolean) => void
  gameName: string
  tagline: string
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const initialState: GameState = {
  teamName: null,
  startTime: null,
  endTime: null,
  answeredDoorIds: [],
  score: 0,
  results: {},
}

type Action =
  | { type: 'SET_TEAM_NAME'; payload: string }
  | { type: 'START_GAME' }
  | { type: 'FINISH_GAME' }
  | { type: 'SUBMIT_ANSWER'; payload: { doorId: number; isCorrect: boolean } }

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_TEAM_NAME':
      return { ...state, teamName: action.payload }
    case 'START_GAME':
      return { ...initialState, teamName: state.teamName, startTime: Date.now() }
    case 'FINISH_GAME':
      return { ...state, endTime: Date.now() }
    case 'SUBMIT_ANSWER': {
      const { doorId, isCorrect } = action.payload
      if (state.answeredDoorIds.includes(doorId)) {
        return state
      }
      return {
        ...state,
        score: state.score + (isCorrect ? 5 : 0),
        answeredDoorIds: [...state.answeredDoorIds, doorId],
        results: { ...state.results, [doorId]: isCorrect ? 'correct' : 'wrong' },
      }
    }
    default:
      return state
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/questions.json')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to load questions:", err)
        setIsLoading(false)
      })
  }, [])

  const maxRoomUnlocked = useMemo(
    () => Math.floor(state.answeredDoorIds.length / 5) + 1,
    [state.answeredDoorIds.length],
  )

  const setTeamName = (name: string) => dispatch({ type: 'SET_TEAM_NAME', payload: name })
  const startGame = () => dispatch({ type: 'START_GAME' })
  const finishGame = () => dispatch({ type: 'FINISH_GAME' })
  const submitAnswer = (doorId: number, isCorrect: boolean) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: { doorId, isCorrect } })
  }

  const value = {
    state,
    questions,
    isLoading,
    maxRoomUnlocked,
    setTeamName,
    startGame,
    finishGame,
    submitAnswer,
    gameName: "Fragment Forge",
    tagline: "Where the first piece of the ultimate code is shaped.",
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
