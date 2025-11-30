import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export function useGameLoop() {
  const tick = useGameStore((s) => s.tick)
  const lastTickRef = useRef<number>(Date.now())
  const accumulatorRef = useRef<number>(0)

  useEffect(() => {
    const TICK_RATE = 100 // 10 ticks per second

    const gameLoop = () => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now

      accumulatorRef.current += delta

      while (accumulatorRef.current >= TICK_RATE) {
        tick(TICK_RATE / 1000)
        accumulatorRef.current -= TICK_RATE
      }
    }

    const intervalId = setInterval(gameLoop, TICK_RATE)
    return () => clearInterval(intervalId)
  }, [tick])
}

export function useOfflineProgress() {
  const stats = useGameStore((s) => s.stats)
  const addVibeCodes = useGameStore((s) => s.addVibeCodes)
  const getPassiveIncome = useGameStore((s) => s.getPassiveIncome)

  useEffect(() => {
    const now = Date.now()
    const lastOnline = stats.lastOnlineTime
    const offlineSeconds = Math.min((now - lastOnline) / 1000, 2 * 60 * 60) // Max 2 hours

    if (offlineSeconds > 60) { // Only if offline for more than 1 minute
      const income = getPassiveIncome()
      const offlineMultiplier = 0.5 // 50% of normal production
      const earned = income.vibeCodes * offlineSeconds * offlineMultiplier

      if (earned > 0) {
        addVibeCodes(earned)
        console.log(`Welcome back! Earned ${earned.toFixed(0)} VB while offline (${(offlineSeconds / 60).toFixed(0)} minutes)`)
      }
    }

    // Update last online time
    useGameStore.setState((state) => ({
      stats: { ...state.stats, lastOnlineTime: now }
    }))
  }, [])
}
