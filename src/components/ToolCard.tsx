import { memo } from 'react'
import { useGameStore } from '../store/gameStore'
import { ToolDefinition, OwnedTool } from '../types'
import { SUBSCRIPTIONS } from '../data/subscriptions'
import { formatNumber, formatPerSecond } from '../utils/formatters'
import { useSound } from '../hooks/useSound'

interface ToolCardProps {
  tool: ToolDefinition
  owned?: OwnedTool
}

export const ToolCard = memo(function ToolCard({ tool, owned }: ToolCardProps) {
  const currencies = useGameStore((s) => s.currencies)
  const purchaseTool = useGameStore((s) => s.purchaseTool)
  const getToolCost = useGameStore((s) => s.getToolCost)
  const { playSound } = useSound()
  
  const cost = getToolCost(tool.id)
  const canAfford = currencies.vibeCodes >= cost
  const count = owned?.count || 0
  const subscription = owned ? SUBSCRIPTIONS[owned.subscriptionTier] : SUBSCRIPTIONS.free
  
  const production = tool.baseProduction * count * subscription.vbMultiplier

  const handlePurchase = () => {
    if (purchaseTool(tool.id)) {
      playSound('success')
    } else {
      playSound('error')
    }
  }

  const tierAccents = {
    1: { border: '#3B82F6', bg: 'bg-blue-50' },
    2: { border: '#A855F7', bg: 'bg-purple-50' },
    3: { border: '#F97316', bg: 'bg-orange-50' },
  }

  const accent = tierAccents[tool.tier]

  return (
    <div 
      className={`tool-card ${accent.bg} group`}
      style={{ borderColor: count > 0 ? accent.border : undefined }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-white border-2 shadow-brutal-sm"
            style={{ borderColor: accent.border }}
          >
            {tool.icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-ink-800 flex items-center gap-2 text-sm">
              {tool.name}
              {count > 0 && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-lg bg-white font-mono border-2"
                  style={{ borderColor: accent.border, color: accent.border }}
                >
                  ×{count}
                </span>
              )}
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">{tool.description}</p>
          </div>
        </div>
        
        {owned && owned.subscriptionTier !== 'free' && (
          <span className={`tier-${owned.subscriptionTier === 'proPlus' ? 'proplus' : owned.subscriptionTier} 
                          text-[10px] px-2 py-1 rounded-lg font-display font-bold`}>
            {subscription.displayName}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs mb-3">
        <div className="flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-lg">
          <span className="text-ink-500">Даёт:</span>
          <span className="text-coral-600 font-mono font-bold">
            {count > 0 ? formatPerSecond(production) : formatPerSecond(tool.baseProduction)}
          </span>
        </div>
        {subscription.ptBonus > 0 && count > 0 && (
          <div className="flex items-center gap-1 bg-lime-100 px-2 py-1 rounded-lg">
            <span className="text-teal-700 font-mono font-bold">
              +{formatPerSecond(subscription.ptBonus * count)} PT
            </span>
          </div>
        )}
      </div>

      {/* Buy button */}
      <button
        onClick={handlePurchase}
        disabled={!canAfford}
        className={`btn w-full py-2 text-sm ${
          canAfford ? 'btn-primary' : ''
        }`}
        style={!canAfford ? { 
          background: '#E5E5E5', 
          color: '#999',
          borderColor: '#CCC',
          boxShadow: 'none',
          cursor: 'not-allowed'
        } : undefined}
      >
        <span className="flex items-center justify-center gap-2">
          <span>Купить</span>
          <span className="font-mono">{formatNumber(cost)} VB</span>
        </span>
      </button>
    </div>
  )
})
