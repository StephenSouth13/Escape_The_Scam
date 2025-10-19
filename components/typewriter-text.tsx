"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
  onComplete?: () => void
}

export default function TypewriterText({ text, className = "", speed = 50, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete && currentIndex === text.length) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <p className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />}
    </p>
  )
}
