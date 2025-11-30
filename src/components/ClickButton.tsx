import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { formatNumber } from '../utils/formatters'
import { useIsMobile } from '../hooks/useIsMobile'

interface FloatingNumber {
  id: number
  value: number
  x: number
  y: number
  isCrit: boolean
}

const MAX_FLOATING_NUMBERS = 6

export function ClickButton() {
  const handleClick = useGameStore((s) => s.handleClick)
  const getClickValue = useGameStore((s) => s.getClickValue)
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([])
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const idCounter = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isMobile = useIsMobile()

  const processClick = useCallback((clientX: number, clientY: number) => {
    const earnedValue = handleClick()
    const clickValue = getClickValue()
    const isCrit = earnedValue > clickValue
    
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = clientX - rect.left
      const y = clientY - rect.top
      
      const newId = idCounter.current++
      
      setFloatingNumbers((prev) => {
        const updated = [...prev, { id: newId, value: earnedValue, x, y, isCrit }]
        if (updated.length > MAX_FLOATING_NUMBERS) {
          return updated.slice(-MAX_FLOATING_NUMBERS)
        }
        return updated
      })
      
      if (!isMobile) {
        setRipples((prev) => [...prev, { id: newId, x, y }])
      }
      
      setTimeout(() => {
        setFloatingNumbers((prev) => prev.filter((n) => n.id !== newId))
        if (!isMobile) {
          setRipples((prev) => prev.filter((r) => r.id !== newId))
        }
      }, 800)
    }
  }, [handleClick, getClickValue, isMobile])

  const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    processClick(e.clientX, e.clientY)
  }, [processClick])

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    if (touch) {
      processClick(touch.clientX, touch.clientY)
    }
  }, [processClick])

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings - simplified on mobile */}
      {!isMobile && (
        <>
          <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full opacity-20 animate-pulse-glow"
               style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.3) 0%, transparent 70%)' }} />
          <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full opacity-30 animate-pulse-glow"
               style={{ background: 'radial-gradient(circle, rgba(201,4,237,0.3) 0%, transparent 70%)', animationDelay: '0.5s' }} />
        </>
      )}
      
      {/* Main button */}
      <motion.button
        ref={buttonRef}
        onClick={onClick}
        onTouchStart={onTouchStart}
        className="click-button relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full 
                   flex flex-col items-center justify-center gap-2 cursor-pointer
                   border-2 border-neon-cyan/30 transition-all duration-200
                   focus:outline-none focus:ring-4 focus:ring-neon-cyan/30
                   select-none"
        style={{ touchAction: 'manipulation', willChange: 'transform' }}
        whileHover={isMobile ? undefined : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Click to generate Vibe Codes"
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 blur-xl" />
        
        {/* Icon/Text */}
        <motion.span 
          className="relative text-5xl md:text-6xl z-10"
          animate={isMobile ? undefined : { rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ⚡
        </motion.span>
        <span className="relative text-xl md:text-2xl font-bold text-white z-10 tracking-wider">
          VIBE
        </span>
        <span className="relative text-sm text-neon-cyan z-10 font-mono">
          +{formatNumber(getClickValue())} VB
        </span>
        
        {/* Ripple effects - desktop only */}
        {!isMobile && (
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="absolute rounded-full bg-neon-cyan/30 pointer-events-none"
                style={{ left: ripple.x, top: ripple.y, willChange: 'transform, opacity' }}
                initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
                animate={{ width: 200, height: 200, x: -100, y: -100, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.button>
      
      {/* Floating numbers */}
      <AnimatePresence>
        {floatingNumbers.map((num) => (
          <motion.div
            key={num.id}
            className={`absolute pointer-events-none font-bold font-mono z-20 ${
              num.isCrit ? 'text-neon-yellow text-2xl md:text-3xl' : 'text-neon-green text-lg md:text-xl'
            }`}
            style={{ 
              left: `calc(50% + ${num.x - 112}px)`, 
              top: `calc(50% + ${num.y - 112}px)`,
              willChange: 'transform, opacity'
            }}
            initial={{ opacity: 1, y: 0, scale: num.isCrit ? 1.3 : 1 }}
            animate={{ opacity: 0, y: -60, scale: num.isCrit ? 1.6 : 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {num.isCrit && <span className="mr-1">CRIT!</span>}
            +{formatNumber(num.value)}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Decorative orbital elements - desktop only */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute w-60 h-60 md:w-68 md:h-68 lg:w-76 lg:h-76 rounded-full border border-neon-cyan/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-neon-cyan rounded-full shadow-neon-cyan" />
          </motion.div>
          
          <motion.div
            className="absolute w-68 h-68 md:w-76 md:h-76 lg:w-84 lg:h-84 rounded-full border border-neon-purple/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-neon-purple rounded-full shadow-neon-purple" />
          </motion.div>
        </>
      )}
    </div>
  )
}
