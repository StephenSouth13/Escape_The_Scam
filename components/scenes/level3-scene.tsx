"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TypewriterText from "@/components/typewriter-text"
import type { GameState } from "@/app/page"
import { AudioManager } from "@/lib/audio-manager"
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle } from "lucide-react"

interface Level3SceneProps {
  gameState: GameState
  onComplete: (success: boolean) => void
  updateGameState: (updates: Partial<GameState>) => void
}

export default function Level3Scene({ gameState, onComplete, updateGameState }: Level3SceneProps) {
  const [showChallenge, setShowChallenge] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  const investments = [
    {
      id: 1,
      name: "Đầu tư Forex siêu lợi nhuận",
      promise: "Lợi nhuận 300% trong 1 tháng",
      description: "Tham gia nhóm VIP, chuyên gia hướng dẫn 24/7. Chỉ cần 10 triệu để bắt đầu!",
      isSafe: false,
      redFlags: ["Lợi nhuận phi thực tế", "Yêu cầu tham gia nhóm kín", "Áp lực đầu tư nhanh"],
    },
    {
      id: 2,
      name: 'Đầu tư tiền ảo "chắc thắng"',
      promise: "X10 tài khoản trong 2 tuần",
      description: "Đồng coin mới, sắp lên sàn. Cơ hội hiếm có! Đầu tư ngay kẻo lỡ!",
      isSafe: false,
      redFlags: ["Hứa hẹn chắc thắng", "Tạo cảm giác khan hiếm", "Không có thông tin rõ ràng"],
    },
    {
      id: 3,
      name: "Từ chối tất cả",
      promise: "Không đầu tư vào các cơ hội đáng ngờ",
      description: "Tìm hiểu kỹ, tham khảo ý kiến chuyên gia trước khi đầu tư bất kỳ khoản tiền nào.",
      isSafe: true,
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

  const handleSelect = (id: number) => {
    AudioManager.playClick()
    setSelectedOption(id)
  }

  const handleSubmit = () => {
    if (selectedOption === null) return

    const investment = investments.find((i) => i.id === selectedOption)
    if (investment?.isSafe) {
      AudioManager.playSuccess()
      updateGameState({
        skills: {
          ...gameState.skills,
          investmentCaution: gameState.skills.investmentCaution + 1,
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
        <img src="/dark-hotel-penthouse-with-city-lights-cyberpunk-fi.jpg" alt="Penthouse" className="w-full h-full object-cover" />
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
            KỸ NĂNG: <span className="text-neon-green">{gameState.skills.investmentCaution}/3</span>
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
            <div className="inline-block px-4 py-1 border border-accent/50 rounded-full">
              <span className="text-xs text-accent font-mono uppercase">Cấp độ 3: Lừa Đảo Đầu Tư</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neon-green">Cơ Hội Đầu Tư "Hấp Dẫn"</h2>
          </div>

          {!showChallenge ? (
            <div className="py-8">
              <TypewriterText
                text="Bạn tìm thấy Linh trong một căn phòng penthouse. Cô ấy đang bị thôi miên bởi những lời hứa hẹn về đầu tư sinh lời cao. Hãy giúp cô ấy tỉnh táo!"
                className="text-lg text-center text-foreground/90"
                speed={30}
              />
            </div>
          ) : (
            <>
              {!showResult ? (
                <div className="space-y-4">
                  <div className="glass-panel rounded p-4 border-l-4 border-neon-magenta">
                    <p className="text-sm text-foreground/90">
                      <span className="font-semibold text-neon-magenta">Linh:</span> "Họ nói tôi sẽ giàu có nếu đầu tư
                      ngay bây giờ. Tôi nên chọn cái nào?"
                    </p>
                  </div>

                  <p className="text-center text-muted-foreground">Hãy giúp Linh đưa ra quyết định đúng đắn:</p>

                  <div className="space-y-3">
                    {investments.map((investment) => (
                      <Card
                        key={investment.id}
                        className={`p-4 cursor-pointer transition-all border-2 ${
                          selectedOption === investment.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                        onClick={() => handleSelect(investment.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {investment.isSafe ? (
                                  <CheckCircle2 className="w-5 h-5 text-neon-green" />
                                ) : (
                                  <TrendingUp className="w-5 h-5 text-neon-magenta" />
                                )}
                                <h3 className="font-semibold text-foreground">{investment.name}</h3>
                              </div>
                              <div className="text-sm text-neon-cyan mt-1">{investment.promise}</div>
                            </div>
                            {selectedOption === investment.id && (
                              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{investment.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="glass-panel rounded p-4 border-l-4 border-danger-red/50 bg-danger-red/5">
                    <div className="flex gap-2">
                      <AlertTriangle className="w-5 h-5 text-danger-red flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/90">
                        <span className="font-semibold">Lưu ý:</span> Các khoản đầu tư hứa hẹn lợi nhuận cao bất thường
                        thường là lừa đảo. Hãy luôn thận trọng!
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold py-6"
                  >
                    XÁC NHẬN QUYẾT ĐỊNH
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  {selectedOption === 3 ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto" />
                      <h3 className="text-2xl font-bold text-neon-green">XUẤT SẮC!</h3>
                      <p className="text-foreground/90">
                        Bạn đã giúp Linh thoát khỏi bẫy lừa đảo đầu tư. Sự thận trọng là chìa khóa để bảo vệ tài sản!
                      </p>
                      <div className="glass-panel rounded p-4 text-left space-y-2">
                        <p className="text-sm font-semibold text-neon-cyan">Nguyên tắc đầu tư an toàn:</p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Không có khoản đầu tư nào "chắc thắng" 100%</li>
                          <li>• Lợi nhuận cao = rủi ro cao</li>
                          <li>• Luôn tìm hiểu kỹ trước khi đầu tư</li>
                          <li>• Tham khảo ý kiến chuyên gia độc lập</li>
                          <li>• Không vay nợ để đầu tư</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-16 h-16 text-danger-red mx-auto" />
                      <h3 className="text-2xl font-bold text-danger-red">THẤT BẠI!</h3>
                      <p className="text-foreground/90">
                        {selectedOption === null
                          ? "Hết thời gian! Linh đã bị thuyết phục đầu tư vào một khoản lừa đảo."
                          : "Đây là một khoản đầu tư lừa đảo! Linh đã mất tất cả tiền tiết kiệm."}
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
