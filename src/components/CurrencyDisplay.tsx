import { useGameStore } from '../store/gameStore'
import { formatNumber, formatPerSecond } from '../utils/formatters'

export function CurrencyDisplay() {
  const currencies = useGameStore((s) => s.currencies)
  const getPassiveIncome = useGameStore((s) => s.getPassiveIncome)
  const income = getPassiveIncome()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      {/* Vibe Codes */}
      <div className="currency-pill group hover:translate-y-[-2px] hover:shadow-brutal transition-all">
        <span className="text-xl">💎</span>
        <div className="flex flex-col">
          <span className="currency-vb text-base md:text-lg">
            {formatNumber(currencies.vibeCodes)}
          </span>
          {income.vibeCodes > 0 && (
            <span className="text-[10px] text-ink-500 -mt-0.5">
              {formatPerSecond(income.vibeCodes)}
            </span>
          )}
        </div>
        <span className="text-[10px] text-ink-400 font-display font-bold hidden sm:inline">VB</span>
      </div>

      {/* Dev Points */}
      <div 
        className="currency-pill group hover:translate-y-[-2px] hover:shadow-brutal transition-all"
        style={{ borderColor: '#A855F7' }}
      >
        <span className="text-xl">🔮</span>
        <div className="flex flex-col">
          <span className="currency-dp text-base md:text-lg">
            {formatNumber(currencies.devPoints)}
          </span>
          {income.devPoints > 0 && (
            <span className="text-[10px] text-ink-500 -mt-0.5">
              {formatPerSecond(income.devPoints)}
            </span>
          )}
        </div>
        <span className="text-[10px] text-ink-400 font-display font-bold hidden sm:inline">DP</span>
      </div>

      {/* Prompt Tokens */}
      <div 
        className="currency-pill group hover:translate-y-[-2px] hover:shadow-brutal transition-all"
        style={{ borderColor: '#BEFF3A' }}
      >
        <span className="text-xl">🪙</span>
        <div className="flex flex-col">
          <span className="currency-pt text-base md:text-lg">
            {formatNumber(currencies.promptTokens)}
          </span>
          {income.promptTokens > 0 && (
            <span className="text-[10px] text-ink-500 -mt-0.5">
              {formatPerSecond(income.promptTokens)}
            </span>
          )}
        </div>
        <span className="text-[10px] text-ink-400 font-display font-bold hidden sm:inline">PT</span>
      </div>
    </div>
  )
}
