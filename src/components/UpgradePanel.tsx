import { useMemo } from 'react'
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
    { id: 'click', name: 'Click Power', icon: '👆', upgrades: getUpgradesByCategory('click') },
    { id: 'production', name: 'Production', icon: '🤖', upgrades: getUpgradesByCategory('production') },
    { id: 'idle', name: 'Idle', icon: '🌙', upgrades: getUpgradesByCategory('idle') },
  ], [])

  const vbInfiniteUpgrades = INFINITE_UPGRADES.filter(u => u.currency === 'vibeCodes')
  const dpInfiniteUpgrades = INFINITE_UPGRADES.filter(u => u.currency === 'devPoints')

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-display font-bold text-ink-800">Upgrades</h2>
      
      {/* Infinite Upgrades - VibeCodes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">♾️</span>
          <h3 className="text-xs font-display font-bold text-coral-600 uppercase tracking-wider">
            Infinite (VB)
          </h3>
        </div>
        
        <div className="space-y-2">
          {vbInfiniteUpgrades.map((upgrade) => {
            const level = getInfiniteUpgradeLevel(upgrade.id)
            const cost = getInfiniteUpgradeCostFn(upgrade.id)
            const canAfford = currencies.vibeCodes >= cost
            const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false

            return (
              <div
                key={upgrade.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isMaxed
                    ? 'bg-lime-50 border-lime-400'
                    : 'bg-white border-ink-200 hover:border-coral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{upgrade.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-ink-800">
                          {upgrade.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-coral-100 text-coral-600 font-mono font-bold">
                          Lv.{level}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-500">{upgrade.effectPerLevel}</p>
                    </div>
                  </div>
                  
                  {isMaxed ? (
                    <span className="text-lime-600 text-xs font-display font-bold px-3 py-1.5 bg-lime-100 rounded-lg">MAX</span>
                  ) : (
                    <button
                      onClick={() => purchaseInfiniteUpgrade(upgrade.id)}
                      disabled={!canAfford}
                      className={`btn text-xs py-1.5 px-3 ${canAfford ? 'btn-primary' : ''}`}
                      style={!canAfford ? { 
                        background: '#E5E5E5', 
                        color: '#999',
                        borderColor: '#CCC',
                        boxShadow: 'none',
                        cursor: 'not-allowed'
                      } : undefined}
                    >
                      {formatNumber(cost)} VB
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Infinite Upgrades - DevPoints */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">💎</span>
          <h3 className="text-xs font-display font-bold text-purple-600 uppercase tracking-wider">
            Infinite (DP)
          </h3>
        </div>
        
        <div className="space-y-2">
          {dpInfiniteUpgrades.map((upgrade) => {
            const level = getInfiniteUpgradeLevel(upgrade.id)
            const cost = getInfiniteUpgradeCostFn(upgrade.id)
            const canAfford = currencies.devPoints >= cost
            const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false

            return (
              <div
                key={upgrade.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isMaxed
                    ? 'bg-lime-50 border-lime-400'
                    : 'bg-white border-ink-200 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{upgrade.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-ink-800">
                          {upgrade.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-purple-100 text-purple-600 font-mono font-bold">
                          Lv.{level}{upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-500">{upgrade.effectPerLevel}</p>
                    </div>
                  </div>
                  
                  {isMaxed ? (
                    <span className="text-lime-600 text-xs font-display font-bold px-3 py-1.5 bg-lime-100 rounded-lg">MAX</span>
                  ) : (
                    <button
                      onClick={() => purchaseInfiniteUpgrade(upgrade.id)}
                      disabled={!canAfford}
                      className="btn text-xs py-1.5 px-3"
                      style={canAfford ? { 
                        background: '#A855F7', 
                        color: 'white',
                        borderColor: '#7C3AED',
                        boxShadow: '4px 4px 0px 0px #7C3AED'
                      } : { 
                        background: '#E5E5E5', 
                        color: '#999',
                        borderColor: '#CCC',
                        boxShadow: 'none',
                        cursor: 'not-allowed'
                      }}
                    >
                      {formatNumber(cost)} DP
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* One-time upgrades */}
      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">{category.icon}</span>
            <h3 className="text-xs font-display font-bold text-ink-600 uppercase tracking-wider">
              {category.name}
            </h3>
          </div>
          
          <div className="space-y-2">
            {category.upgrades.map((upgrade) => {
              const isOwned = ownedUpgrades.includes(upgrade.id)
              const canAfford = currencies.vibeCodes >= upgrade.cost

              return (
                <div
                  key={upgrade.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isOwned
                      ? 'bg-lime-50 border-lime-400'
                      : 'bg-white border-ink-200 hover:border-coral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{upgrade.icon}</span>
                      <div>
                        <h4 className="font-display font-bold text-sm text-ink-800">
                          {upgrade.name}
                        </h4>
                        <p className="text-[11px] text-ink-500">{upgrade.description}</p>
                      </div>
                    </div>
                    
                    {isOwned ? (
                      <span className="text-lime-600 text-lg">✓</span>
                    ) : (
                      <button
                        onClick={() => purchaseUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className={`btn text-xs py-1.5 px-3 ${canAfford ? 'btn-secondary' : ''}`}
                        style={!canAfford ? { 
                          background: '#E5E5E5', 
                          color: '#999',
                          borderColor: '#CCC',
                          boxShadow: 'none',
                          cursor: 'not-allowed'
                        } : undefined}
                      >
                        {formatNumber(upgrade.cost)} VB
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
