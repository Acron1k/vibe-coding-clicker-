import { useGameStore } from '../store/gameStore'
import { formatNumber, formatTime, formatPerSecond } from '../utils/formatters'

export function StatsPanel() {
  const stats = useGameStore((s) => s.stats)
  const getClickValue = useGameStore((s) => s.getClickValue)
  const getPassiveIncome = useGameStore((s) => s.getPassiveIncome)
  const ownedTools = useGameStore((s) => s.ownedTools)
  const ownedUpgrades = useGameStore((s) => s.ownedUpgrades)
  const infiniteUpgrades = useGameStore((s) => s.infiniteUpgrades)
  const getCritChance = useGameStore((s) => s.getCritChance)

  const income = getPassiveIncome()
  const clickValue = getClickValue()
  const critChance = getCritChance()

  const totalInfiniteUpgrades = Object.values(infiniteUpgrades).reduce((sum, level) => sum + level, 0)

  const statItems = [
    { label: 'Total Clicks', value: formatNumber(stats.totalClicks), icon: '👆', color: 'bg-coral-100 text-coral-700' },
    { label: 'VB per Click', value: formatNumber(clickValue), icon: '⚡', color: 'bg-lime-100 text-lime-700' },
    { label: 'VB per Second', value: formatPerSecond(income.vibeCodes), icon: '📈', color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Earned', value: formatNumber(stats.totalVibeCodesEarned), icon: '💰', color: 'bg-orange-100 text-orange-700' },
    { label: 'Tools Owned', value: Object.keys(ownedTools).length.toString(), icon: '🛠️', color: 'bg-purple-100 text-purple-700' },
    { label: 'Upgrades', value: `${ownedUpgrades.length} + ${totalInfiniteUpgrades}`, icon: '⬆️', color: 'bg-teal-100 text-teal-700' },
    { label: 'Crit Chance', value: `${(critChance * 100).toFixed(1)}%`, icon: '🎯', color: 'bg-pink-100 text-pink-700' },
    { label: 'Play Time', value: formatTime(stats.playTime), icon: '⏱️', color: 'bg-indigo-100 text-indigo-700' },
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-display font-bold text-ink-800 mb-3">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-2">
        {statItems.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3 ${stat.color}`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base">{stat.icon}</span>
              <span className="text-[10px] font-display font-bold uppercase tracking-wide opacity-80">
                {stat.label}
              </span>
            </div>
            <span className="font-mono font-bold text-sm">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* DP Income indicator */}
      {income.devPoints > 0 && (
        <div className="mt-3 p-2 bg-purple-50 rounded-xl border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-display font-bold text-purple-700 uppercase">
              🔮 DP Income
            </span>
            <span className="font-mono font-bold text-purple-700 text-sm">
              {formatPerSecond(income.devPoints)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
