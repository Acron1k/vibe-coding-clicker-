import { useMemo } from 'react'
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
    { key: 'tier1', name: 'Basic LLMs', tools: groupedTools.tier1, color: '#3B82F6', dot: 'bg-blue-500' },
    { key: 'tier2', name: 'IDE Tools', tools: groupedTools.tier2, color: '#A855F7', dot: 'bg-purple-500' },
    { key: 'tier3', name: 'Premium', tools: groupedTools.tier3, color: '#F97316', dot: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-ink-800">
          AI Tools
        </h2>
        <span className="text-xs font-mono text-ink-500 bg-paper-200 px-2 py-1 rounded-lg border border-ink-200">
          {Object.keys(ownedTools).length}/{TOOLS.length}
        </span>
      </div>

      {tierInfo.map(({ key, name, tools, dot }) => {
        if (tools.length === 0) return null

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
              <h3 className="text-xs font-display font-bold text-ink-600 uppercase tracking-wider">
                {name}
              </h3>
              <div className="flex-1 h-0.5 bg-ink-200 rounded-full" />
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
          </div>
        )
      })}

      {visibleTools.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-ink-500">Start clicking to unlock tools!</p>
        </div>
      )}
    </div>
  )
}
