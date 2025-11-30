import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { formatNumber, formatPerSecond } from '../utils/formatters'

export function CurrencyDisplay() {
  const currencies = useGameStore((s) => s.currencies)
  const getPassiveIncome = useGameStore((s) => s.getPassiveIncome)
  const income = getPassiveIncome()

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
      {/* Vibe Codes */}
      <motion.div 
        className="currency-display group"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <div className="flex flex-col">
            <span className="currency-value text-lg md:text-xl">
              {formatNumber(currencies.vibeCodes)}
            </span>
            <span className="text-xs text-text-muted">
              {formatPerSecond(income.vibeCodes)}
            </span>
          </div>
        </div>
        <span className="text-xs text-text-secondary ml-2 hidden sm:inline">VB</span>
      </motion.div>

      {/* Dev Points */}
      <motion.div 
        className="currency-display group"
        style={{ 
          background: 'rgba(201, 4, 237, 0.05)',
          borderColor: 'rgba(201, 4, 237, 0.2)'
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔷</span>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-mono font-bold" 
                  style={{ color: '#C904ED' }}>
              {formatNumber(currencies.devPoints)}
            </span>
          </div>
        </div>
        <span className="text-xs text-text-secondary ml-2 hidden sm:inline">DP</span>
      </motion.div>

      {/* Prompt Tokens */}
      <motion.div 
        className="currency-display group"
        style={{ 
          background: 'rgba(255, 215, 0, 0.05)',
          borderColor: 'rgba(255, 215, 0, 0.2)'
        }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-mono font-bold text-gradient-gold">
              {formatNumber(currencies.promptTokens)}
            </span>
            {income.promptTokens > 0 && (
              <span className="text-xs text-text-muted">
                {formatPerSecond(income.promptTokens)}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-text-secondary ml-2 hidden sm:inline">PT</span>
      </motion.div>
    </div>
  )
}
