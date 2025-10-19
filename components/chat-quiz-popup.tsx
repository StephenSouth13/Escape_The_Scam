"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { Question } from "@/lib/level-data" // Giả định type này tồn tại

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

// Hàm helper để tạo độ trễ
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function ChatQuizPopup({ question, onAnswer }: ChatQuizPopupProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  // Cần thêm ref để quản lý timer của câu trả lời, đảm bảo chỉ gọi onAnswer một lần
  const [answerTimer, setAnswerTimer] = useState<NodeJS.Timeout | null>(null);

  // Tái cấu trúc logic hiển thị tin nhắn vào một hàm async/await
  useEffect(() => {
    // Reset trạng thái khi question thay đổi
    setMessages([])
    setShowAnswers(false)
    setSelectedAnswer(null)
    setShowExplanation(false)
    if (answerTimer) {
      clearTimeout(answerTimer);
      setAnswerTimer(null);
    }
    
    let isMounted = true;

    const runSequence = async () => {
      // 1. Gửi tin nhắn kịch bản (Villain)
      await delay(500);
      if (!isMounted) return;
      setMessages([{ id: 1, sender: "villain", text: question.scenario, icon: question.villainIcon }]);

      // 2. Gửi tin nhắn Linh (30% chance)
      const shouldShowLinh = Math.random() < 0.3;
      if (shouldShowLinh) {
        await delay(1500);
        if (!isMounted) return;
        setMessages(prev => [...prev, { id: 2, sender: "linh", text: "Giúp tôi với! Tôi đang bị giam ở đây... Hãy trả lời đúng!", icon: "👧" }]);
      }

      // 3. Gửi tin nhắn hệ thống (Cảnh báo/Tiêu đề câu hỏi)
      await delay(1500); // Đợi thêm 1.5s sau tin nhắn cuối cùng (dù là villain hay linh)
      if (!isMounted) return;
      setMessages(prev => [...prev, { id: 3, sender: "system", text: question.title, icon: "⚠️" }]);

      // 4. Hiển thị nút trả lời
      await delay(1000);
      if (!isMounted) return;
      setShowAnswers(true);
    };

    runSequence();

    // Cleanup function: Dừng sequence nếu component unmount hoặc question thay đổi
    return () => {
      isMounted = false;
    };
  }, [question]); // Dependencies: Chỉ chạy lại khi câu hỏi thay đổi

  const handleAnswerClick = (index: number) => {
    // Ngăn chặn việc bấm nhiều lần
    if (selectedAnswer !== null) return; 

    setSelectedAnswer(index)
    setShowExplanation(true)

    // Thiết lập timer cho việc chuyển màn hình/cấp độ
    const timer = setTimeout(() => {
      onAnswer(index === question.correctAnswer)
    }, 4000)
    
    setAnswerTimer(timer);
  }

  // Thêm useEffect cleanup cho answerTimer
  useEffect(() => {
    return () => {
      if (answerTimer) {
        clearTimeout(answerTimer);
      }
    };
  }, [answerTimer]);
  
  //... (Phần return JSX giữ nguyên)

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