import { SubscriptionDefinition, SubscriptionTier } from '../types'

export const SUBSCRIPTIONS: Record<SubscriptionTier, SubscriptionDefinition> = {
  free: {
    tier: 'free',
    displayName: 'Free',
    dpCost: 0,
    vbMultiplier: 1,
    ptBonus: 0,
    critChance: 0,
    features: ['Базовые промпты'],
    color: '#6B7280',
  },
  pro: {
    tier: 'pro',
    displayName: 'Pro',
    dpCost: 10,
    vbMultiplier: 1.5,
    ptBonus: 0,
    critChance: 0,
    features: ['Длинные контексты', 'Приоритет'],
    color: '#3B82F6',
  },
  proPlus: {
    tier: 'proPlus',
    displayName: 'Pro+',
    dpCost: 25,
    vbMultiplier: 2.5,
    ptBonus: 5,
    critChance: 0,
    features: ['Extended thinking', 'API улучшения', '+5 PT/сек'],
    color: '#A855F7',
  },
  max: {
    tier: 'max',
    displayName: 'Max',
    dpCost: 50,
    vbMultiplier: 4,
    ptBonus: 15,
    critChance: 0.01,
    features: ['Все плюсы Pro+', 'Приоритет обновлений', '+15 PT/сек', '1% крит'],
    color: '#F97316',
  },
  ultra: {
    tier: 'ultra',
    displayName: 'Ultra',
    dpCost: 100,
    vbMultiplier: 6,
    ptBonus: 30,
    critChance: 0.03,
    features: ['Ранний доступ', '+30 PT/сек', '3% крит x2'],
    color: '#FFD700',
  },
}

export const SUBSCRIPTION_ORDER: SubscriptionTier[] = ['free', 'pro', 'proPlus', 'max', 'ultra']

export const getNextTier = (current: SubscriptionTier): SubscriptionTier | null => {
  const currentIndex = SUBSCRIPTION_ORDER.indexOf(current)
  if (currentIndex === -1 || currentIndex >= SUBSCRIPTION_ORDER.length - 1) {
    return null
  }
  return SUBSCRIPTION_ORDER[currentIndex + 1]
}
