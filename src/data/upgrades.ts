import { InfiniteUpgradeDefinition } from '../types'

/**
 * ВСЕ УЛУЧШЕНИЯ БЕСКОНЕЧНЫЕ
 * 
 * Валюты:
 * - VB (VibeCodes) - основная валюта
 * - PT (Prompt Tokens) - генерируются некоторыми инструментами
 * - DP (DevPoints) - генерируются продвинутыми инструментами
 * 
 * Категории:
 * - click: Улучшения клика
 * - production: Улучшения производства
 * - efficiency: Эффективность инструментов
 * - crit: Критические удары
 * - offline: Оффлайн доход
 * - pt: Улучшения Prompt Tokens
 * - dp: Улучшения DevPoints
 * - special: Особые улучшения
 */

export type UpgradeCategory = 'click' | 'production' | 'efficiency' | 'crit' | 'offline' | 'pt' | 'dp' | 'special'

export interface ExtendedInfiniteUpgrade extends InfiniteUpgradeDefinition {
  category: UpgradeCategory
}

export const INFINITE_UPGRADES: ExtendedInfiniteUpgrade[] = [
  // ============================================
  // КЛИК (VB)
  // ============================================
  {
    id: 'click-power',
    name: 'Сила клика',
    description: 'Увеличивает базовый клик',
    effectPerLevel: '+1 VB за клик',
    baseCost: 50,
    growthRate: 1.12,
    currency: 'vibeCodes',
    icon: '👆',
    category: 'click',
  },
  {
    id: 'click-multiplier',
    name: 'Множитель клика',
    description: 'Умножает силу клика',
    effectPerLevel: '+5% к клику',
    baseCost: 500,
    growthRate: 1.18,
    currency: 'vibeCodes',
    icon: '✨',
    category: 'click',
  },
  
  // ============================================
  // ПРОИЗВОДСТВО (VB)
  // ============================================
  {
    id: 'production-boost',
    name: 'Буст производства',
    description: 'Увеличивает производство всех инструментов',
    effectPerLevel: '+10% производства',
    baseCost: 200,
    growthRate: 1.15,
    currency: 'vibeCodes',
    icon: '📈',
    category: 'production',
  },
  {
    id: 'synergy-bonus',
    name: 'Синергия',
    description: 'Бонус за каждый купленный инструмент',
    effectPerLevel: '+2% за инструмент',
    baseCost: 1000,
    growthRate: 1.20,
    currency: 'vibeCodes',
    icon: '🔗',
    category: 'production',
  },
  
  // ============================================
  // ЭФФЕКТИВНОСТЬ (VB)
  // ============================================
  {
    id: 'cost-reduction',
    name: 'Оптимизация затрат',
    description: 'Снижает стоимость инструментов',
    effectPerLevel: '-1% к стоимости',
    baseCost: 800,
    growthRate: 1.25,
    currency: 'vibeCodes',
    maxLevel: 50,
    icon: '💰',
    category: 'efficiency',
  },
  {
    id: 'bulk-discount',
    name: 'Оптовая скидка',
    description: 'Дополнительная скидка при покупке',
    effectPerLevel: '-0.5% к росту цены',
    baseCost: 2000,
    growthRate: 1.30,
    currency: 'vibeCodes',
    maxLevel: 30,
    icon: '🏷️',
    category: 'efficiency',
  },
  
  // ============================================
  // КРИТ (PT)
  // ============================================
  {
    id: 'crit-chance',
    name: 'Шанс крита',
    description: 'Увеличивает шанс критического клика',
    effectPerLevel: '+0.5% шанс крита',
    baseCost: 100,
    growthRate: 1.22,
    currency: 'promptTokens',
    maxLevel: 80,
    icon: '🎯',
    category: 'crit',
  },
  {
    id: 'crit-damage',
    name: 'Сила крита',
    description: 'Увеличивает множитель критического удара',
    effectPerLevel: '+10% к крит урону',
    baseCost: 250,
    growthRate: 1.25,
    currency: 'promptTokens',
    icon: '💥',
    category: 'crit',
  },
  
  // ============================================
  // ОФФЛАЙН (PT)
  // ============================================
  {
    id: 'offline-production',
    name: 'Оффлайн доход',
    description: 'Увеличивает производство когда игра закрыта',
    effectPerLevel: '+5% оффлайн',
    baseCost: 150,
    growthRate: 1.18,
    currency: 'promptTokens',
    maxLevel: 100,
    icon: '🌙',
    category: 'offline',
  },
  {
    id: 'offline-cap',
    name: 'Лимит оффлайна',
    description: 'Увеличивает максимальное время оффлайн сбора',
    effectPerLevel: '+1 час максимум',
    baseCost: 500,
    growthRate: 1.30,
    currency: 'promptTokens',
    maxLevel: 24,
    icon: '⏰',
    category: 'offline',
  },
  
  // ============================================
  // PT УЛУЧШЕНИЯ (VB)
  // ============================================
  {
    id: 'pt-generation',
    name: 'Генерация PT',
    description: 'Увеличивает генерацию Prompt Tokens',
    effectPerLevel: '+10% к PT',
    baseCost: 5000,
    growthRate: 1.20,
    currency: 'vibeCodes',
    icon: '🎫',
    category: 'pt',
  },
  {
    id: 'pt-efficiency',
    name: 'Эффективность PT',
    description: 'Снижает стоимость PT улучшений',
    effectPerLevel: '-2% к стоимости',
    baseCost: 10000,
    growthRate: 1.25,
    currency: 'vibeCodes',
    maxLevel: 40,
    icon: '⚡',
    category: 'pt',
  },
  
  // ============================================
  // DP УЛУЧШЕНИЯ (DP)
  // ============================================
  {
    id: 'dp-boost',
    name: 'Буст DP',
    description: 'Увеличивает генерацию DevPoints',
    effectPerLevel: '+15% к DP',
    baseCost: 50,
    growthRate: 1.22,
    currency: 'devPoints',
    icon: '💎',
    category: 'dp',
  },
  {
    id: 'subscription-discount',
    name: 'Скидка на подписки',
    description: 'Снижает стоимость улучшения подписок',
    effectPerLevel: '-2% к стоимости',
    baseCost: 100,
    growthRate: 1.28,
    currency: 'devPoints',
    maxLevel: 40,
    icon: '💳',
    category: 'dp',
  },
  
  // ============================================
  // ОСОБЫЕ (DP)
  // ============================================
  {
    id: 'golden-clicks',
    name: 'Золотые клики',
    description: 'Шанс получить x10 VB за клик',
    effectPerLevel: '+0.2% шанс',
    baseCost: 200,
    growthRate: 1.35,
    currency: 'devPoints',
    maxLevel: 50,
    icon: '🌟',
    category: 'special',
  },
  {
    id: 'lucky-drops',
    name: 'Удачные дропы',
    description: 'Шанс получить бонусные PT при клике',
    effectPerLevel: '+0.1% шанс',
    baseCost: 150,
    growthRate: 1.30,
    currency: 'devPoints',
    maxLevel: 100,
    icon: '🍀',
    category: 'special',
  },
  {
    id: 'chain-reaction',
    name: 'Цепная реакция',
    description: 'Шанс автоматического двойного клика',
    effectPerLevel: '+0.3% шанс',
    baseCost: 300,
    growthRate: 1.32,
    currency: 'devPoints',
    maxLevel: 60,
    icon: '⛓️',
    category: 'special',
  },
]

