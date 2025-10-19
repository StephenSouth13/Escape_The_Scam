// Audio manager using Web Audio API for sound effects
export class AudioManager {
  private static audioContext: AudioContext | null = null
  private static ambientGain: GainNode | null = null
  private static ambientOscillator: OscillatorNode | null = null

  static init() {
    if (typeof window === "undefined") return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      console.log("[v0] Audio not supported")
    }
  }

  static playAmbient() {
    if (!this.audioContext) return

    try {
      // Create ambient drone sound
      this.ambientOscillator = this.audioContext.createOscillator()
      this.ambientGain = this.audioContext.createGain()

      this.ambientOscillator.type = "sine"
      this.ambientOscillator.frequency.setValueAtTime(55, this.audioContext.currentTime) // Low A note

      this.ambientGain.gain.setValueAtTime(0.05, this.audioContext.currentTime)

      this.ambientOscillator.connect(this.ambientGain)
      this.ambientGain.connect(this.audioContext.destination)

      this.ambientOscillator.start()
    } catch (e) {
      console.log("[v0] Could not play ambient sound")
    }
  }

  static playClick() {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.1)
    } catch (e) {
      console.log("[v0] Could not play click sound")
    }
  }

  static playSuccess() {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = "sine"
      const now = this.audioContext.currentTime

      oscillator.frequency.setValueAtTime(523.25, now) // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5

      gainNode.gain.setValueAtTime(0.2, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

      oscillator.start(now)
      oscillator.stop(now + 0.4)
    } catch (e) {
      console.log("[v0] Could not play success sound")
    }
  }

  static playError() {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = "sawtooth"
      const now = this.audioContext.currentTime

      oscillator.frequency.setValueAtTime(200, now)
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3)

      gainNode.gain.setValueAtTime(0.2, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

      oscillator.start(now)
      oscillator.stop(now + 0.3)
    } catch (e) {
      console.log("[v0] Could not play error sound")
    }
  }

  static playTransition() {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = "sine"
      const now = this.audioContext.currentTime

      oscillator.frequency.setValueAtTime(440, now)
      oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.2)

      gainNode.gain.setValueAtTime(0.1, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

      oscillator.start(now)
      oscillator.stop(now + 0.2)
    } catch (e) {
      console.log("[v0] Could not play transition sound")
    }
  }

  static playVictory() {
    if (!this.audioContext) return

    try {
      const now = this.audioContext.currentTime
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0] // C5, D5, E5, G5, A5

      notes.forEach((freq, i) => {
        const oscillator = this.audioContext!.createOscillator()
        const gainNode = this.audioContext!.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext!.destination)

        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(freq, now + i * 0.15)

        gainNode.gain.setValueAtTime(0.15, now + i * 0.15)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3)

        oscillator.start(now + i * 0.15)
        oscillator.stop(now + i * 0.15 + 0.3)
      })
    } catch (e) {
      console.log("[v0] Could not play victory sound")
    }
  }

  static playGameOver() {
    if (!this.audioContext) return

    try {
      const now = this.audioContext.currentTime
      const notes = [440, 415.3, 392, 369.99] // A4, G#4, G4, F#4 (descending)

      notes.forEach((freq, i) => {
        const oscillator = this.audioContext!.createOscillator()
        const gainNode = this.audioContext!.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext!.destination)

        oscillator.type = "triangle"
        oscillator.frequency.setValueAtTime(freq, now + i * 0.2)

        gainNode.gain.setValueAtTime(0.15, now + i * 0.2)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.4)

        oscillator.start(now + i * 0.2)
        oscillator.stop(now + i * 0.2 + 0.4)
      })
    } catch (e) {
      console.log("[v0] Could not play game over sound")
    }
  }

  static stopAll() {
    if (this.ambientOscillator) {
      try {
        this.ambientOscillator.stop()
      } catch (e) {
        // Already stopped
      }
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}
