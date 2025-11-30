import { useState } from 'react'
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
import { useAudioInit } from './hooks/useSound'

type Tab = 'tools' | 'upgrades' | 'milestones' | 'stats'

function App() {
  useGameLoop()
  useOfflineProgress()
  useAudioInit()
  
  const [activeTab, setActiveTab] = useState<Tab>('tools')
  const resetGame = useGameStore((s) => s.resetGame)
  const isDemoMode = useGameStore((s) => s.isDemoMode)
  const toggleDemoMode = useGameStore((s) => s.toggleDemoMode)
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'upgrades', label: 'Upgrades', icon: '⬆️' },
    { id: 'milestones', label: 'Goals', icon: '🏆' },
    { id: 'stats', label: 'Stats', icon: '📊' },
  ]

  return (
    <div className="min-h-screen text-ink-800 relative font-body">
      <Background />
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="demo-banner">
          <span className="font-display font-bold text-teal-800 text-sm">
            🚀 DEMO MODE — x1,000,000 multiplier active!
          </span>
        </div>
      )}
      
      {/* Header */}
      <header className={`header ${isDemoMode ? 'top-[40px]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
              <span className="text-gradient-coral">Vibe</span>
              <span className="text-teal-700">code</span>
              <span className="text-ink-400 font-normal ml-1">Clicker</span>
            </h1>
            
            <CurrencyDisplay />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`max-w-7xl mx-auto px-4 py-6 pb-24 ${isDemoMode ? 'pt-16' : ''}`}>
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[340px_1fr_380px] gap-6">
          {/* Left: Tools */}
          <aside className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            <ToolList />
          </aside>

          {/* Center: Click Button */}
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <ClickButton />
            <p className="mt-8 text-ink-500 text-center font-body text-lg">
              Click to write a <span className="text-coral-500 font-semibold">prompt</span>
            </p>
            
            {/* Decorative element */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-1 bg-coral-300 rounded-full" />
              <div className="w-3 h-3 bg-lime-400 rounded-full" />
              <div className="w-12 h-1 bg-teal-300 rounded-full" />
            </div>
          </div>

          {/* Right: Panels */}
          <aside className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pl-2">
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
            <p className="mt-6 text-ink-500 text-center text-base">
              Tap to write a <span className="text-coral-500 font-semibold">prompt</span>
            </p>
          </div>

          {/* Tab navigation */}
          <div className={`sticky ${isDemoMode ? 'top-[96px]' : 'top-[56px]'} z-40 bg-paper-100/95 backdrop-blur-sm -mx-4 px-4 py-3 border-y-3 border-teal-700/10`}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="mt-4 space-y-4">
            {activeTab === 'tools' && (
              <>
                <ToolList />
                <SubscriptionPanel />
              </>
            )}
            {activeTab === 'upgrades' && <UpgradePanel />}
            {activeTab === 'milestones' && <MilestonePanel />}
            {activeTab === 'stats' && <StatsPanel />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span className="font-display font-semibold text-ink-500">
            Vibecode v1.5
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSound}
              className={`btn text-xs py-1.5 px-3 ${
                soundEnabled ? 'btn-secondary' : 'btn-ghost'
              }`}
              title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button 
              onClick={toggleDemoMode}
              className={`btn text-xs py-1.5 px-3 ${
                isDemoMode ? 'btn-lime' : 'btn-ghost'
              }`}
            >
              {isDemoMode ? '🚀 DEMO' : 'Demo'}
            </button>
            <button 
              onClick={() => {
                if (confirm('Reset all progress?')) {
                  resetGame()
                }
              }}
              className="text-coral-500 hover:text-coral-600 font-semibold transition-colors text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