// Категории для отображения
export const UPGRADE_CATEGORIES: { id: UpgradeCategory; name: string; icon: string; color: string }[] = [
  { id: 'click', name: 'Клик', icon: '👆', color: 'coral' },
  { id: 'production', name: 'Производство', icon: '📈', color: 'lime' },
  { id: 'efficiency', name: 'Эффективность', icon: '💰', color: 'blue' },
  { id: 'crit', name: 'Крит', icon: '🎯', color: 'orange' },
  { id: 'offline', name: 'Оффлайн', icon: '🌙', color: 'purple' },
  { id: 'pt', name: 'Prompt Tokens', icon: '🎫', color: 'teal' },
  { id: 'dp', name: 'DevPoints', icon: '💎', color: 'pink' },
  { id: 'special', name: 'Особые', icon: '🌟', color: 'yellow' },
]

export const getInfiniteUpgradeById = (id: string): ExtendedInfiniteUpgrade | undefined => {
  return INFINITE_UPGRADES.find(u => u.id === id)
}

export const getUpgradesByCategory = (category: UpgradeCategory): ExtendedInfiniteUpgrade[] => {
  return INFINITE_UPGRADES.filter(u => u.category === category)
}

export const getInfiniteUpgradeCost = (upgrade: ExtendedInfiniteUpgrade, currentLevel: number): number => {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.growthRate, currentLevel))
}
