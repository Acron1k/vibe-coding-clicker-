import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { TOOLS } from '../data/tools'
import { ToolCard } from './ToolCard'

export function ToolList() {
  const unlockedTools = useGameStore((s) => s.unlockedTools)
  const ownedTools = useGameStore((s) => s.ownedTools)

  const visibleTools = useMemo(() => {
    return TOOLS.filter((tool) => unlockedTools.includes(tool.id))
  }, [unlockedTools])

  const groupedTools = useMemo(() => {
    return {
      tier1: visibleTools.filter((t) => t.tier === 1),
      tier2: visibleTools.filter((t) => t.tier === 2),
      tier3: visibleTools.filter((t) => t.tier === 3),
    }
  }, [visibleTools])

  const tierInfo = [
    { key: 'tier1', name: 'Базовые LLM', tools: groupedTools.tier1, color: 'neon-cyan' },
    { key: 'tier2', name: 'IDE Инструменты', tools: groupedTools.tier2, color: 'neon-purple' },
    { key: 'tier3', name: 'Премиум', tools: groupedTools.tier3, color: 'neon-yellow' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gradient">AI Инструменты</h2>
        <span className="text-sm text-text-muted">
          {Object.keys(ownedTools).length}/{TOOLS.length} разблокировано
        </span>
      </div>

      {tierInfo.map(({ key, name, tools, color }) => {
        if (tools.length === 0) return null

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-${color}`} />
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                {name}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-dark-500 to-transparent" />
            </div>

            <div className="space-y-2">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  owned={ownedTools[tool.id]}
                />
              ))}
            </div>
          </motion.div>
        )
      })}

      {visibleTools.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p>Начните кликать чтобы разблокировать инструменты!</p>
        </div>
      )}
    </div>
  )
}
