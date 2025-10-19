"use client"

import { useState, useEffect, useCallback } from "react" // Thêm useCallback
import LoginScene from "@/components/scenes/login-scene"
import StoryScene from "@/components/scenes/story-scene"
import PlatformerGame from "@/components/platformer-game"
import WinScene from "@/components/scenes/win-scene"
import LoseScene from "@/components/scenes/lose-scene"
import { MusicManager } from "@/lib/music-manager"

export type GameScene = "login" | "story" | "game" | "win" | "lose"

export interface GameState {
  playerName: string
  mssv: string
  currentScene: GameScene
  currentLevel: number
  cyberIQ: number
  lives: number
  completedLevels: number[]
  // ĐÃ SỬA: Chính tả phải là 'phishingDetection'
  skills: {
    phishingDetection: number // ĐÃ SỬA CHÍNH TẢ
  }
}

// TÁCH HẰNG SỐ KHỞI TẠO ĐỂ DỄ DÀNG RESTART
const INITIAL_GAME_STATE: GameState = {
  playerName: "",
  mssv: "",
  currentScene: "login",
  currentLevel: 1,
  cyberIQ: 0,
  lives: 3,
  completedLevels: [],
  // ĐÃ THÊM: Khởi tạo cho 'skills'
  skills: {
    phishingDetection: 0,
  },
}

export default function GamePage() {
  // SỬ DỤNG HẰNG SỐ KHỞI TẠO
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)

  // Hàm chuẩn hóa logic reset game
  const resetGame = () => {
    setGameState(INITIAL_GAME_STATE)
    changeScene("login")
  }

  useEffect(() => {
    // Initialize music on mount
    MusicManager.init()
    MusicManager.playMenuMusic()

    return () => {
      MusicManager.stopAll()
    }
  }, [])

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }

  // SỬ DỤNG useCallback VÀ THÊM LOGIC CHUYỂN NHẠC GỌN GÀNG HƠN
  const changeScene = useCallback((scene: GameScene, nextLevel?: number) => {
    setGameState((prev) => ({ ...prev, currentScene: scene }))

    MusicManager.stopAll() // Dừng nhạc cũ trước

    if (scene === "game") {
      const levelToPlay = nextLevel !== undefined ? nextLevel : gameState.currentLevel
      MusicManager.playLevelMusic(levelToPlay)
    } else if (scene === "win") {
      MusicManager.playWinMusic()
    } else if (scene === "lose") {
      MusicManager.playLoseMusic()
    } else {
      MusicManager.playMenuMusic()
    }
  }, [gameState.currentLevel]) // Thêm gameState.currentLevel vào dependencies

  const renderScene = () => {
    switch (gameState.currentScene) {
      case "login":
        return (
          <LoginScene
            onStart={(name, mssv) => {
              updateGameState({ playerName: name, mssv: mssv })
              changeScene("story")
            }}
          />
        )
      case "story":
        return <StoryScene onContinue={() => changeScene("game")} />
      case "game":
        return (
          <PlatformerGame
            gameState={gameState}
            onLevelComplete={(cyberIQGained) => {
              const newCyberIQ = gameState.cyberIQ + cyberIQGained
              const newCompletedLevels = [...gameState.completedLevels, gameState.currentLevel]
              const nextLevel = gameState.currentLevel + 1

              if (gameState.currentLevel >= 4) {
                // Beat final level
                updateGameState({ cyberIQ: newCyberIQ, completedLevels: newCompletedLevels })
                changeScene("win")
              } else {
                // Move to next level
                updateGameState({
                  currentLevel: nextLevel,
                  cyberIQ: newCyberIQ,
                  completedLevels: newCompletedLevels,
                })
                // Gọi changeScene với nextLevel để chơi nhạc đúng
                changeScene("game", nextLevel)
              }
            }}
            onGameOver={() => {
              changeScene("lose")
            }}
            updateGameState={updateGameState}
          />
        )
      case "win":
        return (
          <WinScene
            gameState={gameState}
            // SỬ DỤNG HÀM RESET GỌN GÀNG
            onRestart={resetGame}
          />
        )
      case "lose":
        return (
          <LoseScene
            // SỬ DỤNG HÀM RESET GỌN GÀNG
            onRestart={resetGame}
          />
        )
      default:
        return null
    }
  }

  return <main className="min-h-screen bg-background scanline overflow-hidden">{renderScene()}</main>
}