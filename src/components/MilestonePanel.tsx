import { useGameStore } from '../store/gameStore'
import { MILESTONES } from '../data/milestones'
import { formatNumber } from '../utils/formatters'

export function MilestonePanel() {
  const completedMilestones = useGameStore((s) => s.completedMilestones)
  const stats = useGameStore((s) => s.stats)
  const ownedTools = useGameStore((s) => s.ownedTools)

  const getProgress = (milestone: typeof MILESTONES[0]) => {
    let current = 0
    const target = milestone.condition.value

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
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-display font-bold text-ink-800">Goals</h2>
        <span className="text-xs font-mono bg-paper-200 px-2 py-1 rounded-lg border border-ink-200 text-ink-600">
          {completedMilestones.length}/{MILESTONES.length}
        </span>
      </div>
      
      <div className="space-y-2">
        {MILESTONES.map((milestone) => {
          const isCompleted = completedMilestones.includes(milestone.id)
          const progress = getProgress(milestone)

          return (
            <div
              key={milestone.id}
              className={`rounded-xl p-3 border-2 transition-all ${
                isCompleted
                  ? 'bg-lime-50 border-lime-400'
                  : 'bg-paper-50 border-ink-200'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h4 className="font-display font-bold text-sm text-ink-800 flex items-center gap-2">
                    {isCompleted && <span className="text-lime-600">✓</span>}
                    {milestone.name}
                  </h4>
                  <p className="text-[11px] text-ink-500">{milestone.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              {!isCompleted && (
                <div className="mt-2">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-ink-500 font-mono">
                      {formatNumber(progress.current)} / {formatNumber(progress.target)}
                    </span>
                    <span className="text-[10px] text-coral-500 font-bold">
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
                    className={`text-[10px] px-2 py-0.5 rounded-lg font-mono font-bold ${
                      isCompleted 
                        ? 'bg-ink-200 text-ink-500' 
                        : 'bg-coral-100 text-coral-600'
                    }`}
                  >
                    +{formatNumber(reward.value)} {reward.type === 'vibeCodes' ? 'VB' : 
                      reward.type === 'devPoints' ? 'DP' : 
                      reward.type === 'promptTokens' ? 'PT' : '×' + reward.value}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
