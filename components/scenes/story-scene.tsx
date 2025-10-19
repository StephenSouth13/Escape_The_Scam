"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TypewriterText from "@/components/typewriter-text"
import { AudioManager } from "@/lib/audio-manager"

interface StorySceneProps {
  onContinue: () => void
}

export default function StoryScene({ onContinue }: StorySceneProps) {
  const [currentParagraph, setCurrentParagraph] = useState(0)

  const story = [
    "Ba ngày trước, Linh nhận được một email từ 'Khách sạn Paradise' thông báo cô đã trúng một kỳ nghỉ miễn phí.",
    "Cô ấy đã click vào link trong email và điền thông tin cá nhân. Kể từ đó, không ai liên lạc được với cô ấy.",
    "Bạn đã theo dõi dấu vết và tìm thấy địa chỉ khách sạn. Nhưng khi đến nơi, bạn phát hiện đây là một cái bẫy tinh vi.",
    "Bây giờ, bạn bị mắc kẹt trong khách sạn này. Để thoát ra và cứu Linh, bạn phải vượt qua các thử thách về lừa đảo trực tuyến.",
  ]

  const handleNext = () => {
    AudioManager.playClick()
    if (currentParagraph < story.length - 1) {
      setCurrentParagraph(currentParagraph + 1)
    } else {
      onContinue()
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <img src="/dark-mysterious-hotel-lobby-with-flickering-lights.jpg" alt="Hotel lobby" className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full">
        <div className="glass-panel rounded-lg p-8 md:p-12 space-y-8">
          {/* Chapter indicator */}
          <div className="text-center">
            <div className="inline-block px-4 py-2 border border-primary/50 rounded-full">
              <span className="text-xs text-primary font-mono uppercase tracking-wider">Chương 1: Bí Ẩn Bắt Đầu</span>
            </div>
          </div>

          {/* Story text */}
          <div className="min-h-[200px] flex items-center justify-center">
            <TypewriterText
              key={currentParagraph}
              text={story[currentParagraph]}
              className="text-xl md:text-2xl text-foreground/90 leading-relaxed text-center"
              speed={40}
              onComplete={() => {}}
            />
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2">
            {story.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-12 rounded-full transition-colors ${
                  index <= currentParagraph ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Continue button */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-6 text-lg font-bold"
            >
              {currentParagraph < story.length - 1 ? "TIẾP TỤC" : "BẮT ĐẦU THÁCH THỨC"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
