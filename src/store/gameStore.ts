import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Currencies, PlayerStats, GameSettings, OwnedTool } from '../types'
import { TOOLS, COST_MULTIPLIER, getToolById } from '../data/tools'
import { SUBSCRIPTIONS, getNextTier } from '../data/subscriptions'
import { getUpgradeById, getInfiniteUpgradeById, getInfiniteUpgradeCost } from '../data/upgrades'
import { MILESTONES } from '../data/milestones'

const DEMO_MULTIPLIER = 1_000_000
const DP_PER_CLICK_BASE = 0.01
const PT_TO_DP_RATE = 1000

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
  
  // Click action
  handleClick: () => number
  
  // Tool actions
  purchaseTool: (toolId: string) => boolean
  upgradeSubscription: (toolId: string) => boolean
  
  // Upgrade actions
  purchaseUpgrade: (upgradeId: string) => boolean
  purchaseInfiniteUpgrade: (upgradeId: string) => boolean
  getInfiniteUpgradeLevel: (upgradeId: string) => number
  getInfiniteUpgradeCost: (upgradeId: string) => number
  
  // Calculations
  getToolCost: (toolId: string) => number
  getClickValue: () => number
  getPassiveIncome: () => { vibeCodes: number; promptTokens: number; devPoints: number }
  getTotalToolCount: () => number
  getCritChance: () => number
  
  // Milestone checking
  checkMilestones: () => void
  
  // Game tick
  tick: (deltaSeconds: number) => void
  
  // Tool unlocking
  checkToolUnlocks: () => void
  
  // Demo mode
  toggleDemoMode: () => void
  
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
      unlockedTools: ['claude-baseline'],
      isDemoMode: false,

      toggleDemoMode: () => {
        set((state) => ({ isDemoMode: !state.isDemoMode }))
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

      handleClick: () => {
        const { isDemoMode, ownedTools } = get()
        const baseClickValue = get().getClickValue()
        const demoMultiplier = isDemoMode ? DEMO_MULTIPLIER : 1
        
        // Check for crit
        const critChance = get().getCritChance()
        let critMultiplier = 1
        if (Math.random() < critChance) {
          critMultiplier = 2
        }
        
        const finalValue = baseClickValue * critMultiplier * demoMultiplier
        
        // Calculate DP earned from click
        const toolCount = Object.keys(ownedTools).length
        const dpFromClick = isDemoMode ? 10000 : (DP_PER_CLICK_BASE * (1 + toolCount * 0.1))
        
        // Prompt tokens bonus in demo mode
        const promptTokensBonus = isDemoMode ? 10000 : 0
        
        set((state) => ({
          currencies: {
            ...state.currencies,
            vibeCodes: state.currencies.vibeCodes + finalValue,
            devPoints: state.currencies.devPoints + dpFromClick,
            promptTokens: state.currencies.promptTokens + promptTokensBonus,
          },
          stats: {
            ...state.stats,
            totalClicks: state.stats.totalClicks + 1,
            totalVibeCodesEarned: state.stats.totalVibeCodesEarned + finalValue,
          },
        }))
        
        get().checkToolUnlocks()
        get().checkMilestones()
        
        return finalValue
      },

      purchaseTool: (toolId) => {
        const tool = getToolById(toolId)
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
        
        get().checkToolUnlocks()
        get().checkMilestones()
        return true
      },

      upgradeSubscription: (toolId) => {
        const { ownedTools } = get()
        const tool = ownedTools[toolId]
        if (!tool) return false
        
        const nextTier = getNextTier(tool.subscriptionTier)
        if (!nextTier) return false
        
        const cost = SUBSCRIPTIONS[nextTier].dpCost
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

      purchaseUpgrade: (upgradeId) => {
        const upgrade = getUpgradeById(upgradeId)
        if (!upgrade) return false
        
        const { ownedUpgrades } = get()
        if (ownedUpgrades.includes(upgradeId)) return false
        
        if (!get().spendVibeCodes(upgrade.cost)) return false
        
        set((state) => ({
          ownedUpgrades: [...state.ownedUpgrades, upgradeId],
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
        } else {
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
        return getInfiniteUpgradeCost(upgrade, currentLevel)
      },

      getToolCost: (toolId) => {
        const tool = getToolById(toolId)
        if (!tool) return Infinity
        
        const owned = get().ownedTools[toolId]
        const count = owned?.count || 0
        
        return Math.floor(tool.baseCost * Math.pow(COST_MULTIPLIER, count))
      },

      getCritChance: () => {
        const { ownedTools, infiniteUpgrades } = get()
        let critChance = 0
        
        // From subscriptions
        Object.values(ownedTools).forEach((tool) => {
          const sub = SUBSCRIPTIONS[tool.subscriptionTier]
          critChance += sub.critChance
        })
        
        // From infinite upgrade (crit-master: +0.5% per level)
        const critLevel = infiniteUpgrades['crit-master'] || 0
        critChance += critLevel * 0.005
        
        return Math.min(critChance, 0.5) // Cap at 50%
      },

      getClickValue: () => {
        const { ownedUpgrades, stats, infiniteUpgrades } = get()
        
        // Base click from infinite upgrade (click-power: +1 per level)
        const clickPowerLevel = infiniteUpgrades['click-power'] || 0
        let baseClick = 1 + clickPowerLevel
        
        let additiveBonus = 0
        let multiplicativeBonus = 1
        
        // Apply one-time upgrades
        ownedUpgrades.forEach((upgradeId) => {
          const upgrade = getUpgradeById(upgradeId)
          if (upgrade && upgrade.effect.type === 'clickMultiplier') {
            if (upgrade.effect.isAdditive) {
              additiveBonus += upgrade.effect.value / 100
            } else {
              multiplicativeBonus *= upgrade.effect.value
            }
          }
        })
        
        // Apply prestige bonus
        const prestigeBonus = 1 + stats.projectTokens * 0.1
        
        const result = baseClick * (1 + additiveBonus) * multiplicativeBonus * prestigeBonus
        return Math.max(1, Math.round(result))
      },

      getPassiveIncome: () => {
        const { ownedTools, ownedUpgrades, stats, isDemoMode, infiniteUpgrades } = get()
        const demoMultiplier = isDemoMode ? DEMO_MULTIPLIER : 1
        let totalVB = 0
        let totalPT = 0
        let totalDP = 0
        
        // Calculate base production from tools
        Object.values(ownedTools).forEach((owned) => {
          const toolDef = getToolById(owned.toolId)
          if (!toolDef) return
          
          const sub = SUBSCRIPTIONS[owned.subscriptionTier]
          totalVB += toolDef.baseProduction * owned.count * sub.vbMultiplier
          totalPT += sub.ptBonus * owned.count
          
          // DP from high-tier subscriptions
          if (sub.tier === 'max') {
            totalDP += 0.1 * owned.count
          } else if (sub.tier === 'ultra') {
            totalDP += 0.3 * owned.count
          }
        })
        
        // Apply production upgrades (one-time)
        let additiveBonus = 0
        let multiplicativeBonus = 1
        
        ownedUpgrades.forEach((upgradeId) => {
          const upgrade = getUpgradeById(upgradeId)
          if (upgrade && upgrade.effect.type === 'productionMultiplier') {
            if (upgrade.effect.isAdditive) {
              additiveBonus += upgrade.effect.value / 100
            } else {
              multiplicativeBonus *= upgrade.effect.value
            }
          }
        })
        
        // Apply infinite production boost (+10% per level)
        const prodBoostLevel = infiniteUpgrades['production-boost'] || 0
        additiveBonus += prodBoostLevel * 0.10
        
        // Apply DP generator (+0.1 DP/sec per level)
        const dpGenLevel = infiniteUpgrades['dp-generator'] || 0
        totalDP += dpGenLevel * 0.1
        
        // Apply prestige bonus
        const prestigeBonus = 1 + stats.projectTokens * 0.1
        
        return {
          vibeCodes: totalVB * (1 + additiveBonus) * multiplicativeBonus * prestigeBonus * demoMultiplier,
          promptTokens: totalPT * demoMultiplier,
          devPoints: totalDP * demoMultiplier,
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
        
        // Convert PromptTokens to DevPoints (1000 PT = 1 DP)
        if (newPT >= PT_TO_DP_RATE) {
          const dpFromPT = Math.floor(newPT / PT_TO_DP_RATE)
          newDP += dpFromPT
          newPT -= dpFromPT * PT_TO_DP_RATE
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
        
        get().checkToolUnlocks()
        get().checkMilestones()
      },

      checkToolUnlocks: () => {
        const { stats, ownedTools, unlockedTools } = get()
        const toolCount = Object.keys(ownedTools).length
        
        TOOLS.forEach((tool) => {
          if (unlockedTools.includes(tool.id)) return
          
          let shouldUnlock = false
          
          switch (tool.unlockCondition.type) {
            case 'always':
              shouldUnlock = true
              break
            case 'clicks':
              shouldUnlock = stats.totalClicks >= (tool.unlockCondition.value || 0)
              break
            case 'vibeCodes':
              shouldUnlock = stats.totalVibeCodesEarned >= (tool.unlockCondition.value || 0)
              break
            case 'toolPurchased':
              shouldUnlock = !!ownedTools[tool.unlockCondition.toolId || '']
              break
            case 'toolCount':
              shouldUnlock = toolCount >= (tool.unlockCondition.value || 0)
              break
          }
          
          if (shouldUnlock) {
            set((state) => ({
              unlockedTools: [...state.unlockedTools, tool.id],
            }))
          }
        })
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
          unlockedTools: ['claude-baseline'],
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
