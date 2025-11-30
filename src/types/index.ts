// === CURRENCIES ===
export interface Currencies {
  vibeCodes: number
  devPoints: number
  promptTokens: number
}

// === PLAYER STATS ===
export interface PlayerStats {
  totalClicks: number
  totalVibeCodesEarned: number
  totalPrestigeCount: number
  projectTokens: number
  playTime: number
  lastOnlineTime: number
}

// === GAME SETTINGS ===
export interface GameSettings {
  soundEnabled: boolean
  particlesEnabled: boolean
  autoSaveInterval: number
}

// === TOOLS ===
export type ToolTier = 1 | 2 | 3

export type UnlockConditionType = 'always' | 'clicks' | 'vibeCodes' | 'toolPurchased' | 'toolCount'

export interface UnlockCondition {
  type: UnlockConditionType
  value?: number
  toolId?: string
}

export interface ToolDefinition {
  id: string
  name: string
  description: string
  detailedDescription: string
  tier: ToolTier
  baseCost: number
  baseProduction: number
  unlockCondition: UnlockCondition
  icon: string
  color: string
}

export interface OwnedTool {
  toolId: string
  count: number
  subscriptionTier: SubscriptionTier
  totalProduced: number
}

// === SUBSCRIPTIONS ===
export type SubscriptionTier = 'free' | 'pro' | 'proPlus' | 'max' | 'ultra'

export interface SubscriptionDefinition {
  tier: SubscriptionTier
  displayName: string
  dpCost: number
  vbMultiplier: number
  ptBonus: number
  critChance: number
  features: string[]
  color: string
}

// === UPGRADES ===
export type UpgradeCategory = 'click' | 'production' | 'idle'

export interface UpgradeDefinition {
  id: string
  name: string
  description: string
  category: UpgradeCategory
  cost: number
  effect: {
    type: 'clickMultiplier' | 'productionMultiplier' | 'offlineMultiplier'
    value: number
    isAdditive: boolean
  }
  icon: string
}

export interface OwnedUpgrade {
  upgradeId: string
  purchasedAt: number
}

// === MILESTONES ===
export interface MilestoneDefinition {
  id: string
  name: string
  description: string
  condition: {
    type: 'vibeCodes' | 'clicks' | 'toolCount' | 'subscriptionCount'
    value: number
  }
  rewards: {
    type: 'vibeCodes' | 'devPoints' | 'promptTokens' | 'multiplier'
    value: number
  }[]
}

export interface CompletedMilestone {
  milestoneId: string
  completedAt: number
}

// === GAME STATE ===
export interface GameState {
  currencies: Currencies
  stats: PlayerStats
  settings: GameSettings
}
