// Music manager using Web Audio API and Howler.js concepts
class MusicManagerClass {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private initialized = false

  init() {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      this.gainNode.gain.value = 0.3 // Volume at 30%
      this.initialized = true
    } catch (e) {
      console.log("[v0] Audio not supported")
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = "sine") {
    if (!this.audioContext || !this.gainNode) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.gainNode)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playMenuMusic() {
    // Ambient lo-fi dark cyber beat
    if (!this.audioContext) return

    const playLoop = () => {
      this.playTone(220, 0.5, "sine") // A3
      setTimeout(() => this.playTone(165, 0.5, "sine"), 500) // E3
      setTimeout(() => this.playTone(196, 0.5, "sine"), 1000) // G3
      setTimeout(() => this.playTone(147, 0.5, "sine"), 1500) // D3
    }

    playLoop()
    setInterval(playLoop, 2000)
  }

  playLevelMusic(level: number) {
    // Different music for each level
    if (!this.audioContext) return

    const themes = [
      { freq: 220, type: "sine" as OscillatorType }, // Level 1: Ambient
      { freq: 440, type: "square" as OscillatorType }, // Level 2: Alarm
      { freq: 330, type: "sawtooth" as OscillatorType }, // Level 3: Synthwave
      { freq: 165, type: "triangle" as OscillatorType }, // Level 4: Glitch
      { freq: 110, type: "sine" as OscillatorType }, // Level 5: Bass
      { freq: 550, type: "sawtooth" as OscillatorType }, // Level 6: Orchestral
    ]

    const theme = themes[level - 1] || themes[0]

    const playLoop = () => {
      this.playTone(theme.freq, 0.3, theme.type)
      setTimeout(() => this.playTone(theme.freq * 1.5, 0.3, theme.type), 300)
    }

    playLoop()
    setInterval(playLoop, 1500)
  }

  playWinMusic() {
    // Bright arpeggio
    if (!this.audioContext) return

    const notes = [262, 330, 392, 523] // C-E-G-C
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, "sine"), i * 200)
    })
  }

  playLoseMusic() {
    // Slow distorted piano
    if (!this.audioContext) return

    const notes = [220, 196, 165, 147] // A-G-E-D descending
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.5, "triangle"), i * 400)
    })
  }

  stopAll() {
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }
  }
}

export const MusicManager = new MusicManagerClass()
