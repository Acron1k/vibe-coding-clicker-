import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Currencies, PlayerStats, GameSettings, OwnedTool } from '../types'
import { COST_MULTIPLIER } from '../data/tools'
import { getAIToolById } from '../data/aiTools'
import { SUBSCRIPTIONS, getNextTier } from '../data/subscriptions'
import { getInfiniteUpgradeById, getInfiniteUpgradeCost } from '../data/upgrades'
import { MILESTONES } from '../data/milestones'

const DEMO_MULTIPLIER = 1_000_000

interface GameStore {
  // State
  currencies: Currencies
  stats: PlayerStats
  settings: GameSettings
  ownedTools: Record<string, OwnedTool>
  ownedUpgrades: string[]
  infiniteUpgrades: Record<string, number>
  completedMilestones: string[]
  unlockedTools: string[]
  isDemoMode: boolean
  
  // Currency actions
  addVibeCodes: (amount: number) => void
  spendVibeCodes: (amount: number) => boolean
  addDevPoints: (amount: number) => void
  spendDevPoints: (amount: number) => boolean
  addPromptTokens: (amount: number) => void
  spendPromptTokens: (amount: number) => boolean
  
  // Click action
  handleClick: () => number
  
  // Tool actions
  purchaseTool: (toolId: string) => boolean
  upgradeSubscription: (toolId: string) => boolean
  
  // Upgrade actions
  purchaseInfiniteUpgrade: (upgradeId: string) => boolean
  getInfiniteUpgradeLevel: (upgradeId: string) => number
  getInfiniteUpgradeCost: (upgradeId: string) => number
  
  // Calculations
  getToolCost: (toolId: string) => number
  getClickValue: () => number
  getPassiveIncome: () => { vibeCodes: number; promptTokens: number; devPoints: number }
  getTotalToolCount: () => number
  getCritChance: () => number
  getCritMultiplier: () => number
  
  // Milestone checking
  checkMilestones: () => void
  
  // Game tick
  tick: (deltaSeconds: number) => void
  
  // Legacy
  checkToolUnlocks: () => void
  
  // Demo mode
  toggleDemoMode: () => void
  
  // Sound
  toggleSound: () => void
  
  // Reset
  resetGame: () => void
}

const initialCurrencies: Currencies = {
  vibeCodes: 0,
  devPoints: 0,
  promptTokens: 0,
}

const initialStats: PlayerStats = {
  totalClicks: 0,
  totalVibeCodesEarned: 0,
  totalPrestigeCount: 0,
  projectTokens: 0,
  playTime: 0,
  lastOnlineTime: Date.now(),
}

