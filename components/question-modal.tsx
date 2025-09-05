"use client"

import { Fragment, useState } from "react"
import { Dialog, DialogPanel, DialogTitle, Radio, RadioGroup } from "@headlessui/react"
import { useGame } from "./game-context"
import { Button } from "./ui/button"
import type { Question } from "./game-context"

type QuestionModalProps = {
  isOpen: boolean
  onClose: () => void
  door: {
    doorGlobalIndex: number
    question: Question
  }
}

export default function QuestionModal({ isOpen, onClose, door }: QuestionModalProps) {
  const { submitAnswer } = useGame()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // UPDATED: Destructure the new properties from the question object
  const { prompt, options, correctIndex } = door.question
  const correctAnswer = options[correctIndex]

  const handleSelectOption = (option: string) => {
    setSelectedOption(option)
    // UPDATED: Check for correctness by comparing the selected option to the correct answer string
    const isCorrect = option === correctAnswer
    submitAnswer(door.doorGlobalIndex, isCorrect)

    setTimeout(() => {
      onClose()
      setSelectedOption(null)
    }, 1200) 
  }

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            as="div"
            className="ff-neon-panel relative w-full max-w-lg rounded-xl p-6 text-foreground"
          >
            <DialogTitle as="h3" className="font-serif text-lg font-medium text-primary">
              Door {door.doorGlobalIndex + 1} Challenge
            </DialogTitle>
            <div className="ff-halo" />

            <div className="mt-4">
              {/* UPDATED: Display the 'prompt' instead of 'question' */}
              <p className="text-lg">{prompt}</p>
            </div>

            <RadioGroup
              value={selectedOption}
              onChange={handleSelectOption}
              aria-label="Question options"
              className="mt-4 space-y-3"
            >
              {options.map((option, index) => (
                <Radio
                  key={option}
                  value={option}
                  disabled={!!selectedOption}
                  className="ff-neon-option group relative flex cursor-pointer rounded-lg px-4 py-3 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-ring data-[focus]:ring-offset-2 data-[focus]:ring-offset-background"
                >
                  {({ checked }) => (
                    <>
                      <span className="flex w-full items-center justify-between">
                        <span className="flex items-center text-base font-medium">
                          {/* Added letters A, B, C, D for options */}
                          <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-sm border border-primary/50 text-xs font-semibold text-primary/80">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </span>
                        {checked && selectedOption ? (
                          <div className="shrink-0 text-white">
                            {selectedOption === correctAnswer ? (
                              <svg className="h-6 w-6 fill-green-400" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            ) : (
                              <svg className="h-6 w-6 fill-red-400" viewBox="0 0 24 24">
                                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                              </svg>
                            )}
                          </div>
                        ) : null}
                      </span>
                    </>
                  )}
                </Radio>
              ))}
            </RadioGroup>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
