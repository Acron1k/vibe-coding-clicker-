import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Currencies, PlayerStats, GameSettings, OwnedTool } from '../types'
import { TOOLS, COST_MULTIPLIER, getToolById } from '../data/tools'
import { SUBSCRIPTIONS, getNextTier } from '../data/subscriptions'
import { getUpgradeById } from '../data/upgrades'
import { MILESTONES } from '../data/milestones'

interface GameStore {
  // State
  currencies: Currencies
  stats: PlayerStats
  settings: GameSettings
  ownedTools: Record<string, OwnedTool>
  ownedUpgrades: string[]
  completedMilestones: string[]
  unlockedTools: string[]
  
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
  
  // Calculations
  getToolCost: (toolId: string) => number
  getClickValue: () => number
  getPassiveIncome: () => { vibeCodes: number; promptTokens: number }
  getTotalToolCount: () => number
  
  // Milestone checking
  checkMilestones: () => void
  
  // Game tick
  tick: (deltaSeconds: number) => void
  
  // Tool unlocking
  checkToolUnlocks: () => void
  
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
      completedMilestones: [],
      unlockedTools: ['claude-baseline'],

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
        const clickValue = get().getClickValue()
        
        // Check for crit from ultra subscriptions
        const { ownedTools } = get()
        let critMultiplier = 1
        Object.values(ownedTools).forEach((tool) => {
          const sub = SUBSCRIPTIONS[tool.subscriptionTier]
          if (Math.random() < sub.critChance) {
            critMultiplier = 2
          }
        })
        
        const finalValue = clickValue * critMultiplier
        
        set((state) => ({
          currencies: {
            ...state.currencies,
            vibeCodes: state.currencies.vibeCodes + finalValue,
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

      getToolCost: (toolId) => {
        const tool = getToolById(toolId)
        if (!tool) return Infinity
        
        const owned = get().ownedTools[toolId]
        const count = owned?.count || 0
        
        return Math.floor(tool.baseCost * Math.pow(COST_MULTIPLIER, count))
      },

      getClickValue: () => {
        const { ownedUpgrades, stats } = get()
        let baseClick = 1
        let additiveBonus = 0
        let multiplicativeBonus = 1
        
        // Apply upgrades
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
        
        return Math.floor(baseClick * (1 + additiveBonus) * multiplicativeBonus * prestigeBonus)
      },

      getPassiveIncome: () => {
        const { ownedTools, ownedUpgrades, stats } = get()
        let totalVB = 0
        let totalPT = 0
        
        // Calculate base production from tools
        Object.values(ownedTools).forEach((owned) => {
          const toolDef = getToolById(owned.toolId)
          if (!toolDef) return
          
          const sub = SUBSCRIPTIONS[owned.subscriptionTier]
          totalVB += toolDef.baseProduction * owned.count * sub.vbMultiplier
          totalPT += sub.ptBonus * owned.count
        })
        
        // Apply production upgrades
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
        
        // Apply prestige bonus
        const prestigeBonus = 1 + stats.projectTokens * 0.1
        
        return {
          vibeCodes: totalVB * (1 + additiveBonus) * multiplicativeBonus * prestigeBonus,
          promptTokens: totalPT,
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
            // Award rewards
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
        
        if (income.vibeCodes > 0) {
          const vbEarned = income.vibeCodes * deltaSeconds
          set((state) => ({
            currencies: {
              ...state.currencies,
              vibeCodes: state.currencies.vibeCodes + vbEarned,
            },
            stats: {
              ...state.stats,
              totalVibeCodesEarned: state.stats.totalVibeCodesEarned + vbEarned,
              playTime: state.stats.playTime + deltaSeconds,
            },
          }))
        }
        
        if (income.promptTokens > 0) {
          const ptEarned = income.promptTokens * deltaSeconds
          set((state) => ({
            currencies: {
              ...state.currencies,
              promptTokens: state.currencies.promptTokens + ptEarned,
            },
          }))
        }
        
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
          completedMilestones: [],
          unlockedTools: ['claude-baseline'],
        })
      },
    }),
    {
      name: 'vibecode-clicker-save',
    }
  )
)
