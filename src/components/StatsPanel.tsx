import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { formatNumber, formatTime, formatPerSecond } from '../utils/formatters'

export function StatsPanel() {
  const stats = useGameStore((s) => s.stats)
  const getClickValue = useGameStore((s) => s.getClickValue)
  const getPassiveIncome = useGameStore((s) => s.getPassiveIncome)
  const ownedTools = useGameStore((s) => s.ownedTools)
  const ownedUpgrades = useGameStore((s) => s.ownedUpgrades)

  const income = getPassiveIncome()
  const clickValue = getClickValue()

  const statItems = [
    { label: 'Всего кликов', value: formatNumber(stats.totalClicks), icon: '🖱️' },
    { label: 'VB за клик', value: formatNumber(clickValue), icon: '⚡' },
    { label: 'VB в секунду', value: formatPerSecond(income.vibeCodes), icon: '📈' },
    { label: 'Всего заработано', value: formatNumber(stats.totalVibeCodesEarned), icon: '💰' },
    { label: 'Инструментов', value: Object.keys(ownedTools).length.toString(), icon: '🛠️' },
    { label: 'Апгрейдов', value: ownedUpgrades.length.toString(), icon: '⬆️' },
    { label: 'Время игры', value: formatTime(stats.playTime), icon: '⏱️' },
    { label: 'Project Tokens', value: stats.projectTokens.toString(), icon: '🏆' },
  ]

  return (
    <motion.div
      className="glass-card rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-gradient mb-4">Статистика</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((stat, idx) => (
          <div
            key={idx}
            className="bg-dark-700/50 rounded-lg p-3 border border-dark-500"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-xs text-text-muted">{stat.label}</span>
            </div>
            <span className="font-mono font-bold text-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
