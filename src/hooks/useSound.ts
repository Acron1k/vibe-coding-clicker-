import { useCallback, useRef, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

// Audio context singleton
let audioContext: AudioContext | null = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Generate crisp click sound (like iPhone haptic)
const createClickSound = (ctx: AudioContext, type: 'soft' | 'medium' | 'hard' = 'medium') => {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  const now = ctx.currentTime
  
  if (type === 'soft') {
    // Soft tap - higher pitch, very short
    oscillator.frequency.setValueAtTime(2400, now)
    oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.03)
    oscillator.type = 'sine'
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(3000, now)
    
    gainNode.gain.setValueAtTime(0.15, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
    
    oscillator.start(now)
    oscillator.stop(now + 0.05)
  } else if (type === 'medium') {
    // Medium tap - satisfying click
    oscillator.frequency.setValueAtTime(1800, now)
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.04)
    oscillator.type = 'sine'
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2500, now)
    
    gainNode.gain.setValueAtTime(0.2, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
    
    oscillator.start(now)
    oscillator.stop(now + 0.08)
  } else {
    // Hard tap - deeper, more impact
    oscillator.frequency.setValueAtTime(1200, now)
    oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.06)
    oscillator.type = 'sine'
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, now)
    
    gainNode.gain.setValueAtTime(0.25, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
    
    oscillator.start(now)
    oscillator.stop(now + 0.12)
  }
}

// Success/purchase sound
const createSuccessSound = (ctx: AudioContext) => {
  const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5 chord
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    const now = ctx.currentTime
    const delay = i * 0.04
    
    oscillator.frequency.setValueAtTime(freq, now + delay)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, now + delay)
    gainNode.gain.linearRampToValueAtTime(0.12, now + delay + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2)
    
    oscillator.start(now + delay)
    oscillator.stop(now + delay + 0.2)
  })
}

// Level up / milestone sound
const createMilestoneSound = (ctx: AudioContext) => {
  const frequencies = [392, 523.25, 659.25, 783.99] // G4, C5, E5, G5 arpeggio
  
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    const now = ctx.currentTime
    const delay = i * 0.08
    
    oscillator.frequency.setValueAtTime(freq, now + delay)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, now + delay)
    gainNode.gain.linearRampToValueAtTime(0.15, now + delay + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.3)
    
    oscillator.start(now + delay)
    oscillator.stop(now + delay + 0.3)
  })
}

// Critical hit sound
const createCritSound = (ctx: AudioContext) => {
  // Impact sound
  const oscillator1 = ctx.createOscillator()
  const gainNode1 = ctx.createGain()
  
  oscillator1.connect(gainNode1)
  gainNode1.connect(ctx.destination)
  
  const now = ctx.currentTime
  
  oscillator1.frequency.setValueAtTime(300, now)
  oscillator1.frequency.exponentialRampToValueAtTime(100, now + 0.1)
  oscillator1.type = 'sine'
  
  gainNode1.gain.setValueAtTime(0.2, now)
  gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
  
  oscillator1.start(now)
  oscillator1.stop(now + 0.15)
  
  // Sparkle overlay
  const oscillator2 = ctx.createOscillator()
  const gainNode2 = ctx.createGain()
  
  oscillator2.connect(gainNode2)
  gainNode2.connect(ctx.destination)
  
  oscillator2.frequency.setValueAtTime(2000, now)
  oscillator2.frequency.exponentialRampToValueAtTime(3000, now + 0.1)
  oscillator2.type = 'sine'
  
  gainNode2.gain.setValueAtTime(0.08, now)
  gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
  
  oscillator2.start(now)
  oscillator2.stop(now + 0.15)
}

// Error/can't afford sound
const createErrorSound = (ctx: AudioContext) => {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  const now = ctx.currentTime
  
  oscillator.frequency.setValueAtTime(200, now)
  oscillator.frequency.setValueAtTime(150, now + 0.1)
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.15, now)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
  
  oscillator.start(now)
  oscillator.stop(now + 0.2)
}

export type SoundType = 'click' | 'click-soft' | 'click-hard' | 'success' | 'milestone' | 'crit' | 'error'

export function useSound() {
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled)
  const lastPlayTime = useRef<Record<string, number>>({})
  
  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return
    
    // Throttle sounds to prevent audio spam
    const now = Date.now()
    const minInterval = type.startsWith('click') ? 30 : 100
    if (lastPlayTime.current[type] && now - lastPlayTime.current[type] < minInterval) {
      return
    }
    lastPlayTime.current[type] = now
    
    try {
      const ctx = getAudioContext()
      
      // Resume audio context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      
      switch (type) {
        case 'click':
          createClickSound(ctx, 'medium')
          break
        case 'click-soft':
          createClickSound(ctx, 'soft')
          break
        case 'click-hard':
          createClickSound(ctx, 'hard')
          break
        case 'success':
          createSuccessSound(ctx)
          break
        case 'milestone':
          createMilestoneSound(ctx)
          break
        case 'crit':
          createCritSound(ctx)
          break
        case 'error':
          createErrorSound(ctx)
          break
      }
    } catch (e) {
      // Silently fail if audio not supported
      console.warn('Audio not supported:', e)
    }
  }, [soundEnabled])
  
  return { playSound }
}

// Hook for initializing audio on first user interaction
export function useAudioInit() {
  useEffect(() => {
    const initAudio = () => {
      try {
        const ctx = getAudioContext()
        if (ctx.state === 'suspended') {
          ctx.resume()
        }
      } catch (e) {
        // Ignore
      }
    }
    
    // Initialize on first click/touch
    document.addEventListener('click', initAudio, { once: true })
    document.addEventListener('touchstart', initAudio, { once: true })
    
    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('touchstart', initAudio)
    }
  }, [])
}
