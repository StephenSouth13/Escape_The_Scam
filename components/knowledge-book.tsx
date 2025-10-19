"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { levelData } from "@/lib/level-data"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface KnowledgeBookProps {
  onClose: () => void
}

export default function KnowledgeBook({ onClose }: KnowledgeBookProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const allQuestions = levelData.flatMap((level, levelIndex) =>
    level.questions.map((q, qIndex) => ({
      ...q,
      levelName: level.name,
      levelNumber: levelIndex + 1,
      questionNumber: qIndex + 1,
    })),
  )

  const currentQuestion = allQuestions[currentPage]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.9, opacity: 0, rotateY: 15 }}
        className="w-full max-w-4xl"
      >
        <div className="relative">
          {/* Book cover effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-green/20 rounded-2xl blur-xl" />

          <div className="relative glass-panel rounded-2xl border-2 border-primary/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border-b border-primary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-neon-cyan mb-2">📚 SÁCH KIẾN THỨC AN TOÀN MẠNG</h2>
                  <p className="text-sm text-muted-foreground">
                    Trang {currentPage + 1} / {allQuestions.length}
                  </p>
                </div>
                <Button onClick={onClose} variant="ghost" size="icon" className="text-foreground hover:text-neon-cyan">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Level badge */}
                  <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                    <span className="text-sm font-mono">
                      TẦNG {currentQuestion.levelNumber}: {currentQuestion.levelName}
                    </span>
                  </div>

                  {/* Question title */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-4xl">{currentQuestion.villainIcon}</div>
                      <h3 className="text-2xl font-bold text-neon-magenta">{currentQuestion.title}</h3>
                    </div>
                    <p className="text-lg text-foreground/90 leading-relaxed">{currentQuestion.scenario}</p>
                  </div>

                  {/* Answers */}
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-neon-green uppercase">Các lựa chọn:</div>
                    {currentQuestion.answers.map((answer, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          index === currentQuestion.correctAnswer
                            ? "bg-neon-green/10 border-neon-green/50"
                            : "bg-background/50 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold text-neon-cyan">{String.fromCharCode(65 + index)}.</span>
                          <span className="flex-1">{answer}</span>
                          {index === currentQuestion.correctAnswer && <span className="text-neon-green">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💡</span>
                      <span className="font-bold text-neon-cyan">GIẢI THÍCH:</span>
                    </div>
                    <p className="text-foreground/90 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="border-t border-primary/30 p-4 flex items-center justify-between bg-background/50">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Trang trước
              </Button>

              <div className="text-sm text-muted-foreground font-mono">
                {currentPage + 1} / {allQuestions.length}
              </div>

              <Button
                onClick={() => setCurrentPage((p) => Math.min(allQuestions.length - 1, p + 1))}
                disabled={currentPage === allQuestions.length - 1}
                variant="outline"
                className="gap-2"
              >
                Trang sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
