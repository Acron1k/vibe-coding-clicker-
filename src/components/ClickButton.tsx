import { useState, useCallback, useRef, memo } from 'react'
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

const MAX_FLOATING_NUMBERS_DESKTOP = 6
const MAX_FLOATING_NUMBERS_MOBILE = 3

const FloatingNumberComponent = memo(({ num, onComplete }: { num: FloatingNumber; onComplete: (id: number) => void }) => {
  return (
    <div
      className={`floating-number absolute pointer-events-none z-20 ${
        num.isCrit 
          ? 'text-lime-400 text-2xl md:text-3xl' 
          : 'text-coral-500 text-xl md:text-2xl'
      }`}
      style={{
        left: num.x,
        top: num.y,
        transform: 'translate(-50%, -50%)',
      }}
      onAnimationEnd={() => onComplete(num.id)}
    >
      {num.isCrit && <span className="mr-1">CRIT!</span>}
      +{formatNumber(num.value)}
    </div>
  )
})

FloatingNumberComponent.displayName = 'FloatingNumber'

export function ClickButton() {
  const handleClick = useGameStore((s) => s.handleClick)
  const getClickValue = useGameStore((s) => s.getClickValue)
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([])
  const [isPressed, setIsPressed] = useState(false)
  const idCounter = useRef(0)
  const buttonRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const maxFloating = isMobile ? MAX_FLOATING_NUMBERS_MOBILE : MAX_FLOATING_NUMBERS_DESKTOP

  const removeFloatingNumber = useCallback((id: number) => {
    setFloatingNumbers((prev) => prev.filter((n) => n.id !== id))
  }, [])

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
        if (updated.length > maxFloating) {
          return updated.slice(-maxFloating)
        }
        return updated
      })
    }
  }, [handleClick, getClickValue, maxFloating])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsPressed(true)
    processClick(e.clientX, e.clientY)
  }, [processClick])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsPressed(true)
    const touch = e.touches[0]
    if (touch) {
      processClick(touch.clientX, touch.clientY)
    }
  }, [processClick])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
  }, [])

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Decorative rings - desktop only */}
      {!isMobile && (
        <>
          <div 
            className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-dashed border-coral-300/30 pointer-events-none animate-spin-slow"
            style={{ animationDuration: '30s' }}
          />
          <div 
            className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-dotted border-teal-400/20 pointer-events-none animate-spin-slow"
            style={{ animationDuration: '25s', animationDirection: 'reverse' }}
          />
        </>
      )}

      {/* Pulse ring effect */}
      <div 
        className={`absolute w-52 h-52 md:w-60 md:h-60 rounded-full bg-coral-400/20 pointer-events-none transition-transform duration-150 ${
          isPressed ? 'scale-90' : 'scale-100'
        }`}
      />

      {/* Main clickable button */}
      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            const rect = buttonRef.current?.getBoundingClientRect()
            if (rect) {
              processClick(rect.left + rect.width / 2, rect.top + rect.height / 2)
            }
          }
        }}
        className={`click-button w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 ${isPressed ? 'pressed' : ''}`}
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
        }}
        aria-label="Click to write prompt"
      >
        {/* Inner highlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

        {/* Icon */}
        <span className={`relative text-5xl md:text-6xl z-10 pointer-events-none ${!isMobile ? 'animate-wiggle' : ''}`}>
          ⚡
        </span>
        
        {/* Text */}
        <span className="relative text-xl md:text-2xl font-display font-bold text-white z-10 tracking-wide pointer-events-none mt-1">
          Prompt
        </span>
        
        {/* Value display */}
        <span className="relative text-sm text-white/90 z-10 font-mono font-semibold pointer-events-none mt-1 bg-teal-800/30 px-3 py-1 rounded-full">
          +{formatNumber(getClickValue())} VB
        </span>
      </div>

      {/* Floating numbers */}
      {floatingNumbers.map((num) => (
        <FloatingNumberComponent key={num.id} num={num} onComplete={removeFloatingNumber} />
      ))}

      {/* Decorative elements - desktop only */}
      {!isMobile && (
        <>
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-lime-400 rounded-lg rotate-12 pointer-events-none shadow-brutal-sm animate-bounce-subtle" />
          <div className="absolute -bottom-2 -left-6 w-5 h-5 bg-teal-500 rounded-full pointer-events-none shadow-brutal-sm animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-8 -left-8 w-4 h-4 bg-coral-300 rounded-lg -rotate-12 pointer-events-none shadow-brutal-sm animate-bounce-subtle" style={{ animationDelay: '1s' }} />
        </>
      )}
    </div>
  )
}
