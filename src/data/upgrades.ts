import { UpgradeDefinition } from '../types'

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
