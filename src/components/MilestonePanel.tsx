import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { MILESTONES } from '../data/milestones'
import { formatNumber } from '../utils/formatters'

export function MilestonePanel() {
  const completedMilestones = useGameStore((s) => s.completedMilestones)
  const stats = useGameStore((s) => s.stats)
  const ownedTools = useGameStore((s) => s.ownedTools)

  const getProgress = (milestone: typeof MILESTONES[0]) => {
    let current = 0
    let target = milestone.condition.value

    switch (milestone.condition.type) {
      case 'vibeCodes':
        current = stats.totalVibeCodesEarned
        break
      case 'clicks':
        current = stats.totalClicks
        break
      case 'toolCount':
        current = Object.keys(ownedTools).length
        break
    }

    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <h2 className="text-xl font-bold text-gradient mb-4">
        Майлстоуны
        <span className="text-sm font-normal text-text-muted ml-2">
          {completedMilestones.length}/{MILESTONES.length}
        </span>
      </h2>
      
      <div className="space-y-3">
        {MILESTONES.map((milestone) => {
          const isCompleted = completedMilestones.includes(milestone.id)
          const progress = getProgress(milestone)

          return (
            <motion.div
              key={milestone.id}
              className={`rounded-lg p-3 border transition-all ${
                isCompleted
                  ? 'bg-neon-green/10 border-neon-green/30'
                  : 'bg-dark-700/50 border-dark-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-text-primary flex items-center gap-2">
                    {isCompleted && <span className="text-neon-green">✓</span>}
                    {milestone.name}
                  </h4>
                  <p className="text-xs text-text-muted">{milestone.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              {!isCompleted && (
                <div className="mt-2">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-text-muted">
                      {formatNumber(progress.current)} / {formatNumber(progress.target)}
                    </span>
                    <span className="text-xs text-neon-cyan">
                      {progress.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Rewards */}
              <div className="mt-2 flex flex-wrap gap-1">
                {milestone.rewards.map((reward, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isCompleted ? 'bg-dark-600 text-text-muted' : 'bg-dark-600 text-text-secondary'
                    }`}
                  >
                    +{formatNumber(reward.value)} {reward.type === 'vibeCodes' ? 'VB' : 
                      reward.type === 'devPoints' ? 'DP' : 
                      reward.type === 'promptTokens' ? 'PT' : 'x' + reward.value}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
