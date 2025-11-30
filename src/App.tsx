import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Background } from './components/Background'
import { CurrencyDisplay } from './components/CurrencyDisplay'
import { ClickButton } from './components/ClickButton'
import { ToolList } from './components/ToolList'
import { SubscriptionPanel } from './components/SubscriptionPanel'
import { UpgradePanel } from './components/UpgradePanel'
import { MilestonePanel } from './components/MilestonePanel'
import { StatsPanel } from './components/StatsPanel'
import { useGameLoop, useOfflineProgress } from './hooks/useGameLoop'
import { useGameStore } from './store/gameStore'

type Tab = 'tools' | 'upgrades' | 'milestones' | 'stats'

function App() {
  useGameLoop()
  useOfflineProgress()
  
  const [activeTab, setActiveTab] = useState<Tab>('tools')
  const resetGame = useGameStore((s) => s.resetGame)
  const isDemoMode = useGameStore((s) => s.isDemoMode)
  const toggleDemoMode = useGameStore((s) => s.toggleDemoMode)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'tools', label: 'Инструменты', icon: '🛠️' },
    { id: 'upgrades', label: 'Апгрейды', icon: '⬆️' },
    { id: 'milestones', label: 'Достижения', icon: '🏆' },
    { id: 'stats', label: 'Статистика', icon: '📊' },
  ]

  return (
    <div className="min-h-screen text-text-primary relative">
      <Background />
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-neon-yellow/20 via-neon-yellow/30 to-neon-yellow/20 border-b border-neon-yellow/50 py-1 text-center">
          <span className="text-neon-yellow font-bold text-sm animate-pulse">
            🚀 DEMO MODE - x1,000,000 множитель активен
          </span>
        </div>
      )}
      
      {/* Header */}
      <header className={`sticky ${isDemoMode ? 'top-[28px]' : 'top-0'} z-50 backdrop-blur-md bg-dark-900/80 border-b border-dark-600`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-2xl font-bold neon-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-gradient">Vibecode</span>
              <span className="text-text-secondary font-light">-Clicker</span>
            </motion.h1>
            
            <CurrencyDisplay />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[350px_1fr_380px] gap-6">
          {/* Left: Tools */}
          <aside className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
            <ToolList />
          </aside>

          {/* Center: Click Button */}
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <ClickButton />
            <motion.p 
              className="mt-6 text-text-muted text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Кликай чтобы создавать <span className="text-neon-cyan">Vibe Codes</span>
            </motion.p>
          </div>

          {/* Right: Panels */}
          <aside className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pl-2">
            <SubscriptionPanel />
            <UpgradePanel />
            <MilestonePanel />
            <StatsPanel />
          </aside>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Click button area */}
          <div className="flex flex-col items-center justify-center py-8">
            <ClickButton />
            <p className="mt-4 text-text-muted text-center text-sm">
              Тапай чтобы создавать <span className="text-neon-cyan">Vibe Codes</span>
            </p>
          </div>

          {/* Tab navigation */}
          <div className={`sticky ${isDemoMode ? 'top-[101px]' : 'top-[73px]'} z-40 bg-dark-900/90 backdrop-blur-md -mx-4 px-4 py-2 border-b border-dark-600`}>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'tools' && (
                  <div className="space-y-4">
                    <ToolList />
                    <SubscriptionPanel />
                  </div>
                )}
                {activeTab === 'upgrades' && <UpgradePanel />}
                {activeTab === 'milestones' && <MilestonePanel />}
                {activeTab === 'stats' && <StatsPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-dark-900/80 backdrop-blur-md border-t border-dark-600 py-2 px-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-text-muted">
          <span>Vibecode-Clicker v1.0</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDemoMode}
              className={`px-3 py-1 rounded transition-all font-semibold ${
                isDemoMode 
                  ? 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/50' 
                  : 'bg-dark-700 text-text-secondary hover:bg-dark-600 hover:text-text-primary'
              }`}
            >
              {isDemoMode ? '🚀 DEMO ON' : 'Demo Mode'}
            </button>
            <button 
              onClick={() => {
                if (confirm('Вы уверены что хотите сбросить прогресс?')) {
                  resetGame()
                }
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Сбросить прогресс
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
