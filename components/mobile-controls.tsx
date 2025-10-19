"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface MobileControlsProps {
  onMove: (direction: "left" | "right" | "stop") => void
  onJump: () => void
}

export default function MobileControls({ onMove, onJump }: MobileControlsProps) {
  const [joystickActive, setJoystickActive] = useState(false)
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const joystickRef = useRef<HTMLDivElement>(null)
  const touchIdRef = useRef<number | null>(null)

  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent default touch behavior
    if (touchIdRef.current !== null) return
    const touch = e.touches[0]
    touchIdRef.current = touch.identifier
    setJoystickActive(true)
    handleJoystickMove(e)
  }

  const handleJoystickMove = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent default touch behavior
    if (!joystickRef.current || touchIdRef.current === null) return

    const touch = Array.from(e.touches).find((t) => t.identifier === touchIdRef.current)
    if (!touch) return

    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let deltaX = touch.clientX - centerX
    let deltaY = touch.clientY - centerY

    const maxDistance = rect.width / 2 - 20
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX)
      deltaX = Math.cos(angle) * maxDistance
      deltaY = Math.sin(angle) * maxDistance
    }

    setJoystickPosition({ x: deltaX, y: deltaY })

    if (Math.abs(deltaX) > 10) {
      onMove(deltaX > 0 ? "right" : "left")
    } else {
      onMove("stop")
    }
  }

  const handleJoystickEnd = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent default touch behavior
    touchIdRef.current = null
    setJoystickActive(false)
    setJoystickPosition({ x: 0, y: 0 })
    onMove("stop")
  }

  const handleJumpButton = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent default touch behavior
    onJump()
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-between items-end px-8 pointer-events-none md:hidden">
      {/* Joystick */}
      <div className="pointer-events-auto">
        <div
          ref={joystickRef}
          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-md border-2 border-neon-cyan/30 shadow-2xl"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onTouchCancel={handleJoystickEnd}
          style={{ touchAction: "none" }} // Disable browser touch actions
        >
          {/* Joystick base glow */}
          <div className="absolute inset-0 rounded-full bg-neon-cyan/10 blur-xl" />

          {/* Direction indicators */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute left-2 text-neon-cyan/50 text-xs font-bold">◄</div>
            <div className="absolute right-2 text-neon-cyan/50 text-xs font-bold">►</div>
          </div>

          {/* Joystick knob */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta shadow-lg border-2 border-white/30"
            animate={{
              x: joystickPosition.x,
              y: joystickPosition.y,
              scale: joystickActive ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          </motion.div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-white/50" />
        </div>
        <div className="text-center mt-2 text-xs font-mono text-neon-cyan/70">DI CHUYỂN</div>
      </div>

      {/* Jump Button */}
      <div className="pointer-events-auto">
        <motion.button
          onTouchStart={handleJumpButton}
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neon-magenta/40 to-neon-magenta/20 backdrop-blur-md border-2 border-neon-magenta/50 shadow-2xl active:scale-95 transition-transform"
          whileTap={{ scale: 0.9 }}
          style={{ touchAction: "none" }} // Disable browser touch actions
        >
          {/* Button glow */}
          <div className="absolute inset-0 rounded-full bg-neon-magenta/20 blur-xl" />

          {/* Button content */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <div className="text-3xl">⬆️</div>
            <div className="text-xs font-bold text-white mt-1">JUMP</div>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
        </motion.button>
        <div className="text-center mt-2 text-xs font-mono text-neon-magenta/70">NHẢY</div>
      </div>
    </div>
  )
}
