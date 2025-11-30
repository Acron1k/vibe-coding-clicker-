import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { INFINITE_UPGRADES, UPGRADE_CATEGORIES, getInfiniteUpgradeCost, UpgradeCategory } from '../data/upgrades'
import { formatNumber } from '../utils/formatters'
import { useSound } from '../hooks/useSound'

export function UpgradePanel() {
  const currencies = useGameStore((s) => s.currencies)
  const purchaseInfiniteUpgrade = useGameStore((s) => s.purchaseInfiniteUpgrade)
  const getInfiniteUpgradeLevel = useGameStore((s) => s.getInfiniteUpgradeLevel)
  const { playSound } = useSound()

  const groupedUpgrades = useMemo(() => {
    const groups: Record<UpgradeCategory, typeof INFINITE_UPGRADES> = {
      click: [],
      production: [],
      efficiency: [],
      crit: [],
      offline: [],
      pt: [],
      dp: [],
      special: [],
    }
    
    INFINITE_UPGRADES.forEach(upgrade => {
      groups[upgrade.category].push(upgrade)
    })
    
    return groups
  }, [])

  const getCurrencyAmount = (currency: string) => {
    switch (currency) {
      case 'vibeCodes': return currencies.vibeCodes
      case 'promptTokens': return currencies.promptTokens
      case 'devPoints': return currencies.devPoints
      default: return 0
    }
  }

  const getCurrencyLabel = (currency: string) => {
    switch (currency) {
      case 'vibeCodes': return 'VB'
      case 'promptTokens': return 'PT'
      case 'devPoints': return 'DP'
      default: return ''
    }
  }

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'vibeCodes': return { bg: 'bg-coral-500', text: 'text-white', border: 'border-coral-600' }
      case 'promptTokens': return { bg: 'bg-teal-500', text: 'text-white', border: 'border-teal-600' }
      case 'devPoints': return { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' }
      default: return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' }
    }
  }

  const handlePurchase = (upgradeId: string) => {
    if (purchaseInfiniteUpgrade(upgradeId)) {
      playSound('success')
    } else {
      playSound('error')
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-display font-bold text-ink-800">Улучшения</h2>
      
      {UPGRADE_CATEGORIES.map((category) => {
        const upgrades = groupedUpgrades[category.id]
        if (upgrades.length === 0) return null

        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{category.icon}</span>
              <h3 className="text-xs font-display font-bold text-ink-600 uppercase tracking-wider">
                {category.name}
              </h3>
              <div className="flex-1 h-0.5 bg-ink-200 rounded-full" />
            </div>
            
            <div className="space-y-2">
              {upgrades.map((upgrade) => {
                const level = getInfiniteUpgradeLevel(upgrade.id)
                const cost = getInfiniteUpgradeCost(upgrade, level)
                const currencyAmount = getCurrencyAmount(upgrade.currency)
                const canAfford = currencyAmount >= cost
                const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false
                const currencyLabel = getCurrencyLabel(upgrade.currency)
                const currencyColor = getCurrencyColor(upgrade.currency)

                return (
                  <div
                    key={upgrade.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isMaxed
                        ? 'bg-lime-50 border-lime-400'
                        : 'bg-white border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xl flex-shrink-0">{upgrade.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display font-bold text-sm text-ink-800">
                              {upgrade.name}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-ink-100 text-ink-600 font-mono font-bold">
                              Ур.{level}{upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-500 truncate">{upgrade.effectPerLevel}</p>
                        </div>
                      </div>
                      
                      {isMaxed ? (
                        <span className="text-lime-600 text-xs font-display font-bold px-3 py-1.5 bg-lime-100 rounded-lg flex-shrink-0">
                          МАКС
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePurchase(upgrade.id)}
                          disabled={!canAfford}
                          className={`btn text-xs py-1.5 px-3 flex-shrink-0 ${currencyColor.bg} ${currencyColor.text} border-2 ${currencyColor.border}`}
                          style={!canAfford ? { 
                            background: '#E5E5E5', 
                            color: '#999',
                            borderColor: '#CCC',
                            boxShadow: 'none',
                            cursor: 'not-allowed'
                          } : {
                            boxShadow: `3px 3px 0px 0px ${upgrade.currency === 'vibeCodes' ? '#C53030' : upgrade.currency === 'promptTokens' ? '#0D9488' : '#7C3AED'}`
                          }}
                        >
                          {formatNumber(cost)} {currencyLabel}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
