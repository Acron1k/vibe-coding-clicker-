import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getToolById } from '../data/tools'
import { SUBSCRIPTIONS, getNextTier, SUBSCRIPTION_ORDER } from '../data/subscriptions'

export function SubscriptionPanel() {
  const ownedTools = useGameStore((s) => s.ownedTools)
  const currencies = useGameStore((s) => s.currencies)
  const upgradeSubscription = useGameStore((s) => s.upgradeSubscription)

  if (Object.keys(ownedTools).length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-gradient mb-4">Подписки</h2>
        <p className="text-text-muted text-center py-4">
          Купите инструменты чтобы улучшить их подписки
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <h2 className="text-xl font-bold text-gradient mb-4">Подписки</h2>
      
      <div className="space-y-3">
        {Object.values(ownedTools).map((owned) => {
          const tool = getToolById(owned.toolId)
          if (!tool) return null

          const currentSub = SUBSCRIPTIONS[owned.subscriptionTier]
          const nextTier = getNextTier(owned.subscriptionTier)
          const nextSub = nextTier ? SUBSCRIPTIONS[nextTier] : null
          const canUpgrade = nextSub && currencies.devPoints >= nextSub.dpCost

          return (
            <motion.div
              key={owned.toolId}
              className="bg-dark-700/50 rounded-lg p-3 border border-dark-500"
              whileHover={{ borderColor: 'rgba(0, 217, 255, 0.3)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tool.icon}</span>
                  <span className="font-semibold text-text-primary">{tool.name}</span>
                </div>
                <span className={`badge-${owned.subscriptionTier === 'proPlus' ? 'pro-plus' : owned.subscriptionTier} 
                                text-xs px-2 py-1 rounded-md font-semibold`}>
                  {currentSub.displayName}
                </span>
              </div>

              {/* Current bonuses */}
              <div className="text-xs text-text-muted mb-2 flex flex-wrap gap-2">
                <span>x{currentSub.vbMultiplier} VB</span>
                {currentSub.ptBonus > 0 && (
                  <span className="text-gradient-gold">+{currentSub.ptBonus} PT/s</span>
                )}
                {currentSub.critChance > 0 && (
                  <span className="text-neon-yellow">{currentSub.critChance * 100}% крит</span>
                )}
              </div>

              {/* Upgrade button */}
              {nextSub ? (
                <motion.button
                  onClick={() => upgradeSubscription(owned.toolId)}
                  disabled={!canUpgrade}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all
                             flex items-center justify-between ${
                    canUpgrade
                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-neon-purple cursor-pointer'
                      : 'bg-dark-600 text-text-muted cursor-not-allowed'
                  }`}
                  whileHover={canUpgrade ? { scale: 1.02 } : {}}
                  whileTap={canUpgrade ? { scale: 0.98 } : {}}
                >
                  <span>Улучшить до {nextSub.displayName}</span>
                  <span className="font-mono flex items-center gap-1">
                    🔷 {nextSub.dpCost}
                  </span>
                </motion.button>
              ) : (
                <div className="text-center py-2 text-neon-green text-sm font-semibold">
                  ✨ Максимальный уровень!
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Subscription legend */}
      <div className="mt-4 pt-4 border-t border-dark-500">
        <p className="text-xs text-text-muted mb-2">Уровни подписок:</p>
        <div className="flex flex-wrap gap-1">
          {SUBSCRIPTION_ORDER.map((tier) => (
            <span
              key={tier}
              className={`badge-${tier === 'proPlus' ? 'pro-plus' : tier} text-xs px-2 py-0.5 rounded`}
            >
              {SUBSCRIPTIONS[tier].displayName}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
