"use client"

import { Button } from "@/components/ui/button"
import TypewriterText from "@/components/typewriter-text"
import { XCircle, AlertTriangle } from "lucide-react"
import { useEffect } from "react"
import { AudioManager } from "@/lib/audio-manager"

interface LoseSceneProps {
  onRestart: () => void
}

export default function LoseScene({ onRestart }: LoseSceneProps) {
  useEffect(() => {
    AudioManager.playGameOver()
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <img src="/dark-abandoned-hotel-room-cyberpunk-red-emergency-.jpg" alt="Game Over" className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      {/* Red alert overlay */}
      <div className="absolute inset-0 bg-danger-red/5 animate-pulse" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full space-y-8">
        {/* Game Over banner */}
        <div className="text-center space-y-4">
          <XCircle className="w-24 h-24 text-danger-red mx-auto" />
          <h1 className="text-5xl md:text-7xl font-bold text-danger-red glitch">THẤT BẠI</h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-danger-red to-transparent" />
        </div>

        {/* Message */}
        <div className="glass-panel rounded-lg p-8 border-2 border-danger-red/30 space-y-6">
          <TypewriterText
            text="Bạn đã không vượt qua được thử thách. Linh vẫn bị mắc kẹt trong khách sạn bí ẩn..."
            className="text-xl md:text-2xl text-center text-foreground/90"
            speed={40}
          />

          <div className="pt-4">
            <TypewriterText
              text="Những kẻ lừa đảo đã thắng lần này. Nhưng đừng bỏ cuộc! Hãy học hỏi từ sai lầm và thử lại."
              className="text-base md:text-lg text-center text-muted-foreground"
              speed={30}
            />
          </div>
        </div>

        {/* Warning message */}
        <div className="glass-panel rounded-lg p-6 border-l-4 border-danger-red bg-danger-red/10 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-danger-red flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-danger-red">Trong Thực Tế, Hậu Quả Có Thể Nghiêm Trọng Hơn</h3>
              <ul className="text-sm text-foreground/90 space-y-1">
                <li>• Mất toàn bộ tiền tiết kiệm</li>
                <li>• Thông tin cá nhân bị đánh cắp</li>
                <li>• Tài khoản ngân hàng bị chiếm đoạt</li>
                <li>• Danh tính bị mạo danh để lừa đảo người khác</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-neon-cyan text-center">Mẹo Để Thành Công</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-neon-cyan">•</span>
              <span>Di chuyển cẩn thận và tránh va chạm với kẻ địch khi chưa sẵn sàng</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">•</span>
              <span>Đọc kỹ câu hỏi và kịch bản scam trước khi chọn đáp án</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">•</span>
              <span>Chú ý đến các dấu hiệu cảnh báo (domain lạ, lời hứa phi thực tế, áp lực thời gian)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">•</span>
              <span>Khi nghi ngờ, hãy chọn phương án an toàn nhất - luôn xác minh qua kênh chính thức</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">•</span>
              <span>Đánh bại tất cả kẻ địch trước khi đến portal để qua tầng tiếp theo</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRestart}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 py-6 text-lg"
          >
            THỬ LẠI
          </Button>
        </div>

        {/* Encouragement */}
        <p className="text-center text-sm text-muted-foreground">
          Mỗi lần thất bại là một bài học. Hãy tiếp tục cố gắng!
        </p>
      </div>
    </div>
  )
}
