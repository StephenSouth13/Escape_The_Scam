"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TutorialPopupProps {
  onClose: () => void
}

export default function TutorialPopup({ onClose }: TutorialPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-panel rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-neon-cyan">📖 HƯỚNG DẪN CHƠI</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6 text-foreground/90">
          {/* Story */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neon-magenta flex items-center gap-2">🎭 CỐT TRUYỆN</h3>
            <p className="leading-relaxed">
              Linh, bạn của bạn, đã mất tích sau khi nhận được một email lừa đảo từ "Khách sạn Cyber Paradise". Cô ấy
              đang bị giam giữ ở đâu đó trong khách sạn đầy bẫy lừa đảo này. Nhiệm vụ của bạn là vượt qua 6 tầng nguy
              hiểm, đánh bại các kẻ xấu bằng kiến thức an toàn mạng, và giải cứu Linh!
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neon-cyan flex items-center gap-2">🎮 ĐIỀU KHIỂN</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-panel rounded p-4">
                <h4 className="font-bold text-neon-green mb-2">💻 PC / Laptop:</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <span className="text-neon-cyan">A / ←</span> - Di chuyển sang trái
                  </li>
                  <li>
                    • <span className="text-neon-cyan">D / →</span> - Di chuyển sang phải
                  </li>
                  <li>
                    • <span className="text-neon-cyan">SPACE / W</span> - Nhảy
                  </li>
                </ul>
              </div>
              <div className="glass-panel rounded p-4">
                <h4 className="font-bold text-neon-green mb-2">📱 Mobile / Tablet:</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <span className="text-neon-cyan">Joystick trái</span> - Di chuyển
                  </li>
                  <li>
                    • <span className="text-neon-cyan">Nút phải</span> - Nhảy
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gameplay */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neon-magenta flex items-center gap-2">⚔️ CÁCH CHƠI</h3>
            <ul className="space-y-2 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-neon-cyan">1.</span>
                <span>Di chuyển HackBoy qua các nền tảng và tránh rơi xuống</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-cyan">2.</span>
                <span>Va chạm với kẻ xấu (💻 📷 🤖) để kích hoạt câu hỏi</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-cyan">3.</span>
                <span>Trả lời đúng để đánh bại kẻ xấu và nhận +10 Cyber IQ</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-cyan">4.</span>
                <span>Trả lời sai sẽ mất 1 mạng (bạn có 3 mạng)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-cyan">5.</span>
                <span>Đánh bại tất cả kẻ xấu để mở Portal sang tầng tiếp theo</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-cyan">6.</span>
                <span>Hoàn thành 6 tầng để giải cứu Linh!</span>
              </li>
            </ul>
          </div>

          {/* Enemies */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neon-cyan flex items-center gap-2">👾 KẺ XẤU</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="glass-panel rounded p-3 text-center">
                <div className="text-3xl mb-2">💻</div>
                <div className="font-bold text-danger-red">Laptop Lừa Đảo</div>
                <div className="text-xs text-muted-foreground mt-1">Phishing & Email giả</div>
              </div>
              <div className="glass-panel rounded p-3 text-center">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold text-neon-magenta">Camera Gián Điệp</div>
                <div className="text-xs text-muted-foreground mt-1">OTP & Deepfake</div>
              </div>
              <div className="glass-panel rounded p-3 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-bold text-neon-green">Robot AI</div>
                <div className="text-xs text-muted-foreground mt-1">Đầu tư giả & AI scam</div>
              </div>
            </div>
          </div>

          {/* Levels */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neon-magenta flex items-center gap-2">🏢 6 TẦNG KHÁCH SẠN</h3>
            <div className="space-y-2 text-sm">
              <div className="glass-panel rounded p-3">
                <span className="font-bold text-neon-cyan">Tầng 1:</span> Phishing Lobby - Học cách nhận diện email lừa
                đảo
              </div>
              <div className="glass-panel rounded p-3">
                <span className="font-bold text-neon-cyan">Tầng 2:</span> OTP Hellway - Bảo vệ mã OTP của bạn
              </div>
              <div className="glass-panel rounded p-3">
                <span className="font-bold text-neon-cyan">Tầng 3:</span> Investment Trap - Tránh lừa đảo đầu tư
              </div>
              <div className="glass-panel rounded p-3">
                <span className="font-bold text-neon-cyan">Tầng 4:</span> Deepfake Floor - Nhận diện video/audio giả
              </div>
              <div className="glass-panel rounded p-3">
                <span className="font-bold text-neon-cyan">Tầng 5:</span> Blackmail Chamber - Đối phó với tống tiền
              </div>
              <div className="glass-panel rounded p-3">
                <span className="font-bold text-neon-cyan">Tầng 6:</span> AI Boss Battle - Chiến đấu với AI lừa đảo
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neon-green flex items-center gap-2">💡 MẸO CHƠI</h3>
            <ul className="space-y-1 text-sm">
              <li>• Đọc kỹ câu hỏi và các đáp án trước khi chọn</li>
              <li>• Sau mỗi câu trả lời, đọc phần giải thích để học thêm</li>
              <li>• Bật âm thanh để trải nghiệm tốt hơn</li>
              <li>• Sau khi thắng, xem Sách Kiến Thức để ôn lại tất cả</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-neon-cyan to-neon-magenta hover:from-neon-cyan/80 hover:to-neon-magenta/80 text-background font-bold px-8 py-6 text-lg"
          >
            ✅ HIỂU RỒI, BẮT ĐẦU CHƠI!
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
