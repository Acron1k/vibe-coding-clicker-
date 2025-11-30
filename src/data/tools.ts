import { ToolDefinition } from '../types'

export const TOOLS: ToolDefinition[] = [
  // === TIER 1: Basic Tools (0-100 VB) ===
  {
    id: 'claude-baseline',
    name: 'Claude',
    description: 'Базовое промптерование - простой Claude без оптимизаций',
    detailedDescription: 'AI-помощник от Anthropic для веб-разработки. Поддерживает длинные контексты и extended thinking для сложных задач.',
    tier: 1,
    baseCost: 10,
    baseProduction: 0.1,
    unlockCondition: { type: 'always' },
    icon: '🧠',
    color: '#D97706',
  },
  {
    id: 'chatgpt-4-mini',
    name: 'ChatGPT 4 Mini',
    description: 'Быстрый помощник для фронтенда',
    detailedDescription: 'OpenAI GPT-4 Mini - оптимизированная версия для быстрых задач разработки.',
    tier: 1,
    baseCost: 50,
    baseProduction: 0.5,
    unlockCondition: { type: 'clicks', value: 30 },
    icon: '💬',
    color: '#10B981',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description: "Google's мощный многомодальный генератор",
    detailedDescription: 'Многомодальный AI от Google, интегрированный с Google Workspace.',
    tier: 1,
    baseCost: 100,
    baseProduction: 1,
    unlockCondition: { type: 'vibeCodes', value: 200 },
    icon: '✨',
    color: '#4285F4',
  },

  // === TIER 2: IDE Tools (100-1000 VB) ===
  {
    id: 'cursor-ide',
    name: 'Cursor IDE',
    description: 'VS Code на стероидах с AI-автодополнением',
    detailedDescription: 'IDE с встроенным AI на базе Claude, популярен среди разработчиков.',
    tier: 2,
    baseCost: 200,
    baseProduction: 2,
    unlockCondition: { type: 'toolPurchased', toolId: 'gemini-cli' },
    icon: '⚡',
    color: '#00D9FF',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Экспериментальный IDE от Anthropic',
    detailedDescription: 'Продвинутый AI-ассистент для кодинга с поддержкой агентного режима.',
    tier: 2,
    baseCost: 500,
    baseProduction: 5,
    unlockCondition: { type: 'vibeCodes', value: 800 },
    icon: '🚀',
    color: '#C904ED',
  },
  {
    id: 'v0-vercel',
    name: 'V0 by Vercel',
    description: 'AI-генератор UI компонентов',
    detailedDescription: 'Генератор UI от Vercel, создает React компоненты из текстовых описаний.',
    tier: 2,
    baseCost: 750,
    baseProduction: 7.5,
    unlockCondition: { type: 'toolPurchased', toolId: 'cursor-ide' },
    icon: '🎨',
    color: '#000000',
  },
  {
    id: 'replit-ai',
    name: 'Replit AI',
    description: 'Cloud IDE с встроенным AI-помощником',
    detailedDescription: 'Облачная IDE с AI-автодополнением и мгновенным деплоем.',
    tier: 2,
    baseCost: 1000,
    baseProduction: 10,
    unlockCondition: { type: 'vibeCodes', value: 1500 },
    icon: '☁️',
    color: '#F26207',
  },

  // === TIER 3: Premium Tools (1000+ VB) ===
  {
    id: 'lovable',
    name: 'Lovable',
    description: 'No-code платформа с AI - генери приложения из описания',
    detailedDescription: 'Превращает текстовые описания в полноценные веб-приложения за секунды.',
    tier: 3,
    baseCost: 2500,
    baseProduction: 25,
    unlockCondition: { type: 'vibeCodes', value: 3000 },
    icon: '💖',
    color: '#FF00E5',
  },
  {
    id: 'kiro',
    name: 'Kiro',
    description: 'Специализированный генератор для web3 приложений',
    detailedDescription: 'Нишевый инструмент для создания децентрализованных приложений.',
    tier: 3,
    baseCost: 5000,
    baseProduction: 50,
    unlockCondition: { type: 'toolCount', value: 5 },
    icon: '🔗',
    color: '#8B5CF6',
  },
  {
    id: 'anthropic-console',
    name: 'Anthropic Console',
    description: 'Прямой доступ к Claude API и экспериментам',
    detailedDescription: 'Максимальный контроль и скорость с прямым API доступом к Claude.',
    tier: 3,
    baseCost: 7500,
    baseProduction: 75,
    unlockCondition: { type: 'vibeCodes', value: 10000 },
    icon: '🔮',
    color: '#00FF41',
  },
]

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOLS.find(t => t.id === id)
}

export const getToolsByTier = (tier: number): ToolDefinition[] => {
  return TOOLS.filter(t => t.tier === tier)
}

export const COST_MULTIPLIER = 1.15
