"use client"

interface RadarProps {
  playerX: number
  playerY: number
  enemies: Array<{ x: number; y: number; defeated: boolean }>
  chests: Array<{ x: number; y: number; collected: boolean }>
  canvasWidth: number
  canvasHeight: number
}

export default function MiniRadar({ playerX, playerY, enemies, chests, canvasWidth, canvasHeight }: RadarProps) {
  const radarSize = 120
  const scale = radarSize / Math.max(canvasWidth, canvasHeight)

  return (
    <div className="glass-panel rounded p-2" style={{ width: radarSize + 16, height: radarSize + 16 }}>
      <div className="relative" style={{ width: radarSize, height: radarSize }}>
        {/* Background */}
        <div className="absolute inset-0 bg-background/50 rounded border border-neon-cyan/30">
          {/* Grid lines */}
          <svg className="w-full h-full opacity-20">
            <line x1="0" y1={radarSize / 2} x2={radarSize} y2={radarSize / 2} stroke="#00ffff" strokeWidth="1" />
            <line x1={radarSize / 2} y1="0" x2={radarSize / 2} y2={radarSize} stroke="#00ffff" strokeWidth="1" />
            <circle
              cx={radarSize / 2}
              cy={radarSize / 2}
              r={radarSize / 3}
              fill="none"
              stroke="#00ffff"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Chests */}
        {chests.map((chest, i) => {
          if (chest.collected) return null
          const x = chest.x * scale
          const y = chest.y * scale
          return (
            <div
              key={`chest-${i}`}
              className="absolute w-2 h-2 rounded-full bg-neon-green animate-pulse"
              style={{
                left: x - 4,
                top: y - 4,
                boxShadow: "0 0 8px #00ff00",
              }}
            />
          )
        })}

        {/* Enemies */}
        {enemies.map((enemy, i) => {
          if (enemy.defeated) return null
          const x = enemy.x * scale
          const y = enemy.y * scale
          return (
            <div
              key={`enemy-${i}`}
              className="absolute w-2 h-2 rounded-full bg-neon-magenta animate-pulse"
              style={{
                left: x - 4,
                top: y - 4,
                boxShadow: "0 0 8px #ff00ff",
              }}
            />
          )
        })}

        {/* Player */}
        <div
          className="absolute w-3 h-3 rounded-full bg-neon-cyan"
          style={{
            left: playerX * scale - 6,
            top: playerY * scale - 6,
            boxShadow: "0 0 12px #00ffff",
          }}
        />

        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)",
            animation: "radar-scan 3s linear infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes radar-scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  )
}
