/**
 * ИИ ИНСТРУМЕНТЫ - ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ
 * 
 * Каждый инструмент открывается при покупке предыдущего.
 * Первый инструмент доступен сразу.
 * 
 * Формат:
 * {
 *   id: string           - уникальный ID (латиницей, без пробелов)
 *   name: string         - название инструмента (оригинальное название)
 *   description: string  - описание на русском
 *   icon: string         - эмодзи иконка
 *   baseCost: number     - базовая стоимость в VibeCodes
 *   baseProduction: number - базовая генерация VB в секунду
 *   tier: 1 | 2 | 3      - уровень сложности (влияет на цвет)
 * }
 * 
 * Tier 1 (синий) - базовые инструменты, дешевые
 * Tier 2 (фиолетовый) - продвинутые, средняя цена
 * Tier 3 (оранжевый) - премиум, дорогие
 */

import { ToolDefinition } from '../types'

export const AI_TOOLS: ToolDefinition[] = [
  // === TIER 1 - БАЗОВЫЕ ===
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Классический ИИ-помощник для диалогов',
    icon: '💬',
    baseCost: 10,
    baseProduction: 1,
    tier: 1,
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Умный помощник от Anthropic',
    icon: '🧠',
    baseCost: 50,
    baseProduction: 3,
    tier: 1,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Мультимодальный ИИ от Google',
    icon: '✨',
    baseCost: 100,
    baseProduction: 5,
    tier: 1,
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'Автодополнение кода в реальном времени',
    icon: '🤖',
    baseCost: 250,
    baseProduction: 10,
    tier: 1,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'IDE с встроенным ИИ-программистом',
    icon: '📝',
    baseCost: 500,
    baseProduction: 18,
    tier: 1,
  },
  
  // === TIER 2 - ПРОДВИНУТЫЕ ===
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Генерация изображений по описанию',
    icon: '🎨',
    baseCost: 1000,
    baseProduction: 30,
    tier: 2,
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    description: 'Создание картинок от OpenAI',
    icon: '🖼️',
    baseCost: 2000,
    baseProduction: 50,
    tier: 2,
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Опенсорс генерация изображений',
    icon: '🌀',
    baseCost: 4000,
    baseProduction: 80,
    tier: 2,
  },
  {
    id: 'whisper',
    name: 'Whisper',
    description: 'Распознавание речи в текст',
    icon: '🎙️',
    baseCost: 8000,
    baseProduction: 130,
    tier: 2,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Клонирование и синтез голоса',
    icon: '🗣️',
    baseCost: 15000,
    baseProduction: 200,
    tier: 2,
  },
  
  // === TIER 3 - ПРЕМИУМ ===
  {
    id: 'sora',
    name: 'Sora',
    description: 'Генерация видео от OpenAI',
    icon: '🎬',
    baseCost: 30000,
    baseProduction: 350,
    tier: 3,
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    description: 'Профессиональная генерация видео',
    icon: '🎥',
    baseCost: 60000,
    baseProduction: 550,
    tier: 3,
  },
  {
    id: 'devin',
    name: 'Devin',
    description: 'Автономный ИИ-разработчик',
    icon: '👨‍💻',
    baseCost: 120000,
    baseProduction: 900,
    tier: 3,
  },
  
  // =====================================================
  // ДОБАВЛЯЙ СВОИ ИНСТРУМЕНТЫ НИЖЕ ПО ШАБЛОНУ:
  // =====================================================
  
  /*
  {
    id: 'unique-id',
    name: 'Tool Name',
    description: 'Описание на русском',
    icon: '🔮',
    baseCost: 250000,
    baseProduction: 1500,
    tier: 3,
  },
  */
]

// Получить инструмент по ID
export function getAIToolById(id: string): ToolDefinition | undefined {
  return AI_TOOLS.find(t => t.id === id)
}

// Получить индекс инструмента (для проверки разблокировки)
export function getAIToolIndex(id: string): number {
  return AI_TOOLS.findIndex(t => t.id === id)
}

// Проверить, разблокирован ли инструмент
export function isAIToolUnlocked(toolId: string, ownedTools: Record<string, { count: number }>): boolean {
  const index = getAIToolIndex(toolId)
  if (index === 0) return true // Первый инструмент всегда доступен
  if (index === -1) return false
  
  // Проверяем, куплен ли предыдущий инструмент
  const previousTool = AI_TOOLS[index - 1]
  return previousTool ? (ownedTools[previousTool.id]?.count || 0) > 0 : false
}

// Получить все разблокированные инструменты
export function getUnlockedAITools(ownedTools: Record<string, { count: number }>): ToolDefinition[] {
  return AI_TOOLS.filter(tool => isAIToolUnlocked(tool.id, ownedTools))
}

// Получить следующий инструмент для разблокировки
export function getNextLockedAITool(ownedTools: Record<string, { count: number }>): ToolDefinition | undefined {
  return AI_TOOLS.find(tool => !isAIToolUnlocked(tool.id, ownedTools))
}
