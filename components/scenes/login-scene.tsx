"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { SoundManager } from "@/lib/sound-manager"
import TutorialPopup from "@/components/tutorial-popup"
import { Volume2, VolumeX, HelpCircle } from "lucide-react"

interface LoginSceneProps {
  onStart: (name: string, mssv: string) => void
}

export default function LoginScene({ onStart }: LoginSceneProps) {
  const [name, setName] = useState("")
  const [mssv, setMssv] = useState("")
  const [showIntro, setShowIntro] = useState(true)
  const [introStep, setIntroStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setIntroStep(1), 2000),
      setTimeout(() => setIntroStep(2), 4000),
      setTimeout(() => setIntroStep(3), 6000),
      setTimeout(() => setShowIntro(false), 8000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  const handleStart = () => {
    if (name.trim()) {
      SoundManager.playClick()
      onStart(name.trim(), mssv.trim())
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    SoundManager.setMuted(newMuted)
    SoundManager.playClick()
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <img
          src="/dark-cyberpunk-hotel-exterior-with-neon-signs-at-n.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Sound toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 glass-panel rounded-full w-12 h-12"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-muted-foreground" />
        ) : (
          <Volume2 className="w-6 h-6 text-neon-cyan" />
        )}
      </Button>

      {/* Cinematic intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background flex items-center justify-center"
          >
            <div className="text-center space-y-8 max-w-3xl px-4">
              {introStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="text-6xl">🏨</div>
                  <h1 className="text-5xl font-bold text-neon-cyan">KHÁCH SẠN BÍ ẨN</h1>
                  <p className="text-xl text-foreground/80">Một câu chuyện về lừa đảo trực tuyến</p>
                </motion.div>
              )}

              {introStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <p className="text-2xl font-bold text-neon-magenta">Linh, bạn của bạn, đã mất tích...</p>
                  <p className="text-lg text-foreground/80">
                    Cô ấy nhận được một email lạ từ "Khách sạn Cyber Paradise"
                  </p>
                </motion.div>
              )}

              {introStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <p className="text-2xl font-bold text-neon-green">Cô ấy đang bị giam giữ...</p>
                  <p className="text-lg text-foreground/80">Trong một khách sạn đầy bẫy lừa đảo</p>
                </motion.div>
              )}

              {introStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <p className="text-3xl font-bold text-neon-cyan">Bạn có đủ can đảm không?</p>
                  <p className="text-xl text-neon-magenta">Hãy vượt qua 4 tầng để giải cứu cô ấy!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-4xl w-full"
          >
            {/* Technical overlay */}
            <div className="absolute top-4 left-4 text-xs text-muted-foreground font-mono space-y-1">
              <div>
                TRẠNG THÁI HỆ THỐNG: <span className="text-neon-cyan">TRỰC TUYẾN</span>
              </div>
              <div>
                MÃ PHIÊN:{" "}
                <span className="text-neon-magenta">ESC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div>
                THỜI GIAN: <span className="text-neon-green">{new Date().toLocaleTimeString("vi-VN")}</span>
              </div>
            </div>

            {/* Main content */}
            <div className="glass-panel rounded-lg p-8 md:p-12 space-y-8">
              <div className="text-center space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-bold text-neon-cyan glitch"
                >
                  ESCAPE THE SCAM
                </motion.h1>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />
              </div>

              <div className="space-y-6 text-center">
                <div className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                  <p className="mb-4">
                    Linh, bạn của bạn, đã mất tích sau khi nhận được một email lạ từ "Khách sạn Cyber Paradise"...
                  </p>
                  <p className="mb-4">Cô ấy đang bị giam giữ ở đâu đó trong khách sạn đầy bẫy lừa đảo này.</p>
                  <p className="text-neon-magenta font-bold">Bạn phải vượt qua 4 tầng nguy hiểm để giải cứu cô ấy!</p>
                </div>

                <div className="max-w-md mx-auto space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm text-neon-green uppercase tracking-wider">Tên HackBoy của bạn:</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleStart()}
                      placeholder="Nhập tên của bạn..."
                      className="bg-background/50 border-primary/50 text-foreground placeholder:text-muted-foreground focus:border-primary text-center text-lg"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neon-cyan uppercase tracking-wider">MSSV (Mã Số Sinh Viên):</label>
                    <Input
                      type="text"
                      value={mssv}
                      onChange={(e) => setMssv(e.target.value)}
                      placeholder="VD: 20210001"
                      className="bg-background/50 border-primary/50 text-foreground placeholder:text-muted-foreground focus:border-primary text-center text-lg"
                    />
                  </div>

                  <Button
                    onClick={handleStart}
                    disabled={!name.trim()}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:from-neon-cyan/80 hover:to-neon-magenta/80 text-background font-bold text-lg py-6 relative overflow-hidden group"
                  >
                    <span className="relative z-10">🎮 BẮT ĐẦU NHIỆM VỤ GIẢI CỨU</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </Button>

                  <Button
                    onClick={() => {
                      SoundManager.playClick()
                      setShowTutorial(true)
                    }}
                    variant="outline"
                    className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 font-bold py-6"
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />📖 HƯỚNG DẪN CHƠI
                  </Button>
                </div>
              </div>

              {/* Warning message */}
              <div className="border border-danger-red/30 bg-danger-red/10 rounded p-4 text-center">
                <p className="text-sm text-danger-red font-mono">
                  ⚠ CẢNH BÁO: Trò chơi này chứa nội dung về lừa đảo trực tuyến. Hãy học hỏi và bảo vệ bản thân!
                </p>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-6 text-center text-xs text-muted-foreground font-mono space-y-1">
              <p>🛡️ Một trò chơi giáo dục về an toàn mạng</p>
              <p className="text-neon-cyan">Học cách nhận diện và tránh các chiêu lừa đảo trực tuyến</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial popup */}
      <AnimatePresence>{showTutorial && <TutorialPopup onClose={() => setShowTutorial(false)} />}</AnimatePresence>
    </div>
  )
}
