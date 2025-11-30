import { UpgradeDefinition, InfiniteUpgradeDefinition } from '../types'

export const UPGRADES: UpgradeDefinition[] = [
  // === Click Upgrades ===
  {
    id: 'better-hands',
    name: 'Better Hands',
    description: '+10% от клика',
    category: 'click',
    cost: 50,
    effect: { type: 'clickMultiplier', value: 10, isAdditive: true },
    icon: '🖐️',
  },
  {
    id: 'caffeine-boost',
    name: 'Caffeine Boost',
    description: '+25% от клика',
    category: 'click',
    cost: 200,
    effect: { type: 'clickMultiplier', value: 25, isAdditive: true },
    icon: '☕',
  },
  {
    id: 'energy-drink',
    name: 'Energy Drink',
    description: '+50% от клика',
    category: 'click',
    cost: 1000,
    effect: { type: 'clickMultiplier', value: 50, isAdditive: true },
    icon: '⚡',
  },
  {
    id: 'nanobots-cursor',
    name: 'Nanobots Cursor',
    description: 'x2 клик (двойной клик)',
    category: 'click',
    cost: 5000,
    effect: { type: 'clickMultiplier', value: 2, isAdditive: false },
    icon: '🤖',
  },

  // === Production Upgrades ===
  {
    id: 'multi-prompt',
    name: 'Multi-Prompt',
    description: 'Все инструменты +10%',
    category: 'production',
    cost: 100,
    effect: { type: 'productionMultiplier', value: 10, isAdditive: true },
    icon: '📝',
  },
  {
    id: 'context-window-plus',
    name: 'Context Window+',
    description: '+25% ко всему производству',
    category: 'production',
    cost: 500,
    effect: { type: 'productionMultiplier', value: 25, isAdditive: true },
    icon: '📊',
  },
  {
    id: 'token-optimization',
    name: 'Token Optimization',
    description: '+50% эффективности',
    category: 'production',
    cost: 2500,
    effect: { type: 'productionMultiplier', value: 50, isAdditive: true },
    icon: '🎯',
  },
  {
    id: 'quantum-prompting',
    name: 'Quantum Prompting',
    description: 'x2 все производство',
    category: 'production',
    cost: 10000,
    effect: { type: 'productionMultiplier', value: 2, isAdditive: false },
    icon: '🌀',
  },

  // === Idle Upgrades ===
  {
    id: 'auto-save-code',
    name: 'Auto-Save Code',
    description: '50% скорости оффлайн',
    category: 'idle',
    cost: 300,
    effect: { type: 'offlineMultiplier', value: 50, isAdditive: true },
    icon: '💾',
  },
  {
    id: 'background-worker',
    name: 'Background Worker',
    description: '+20% когда окно закрыто',
    category: 'idle',
    cost: 1000,
    effect: { type: 'offlineMultiplier', value: 20, isAdditive: true },
    icon: '🔄',
  },
  {
    id: 'dev-mode-24-7',
    name: '24/7 Dev Mode',
    description: '100% оффлайн продакшн',
    category: 'idle',
    cost: 5000,
    effect: { type: 'offlineMultiplier', value: 30, isAdditive: true },
    icon: '🌙',
  },
]

export const getUpgradeById = (id: string): UpgradeDefinition | undefined => {
  return UPGRADES.find(u => u.id === id)
}

export const getUpgradesByCategory = (category: string): UpgradeDefinition[] => {
  return UPGRADES.filter(u => u.category === category)
}

// === INFINITE UPGRADES ===
export const INFINITE_UPGRADES: InfiniteUpgradeDefinition[] = [
  {
    id: 'click-power',
    name: 'Click Power',
    description: '+1 к базовому клику за уровень',
    effectPerLevel: '+1 клик',
    baseCost: 100,
    growthRate: 1.15,
    currency: 'vibeCodes',
    icon: '👆',
  },
  {
    id: 'production-boost',
    name: 'Production Boost',
    description: '+10% к производству за уровень',
    effectPerLevel: '+10% производства',
    baseCost: 500,
    growthRate: 1.20,
    currency: 'vibeCodes',
    icon: '📈',
  },
  {
    id: 'dp-generator',
    name: 'DP Generator',
    description: '+0.1 DevPoints в секунду за уровень',
    effectPerLevel: '+0.1 DP/сек',
    baseCost: 25,
    growthRate: 1.25,
    currency: 'devPoints',
    icon: '💎',
  },
  {
    id: 'crit-master',
    name: 'Crit Master',
    description: '+0.5% шанс критического удара за уровень',
    effectPerLevel: '+0.5% крит',
    baseCost: 100,
    growthRate: 1.30,
    currency: 'devPoints',
    maxLevel: 50,
    icon: '🎯',
  },
  {
    id: 'offline-gains',
    name: 'Offline Gains',
    description: '+5% к оффлайн доходу за уровень',
    effectPerLevel: '+5% оффлайн',
    baseCost: 50,
    growthRate: 1.18,
    currency: 'devPoints',
    maxLevel: 100,
    icon: '🌙',
  },
]

export const getInfiniteUpgradeById = (id: string): InfiniteUpgradeDefinition | undefined => {
  return INFINITE_UPGRADES.find(u => u.id === id)
}

export const getInfiniteUpgradeCost = (upgrade: InfiniteUpgradeDefinition, currentLevel: number): number => {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.growthRate, currentLevel))
}
