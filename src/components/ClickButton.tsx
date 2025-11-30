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
      className={`floating-number absolute pointer-events-none font-bold font-mono z-20 ${
        num.isCrit ? 'text-neon-yellow text-xl' : 'text-neon-green text-base'
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
      {/* Outer glow rings - desktop only, CSS animation */}
      {!isMobile && (
        <>
          <div 
            className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full opacity-20 animate-pulse pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,217,255,0.3) 0%, transparent 70%)' }} 
          />
          <div 
            className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full opacity-30 animate-pulse pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,4,237,0.3) 0%, transparent 70%)', animationDelay: '0.5s' }} 
          />
        </>
      )}

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
        className={`click-button relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full 
                   flex flex-col items-center justify-center gap-2 cursor-pointer
                   border-2 border-neon-cyan/30
                   focus:outline-none focus:ring-4 focus:ring-neon-cyan/30
                   select-none transition-transform duration-100
                   ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}`}
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
        }}
        aria-label="Click to generate Vibe Codes"
      >
        {/* Inner glow - pointer-events-none */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 blur-xl pointer-events-none" />

        {/* Icon */}
        <span className={`relative text-5xl md:text-6xl z-10 pointer-events-none ${!isMobile ? 'animate-wiggle' : ''}`}>
          ⚡
        </span>
        <span className="relative text-xl md:text-2xl font-bold text-white z-10 tracking-wider pointer-events-none">
          Prompt
        </span>
        <span className="relative text-sm text-neon-cyan z-10 font-mono pointer-events-none">
          +{formatNumber(getClickValue())} VB
        </span>
      </div>

      {/* Floating numbers - CSS animated */}
      {floatingNumbers.map((num) => (
        <FloatingNumberComponent key={num.id} num={num} onComplete={removeFloatingNumber} />
      ))}

      {/* Decorative orbital elements - desktop only, CSS animated */}
      {!isMobile && (
        <>
          <div className="absolute w-60 h-60 md:w-68 md:h-68 lg:w-76 lg:h-76 rounded-full border border-neon-cyan/20 animate-spin-slow pointer-events-none">
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-neon-cyan rounded-full shadow-neon-cyan" />
          </div>
          <div className="absolute w-68 h-68 md:w-76 md:h-76 lg:w-84 lg:h-84 rounded-full border border-neon-purple/20 animate-spin-slower pointer-events-none">
            <div className="absolute -top-1 left-1/2 w-2 h-2 bg-neon-purple rounded-full shadow-neon-purple" />
          </div>
        </>
      )}
    </div>
  )
}