const initialSettings: GameSettings = {
  soundEnabled: true,
  particlesEnabled: true,
  autoSaveInterval: 5,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currencies: initialCurrencies,
      stats: initialStats,
      settings: initialSettings,
      ownedTools: {},
      ownedUpgrades: [],
      infiniteUpgrades: {},
      completedMilestones: [],
      unlockedTools: ['chatgpt'],
      isDemoMode: false,

      toggleDemoMode: () => {
        set((state) => ({ isDemoMode: !state.isDemoMode }))
      },

      toggleSound: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled,
          },
        }))
      },

      addVibeCodes: (amount) => {
        set((state) => ({
          currencies: {
            ...state.currencies,
            vibeCodes: state.currencies.vibeCodes + amount,
          },
          stats: {
            ...state.stats,
            totalVibeCodesEarned: state.stats.totalVibeCodesEarned + amount,
          },
        }))
      },

      spendVibeCodes: (amount) => {
        const { currencies } = get()
        if (currencies.vibeCodes >= amount) {
          set((state) => ({
            currencies: {
              ...state.currencies,
              vibeCodes: state.currencies.vibeCodes - amount,
            },
          }))
          return true
        }
        return false
      },

      addDevPoints: (amount) => {
        set((state) => ({
          currencies: {
            ...state.currencies,
            devPoints: state.currencies.devPoints + amount,
          },
        }))
      },

      spendDevPoints: (amount) => {
        const { currencies } = get()
        if (currencies.devPoints >= amount) {
          set((state) => ({
            currencies: {
              ...state.currencies,
              devPoints: state.currencies.devPoints - amount,
            },
          }))
          return true
        }
        return false
      },

      addPromptTokens: (amount) => {
        set((state) => ({
          currencies: {
            ...state.currencies,
            promptTokens: state.currencies.promptTokens + amount,
          },
        }))
      },

      spendPromptTokens: (amount) => {
        const { currencies } = get()
        if (currencies.promptTokens >= amount) {
          set((state) => ({
            currencies: {
              ...state.currencies,
              promptTokens: state.currencies.promptTokens - amount,
            },
          }))
          return true
        }
        return false
      },

      handleClick: () => {
        const { isDemoMode, infiniteUpgrades } = get()
        const baseClickValue = get().getClickValue()
        const demoMultiplier = isDemoMode ? DEMO_MULTIPLIER : 1
        
        // Check for crit
        const critChance = get().getCritChance()
        const critMultiplier = get().getCritMultiplier()
        let finalCritMult = 1
        if (Math.random() < critChance) {
          finalCritMult = critMultiplier
        }
        
        // Check for golden click (special upgrade)
        const goldenClickLevel = infiniteUpgrades['golden-clicks'] || 0
        const goldenChance = goldenClickLevel * 0.002
        if (Math.random() < goldenChance) {
          finalCritMult *= 10
        }
        
        // Check for chain reaction
        const chainLevel = infiniteUpgrades['chain-reaction'] || 0
        const chainChance = chainLevel * 0.003
        let chainBonus = 1
        if (Math.random() < chainChance) {
          chainBonus = 2
        }
        
        const finalValue = Math.round(baseClickValue * finalCritMult * chainBonus * demoMultiplier)
        
        // Check for lucky PT drops (special upgrade)
        const luckyDropLevel = infiniteUpgrades['lucky-drops'] || 0
        const luckyChance = luckyDropLevel * 0.001
        let ptBonus = 0
        if (Math.random() < luckyChance) {
          ptBonus = 1 + Math.floor(luckyDropLevel / 10)
        }
        
        set((state) => ({
          currencies: {
            ...state.currencies,
            vibeCodes: state.currencies.vibeCodes + finalValue,
            promptTokens: state.currencies.promptTokens + ptBonus + (isDemoMode ? 1000 : 0),
          },
          stats: {
            ...state.stats,
            totalClicks: state.stats.totalClicks + 1,
            totalVibeCodesEarned: state.stats.totalVibeCodesEarned + finalValue,
          },
        }))
        
        get().checkMilestones()
        
        return finalValue
      },

      purchaseTool: (toolId) => {
        const tool = getAIToolById(toolId)
        if (!tool) return false
        
        const cost = get().getToolCost(toolId)
        if (!get().spendVibeCodes(cost)) return false
        
        set((state) => {
          const existingTool = state.ownedTools[toolId]
          return {
            ownedTools: {
              ...state.ownedTools,
              [toolId]: {
                toolId,
                count: existingTool ? existingTool.count + 1 : 1,
                subscriptionTier: existingTool?.subscriptionTier || 'free',
                totalProduced: existingTool?.totalProduced || 0,
              },
            },
          }
        })
        
        get().checkMilestones()
        return true
      },

      upgradeSubscription: (toolId) => {
        const { ownedTools, infiniteUpgrades } = get()
        const tool = ownedTools[toolId]
        if (!tool) return false
        
        const nextTier = getNextTier(tool.subscriptionTier)
        if (!nextTier) return false
        
        // Apply subscription discount
        const discountLevel = infiniteUpgrades['subscription-discount'] || 0
        const discount = 1 - (discountLevel * 0.02)
        const cost = Math.floor(SUBSCRIPTIONS[nextTier].dpCost * Math.max(0.2, discount))
        
        if (!get().spendDevPoints(cost)) return false
        
        set((state) => ({
          ownedTools: {
            ...state.ownedTools,
            [toolId]: {
              ...state.ownedTools[toolId],
              subscriptionTier: nextTier,
            },
          },
        }))
        
        return true
      },

      purchaseInfiniteUpgrade: (upgradeId) => {
        const upgrade = getInfiniteUpgradeById(upgradeId)
        if (!upgrade) return false
        
        const currentLevel = get().getInfiniteUpgradeLevel(upgradeId)
        
        // Check max level
        if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return false
        
        const cost = get().getInfiniteUpgradeCost(upgradeId)
        
        // Spend the correct currency
        if (upgrade.currency === 'vibeCodes') {
          if (!get().spendVibeCodes(cost)) return false
        } else if (upgrade.currency === 'promptTokens') {
          if (!get().spendPromptTokens(cost)) return false
        } else if (upgrade.currency === 'devPoints') {
          if (!get().spendDevPoints(cost)) return false
        }
        
        set((state) => ({
          infiniteUpgrades: {
            ...state.infiniteUpgrades,
            [upgradeId]: currentLevel + 1,
          },
        }))
        
        return true
      },

      getInfiniteUpgradeLevel: (upgradeId) => {
        return get().infiniteUpgrades[upgradeId] || 0
      },

      getInfiniteUpgradeCost: (upgradeId) => {
        const upgrade = getInfiniteUpgradeById(upgradeId)
        if (!upgrade) return Infinity
        
        const currentLevel = get().getInfiniteUpgradeLevel(upgradeId)
        
        // Apply PT efficiency discount for PT upgrades
        if (upgrade.currency === 'promptTokens') {
          const ptEffLevel = get().infiniteUpgrades['pt-efficiency'] || 0
          const discount = 1 - (ptEffLevel * 0.02)
          return Math.floor(getInfiniteUpgradeCost(upgrade, currentLevel) * Math.max(0.2, discount))
        }
        
        return getInfiniteUpgradeCost(upgrade, currentLevel)
      },

      getToolCost: (toolId) => {
        const tool = getAIToolById(toolId)
        if (!tool) return Infinity
        
        const owned = get().ownedTools[toolId]
        const count = owned?.count || 0
        const { infiniteUpgrades } = get()
        
        // Apply cost reduction
        const costReductionLevel = infiniteUpgrades['cost-reduction'] || 0
        const costMultiplier = 1 - (costReductionLevel * 0.01)
        
        // Apply bulk discount to growth rate
        const bulkDiscountLevel = infiniteUpgrades['bulk-discount'] || 0
        const adjustedGrowthRate = COST_MULTIPLIER - (bulkDiscountLevel * 0.005)
        
        const baseCost = tool.baseCost * Math.pow(Math.max(1.01, adjustedGrowthRate), count)
        return Math.floor(baseCost * Math.max(0.5, costMultiplier))
      },

      getCritChance: () => {
        const { ownedTools, infiniteUpgrades } = get()
        let critChance = 0
        
        // From subscriptions
        Object.values(ownedTools).forEach((tool) => {
          const sub = SUBSCRIPTIONS[tool.subscriptionTier]
          critChance += sub.critChance
        })
        
        // From infinite upgrade (crit-chance: +0.5% per level)
        const critLevel = infiniteUpgrades['crit-chance'] || 0
        critChance += critLevel * 0.005
        
        return Math.min(critChance, 0.80) // Cap at 80%
      },

      getCritMultiplier: () => {
        const { infiniteUpgrades } = get()
        
        // Base crit multiplier is 2x
        let mult = 2
        
        // From crit-damage upgrade (+10% per level)
        const critDamageLevel = infiniteUpgrades['crit-damage'] || 0
        mult += critDamageLevel * 0.1
        
        return mult
      },

      getClickValue: () => {
        const { stats, infiniteUpgrades, ownedTools } = get()
        
        // Base click from click-power upgrade (+1 per level)
        const clickPowerLevel = infiniteUpgrades['click-power'] || 0
        let baseClick = 1 + clickPowerLevel
        
        // Click multiplier (+5% per level)
        const clickMultLevel = infiniteUpgrades['click-multiplier'] || 0
        const clickMultBonus = 1 + (clickMultLevel * 0.05)
        
        // Synergy bonus (+2% per tool per level)
        const synergyLevel = infiniteUpgrades['synergy-bonus'] || 0
        const toolCount = Object.keys(ownedTools).length
        const synergyBonus = 1 + (synergyLevel * 0.02 * toolCount)
        
        // Apply prestige bonus
        const prestigeBonus = 1 + stats.projectTokens * 0.1
        
        const result = baseClick * clickMultBonus * synergyBonus * prestigeBonus
        return Math.max(1, Math.round(result))
      },

      getPassiveIncome: () => {
        const { ownedTools, stats, isDemoMode, infiniteUpgrades } = get()
        const demoMultiplier = isDemoMode ? DEMO_MULTIPLIER : 1
        let totalVB = 0
        let totalPT = 0
        let totalDP = 0
        
        // Calculate production from tools
        Object.values(ownedTools).forEach((owned) => {
          const toolDef = getAIToolById(owned.toolId)
          if (!toolDef) return
          
          const sub = SUBSCRIPTIONS[owned.subscriptionTier]
          
          // VB production
          totalVB += toolDef.baseProduction * owned.count * sub.vbMultiplier
          
          // PT production from tool + subscription bonus
          const toolPT = toolDef.ptGeneration || 0
          totalPT += toolPT * owned.count + (sub.ptBonus * owned.count)
          
          // DP production from tool
          const toolDP = toolDef.dpGeneration || 0
          totalDP += toolDP * owned.count
          
          // DP from high-tier subscriptions
          if (sub.tier === 'max') {
            totalDP += 0.1 * owned.count
          } else if (sub.tier === 'ultra') {
            totalDP += 0.3 * owned.count
          }
        })
        
        // Apply production boost (+10% per level)
        const prodBoostLevel = infiniteUpgrades['production-boost'] || 0
        const prodBonus = 1 + (prodBoostLevel * 0.10)
        
        // Apply synergy bonus to production too
        const synergyLevel = infiniteUpgrades['synergy-bonus'] || 0
        const toolCount = Object.keys(ownedTools).length
        const synergyBonus = 1 + (synergyLevel * 0.02 * toolCount)
        
        // Apply PT generation boost (+10% per level)
        const ptGenLevel = infiniteUpgrades['pt-generation'] || 0
        const ptBonus = 1 + (ptGenLevel * 0.10)
        
        // Apply DP boost (+15% per level)
        const dpBoostLevel = infiniteUpgrades['dp-boost'] || 0
        const dpBonus = 1 + (dpBoostLevel * 0.15)
        
        // Apply prestige bonus
        const prestigeBonus = 1 + stats.projectTokens * 0.1
        
        return {
          vibeCodes: totalVB * prodBonus * synergyBonus * prestigeBonus * demoMultiplier,
          promptTokens: totalPT * ptBonus * demoMultiplier,
          devPoints: totalDP * dpBonus * demoMultiplier,
        }
      },

      getTotalToolCount: () => {
        const { ownedTools } = get()
        return Object.keys(ownedTools).length
      },

      checkMilestones: () => {
        const { stats, completedMilestones, ownedTools } = get()
        const toolCount = Object.keys(ownedTools).length
        
        MILESTONES.forEach((milestone) => {
          if (completedMilestones.includes(milestone.id)) return
          
          let conditionMet = false
          
          switch (milestone.condition.type) {
            case 'vibeCodes':
              conditionMet = stats.totalVibeCodesEarned >= milestone.condition.value
              break
            case 'clicks':
              conditionMet = stats.totalClicks >= milestone.condition.value
              break
            case 'toolCount':
              conditionMet = toolCount >= milestone.condition.value
              break
          }
          
          if (conditionMet) {
            milestone.rewards.forEach((reward) => {
              switch (reward.type) {
                case 'vibeCodes':
                  get().addVibeCodes(reward.value)
                  break
                case 'devPoints':
                  get().addDevPoints(reward.value)
                  break
                case 'promptTokens':
                  get().addPromptTokens(reward.value)
                  break
              }
            })
            
            set((state) => ({
              completedMilestones: [...state.completedMilestones, milestone.id],
            }))
          }
        })
      },

      tick: (deltaSeconds) => {
        const income = get().getPassiveIncome()
        const { currencies } = get()
        
        let newVB = currencies.vibeCodes
        let newPT = currencies.promptTokens
        let newDP = currencies.devPoints
        let vbEarned = 0
        
        // VibeCodes income
        if (income.vibeCodes > 0) {
          vbEarned = income.vibeCodes * deltaSeconds
          newVB += vbEarned
        }
        
        // PromptTokens income
        if (income.promptTokens > 0) {
          newPT += income.promptTokens * deltaSeconds
        }
        
        // DevPoints income
        if (income.devPoints > 0) {
          newDP += income.devPoints * deltaSeconds
        }
        
        set((state) => ({
          currencies: {
            vibeCodes: newVB,
            promptTokens: newPT,
            devPoints: newDP,
          },
          stats: {
            ...state.stats,
            totalVibeCodesEarned: state.stats.totalVibeCodesEarned + vbEarned,
            playTime: state.stats.playTime + deltaSeconds,
          },
        }))
        
        get().checkMilestones()
      },

      checkToolUnlocks: () => {
        // Legacy - not used
      },

      resetGame: () => {
        set({
          currencies: initialCurrencies,
          stats: { ...initialStats, lastOnlineTime: Date.now() },
          settings: initialSettings,
          ownedTools: {},
          ownedUpgrades: [],
          infiniteUpgrades: {},
          completedMilestones: [],
          unlockedTools: ['chatgpt'],
          isDemoMode: false,
        })
      },
    }),
    {
      name: 'vibecode-clicker-save',
      partialize: (state) => ({
        currencies: state.currencies,
        stats: state.stats,
        settings: state.settings,
        ownedTools: state.ownedTools,
        ownedUpgrades: state.ownedUpgrades,
        infiniteUpgrades: state.infiniteUpgrades,
        completedMilestones: state.completedMilestones,
        unlockedTools: state.unlockedTools,
      }),
    }
  )
)
