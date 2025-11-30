import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getUpgradesByCategory } from '../data/upgrades'
import { formatNumber } from '../utils/formatters'

export function UpgradePanel() {
  const currencies = useGameStore((s) => s.currencies)
  const ownedUpgrades = useGameStore((s) => s.ownedUpgrades)
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade)

  const categories = useMemo(() => [
    { id: 'click', name: 'Click Upgrades', icon: '🖱️', upgrades: getUpgradesByCategory('click') },
    { id: 'production', name: 'AI Multipliers', icon: '🤖', upgrades: getUpgradesByCategory('production') },
    { id: 'idle', name: 'Idle Bonuses', icon: '🌙', upgrades: getUpgradesByCategory('idle') },
  ], [])

  return (
    <div className="glass-card rounded-xl p-4">
      <h2 className="text-xl font-bold text-gradient mb-4">Апгрейды</h2>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-2 mb-2">
              <span>{category.icon}</span>
              <h3 className="text-sm font-semibold text-text-secondary">{category.name}</h3>
            </div>
            
            <div className="space-y-2">
              {category.upgrades.map((upgrade) => {
                const isOwned = ownedUpgrades.includes(upgrade.id)
                const canAfford = currencies.vibeCodes >= upgrade.cost

                return (
                  <motion.div
                    key={upgrade.id}
                    className={`rounded-lg p-3 border transition-all ${
                      isOwned
                        ? 'bg-neon-green/10 border-neon-green/30'
                        : 'bg-dark-700/50 border-dark-500 hover:border-neon-cyan/30'
                    }`}
                    whileHover={!isOwned ? { scale: 1.01 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{upgrade.icon}</span>
                        <div>
                          <h4 className="font-semibold text-sm text-text-primary">
                            {upgrade.name}
                          </h4>
                          <p className="text-xs text-text-muted">{upgrade.description}</p>
                        </div>
                      </div>
                      
                      {isOwned ? (
                        <span className="text-neon-green text-sm font-semibold">✓</span>
                      ) : (
                        <motion.button
                          onClick={() => purchaseUpgrade(upgrade.id)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            canAfford
                              ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 cursor-pointer'
                              : 'bg-dark-600 text-text-muted cursor-not-allowed'
                          }`}
                          whileHover={canAfford ? { scale: 1.05 } : {}}
                          whileTap={canAfford ? { scale: 0.95 } : {}}
                        >
                          {formatNumber(upgrade.cost)} VB
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
