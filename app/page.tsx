"use client"

import { useState, useEffect } from "react"
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
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    playerName: "",
    mssv: "",
    currentScene: "login",
    currentLevel: 1,
    cyberIQ: 0,
    lives: 3,
    completedLevels: [],
  })

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

  const changeScene = (scene: GameScene) => {
    setGameState((prev) => ({ ...prev, currentScene: scene }))

    if (scene === "game") {
      MusicManager.playLevelMusic(gameState.currentLevel)
    } else if (scene === "win") {
      MusicManager.playWinMusic()
    } else if (scene === "lose") {
      MusicManager.playLoseMusic()
    } else {
      MusicManager.playMenuMusic()
    }
  }

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

              if (gameState.currentLevel >= 4) {
                // Beat final level
                updateGameState({ cyberIQ: newCyberIQ, completedLevels: newCompletedLevels })
                changeScene("win")
              } else {
                // Move to next level
                updateGameState({
                  currentLevel: gameState.currentLevel + 1,
                  cyberIQ: newCyberIQ,
                  completedLevels: newCompletedLevels,
                })
                MusicManager.playLevelMusic(gameState.currentLevel + 1)
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
            onRestart={() => {
              setGameState({
                playerName: "",
                currentScene: "login",
                currentLevel: 1,
                cyberIQ: 0,
                lives: 3,
                completedLevels: [],
              })
              changeScene("login")
            }}
          />
        )
      case "lose":
        return (
          <LoseScene
            onRestart={() => {
              setGameState({
                playerName: "",
                currentScene: "login",
                currentLevel: 1,
                cyberIQ: 0,
                lives: 3,
                completedLevels: [],
              })
              changeScene("login")
            }}
          />
        )
      default:
        return null
    }
  }

  return <main className="min-h-screen bg-background scanline overflow-hidden">{renderScene()}</main>
}
