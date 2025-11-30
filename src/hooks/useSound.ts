import { useCallback, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

let audioContext: AudioContext | null = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Soft thud/tap - like a muted vibration
const createTapSound = (ctx: AudioContext, intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  const now = ctx.currentTime
  
  // Low frequency for thud feeling
  filter.type = 'lowpass'
  oscillator.type = 'sine'
  
  if (intensity === 'light') {
    oscillator.frequency.setValueAtTime(80, now)
    oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.03)
    filter.frequency.setValueAtTime(150, now)
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    oscillator.start(now)
    oscillator.stop(now + 0.04)
  } else if (intensity === 'medium') {
    oscillator.frequency.setValueAtTime(100, now)
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.05)
    filter.frequency.setValueAtTime(200, now)
    gainNode.gain.setValueAtTime(0.4, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
    oscillator.start(now)
    oscillator.stop(now + 0.06)
  } else {
    oscillator.frequency.setValueAtTime(120, now)
    oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.08)
    filter.frequency.setValueAtTime(250, now)
    gainNode.gain.setValueAtTime(0.5, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    oscillator.start(now)
    oscillator.stop(now + 0.1)
  }
}

// Double tap for success - two quick thuds
const createSuccessTap = (ctx: AudioContext) => {
  const now = ctx.currentTime
  
  // First tap
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  const filter1 = ctx.createBiquadFilter()
  
  osc1.connect(filter1)
  filter1.connect(gain1)
  gain1.connect(ctx.destination)
  
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(100, now)
  osc1.frequency.exponentialRampToValueAtTime(60, now + 0.04)
  filter1.type = 'lowpass'
  filter1.frequency.setValueAtTime(200, now)
  gain1.gain.setValueAtTime(0.35, now)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
  
  osc1.start(now)
  osc1.stop(now + 0.05)
  
  // Second tap (slightly higher)
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  const filter2 = ctx.createBiquadFilter()
  
  osc2.connect(filter2)
  filter2.connect(gain2)
  gain2.connect(ctx.destination)
  
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(130, now + 0.06)
  osc2.frequency.exponentialRampToValueAtTime(70, now + 0.1)
  filter2.type = 'lowpass'
  filter2.frequency.setValueAtTime(220, now + 0.06)
  gain2.gain.setValueAtTime(0.4, now + 0.06)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  
  osc2.start(now + 0.06)
  osc2.stop(now + 0.12)
}

// Heavy thud for crit
const createCritTap = (ctx: AudioContext) => {
  const now = ctx.currentTime
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, now)
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.12)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(300, now)
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.12)
  gain.gain.setValueAtTime(0.6, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  
  osc.start(now)
  osc.stop(now + 0.15)
}

// Soft buzz for error
const createErrorTap = (ctx: AudioContext) => {
  const now = ctx.currentTime
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  
  osc.type = 'sine'
  osc.frequency.setValueAtTime(60, now)
  osc.frequency.setValueAtTime(50, now + 0.05)
  osc.frequency.setValueAtTime(60, now + 0.1)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(120, now)
  gain.gain.setValueAtTime(0.25, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  
  osc.start(now)
  osc.stop(now + 0.15)
}

// Triple ascending taps for milestone
const createMilestoneTap = (ctx: AudioContext) => {
  const now = ctx.currentTime
  const frequencies = [80, 100, 130]
  
  frequencies.forEach((freq, i) => {
    const delay = i * 0.07
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + delay)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + delay + 0.05)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(200 + i * 30, now + delay)
    gain.gain.setValueAtTime(0.35, now + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06)
    
    osc.start(now + delay)
    osc.stop(now + delay + 0.06)
  })
}

export type SoundType = 'tap' | 'tap-light' | 'tap-heavy' | 'success' | 'milestone' | 'crit' | 'error'

export function useSound() {
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled)
  const lastPlayTime = useRef<Record<string, number>>({})
  
  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return
    
    const now = Date.now()
    const minInterval = type.startsWith('tap') ? 25 : 80
    if (lastPlayTime.current[type] && now - lastPlayTime.current[type] < minInterval) {
      return
    }
    lastPlayTime.current[type] = now
    
    try {
      const ctx = getAudioContext()
      
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      switch (type) {
        case 'tap':
          createTapSound(ctx, 'medium')
          break
        case 'tap-light':
          createTapSound(ctx, 'light')
          break
        case 'tap-heavy':
          createTapSound(ctx, 'heavy')
          break
        case 'success':
          createSuccessTap(ctx)
          break
        case 'milestone':
          createMilestoneTap(ctx)
          break
        case 'crit':
          createCritTap(ctx)
          break
        case 'error':
          createErrorTap(ctx)
          break
      }
    } catch (e) {
      console.warn('Audio not supported:', e)
    }
  }, [soundEnabled])
  
  return { playSound }
}

export function useAudioInit() {
  // Audio context will be created on first sound play
}
