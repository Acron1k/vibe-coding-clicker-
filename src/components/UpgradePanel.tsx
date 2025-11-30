import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getUpgradesByCategory, INFINITE_UPGRADES } from '../data/upgrades'
import { formatNumber } from '../utils/formatters'

export function UpgradePanel() {
  const currencies = useGameStore((s) => s.currencies)
  const ownedUpgrades = useGameStore((s) => s.ownedUpgrades)
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade)
  const purchaseInfiniteUpgrade = useGameStore((s) => s.purchaseInfiniteUpgrade)
  const getInfiniteUpgradeLevel = useGameStore((s) => s.getInfiniteUpgradeLevel)
  const getInfiniteUpgradeCostFn = useGameStore((s) => s.getInfiniteUpgradeCost)

  const categories = useMemo(() => [
    { id: 'click', name: 'Click Upgrades', icon: '🖱️', upgrades: getUpgradesByCategory('click') },
    { id: 'production', name: 'AI Multipliers', icon: '🤖', upgrades: getUpgradesByCategory('production') },
    { id: 'idle', name: 'Idle Bonuses', icon: '🌙', upgrades: getUpgradesByCategory('idle') },
  ], [])

  const vbInfiniteUpgrades = INFINITE_UPGRADES.filter(u => u.currency === 'vibeCodes')
  const dpInfiniteUpgrades = INFINITE_UPGRADES.filter(u => u.currency === 'devPoints')

  return (
    <div className="glass-card rounded-xl p-4">
      <h2 className="text-xl font-bold text-gradient mb-4">Апгрейды</h2>
      
      <div className="space-y-4">
        {/* Infinite Upgrades - VibeCodes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span>♾️</span>
            <h3 className="text-sm font-semibold text-neon-cyan">Бесконечные (VB)</h3>
          </div>
          
          <div className="space-y-2">
            {vbInfiniteUpgrades.map((upgrade) => {
              const level = getInfiniteUpgradeLevel(upgrade.id)
              const cost = getInfiniteUpgradeCostFn(upgrade.id)
              const canAfford = currencies.vibeCodes >= cost
              const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false

              return (
                <motion.div
                  key={upgrade.id}
                  className={`rounded-lg p-3 border transition-all ${
                    isMaxed
                      ? 'bg-neon-green/10 border-neon-green/30'
                      : 'bg-dark-700/50 border-dark-500 hover:border-neon-cyan/30'
                  }`}
                  whileHover={!isMaxed ? { scale: 1.01 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{upgrade.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-text-primary">
                            {upgrade.name}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan font-mono">
                            Lv.{level}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">{upgrade.description}</p>
                      </div>
                    </div>
                    
                    {isMaxed ? (
                      <span className="text-neon-green text-sm font-semibold">MAX</span>
                    ) : (
                      <motion.button
                        onClick={() => purchaseInfiniteUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          canAfford
                            ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 cursor-pointer'
                            : 'bg-dark-600 text-text-muted cursor-not-allowed'
                        }`}
                        whileHover={canAfford ? { scale: 1.05 } : {}}
                        whileTap={canAfford ? { scale: 0.95 } : {}}
                      >
                        {formatNumber(cost)} VB
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Infinite Upgrades - DevPoints */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span>💎</span>
            <h3 className="text-sm font-semibold text-neon-purple">Бесконечные (DP)</h3>
          </div>
          
          <div className="space-y-2">
            {dpInfiniteUpgrades.map((upgrade) => {
              const level = getInfiniteUpgradeLevel(upgrade.id)
              const cost = getInfiniteUpgradeCostFn(upgrade.id)
              const canAfford = currencies.devPoints >= cost
              const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false

              return (
                <motion.div
                  key={upgrade.id}
                  className={`rounded-lg p-3 border transition-all ${
                    isMaxed
                      ? 'bg-neon-green/10 border-neon-green/30'
                      : 'bg-dark-700/50 border-dark-500 hover:border-neon-purple/30'
                  }`}
                  whileHover={!isMaxed ? { scale: 1.01 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{upgrade.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-text-primary">
                            {upgrade.name}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple font-mono">
                            Lv.{level}{upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted">{upgrade.description}</p>
                      </div>
                    </div>
                    
                    {isMaxed ? (
                      <span className="text-neon-green text-sm font-semibold">MAX</span>
                    ) : (
                      <motion.button
                        onClick={() => purchaseInfiniteUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          canAfford
                            ? 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 cursor-pointer'
                            : 'bg-dark-600 text-text-muted cursor-not-allowed'
                        }`}
                        whileHover={canAfford ? { scale: 1.05 } : {}}
                        whileTap={canAfford ? { scale: 0.95 } : {}}
                      >
                        {formatNumber(cost)} DP
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* One-time upgrades */}
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
