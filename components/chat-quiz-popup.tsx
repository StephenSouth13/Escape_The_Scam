"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { Question } from "@/lib/level-data"

interface ChatQuizPopupProps {
  question: Question
  onAnswer: (correct: boolean) => void
}

interface Message {
  id: number
  sender: "villain" | "linh" | "system"
  text: string
  icon: string
}

export default function ChatQuizPopup({ question, onAnswer }: ChatQuizPopupProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    // Initial messages sequence
    const sequence = [
      {
        id: 1,
        sender: "villain" as const,
        text: question.scenario,
        icon: question.villainIcon,
        delay: 500,
      },
    ]

    // Randomly add Linh's cry for help (30% chance)
    if (Math.random() < 0.3) {
      sequence.push({
        id: 2,
        sender: "linh" as const,
        text: "Giúp tôi với! Tôi đang bị giam ở đây... Hãy trả lời đúng!",
        icon: "👧",
        delay: 2000,
      })
    }

    sequence.push({
      id: 3,
      sender: "system" as const,
      text: question.title,
      icon: "⚠️",
      delay: sequence.length > 1 ? 3500 : 2000,
    })

    // Add messages with delays
    sequence.forEach((msg) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg])
      }, msg.delay)
    })

    // Show answers after all messages
    setTimeout(
      () => {
        setShowAnswers(true)
      },
      sequence[sequence.length - 1].delay + 1000,
    )
  }, [question])

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)

    // Show explanation for 3 seconds, then close
    setTimeout(() => {
      onAnswer(index === question.correctAnswer)
    }, 4000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl">
        {/* Chat container */}
        <div className="glass-panel rounded-lg overflow-hidden border-2 border-primary/50 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-danger-red/20 to-neon-magenta/20 border-b border-primary/30 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-danger-red/30 flex items-center justify-center text-2xl">
                {question.villainIcon}
              </div>
              <div>
                <div className="font-bold text-foreground">Kẻ Lừa Đảo</div>
                <div className="text-xs text-neon-green">● Đang hoạt động</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-background/50 p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === "system" ? "justify-center" : msg.sender === "linh" ? "justify-start" : "justify-end"}`}
                >
                  {msg.sender !== "system" && msg.sender === "linh" && (
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/30 flex items-center justify-center text-lg flex-shrink-0">
                      {msg.icon}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "villain"
                        ? "bg-danger-red/20 border border-danger-red/30"
                        : msg.sender === "linh"
                          ? "bg-neon-cyan/20 border border-neon-cyan/30"
                          : "bg-neon-magenta/20 border border-neon-magenta/30 text-center"
                    }`}
                  >
                    {msg.sender === "system" && <div className="text-xs font-bold mb-1">{msg.icon} CẢNH BÁO</div>}
                    <p className="text-sm text-foreground/90">{msg.text}</p>
                  </div>

                  {msg.sender === "villain" && (
                    <div className="w-8 h-8 rounded-full bg-danger-red/30 flex items-center justify-center text-lg flex-shrink-0">
                      {msg.icon}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Answer buttons */}
            {showAnswers && !showExplanation && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-4">
                <div className="text-center text-sm font-bold text-neon-green mb-3">Chọn câu trả lời của bạn:</div>
                {question.answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className="w-full text-left justify-start h-auto py-3 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 transition-all"
                  >
                    <span className="font-bold text-neon-cyan mr-2">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-foreground/90">{answer}</span>
                  </Button>
                ))}
              </motion.div>
            )}

            {/* Explanation */}
            {showExplanation && selectedAnswer !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-4">
                <div
                  className={`rounded-2xl p-4 border-2 ${
                    selectedAnswer === question.correctAnswer
                      ? "bg-neon-green/20 border-neon-green/50"
                      : "bg-danger-red/20 border-danger-red/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-3xl">{selectedAnswer === question.correctAnswer ? "✅" : "❌"}</div>
                    <div className="font-bold text-lg">
                      {selectedAnswer === question.correctAnswer ? "Chính xác!" : "Sai rồi!"}
                    </div>
                  </div>
                  <div className="text-sm text-foreground/90 leading-relaxed">{question.explanation}</div>
                  {selectedAnswer === question.correctAnswer && (
                    <div className="mt-3 text-neon-cyan font-bold text-sm">+10 Cyber IQ</div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
