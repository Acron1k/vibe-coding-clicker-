import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

export function Background() {
  const isMobile = useIsMobile()
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-dark" />
      
      {/* Radial glows - simplified on mobile */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      {!isMobile && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/3 rounded-full blur-3xl" />
      )}
      
      {/* Grid */}
      <div className="absolute inset-0 cyber-grid-animated opacity-50" />
      
      {/* Floating code particles - disabled on mobile for performance */}
      {!isMobile && <MatrixRain />}
      
      {/* Scan line effect - desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-dark-900/80" />
    </div>
  )
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastFrameRef = useRef<number>(0)
  
  const chars = useMemo(() => {
    return '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]();:=+-*/'.split('')
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let drops: number[] = []
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      const fontSize = 14
      const columns = Math.floor(canvas.width / fontSize)
      drops = new Array(columns).fill(1)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const fontSize = 14
    const frameInterval = 80

    const draw = (timestamp: number) => {
      if (timestamp - lastFrameRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      lastFrameRef.current = timestamp
      
      ctx.fillStyle = 'rgba(10, 14, 26, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(0, 217, 255, 0.15)'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      
      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [chars])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30"
    />
  )
}
