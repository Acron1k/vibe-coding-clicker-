import { useGameStore } from '../store/gameStore'
import { getToolById } from '../data/tools'
import { SUBSCRIPTIONS, getNextTier, SUBSCRIPTION_ORDER } from '../data/subscriptions'

export function SubscriptionPanel() {
  const ownedTools = useGameStore((s) => s.ownedTools)
  const currencies = useGameStore((s) => s.currencies)
  const upgradeSubscription = useGameStore((s) => s.upgradeSubscription)

  if (Object.keys(ownedTools).length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-display font-bold text-ink-800 mb-3">Subscriptions</h2>
        <p className="text-ink-500 text-center py-4 text-sm">
          Buy tools to upgrade their subscriptions
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-lg font-display font-bold text-ink-800 mb-3">Subscriptions</h2>
      
      <div className="space-y-2">
        {Object.values(ownedTools).map((owned) => {
          const tool = getToolById(owned.toolId)
          if (!tool) return null

          const currentSub = SUBSCRIPTIONS[owned.subscriptionTier]
          const nextTier = getNextTier(owned.subscriptionTier)
          const nextSub = nextTier ? SUBSCRIPTIONS[nextTier] : null
          const canUpgrade = nextSub && currencies.devPoints >= nextSub.dpCost

          return (
            <div
              key={owned.toolId}
              className="bg-paper-100 rounded-xl p-3 border-2 border-ink-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tool.icon}</span>
                  <span className="font-display font-bold text-ink-800 text-sm">{tool.name}</span>
                </div>
                <span className={`tier-${owned.subscriptionTier === 'proPlus' ? 'proplus' : owned.subscriptionTier} 
                                text-[10px] px-2 py-1 rounded-lg font-display font-bold`}>
                  {currentSub.displayName}
                </span>
              </div>

              {/* Current bonuses */}
              <div className="text-[11px] text-ink-500 mb-2 flex flex-wrap gap-2">
                <span className="bg-white px-2 py-0.5 rounded">×{currentSub.vbMultiplier} VB</span>
                {currentSub.ptBonus > 0 && (
                  <span className="bg-lime-100 text-lime-700 px-2 py-0.5 rounded">+{currentSub.ptBonus} PT/s</span>
                )}
                {currentSub.critChance > 0 && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{currentSub.critChance * 100}% crit</span>
                )}
              </div>

              {/* Upgrade button */}
              {nextSub ? (
                <button
                  onClick={() => upgradeSubscription(owned.toolId)}
                  disabled={!canUpgrade}
                  className="btn w-full py-2 text-xs"
                  style={canUpgrade ? { 
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)', 
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
                  <span className="flex items-center justify-between w-full">
                    <span>Upgrade to {nextSub.displayName}</span>
                    <span className="font-mono">🔮 {nextSub.dpCost}</span>
                  </span>
                </button>
              ) : (
                <div className="text-center py-2 text-lime-600 text-xs font-display font-bold bg-lime-50 rounded-lg">
                  ✨ Max Level!
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Subscription legend */}
      <div className="mt-4 pt-3 border-t-2 border-ink-100">
        <p className="text-[10px] text-ink-500 mb-2 font-display font-bold uppercase">Tiers:</p>
        <div className="flex flex-wrap gap-1">
          {SUBSCRIPTION_ORDER.map((tier) => (
            <span
              key={tier}
              className={`tier-${tier === 'proPlus' ? 'proplus' : tier} text-[9px] px-2 py-0.5 rounded-lg font-bold`}
            >
              {SUBSCRIPTIONS[tier].displayName}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
