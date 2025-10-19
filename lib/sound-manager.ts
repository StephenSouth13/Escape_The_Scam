export class SoundManager {
  private static audioContext: AudioContext | null = null
  private static muted = false
  private static masterVolume = 0.3 // Reduce default volume by 70%
  private static activeSounds = 0
  private static maxPolyphony = 3 // Max 3 sounds at once

  private static getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (this.audioContext.state === "suspended") {
        document.addEventListener(
          "touchstart",
          () => {
            this.audioContext?.resume()
          },
          { once: true },
        )
        document.addEventListener(
          "click",
          () => {
            this.audioContext?.resume()
          },
          { once: true },
        )
      }
    }
    return this.audioContext
  }

  static setMuted(muted: boolean) {
    console.log("[v0] SoundManager.setMuted:", muted)
    this.muted = muted
    if (typeof window !== "undefined") {
      localStorage.setItem("game-muted", muted ? "true" : "false")
    }
  }

  static isMuted(): boolean {
    if (this.muted === false && typeof window !== "undefined") {
      const stored = localStorage.getItem("game-muted")
      if (stored === "true") {
        this.muted = true
      }
    }
    return this.muted
  }

  private static canPlaySound(): boolean {
    return !this.muted && this.activeSounds < this.maxPolyphony
  }

  private static trackSound(duration: number) {
    this.activeSounds++
    setTimeout(() => {
      this.activeSounds--
    }, duration * 1000)
  }

  static playJump() {
    if (!this.canPlaySound()) return

    const ctx = this.getContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.2 * this.masterVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
    this.trackSound(0.1)
  }

  static playStep() {
    if (!this.canPlaySound()) return

    const ctx = this.getContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = "square"
    oscillator.frequency.setValueAtTime(100, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.05 * this.masterVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
    this.trackSound(0.05)
  }

  static playCollision() {
    if (!this.canPlaySound()) return

    const ctx = this.getContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.25 * this.masterVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
    this.trackSound(0.2)
  }

  static playSuccess() {
    if (!this.canPlaySound()) return

    const ctx = this.getContext()
    const notes = [523.25, 659.25, 783.99]

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)

      gainNode.gain.setValueAtTime(0.15 * this.masterVolume, ctx.currentTime + i * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3)

      oscillator.start(ctx.currentTime + i * 0.1)
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
    this.trackSound(0.6)
  }

  static playError() {
    if (!this.canPlaySound()) return

    const ctx = this.getContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)

    gainNode.gain.setValueAtTime(0.25 * this.masterVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
    this.trackSound(0.3)
  }

  static playClick() {
    if (!this.canPlaySound()) return

    const ctx = this.getContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, ctx.currentTime)

    gainNode.gain.setValueAtTime(0.15 * this.masterVolume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
    this.trackSound(0.05)
  }
}
