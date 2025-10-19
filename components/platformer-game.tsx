"use client"

import { useEffect, useRef, useState } from "react"
import type { GameState } from "@/app/page"
import { levelData, type LevelData, type Chest, type Decoration } from "@/lib/level-data"
import { SoundManager } from "@/lib/sound-manager"
import { VolumeX, Volume2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatQuizPopup from "@/components/chat-quiz-popup"
import MobileControls from "@/components/mobile-controls"
import MiniRadar from "@/components/mini-radar"

interface PlatformerGameProps {
  gameState: GameState
  onLevelComplete: (cyberIQGained: number) => void
  onGameOver: () => void
  updateGameState: (updates: Partial<GameState>) => void
}

interface Player {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  grounded: boolean
  facingRight: boolean
  animationState: "idle" | "walk" | "jump" | "fall"
  animationFrame: number
  animationTimer: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface Enemy {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: "laptop" | "camera" | "robot"
  defeated: boolean
  questionId: number
  animationOffset: number
}

interface PatrolEnemy {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: "drone" | "virus" | "firewall"
  patrolStart: number
  patrolEnd: number
  patrolSpeed: number
  patrolDirection: number
  animationOffset: number
}

export default function PlatformerGame({
  gameState,
  onLevelComplete,
  onGameOver,
  updateGameState,
}: PlatformerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const characterImageRef = useRef<HTMLImageElement | null>(null)

  const playerRef = useRef<Player>({
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    width: 120,
    height: 180,
    grounded: false,
    facingRight: true,
    animationState: "idle",
    animationFrame: 0,
    animationTimer: 0,
  })
  const enemiesRef = useRef<Enemy[]>([])
  const patrolEnemiesRef = useRef<PatrolEnemy[]>([])
  const particlesRef = useRef<Particle[]>([])
  const chestsRef = useRef<Chest[]>([])
  const decorationsRef = useRef<Decoration[]>([])
  const invincibilityTimerRef = useRef<number>(0)
  const skipQuizPowerRef = useRef<number>(0)

  const [showQuiz, setShowQuiz] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null)
  const [levelComplete, setLevelComplete] = useState(false)
  const cyberIQGainedRef = useRef(0)
  const [isMuted, setIsMuted] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const keysPressed = useRef<Set<string>>(new Set())
  const animationFrameId = useRef<number>()
  const currentLevelData = useRef<LevelData>(levelData[gameState.currentLevel - 1])
  const coyoteTimeRef = useRef<number>(0)
  const jumpBufferRef = useRef<number>(0)
  const gameLoopPausedRef = useRef(false)
  const mobileControlsRef = useRef({ left: false, right: false })

  useEffect(() => {
    const img = new Image()
    img.src = "/hackboy-character.png"
    img.onload = () => {
      characterImageRef.current = img
    }
  }, [])

  useEffect(() => {
    console.log("[v0] Initializing level", gameState.currentLevel)
    currentLevelData.current = levelData[gameState.currentLevel - 1]

    playerRef.current = {
      x: 150,
      y: 300,
      vx: 0,
      vy: 0,
      width: 120,
      height: 180,
      grounded: false,
      facingRight: true,
      animationState: "idle",
      animationFrame: 0,
      animationTimer: 0,
    }

    const newEnemies: Enemy[] = currentLevelData.current.enemies.map((e, i) => ({
      id: `enemy-${i}`,
      x: e.x,
      y: e.y,
      width: 50,
      height: 50,
      type: e.type,
      defeated: false,
      questionId: e.questionId,
      animationOffset: Math.random() * Math.PI * 2,
    }))
    enemiesRef.current = newEnemies

    const newPatrolEnemies: PatrolEnemy[] =
      currentLevelData.current.patrolEnemies?.map((e, i) => ({
        id: `patrol-${i}`,
        x: e.x,
        y: e.y,
        width: 45,
        height: 45,
        type: e.type,
        patrolStart: e.patrolStart,
        patrolEnd: e.patrolEnd,
        patrolSpeed: e.patrolSpeed,
        patrolDirection: 1,
        animationOffset: Math.random() * Math.PI * 2,
      })) || []
    patrolEnemiesRef.current = newPatrolEnemies

    chestsRef.current = currentLevelData.current.chests.map((c) => ({ ...c }))
    decorationsRef.current = currentLevelData.current.decorations.map((d) => ({ ...d }))

    particlesRef.current = []
    setLevelComplete(false)
    gameLoopPausedRef.current = false
    invincibilityTimerRef.current = 120 // 2 seconds at 60fps
    coyoteTimeRef.current = 0

    if (gameState.currentLevel === 1) {
      setShowTutorial(true)
    }
  }, [gameState.currentLevel])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase())

      if ((e.key === " " || e.key.toLowerCase() === "w") && !gameLoopPausedRef.current) {
        jumpBufferRef.current = 5
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    gameLoopPausedRef.current = showQuiz || levelComplete || showTutorial
  }, [showQuiz, levelComplete, showTutorial])

  const createParticles = (x: number, y: number, count: number, color: string) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        life: 30,
        maxLife: 30,
        color,
        size: Math.random() * 3 + 2,
      })
    }
    particlesRef.current = [...particlesRef.current, ...newParticles]
  }

  const drawCharacter = (ctx: CanvasRenderingContext2D, player: Player) => {
    const { x, y, facingRight } = player

    ctx.save()
    ctx.translate(x + player.width / 2, y + player.height / 2)
    if (!facingRight) ctx.scale(-1, 1)
    ctx.translate(-player.width / 2, -player.height / 2)

    if (characterImageRef.current) {
      ctx.shadowBlur = 15
      ctx.shadowColor = "#00ffff"
      ctx.drawImage(characterImageRef.current, 0, 0, player.width, player.height)
      ctx.shadowBlur = 0
    } else {
      ctx.shadowBlur = 20
      ctx.shadowColor = "#00ffff"
      ctx.fillStyle = "#00ffff"
      ctx.fillRect(0, 0, player.width, player.height)
      ctx.shadowBlur = 0
    }

    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const GRAVITY = 0.6
    const MOVE_SPEED = 5
    const ACCELERATION = 0.8
    const FRICTION = 0.85
    const JUMP_POWER = 15
    const COYOTE_TIME = 6

    const gameLoop = () => {
      if (gameLoopPausedRef.current) {
        animationFrameId.current = requestAnimationFrame(gameLoop)
        return
      }

      const player = playerRef.current
      const enemies = enemiesRef.current
      const patrolEnemies = patrolEnemiesRef.current
      const particles = particlesRef.current
      const chests = chestsRef.current
      const decorations = decorationsRef.current

      if (invincibilityTimerRef.current > 0) {
        invincibilityTimerRef.current--
      }

      if (jumpBufferRef.current > 0) {
        jumpBufferRef.current--
      }

      if (coyoteTimeRef.current > 0) {
        coyoteTimeRef.current--
      }

      let newVx = player.vx
      let newVy = player.vy + GRAVITY
      let newX = player.x
      let newY = player.y
      let newGrounded = false
      let newFacingRight = player.facingRight
      let newAnimationState = player.animationState
      let newAnimationFrame = player.animationFrame
      const newAnimationTimer = player.animationTimer + 1

      const targetVx =
        keysPressed.current.has("a") || keysPressed.current.has("arrowleft") || mobileControlsRef.current.left
          ? -MOVE_SPEED
          : keysPressed.current.has("d") || keysPressed.current.has("arrowright") || mobileControlsRef.current.right
            ? MOVE_SPEED
            : 0

      if (targetVx !== 0) {
        newVx += (targetVx - newVx) * ACCELERATION
        newFacingRight = targetVx > 0
        if (player.grounded && newAnimationTimer % 15 === 0) {
          SoundManager.playStep()
        }
      } else {
        newVx *= FRICTION
      }

      if (jumpBufferRef.current > 0 && coyoteTimeRef.current > 0) {
        newVy = -JUMP_POWER
        coyoteTimeRef.current = 0
        jumpBufferRef.current = 0
        SoundManager.playJump()
        createParticles(newX + player.width / 2, newY + player.height, 8, "#00ffff")
      }

      newX += newVx
      newY += newVy

      currentLevelData.current.platforms.forEach((platform) => {
        if (
          newY + player.height > platform.y &&
          player.y + player.height <= platform.y &&
          newX + player.width > platform.x &&
          newX < platform.x + platform.width
        ) {
          newY = platform.y - player.height
          newVy = 0
          newGrounded = true
          if (!player.grounded) {
            createParticles(newX + player.width / 2, newY + player.height, 12, "#00ffff")
          }
        }

        if (
          newY < platform.y + platform.height &&
          player.y >= platform.y + platform.height &&
          newX + player.width > platform.x &&
          newX < platform.x + platform.width
        ) {
          newY = platform.y + platform.height
          newVy = 0
        }

        if (
          newX < platform.x + platform.width &&
          player.x >= platform.x + platform.width &&
          newY + player.height > platform.y &&
          newY < platform.y + platform.height
        ) {
          newX = platform.x + platform.width
          newVx = 0
        }

        if (
          newX + player.width > platform.x &&
          player.x + player.width <= platform.x &&
          newY + player.height > platform.y &&
          newY < platform.y + platform.height
        ) {
          newX = platform.x - player.width
          newVx = 0
        }
      })

      if (newX < 0) newX = 0
      if (newX + player.width > canvas.width) newX = canvas.width - player.width
      if (newY + player.height > canvas.height) {
        newY = canvas.height - player.height
        newVy = 0
        newGrounded = true
        if (!player.grounded) {
          createParticles(newX + player.width / 2, newY + player.height, 12, "#00ffff")
        }
      }

      if (newGrounded) {
        coyoteTimeRef.current = COYOTE_TIME
      }

      if (!newGrounded && newVy < 0) {
        newAnimationState = "jump"
      } else if (!newGrounded && newVy > 0) {
        newAnimationState = "fall"
      } else if (Math.abs(newVx) > 0.5) {
        newAnimationState = "walk"
        if (newAnimationTimer % 5 === 0) {
          createParticles(newX + player.width / 2, newY + player.height - 5, 2, "#00ffff")
        }
      } else {
        newAnimationState = "idle"
      }

      if (newAnimationTimer % 8 === 0) {
        newAnimationFrame++
      }

      playerRef.current = {
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        width: player.width,
        height: player.height,
        grounded: newGrounded,
        facingRight: newFacingRight,
        animationState: newAnimationState,
        animationFrame: newAnimationFrame,
        animationTimer: newAnimationTimer,
      }

      particlesRef.current = particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2,
          life: p.life - 1,
        }))
        .filter((p) => p.life > 0)

      enemies.forEach((enemy) => {
        if (!enemy.defeated) {
          const hitboxReduction = 0.3
          const enemyHitboxX = enemy.x + (enemy.width * hitboxReduction) / 2
          const enemyHitboxY = enemy.y + (enemy.height * hitboxReduction) / 2
          const enemyHitboxWidth = enemy.width * (1 - hitboxReduction)
          const enemyHitboxHeight = enemy.height * (1 - hitboxReduction)

          const isStomping =
            playerRef.current.y + playerRef.current.height <= enemyHitboxY + 20 &&
            player.vy > 0 &&
            playerRef.current.x < enemyHitboxX + enemyHitboxWidth &&
            playerRef.current.x + playerRef.current.width > enemyHitboxX

          if (isStomping) {
            enemy.defeated = true
            cyberIQGainedRef.current += 10
            newVy = -8 // Bounce back up
            SoundManager.playSuccess()
            createParticles(enemy.x + enemy.width / 2, enemy.y, 15, "#00ff00")
          } else if (
            playerRef.current.x < enemyHitboxX + enemyHitboxWidth &&
            playerRef.current.x + playerRef.current.width > enemyHitboxX &&
            playerRef.current.y < enemyHitboxY + enemyHitboxHeight &&
            playerRef.current.y + playerRef.current.height > enemyHitboxY
          ) {
            setCurrentEnemy(enemy)
            setShowQuiz(true)
            SoundManager.playCollision()
          }
        }
      })

      patrolEnemies.forEach((enemy) => {
        const hitboxReduction = 0.25
        const enemyHitboxX = enemy.x + (enemy.width * hitboxReduction) / 2
        const enemyHitboxY = enemy.y + (enemy.height * hitboxReduction) / 2
        const enemyHitboxWidth = enemy.width * (1 - hitboxReduction)
        const enemyHitboxHeight = enemy.height * (1 - hitboxReduction)

        const distX = Math.abs(playerRef.current.x + playerRef.current.width / 2 - (enemy.x + enemy.width / 2))
        const distY = Math.abs(playerRef.current.y + playerRef.current.height / 2 - (enemy.y + enemy.height / 2))
        const distance = Math.sqrt(distX * distX + distY * distY)

        if (
          playerRef.current.x < enemyHitboxX + enemyHitboxWidth &&
          playerRef.current.x + playerRef.current.width > enemyHitboxX &&
          playerRef.current.y < enemyHitboxY + enemyHitboxHeight &&
          playerRef.current.y + playerRef.current.height > enemyHitboxY &&
          invincibilityTimerRef.current === 0
        ) {
          const newLives = gameState.lives - 1
          updateGameState({ lives: newLives })
          invincibilityTimerRef.current = 120
          SoundManager.playError()
          createParticles(
            playerRef.current.x + playerRef.current.width / 2,
            playerRef.current.y + playerRef.current.height / 2,
            15,
            "#ff0000",
          )

          if (newLives <= 0) {
            setTimeout(() => onGameOver(), 1000)
            return
          }
        }
      })

      chests.forEach((chest) => {
        if (
          !chest.collected &&
          playerRef.current.x < chest.x + chest.width &&
          playerRef.current.x + playerRef.current.width > chest.x &&
          playerRef.current.y < chest.y + chest.height &&
          playerRef.current.y + playerRef.current.height > chest.y
        ) {
          chest.collected = true
          SoundManager.playSuccess()
          createParticles(chest.x + chest.width / 2, chest.y + chest.height / 2, 20, "#00ff00")

          if (chest.type === "life") {
            updateGameState({ lives: gameState.lives + 1 })
          } else if (chest.type === "data") {
            cyberIQGainedRef.current += 5
          } else if (chest.type === "power") {
            skipQuizPowerRef.current++
          } else if (chest.type === "virus") {
            // Stun nearby enemies for 3 seconds
            // Apply stun to patrol enemies
            patrolEnemies.forEach((e) => {
              const dist = Math.sqrt((e.x - chest.x) ** 2 + (e.y - chest.y) ** 2)
              if (dist < 200) {
                const originalSpeed = e.patrolSpeed
                e.patrolSpeed = 0
                setTimeout(() => {
                  e.patrolSpeed = originalSpeed
                }, 3000)
              }
            })
          }
        }
      })

      patrolEnemies.forEach((enemy) => {
        enemy.x += enemy.patrolSpeed * enemy.patrolDirection
        if (enemy.x <= enemy.patrolStart || enemy.x >= enemy.patrolEnd) {
          enemy.patrolDirection *= -1
        }
      })

      const portal = currentLevelData.current.portal
      const allEnemiesDefeated = enemies.every((e) => e.defeated)

      if (allEnemiesDefeated) {
        const portalCollision =
          playerRef.current.x < portal.x + portal.width &&
          playerRef.current.x + playerRef.current.width > portal.x &&
          playerRef.current.y < portal.y + portal.height &&
          playerRef.current.y + playerRef.current.height > portal.y

        if (portalCollision && !levelComplete) {
          console.log("[v0] Portal collision detected! Player at:", playerRef.current.x, playerRef.current.y)
          console.log("[v0] Portal at:", portal.x, portal.y, "Size:", portal.width, portal.height)
          const finalScore = cyberIQGainedRef.current
          setLevelComplete(true)
          SoundManager.playSuccess()
          cyberIQGainedRef.current = 0
          setTimeout(() => {
            onLevelComplete(finalScore)
          }, 1500)
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0e1a")
      gradient.addColorStop(1, "#1a1f35")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "rgba(100, 100, 150, 0.05)"
      for (let i = 0; i < 5; i++) {
        const fogY = (Date.now() * 0.01 + i * 100) % canvas.height
        ctx.fillRect(0, fogY, canvas.width, 60)
      }

      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.strokeStyle = "rgba(0, 255, 255, 0.05)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.strokeStyle = "rgba(0, 255, 255, 0.05)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      decorations.forEach((deco) => {
        if (deco.glow) {
          ctx.shadowBlur = 20
          ctx.shadowColor = deco.color
        }

        ctx.fillStyle = deco.color
        ctx.fillRect(deco.x, deco.y, deco.width, deco.height)

        ctx.font = `${deco.height * 0.8}px monospace`
        ctx.textAlign = "center"
        ctx.fillText(deco.emoji, deco.x + deco.width / 2, deco.y + deco.height * 0.85)

        ctx.shadowBlur = 0
      })

      chests.forEach((chest) => {
        if (!chest.collected) {
          const time = Date.now() * 0.003
          const pulse = Math.sin(time) * 0.3 + 0.7

          ctx.shadowBlur = 25 * pulse
          ctx.shadowColor =
            chest.type === "life"
              ? "#00ff00"
              : chest.type === "data"
                ? "#00ffff"
                : chest.type === "power"
                  ? "#ffff00"
                  : "#ff00ff"

          const chestGradient = ctx.createRadialGradient(
            chest.x + chest.width / 2,
            chest.y + chest.height / 2,
            0,
            chest.x + chest.width / 2,
            chest.y + chest.height / 2,
            chest.width / 2,
          )
          chestGradient.addColorStop(0, ctx.shadowColor)
          chestGradient.addColorStop(1, "rgba(0,0,0,0.5)")
          ctx.fillStyle = chestGradient
          ctx.fillRect(chest.x, chest.y, chest.width, chest.height)

          ctx.font = "20px monospace"
          ctx.textAlign = "center"
          ctx.fillStyle = "#ffffff"
          ctx.fillText(
            chest.type === "life" ? "💙" : chest.type === "data" ? "💾" : chest.type === "power" ? "🧠" : "💥",
            chest.x + chest.width / 2,
            chest.y + chest.height / 2 + 7,
          )

          ctx.shadowBlur = 0
        }
      })

      currentLevelData.current.platforms.forEach((platform) => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fillRect(platform.x + 4, platform.y + 4, platform.width, platform.height)

        ctx.fillStyle = "#2a3f5f"
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)

        ctx.shadowBlur = 10
        ctx.shadowColor = "#00ffff"
        ctx.strokeStyle = "#00ffff"
        ctx.lineWidth = 2
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
        ctx.shadowBlur = 0

        ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
        ctx.lineWidth = 1
        for (let i = platform.x; i < platform.x + platform.width; i += 20) {
          ctx.beginPath()
          ctx.moveTo(i, platform.y)
          ctx.lineTo(i, platform.y + platform.height)
          ctx.stroke()
        }
      })

      if (enemies.every((e) => e.defeated)) {
        const time = Date.now() * 0.001
        const portal = currentLevelData.current.portal
        const portalGradient = ctx.createRadialGradient(
          portal.x + portal.width / 2,
          portal.y + portal.height / 2,
          0,
          portal.x + portal.width / 2,
          portal.y + portal.height / 2,
          portal.width / 2,
        )
        portalGradient.addColorStop(0, "#00ffff")
        portalGradient.addColorStop(0.5, "#ff00ff")
        portalGradient.addColorStop(1, "transparent")

        ctx.shadowBlur = 30
        ctx.shadowColor = "#ff00ff"
        ctx.fillStyle = portalGradient
        ctx.fillRect(portal.x, portal.y, portal.width, portal.height)
        ctx.shadowBlur = 0

        for (let i = 0; i < 3; i++) {
          const radius = (Math.sin(time * 2 + i) * 0.5 + 0.5) * portal.width * 0.4
          ctx.strokeStyle = `rgba(255, 0, 255, ${0.5 - i * 0.15})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(portal.x + portal.width / 2, portal.y + portal.height / 2, radius, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px monospace"
        ctx.textAlign = "center"
        ctx.shadowBlur = 5
        ctx.shadowColor = "#ffffff"
        ctx.fillText("PORTAL", portal.x + portal.width / 2, portal.y + portal.height / 2)
        ctx.shadowBlur = 0
      }

      const time = Date.now() * 0.001
      enemies.forEach((enemy) => {
        if (!enemy.defeated) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
          ctx.fillRect(enemy.x + 4, enemy.y + 4, enemy.width, enemy.height)

          ctx.shadowBlur = 30
          ctx.shadowColor = "#0066ff"

          const enemyGradient = ctx.createLinearGradient(enemy.x, enemy.y, enemy.x, enemy.y + enemy.height)
          enemyGradient.addColorStop(0, "#0066ff")
          enemyGradient.addColorStop(1, "#0044cc")
          ctx.fillStyle = enemyGradient
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)

          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height)

          ctx.shadowBlur = 0

          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 20px monospace"
          ctx.textAlign = "center"
          ctx.fillText("?", enemy.x + enemy.width / 2, enemy.y - 10)

          ctx.font = "28px monospace"
          ctx.fillText(
            enemy.type === "laptop" ? "💻" : enemy.type === "camera" ? "📷" : "🤖",
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2 + 10,
          )
        }
      })

      patrolEnemies.forEach((enemy) => {
        const bounce = Math.sin(time * 3 + enemy.animationOffset) * 5

        const distX = Math.abs(playerRef.current.x + playerRef.current.width / 2 - (enemy.x + enemy.width / 2))
        const distY = Math.abs(playerRef.current.y + playerRef.current.height / 2 - (enemy.y + enemy.height / 2))
        const distance = Math.sqrt(distX * distX + distY * distY)
        const isNear = distance < 100

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fillRect(enemy.x + 4, enemy.y + 4 + bounce, enemy.width, enemy.height)

        ctx.shadowBlur = isNear ? 40 : 25
        ctx.shadowColor = "#ff0000"

        const patrolGradient = ctx.createLinearGradient(enemy.x, enemy.y, enemy.x, enemy.y + enemy.height)
        patrolGradient.addColorStop(0, isNear ? "#ff3333" : "#ff0066")
        patrolGradient.addColorStop(1, isNear ? "#ff0000" : "#cc0044")
        ctx.fillStyle = patrolGradient
        ctx.fillRect(enemy.x, enemy.y + bounce, enemy.width, enemy.height)

        ctx.strokeStyle = isNear ? "#ffff00" : "#ffffff"
        ctx.lineWidth = isNear ? 3 : 2
        ctx.strokeRect(enemy.x, enemy.y + bounce, enemy.width, enemy.height)

        ctx.shadowBlur = 0

        ctx.fillStyle = "#ffffff"
        ctx.font = "24px monospace"
        ctx.textAlign = "center"
        ctx.fillText(
          enemy.type === "drone" ? "🛸" : enemy.type === "virus" ? "🦠" : "🛡️",
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2 + 9 + bounce,
        )
      })

      particlesRef.current.forEach((p) => {
        const alpha = p.life / p.maxLife
        ctx.fillStyle = p.color.replace(")", `, ${alpha})`)
        ctx.shadowBlur = 5
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      if (invincibilityTimerRef.current === 0 || Math.floor(invincibilityTimerRef.current / 10) % 2 === 0) {
        drawCharacter(ctx, playerRef.current)
      }

      if (invincibilityTimerRef.current > 60) {
        ctx.fillStyle = "rgba(0, 255, 0, 0.1)"
        ctx.fillRect(0, 0, 300, canvas.height)
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
        ctx.lineWidth = 3
        ctx.strokeRect(0, 0, 300, canvas.height)
        ctx.fillStyle = "#00ff00"
        ctx.font = "bold 16px monospace"
        ctx.textAlign = "center"
        ctx.fillText("VÙNG AN TOÀN", 150, 30)
      }

      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [gameState.currentLevel, gameState.lives, onLevelComplete, onGameOver, updateGameState])

  const handleQuizAnswer = (correct: boolean) => {
    if (correct && currentEnemy) {
      enemiesRef.current = enemiesRef.current.map((e) => (e.id === currentEnemy.id ? { ...e, defeated: true } : e))
      cyberIQGainedRef.current += 10
      SoundManager.playSuccess()
    } else if (skipQuizPowerRef.current > 0) {
      skipQuizPowerRef.current--
      if (currentEnemy) {
        enemiesRef.current = enemiesRef.current.map((e) => (e.id === currentEnemy.id ? { ...e, defeated: true } : e))
      }
      SoundManager.playSuccess()
    } else {
      SoundManager.playError()
    }

    setShowQuiz(false)
    setCurrentEnemy(null)
  }

  const handleMobileMove = (direction: "left" | "right" | "stop") => {
    console.log("[v0] Mobile move:", direction)
    if (direction === "left") {
      mobileControlsRef.current.left = true
      mobileControlsRef.current.right = false
    } else if (direction === "right") {
      mobileControlsRef.current.right = true
      mobileControlsRef.current.left = false
    } else {
      mobileControlsRef.current.left = false
      mobileControlsRef.current.right = false
    }
  }

  const handleMobileJump = () => {
    console.log("[v0] Mobile jump")
    if (!gameLoopPausedRef.current) {
      jumpBufferRef.current = 5
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    console.log("[v0] Toggling mute:", newMuted)
    setIsMuted(newMuted)
    SoundManager.setMuted(newMuted)
    if (!newMuted) {
      SoundManager.playClick()
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20">
        <img
          src={currentLevelData.current.backgroundImage || "/placeholder.svg"}
          alt="Level background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="flex gap-3">
          <div className="glass-panel rounded px-4 py-2 space-y-1 text-xs font-mono">
            <div>
              {gameState.playerName.toUpperCase()}: <span className="text-neon-cyan">{gameState.mssv || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>HP:</span>
              <div className="flex gap-1">
                {Array.from({ length: Math.max(gameState.lives, 0) }).map((_, i) => (
                  <Heart key={i} className="w-4 h-4 fill-neon-magenta text-neon-magenta" />
                ))}
              </div>
            </div>
            <div>
              CYBER IQ: <span className="text-neon-green">{gameState.cyberIQ + cyberIQGainedRef.current}</span>
            </div>
            {skipQuizPowerRef.current > 0 && (
              <div>
                SKIP: <span className="text-neon-yellow">🧠 x{skipQuizPowerRef.current}</span>
              </div>
            )}
          </div>

          <MiniRadar
            playerX={playerRef.current.x}
            playerY={playerRef.current.y}
            enemies={enemiesRef.current}
            chests={chestsRef.current}
            canvasWidth={1200}
            canvasHeight={600}
          />
        </div>

        <div className="flex gap-2 items-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="glass-panel rounded px-3 py-1 text-xs"
          >
            ❓ Hướng Dẫn
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMute} className="glass-panel rounded w-10 h-10">
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-neon-cyan" />
            )}
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        className="border-2 border-primary/30 rounded-lg shadow-2xl"
        style={{ maxWidth: "100%", height: "auto" }}
      />

      <MobileControls onMove={handleMobileMove} onJump={handleMobileJump} />

      {showQuiz && currentEnemy && (
        <ChatQuizPopup
          question={currentLevelData.current.questions[currentEnemy.questionId]}
          onAnswer={handleQuizAnswer}
        />
      )}

      {showTutorial && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-40">
          <div className="glass-panel rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto space-y-4">
            <h2 className="text-2xl font-bold text-neon-cyan">🎮 HƯỚNG DẪN CHƠI</h2>

            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-bold text-neon-green mb-1">🎯 Mục Tiêu:</h3>
                <p>Vượt qua 4 tầng khách sạn, trả lời câu hỏi về an toàn mạng, và giải cứu Linh!</p>
              </div>

              <div>
                <h3 className="font-bold text-neon-green mb-1">🕹️ Điều Khiển:</h3>
                <p>
                  <strong>PC:</strong> A/D hoặc ←/→ để di chuyển, Space hoặc W để nhảy
                </p>
                <p>
                  <strong>Mobile:</strong> Dùng joystick và nút nhảy ở góc màn hình
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neon-green mb-1">🎨 Nhận Diện Vật Thể:</h3>
                <p>
                  <span className="text-blue-400">🔵 Ánh sáng xanh + dấu "?"</span> = Câu hỏi (đứng yên, không gây sát
                  thương)
                </p>
                <p>
                  <span className="text-red-400">🔴 Ánh sáng đỏ</span> = Kẻ địch tuần tra (di chuyển, gây sát thương)
                </p>
                <p>
                  <span className="text-green-400">💚 Phát sáng xanh lá</span> = Rương vật phẩm (💙 mạng, 💾 điểm, 🧠
                  skip, 💥 stun)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neon-green mb-1">🛡️ Vùng An Toàn:</h3>
                <p>Khi bắt đầu mỗi tầng, bạn có 2 giây miễn sát thương trong vùng xanh lá để chuẩn bị!</p>
              </div>

              <div>
                <h3 className="font-bold text-neon-yellow mb-1">💡 Mẹo Chơi:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Quan sát kỹ màu sắc để phân biệt vật thể</li>
                  <li>Kẻ địch đỏ sẽ nhấp nháy khi bạn ở gần - hãy cẩn thận!</li>
                  <li>Thu thập rương để có thêm mạng và vật phẩm hỗ trợ</li>
                  <li>Trả lời đúng câu hỏi để tăng Cyber IQ và mở portal</li>
                </ul>
              </div>
            </div>

            <Button onClick={() => setShowTutorial(false)} className="w-full">
              Đã Hiểu - Bắt Đầu Chơi!
            </Button>
          </div>
        </div>
      )}

      {levelComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
          <div className="glass-panel rounded-lg p-8 text-center space-y-4 max-w-md">
            <div className="text-4xl">🎉</div>
            <h2 className="text-3xl font-bold text-neon-green">HOÀN THÀNH!</h2>
            <p className="text-foreground/90">Bạn đã vượt qua tầng {gameState.currentLevel}!</p>
            <div className="text-2xl font-bold text-neon-cyan">+{cyberIQGainedRef.current} Cyber IQ</div>
          </div>
        </div>
      )}
    </div>
  )
}
