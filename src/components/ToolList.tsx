import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { TOOLS } from '../data/tools'
import { isAIToolUnlocked, getNextLockedAITool } from '../data/aiTools'
import { ToolCard } from './ToolCard'
import { formatNumber } from '../utils/formatters'

export function ToolList() {
  const ownedTools = useGameStore((s) => s.ownedTools)

  const { unlockedTools, nextTool } = useMemo(() => {
    const unlocked = TOOLS.filter((tool) => isAIToolUnlocked(tool.id, ownedTools))
    const next = getNextLockedAITool(ownedTools)
    return { unlockedTools: unlocked, nextTool: next }
  }, [ownedTools])

  const groupedTools = useMemo(() => {
    return {
      tier1: unlockedTools.filter((t) => t.tier === 1),
      tier2: unlockedTools.filter((t) => t.tier === 2),
      tier3: unlockedTools.filter((t) => t.tier === 3),
    }
  }, [unlockedTools])

  const tierInfo = [
    { key: 'tier1', name: 'Базовые', tools: groupedTools.tier1, dot: 'bg-blue-500' },
    { key: 'tier2', name: 'Продвинутые', tools: groupedTools.tier2, dot: 'bg-purple-500' },
    { key: 'tier3', name: 'Премиум', tools: groupedTools.tier3, dot: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-ink-800">
          ИИ Инструменты
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

      {/* Next tool to unlock */}
      {nextTool && (
        <div className="card bg-ink-100/50 border-dashed">
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-ink-200 border-2 border-ink-300">
              🔒
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-ink-600 text-sm">
                {nextTool.name}
              </h3>
              <p className="text-xs text-ink-500">
                Купите предыдущий инструмент чтобы разблокировать
              </p>
            </div>
            <div className="text-xs font-mono text-ink-500">
              {formatNumber(nextTool.baseCost)} VB
            </div>
          </div>
        </div>
      )}

      {unlockedTools.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-ink-500">Начните кликать чтобы разблокировать инструменты!</p>
        </div>
      )}
    </div>
  )
}
