"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TypewriterText from "@/components/typewriter-text"
import type { GameState } from "@/app/page"
import { AudioManager } from "@/lib/audio-manager"
import { CheckCircle2, XCircle, Phone } from "lucide-react"

interface Level2SceneProps {
  gameState: GameState
  onComplete: (success: boolean) => void
  updateGameState: (updates: Partial<GameState>) => void
}

export default function Level2Scene({ gameState, onComplete, updateGameState }: Level2SceneProps) {
  const [showChallenge, setShowChallenge] = useState(false)
  const [otpInput, setOtpInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(45)
  const [showWarning, setShowWarning] = useState(false)

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

  const handleRefuse = () => {
    AudioManager.playSuccess()
    updateGameState({
      skills: {
        ...gameState.skills,
        otpAwareness: gameState.skills.otpAwareness + 1,
      },
    })
    setShowResult(true)
    setTimeout(() => onComplete(true), 3000)
  }

  const handleSubmitOTP = () => {
    if (otpInput.length === 6) {
      AudioManager.playError()
      setShowWarning(true)
      setTimeout(() => {
        setShowResult(true)
        setTimeout(() => onComplete(false), 3000)
      }, 2000)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <img src="/dark-hotel-corridor-with-phone-booth-cyberpunk-neo.jpg" alt="Hotel corridor" className="w-full h-full object-cover" />
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
            KỸ NĂNG: <span className="text-neon-green">{gameState.skills.otpAwareness}/3</span>
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
            <div className="inline-block px-4 py-1 border border-secondary/50 rounded-full">
              <span className="text-xs text-secondary font-mono uppercase">Cấp độ 2: Lừa Đảo OTP</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neon-magenta">Cuộc Gọi Đáng Ngờ</h2>
          </div>

          {!showChallenge ? (
            <div className="py-8">
              <TypewriterText
                text="Điện thoại của bạn đổ chuông. Một giọng nói tự xưng là nhân viên ngân hàng yêu cầu bạn cung cấp mã OTP để 'xác minh giao dịch'..."
                className="text-lg text-center text-foreground/90"
                speed={30}
              />
            </div>
          ) : (
            <>
              {!showResult ? (
                <div className="space-y-6">
                  {/* Phone call simulation */}
                  <div className="glass-panel rounded-lg p-6 space-y-4 border-2 border-secondary/30 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Ngân hàng Vietcombank</div>
                        <div className="text-sm text-muted-foreground">+84 1900 xxxx</div>
                      </div>
                    </div>

                    <div className="bg-background/50 rounded p-4 space-y-3 text-sm">
                      <p className="text-foreground/90">
                        <span className="font-semibold text-secondary">Nhân viên:</span> "Xin chào quý khách, tôi là
                        nhân viên Vietcombank. Chúng tôi phát hiện một giao dịch đáng ngờ từ tài khoản của quý khách."
                      </p>
                      <p className="text-foreground/90">
                        <span className="font-semibold text-secondary">Nhân viên:</span> "Để bảo vệ tài khoản, quý khách
                        vui lòng cung cấp mã OTP vừa nhận được qua SMS."
                      </p>
                      <div className="border-l-4 border-neon-cyan pl-3 text-neon-cyan">
                        Bạn vừa nhận được SMS: "Mã OTP của bạn là: 123456. Không chia sẻ mã này với bất kỳ ai."
                      </div>
                    </div>
                  </div>

                  {showWarning && (
                    <div className="glass-panel rounded-lg p-4 border-2 border-danger-red/50 bg-danger-red/10 animate-in fade-in">
                      <p className="text-danger-red text-center font-semibold">
                        ⚠ CẢNH BÁO: Không bao giờ chia sẻ mã OTP với bất kỳ ai, kể cả nhân viên ngân hàng!
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground">Bạn sẽ làm gì?</p>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-foreground">Nhập mã OTP:</label>
                        <Input
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="123456"
                          maxLength={6}
                          className="bg-background/50 border-border text-center text-2xl tracking-widest font-mono"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitOTP}
                        disabled={otpInput.length !== 6}
                        variant="outline"
                        className="w-full border-danger-red/50 text-danger-red hover:bg-danger-red/10 bg-transparent"
                      >
                        CUNG CẤP MÃ OTP
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleRefuse}
                        className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-bold py-6"
                      >
                        TỪ CHỐI VÀ GẬP MÁY
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  {gameState.skills.otpAwareness > 0 ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto" />
                      <h3 className="text-2xl font-bold text-neon-green">ĐÚNG RỒI!</h3>
                      <p className="text-foreground/90">
                        Bạn đã làm đúng! Không bao giờ chia sẻ mã OTP với bất kỳ ai, kể cả người tự xưng là nhân viên
                        ngân hàng.
                      </p>
                      <div className="glass-panel rounded p-4 text-left space-y-2">
                        <p className="text-sm font-semibold text-neon-cyan">Lưu ý quan trọng:</p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Ngân hàng KHÔNG BAO GIỜ yêu cầu mã OTP qua điện thoại</li>
                          <li>• Mã OTP chỉ dùng để XÁC NHẬN giao dịch do BẠN thực hiện</li>
                          <li>• Nếu nghi ngờ, hãy gọi lại số hotline chính thức của ngân hàng</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-16 h-16 text-danger-red mx-auto" />
                      <h3 className="text-2xl font-bold text-danger-red">SAI RỒI!</h3>
                      <p className="text-foreground/90">
                        Bạn đã bị lừa! Kẻ lừa đảo đã sử dụng mã OTP để rút sạch tiền trong tài khoản của bạn.
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
