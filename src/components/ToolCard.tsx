import { memo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { ToolDefinition, OwnedTool } from '../types'
import { SUBSCRIPTIONS } from '../data/subscriptions'
import { formatNumber, formatPerSecond } from '../utils/formatters'

interface ToolCardProps {
  tool: ToolDefinition
  owned?: OwnedTool
}

export const ToolCard = memo(function ToolCard({ tool, owned }: ToolCardProps) {
  const currencies = useGameStore((s) => s.currencies)
  const purchaseTool = useGameStore((s) => s.purchaseTool)
  const getToolCost = useGameStore((s) => s.getToolCost)
  
  const cost = getToolCost(tool.id)
  const canAfford = currencies.vibeCodes >= cost
  const count = owned?.count || 0
  const subscription = owned ? SUBSCRIPTIONS[owned.subscriptionTier] : SUBSCRIPTIONS.free
  
  // Calculate actual production
  const production = tool.baseProduction * count * subscription.vbMultiplier

  const handlePurchase = () => {
    purchaseTool(tool.id)
  }

  const tierColors = {
    1: 'from-blue-500/20 to-cyan-500/20',
    2: 'from-purple-500/20 to-pink-500/20',
    3: 'from-orange-500/20 to-yellow-500/20',
  }

  return (
    <motion.div
      className={`tool-card bg-gradient-to-br ${tierColors[tool.tier]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                       bg-dark-700 border border-dark-500"
            style={{ boxShadow: `0 0 20px ${tool.color}30` }}
          >
            {tool.icon}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              {tool.name}
              {count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan font-mono">
                  x{count}
                </span>
              )}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">{tool.description}</p>
          </div>
        </div>
        
        {/* Subscription badge */}
        {owned && owned.subscriptionTier !== 'free' && (
          <span className={`badge-${owned.subscriptionTier === 'proPlus' ? 'pro-plus' : owned.subscriptionTier} 
                          text-xs px-2 py-1 rounded-md font-semibold`}>
            {subscription.displayName}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-text-muted">Производит:</span>
            <span className="text-neon-green font-mono font-semibold">
              {count > 0 ? formatPerSecond(production) : formatPerSecond(tool.baseProduction)}
            </span>
          </div>
          {subscription.ptBonus > 0 && count > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-text-muted">+</span>
              <span className="text-gradient-gold font-mono font-semibold">
                {formatPerSecond(subscription.ptBonus * count)} PT
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Buy button */}
      <motion.button
        onClick={handlePurchase}
        disabled={!canAfford}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all
                   flex items-center justify-center gap-2 ${
          canAfford
            ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:shadow-neon-cyan cursor-pointer'
            : 'bg-dark-600 text-text-muted cursor-not-allowed'
        }`}
        whileHover={canAfford ? { scale: 1.02 } : {}}
        whileTap={canAfford ? { scale: 0.98 } : {}}
      >
        <span>Купить</span>
        <span className="font-mono">
          {formatNumber(cost)} VB
        </span>
      </motion.button>
    </motion.div>
  )
})
