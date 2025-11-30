import { useMemo, useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { 
  AI_TOOLS, 
  isAIToolUnlocked, 
  getNextLockedAITool, 
  needsNewGeneratedTool,
  getLastNTools,
  addGeneratedTool,
  saveGeneratedTools,
  STATIC_TOOLS_COUNT
} from '../data/aiTools'
import { ToolCard } from './ToolCard'
import { formatNumber } from '../utils/formatters'
import { generateNextTool } from '../services/toolGenerator'

export function ToolList() {
  const ownedTools = useGameStore((s) => s.ownedTools)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [toolsVersion, setToolsVersion] = useState(0) // Force re-render when tools change

  const handleGenerateNewTool = useCallback(async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    setGenerationError(null)
    
    try {
      const lastThree = getLastNTools(3)
      const previousTool = lastThree[lastThree.length - 1]
      const newToolIndex = AI_TOOLS.length + 1
      
      const newTool = await generateNextTool({
        lastThreeTools: lastThree,
        toolIndex: newToolIndex,
        previousTool
      })
      
      addGeneratedTool(newTool)
      saveGeneratedTools()
      setToolsVersion(v => v + 1)
      
    } catch (error) {
      console.error('Generation failed:', error)
      setGenerationError('Не удалось сгенерировать инструмент')
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating])

  // Check if we need to generate a new tool
  useEffect(() => {
    if (needsNewGeneratedTool(ownedTools) && !isGenerating) {
      handleGenerateNewTool()
    }
  }, [ownedTools, isGenerating, handleGenerateNewTool])

  const { unlockedTools, nextTool } = useMemo(() => {
    // Use toolsVersion to force recalculation
    void toolsVersion
    const unlocked = AI_TOOLS.filter((tool) => isAIToolUnlocked(tool.id, ownedTools))
    const next = getNextLockedAITool(ownedTools)
    return { unlockedTools: unlocked, nextTool: next }
  }, [ownedTools, toolsVersion])

  const groupedTools = useMemo(() => {
    return {
      tier1: unlockedTools.filter((t) => t.tier === 1),
      tier2: unlockedTools.filter((t) => t.tier === 2),
      tier3: unlockedTools.filter((t) => t.tier === 3),
    }
  }, [unlockedTools])

  const ownedCount = Object.keys(ownedTools).length
  const isGeneratedSection = ownedCount >= STATIC_TOOLS_COUNT

  const tierInfo = [
    { key: 'tier1', name: 'Базовые', tools: groupedTools.tier1, dot: 'bg-blue-500' },
    { key: 'tier2', name: 'Продвинутые', tools: groupedTools.tier2, dot: 'bg-purple-500' },
    { key: 'tier3', name: isGeneratedSection ? 'Сгенерированные ИИ' : 'Премиум', tools: groupedTools.tier3, dot: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-ink-800">
          ИИ Инструменты
        </h2>
        <span className="text-xs font-mono text-ink-500 bg-paper-200 px-2 py-1 rounded-lg border border-ink-200">
          {ownedCount}/{AI_TOOLS.length}{isGeneratedSection ? '+' : ''}
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

      {/* Next tool to unlock or generate */}
      {nextTool && !isGenerating && (
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

      {/* Generating new tool indicator */}
      {isGenerating && (
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white border-2 border-purple-400 animate-pulse">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-purple-700 text-sm">
                Генерирую новый инструмент...
              </h3>
              <p className="text-xs text-purple-500">
                ИИ придумывает что-то невероятное
              </p>
            </div>
            <div className="animate-spin text-2xl">⚡</div>
          </div>
        </div>
      )}

      {/* Error state */}
      {generationError && (
        <div className="card bg-red-50 border-red-300">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{generationError}</p>
            <button 
              onClick={handleGenerateNewTool}
              className="btn btn-primary text-xs py-1 px-3"
            >
              Повторить
            </button>
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
