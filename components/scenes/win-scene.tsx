"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TypewriterText from "@/components/typewriter-text"
import type { GameState } from "@/app/page"
import { Trophy, Star, Shield, Zap, BookOpen, User, Hash } from "lucide-react"
import { useEffect, useState } from "react"
import { SoundManager } from "@/lib/sound-manager"
import KnowledgeBook from "@/components/knowledge-book"
import { motion } from "framer-motion"

interface WinSceneProps {
  gameState: GameState
  onRestart: () => void
}

export default function WinScene({ gameState, onRestart }: WinSceneProps) {
  const [showKnowledgeBook, setShowKnowledgeBook] = useState(false)

  useEffect(() => {
    SoundManager.playSuccess()
  }, [])

  const getRank = (score: number) => {
    if (score >= 120) return { title: "Huyền Thoại Cyber", color: "text-neon-cyan" }
    if (score >= 100) return { title: "Chuyên Gia Bảo Mật", color: "text-neon-magenta" }
    if (score >= 75) return { title: "Thám Tử Mạng", color: "text-neon-green" }
    return { title: "Người Bảo Vệ", color: "text-primary" }
  }

  const rank = getRank(gameState.cyberIQ)

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="/cyberpunk-city-skyline-at-dawn-with-bright-lights-.jpg"
          alt="Victory"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />

      {/* Celebration effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [1, 0], y: -100 }}
            transition={{ duration: 3, delay: i * 0.1, repeat: Number.POSITIVE_INFINITY }}
            className="absolute w-3 h-3 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: 0,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full space-y-8">
        {/* Victory banner */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center space-y-4"
        >
          <Trophy className="w-32 h-32 text-neon-cyan mx-auto animate-bounce" />
          <h1 className="text-6xl md:text-8xl font-bold text-neon-cyan glitch">CHIẾN THẮNG!</h1>
          <div className="h-2 w-64 mx-auto bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-lg p-8 border-2 border-neon-cyan/50 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
              <User className="w-6 h-6 text-neon-cyan flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Tên Sinh Viên</p>
                <p className="text-xl font-bold text-neon-cyan">{gameState.playerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4">
              <Hash className="w-6 h-6 text-neon-magenta flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">MSSV (Mã Số Sinh Viên)</p>
                <p className="text-xl font-bold text-neon-magenta">{gameState.mssv || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Story conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-lg p-8 space-y-6"
        >
          <TypewriterText
            text={`Chúc mừng ${gameState.playerName}! Bạn đã giải cứu Linh thành công và giúp cô ấy thoát khỏi những cạm bẫy lừa đảo trực tuyến.`}
            className="text-xl md:text-2xl text-center text-foreground/90"
            speed={40}
          />

          <div className="pt-4">
            <TypewriterText
              text="Nhờ vào kiến thức và sự thận trọng của bạn, cả hai đã an toàn rời khỏi khách sạn bí ẩn. Linh đã học được bài học quý giá về an toàn mạng."
              className="text-base md:text-lg text-center text-muted-foreground"
              speed={30}
            />
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Card className="glass-panel p-6 text-center space-y-2 border-neon-cyan/30">
            <Zap className="w-8 h-8 text-neon-cyan mx-auto" />
            <div className="text-4xl font-bold text-neon-cyan">{gameState.cyberIQ}</div>
            <div className="text-sm text-muted-foreground">Cyber IQ</div>
          </Card>

          <Card className="glass-panel p-6 text-center space-y-2 border-neon-magenta/30">
            <Shield className="w-8 h-8 text-neon-magenta mx-auto" />
            <div className="text-4xl font-bold text-neon-magenta">{gameState.completedLevels.length}/4</div>
            <div className="text-sm text-muted-foreground">Tầng Hoàn Thành</div>
          </Card>

          <Card className="glass-panel p-6 text-center space-y-2 border-neon-green/30">
            <Trophy className="w-8 h-8 text-neon-green mx-auto" />
            <div className="text-4xl font-bold text-neon-green">{gameState.lives}</div>
            <div className="text-sm text-muted-foreground">Mạng Còn Lại</div>
          </Card>
        </motion.div>

        {/* Rank display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="glass-panel rounded-lg p-8 border-2 border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10"
        >
          <div className="flex items-center gap-6">
            <Star
              className={`w-16 h-16 ${rank.color} flex-shrink-0 animate-spin`}
              style={{ animationDuration: "3s" }}
            />
            <div className="flex-1">
              <h3 className={`text-3xl font-bold ${rank.color} mb-2`}>{rank.title}</h3>
              <p className="text-base text-muted-foreground">
                Bạn đã hoàn thành tất cả 4 tầng với {gameState.cyberIQ} Cyber IQ. Bạn là một chiến binh bảo vệ mạng thực
                thụ!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key lessons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="glass-panel rounded-lg p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-neon-magenta text-center">Bài Học Quan Trọng</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-neon-cyan">✓</span>
              <span>Luôn kiểm tra kỹ email và link trước khi click (Phishing)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">✓</span>
              <span>Không bao giờ chia sẻ mã OTP với bất kỳ ai (OTP Scam)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">✓</span>
              <span>Cảnh giác với các cơ hội đầu tư hứa hẹn lợi nhuận cao bất thường (Investment Fraud)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">✓</span>
              <span>Xác minh qua nhiều kênh khi nhận video/audio đáng ngờ (Deepfake & AI)</span>
            </li>
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => setShowKnowledgeBook(true)}
            className="bg-gradient-to-r from-neon-magenta to-neon-cyan hover:from-neon-magenta/80 hover:to-neon-cyan/80 text-background font-bold px-8 py-6 text-lg gap-2"
          >
            <BookOpen className="w-5 h-5" />
            XEM SÁCH KIẾN THỨC
          </Button>
          <Button
            onClick={onRestart}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 py-6 text-lg"
          >
            CHƠI LẠI
          </Button>
        </motion.div>
      </div>

      {showKnowledgeBook && <KnowledgeBook onClose={() => setShowKnowledgeBook(false)} />}
    </div>
  )
}
