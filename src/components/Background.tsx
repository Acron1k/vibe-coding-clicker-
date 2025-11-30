import { useIsMobile } from '../hooks/useIsMobile'

export function Background() {
  const isMobile = useIsMobile()
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-paper-100">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-50 pattern-dots" />
      
      {/* Decorative shapes */}
      {!isMobile && (
        <>
          {/* Top right coral blob */}
          <div 
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF6B6B 0%, transparent 70%)' }}
          />
          
          {/* Bottom left lime blob */}
          <div 
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #BEFF3A 0%, transparent 70%)' }}
          />
          
          {/* Center teal accent */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #2D4A5E 0%, transparent 60%)' }}
          />
        </>
      )}
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      
      {/* Decorative geometric elements - desktop only */}
      {!isMobile && (
        <>
          {/* Floating squares */}
          <div 
            className="absolute top-20 left-[10%] w-8 h-8 bg-coral-400 rounded-lg opacity-20 animate-float"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="absolute top-40 right-[15%] w-6 h-6 bg-lime-400 rounded-lg opacity-30 animate-float"
            style={{ animationDelay: '1s' }}
          />
          <div 
            className="absolute bottom-32 left-[20%] w-10 h-10 bg-teal-400 rounded-lg opacity-15 animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div 
            className="absolute bottom-48 right-[25%] w-5 h-5 bg-coral-300 rounded-full opacity-25 animate-float"
            style={{ animationDelay: '0.5s' }}
          />
        </>
      )}
    </div>
  )
}
