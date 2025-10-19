"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TypewriterText from "@/components/typewriter-text"
import type { GameState } from "@/app/page"
import { AudioManager } from "@/lib/audio-manager"
import { CheckCircle2, XCircle } from "lucide-react"

interface Level1SceneProps {
  gameState: GameState
  onComplete: (success: boolean) => void
  updateGameState: (updates: Partial<GameState>) => void
}

export default function Level1Scene({ gameState, onComplete, updateGameState }: Level1SceneProps) {
  const [showChallenge, setShowChallenge] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  const emails = [
    {
      id: 1,
      from: "security@vietcombank.com.vn",
      subject: "Cảnh báo: Tài khoản của bạn sẽ bị khóa",
      preview: "Nhấn vào đây ngay để xác minh tài khoản...",
      isScam: true,
      redFlags: ["Tạo cảm giác khẩn cấp", "Yêu cầu click link ngay", "Email giả mạo ngân hàng"],
    },
    {
      id: 2,
      from: "noreply@facebook-security.com",
      subject: "Ai đó đã đăng nhập vào tài khoản của bạn",
      preview: "Click để đổi mật khẩu ngay lập tức...",
      isScam: true,
      redFlags: ["Domain giả mạo", "Tạo hoảng loạn", "Link đáng ngờ"],
    },
    {
      id: 3,
      from: "hr@company.com",
      subject: "Thông báo lịch họp tuần",
      preview: "Cuộc họp sẽ diễn ra vào thứ 2 lúc 9h sáng...",
      isScam: false,
      redFlags: [],
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setShowChallenge(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showChallenge && !showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [showChallenge, showResult, timeLeft])

  const handleTimeout = () => {
    AudioManager.playError()
    setShowResult(true)
    setTimeout(() => onComplete(false), 3000)
  }

  const handleSelectEmail = (emailId: number) => {
    AudioManager.playClick()
    setSelectedEmail(emailId)
  }

  const handleSubmit = () => {
    if (selectedEmail === null) return

    const email = emails.find((e) => e.id === selectedEmail)
    if (email?.isScam) {
      AudioManager.playSuccess()
      updateGameState({
        skills: {
          ...gameState.skills,
          phishingDetection: gameState.skills.phishingDetection + 1,
        },
      })
      setShowResult(true)
      setTimeout(() => onComplete(true), 3000)
    } else {
      AudioManager.playError()
      setShowResult(true)
      setTimeout(() => onComplete(false), 3000)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <img src="/dark-hotel-room-with-computer-screen-glowing-cyber.jpg" alt="Hotel room" className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="glass-panel rounded px-4 py-2 space-y-1 text-xs font-mono">
          <div>
            NGƯỜI CHƠI: <span className="text-neon-cyan">{gameState.playerName}</span>
          </div>
          <div>
            MẠNG SỐNG: <span className="text-neon-magenta">{"❤".repeat(gameState.lives)}</span>
          </div>
          <div>
            KỸ NĂNG: <span className="text-neon-green">{gameState.skills.phishingDetection}/3</span>
          </div>
        </div>

        <div className="glass-panel rounded px-6 py-3">
          <div className="text-2xl font-bold font-mono text-neon-cyan">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full mt-20">
        <div className="glass-panel rounded-lg p-6 md:p-8 space-y-6">
          {/* Level title */}
          <div className="text-center space-y-2">
            <div className="inline-block px-4 py-1 border border-primary/50 rounded-full">
              <span className="text-xs text-primary font-mono uppercase">Cấp độ 1: Phishing Email</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neon-cyan">Nhận Diện Email Lừa Đảo</h2>
          </div>

          {!showChallenge ? (
            <div className="py-8">
              <TypewriterText
                text="Bạn tìm thấy một chiếc máy tính trong phòng. Trên màn hình có nhiều email. Một trong số chúng là email lừa đảo đã dụ Linh vào bẫy. Hãy tìm ra nó!"
                className="text-lg text-center text-foreground/90"
                speed={30}
              />
            </div>
          ) : (
            <>
              {!showResult ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">Chọn email mà bạn nghĩ là lừa đảo:</p>

                  <div className="space-y-3">
                    {emails.map((email) => (
                      <Card
                        key={email.id}
                        className={`p-4 cursor-pointer transition-all border-2 ${
                          selectedEmail === email.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleSelectEmail(email.id)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-muted-foreground truncate">Từ: {email.from}</div>
                              <div className="font-semibold text-foreground truncate">{email.subject}</div>
                            </div>
                            {selectedEmail === email.id && (
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{email.preview}</div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={selectedEmail === null}
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-6"
                  >
                    XÁC NHẬN LỰA CHỌN
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  {selectedEmail && emails.find((e) => e.id === selectedEmail)?.isScam ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto" />
                      <h3 className="text-2xl font-bold text-neon-green">CHÍNH XÁC!</h3>
                      <p className="text-foreground/90">
                        Bạn đã nhận diện đúng email lừa đảo. Kỹ năng phát hiện phishing của bạn đã tăng lên!
                      </p>
                      {selectedEmail && (
                        <div className="glass-panel rounded p-4 text-left space-y-2">
                          <p className="text-sm font-semibold text-neon-magenta">Dấu hiệu nhận biết:</p>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {emails
                              .find((e) => e.id === selectedEmail)
                              ?.redFlags.map((flag, i) => (
                                <li key={i}>• {flag}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-16 h-16 text-danger-red mx-auto" />
                      <h3 className="text-2xl font-bold text-danger-red">SAI RỒI!</h3>
                      <p className="text-foreground/90">
                        {selectedEmail === null
                          ? "Hết thời gian! Bạn cần nhanh hơn."
                          : "Đây không phải email lừa đảo. Bạn đã mất một mạng sống."}
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
