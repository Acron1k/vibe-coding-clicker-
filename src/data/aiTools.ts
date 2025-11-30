/**
 * ИИ ИНСТРУМЕНТЫ
 * 
 * Первые 18 инструментов - статичные (до Gemini Ultra 2)
 * После 18 - генерируются через ИИ
 */

import { ToolDefinition } from '../types'

export interface AIToolDefinition extends ToolDefinition {
  ptGeneration?: number
  dpGeneration?: number
}

// Версия данных - увеличивать при изменении структуры
const DATA_VERSION = 3

// Количество статичных инструментов
export const STATIC_TOOLS_COUNT = 18

// Статичные инструменты (1-18)
export const STATIC_AI_TOOLS: AIToolDefinition[] = [
  // TIER 1 - БАЗОВЫЕ
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Классический ИИ-помощник для диалогов',
    icon: '💬',
    baseCost: 15,
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
    baseCost: 120,
    baseProduction: 6,
    tier: 1,
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'Автодополнение кода в реальном времени',
    icon: '🤖',
    baseCost: 300,
    baseProduction: 12,
    tier: 1,
    ptGeneration: 0.1,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'IDE с встроенным ИИ-программистом',
    icon: '📝',
    baseCost: 700,
    baseProduction: 25,
    tier: 1,
    ptGeneration: 0.2,
  },
  {
    id: 'codewhisperer',
    name: 'CodeWhisperer',
    description: 'ИИ-помощник для кода от Amazon',
    icon: '🔮',
    baseCost: 1500,
    baseProduction: 50,
    tier: 1,
    ptGeneration: 0.3,
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    description: 'Умное автодополнение для всех языков',
    icon: '⌨️',
    baseCost: 3500,
    baseProduction: 100,
    tier: 1,
    ptGeneration: 0.5,
  },
  
  // TIER 2 - ПРОДВИНУТЫЕ
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Генерация изображений по описанию',
    icon: '🎨',
    baseCost: 8000,
    baseProduction: 200,
    tier: 2,
    ptGeneration: 1,
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    description: 'Создание картинок от OpenAI',
    icon: '🖼️',
    baseCost: 18000,
    baseProduction: 400,
    tier: 2,
    ptGeneration: 1.5,
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Опенсорс генерация изображений',
    icon: '🌀',
    baseCost: 40000,
    baseProduction: 800,
    tier: 2,
    ptGeneration: 2,
    dpGeneration: 0.1,
  },
  {
    id: 'whisper',
    name: 'Whisper',
    description: 'Распознавание речи в текст',
    icon: '🎙️',
    baseCost: 90000,
    baseProduction: 1600,
    tier: 2,
    ptGeneration: 3,
    dpGeneration: 0.2,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Клонирование и синтез голоса',
    icon: '🗣️',
    baseCost: 200000,
    baseProduction: 3200,
    tier: 2,
    ptGeneration: 5,
    dpGeneration: 0.3,
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    description: 'Профессиональная генерация видео',
    icon: '🎥',
    baseCost: 450000,
    baseProduction: 6500,
    tier: 2,
    ptGeneration: 8,
    dpGeneration: 0.5,
  },
  {
    id: 'sora',
    name: 'Sora',
    description: 'Генерация видео от OpenAI',
    icon: '🎬',
    baseCost: 1000000,
    baseProduction: 13000,
    tier: 2,
    ptGeneration: 12,
    dpGeneration: 0.8,
  },
  {
    id: 'devin',
    name: 'Devin',
    description: 'Автономный ИИ-разработчик',
    icon: '👨‍💻',
    baseCost: 2200000,
    baseProduction: 26000,
    tier: 2,
    ptGeneration: 18,
    dpGeneration: 1.2,
  },
  
  // TIER 3 - ПРЕМИУМ (последние 3 статичных)
  {
    id: 'gpt5',
    name: 'GPT-5',
    description: 'Следующее поколение языковых моделей',
    icon: '🚀',
    baseCost: 5000000,
    baseProduction: 55000,
    tier: 3,
    ptGeneration: 30,
    dpGeneration: 2,
  },
  {
    id: 'claude-opus',
    name: 'Claude Opus Pro',
    description: 'Максимальные возможности Claude',
    icon: '💎',
    baseCost: 11000000,
    baseProduction: 120000,
    tier: 3,
    ptGeneration: 50,
    dpGeneration: 3.5,
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra 2',
    description: 'Полная мощь Google AI',
    icon: '⚡',
    baseCost: 25000000,
    baseProduction: 250000,
    tier: 3,
    ptGeneration: 80,
    dpGeneration: 5,
  },
]

// Динамический список всех инструментов (статичные + сгенерированные)
export let AI_TOOLS: AIToolDefinition[] = [...STATIC_AI_TOOLS]

// Добавить сгенерированный инструмент (с проверкой на дубликаты)
export function addGeneratedTool(tool: AIToolDefinition): boolean {
  // Проверяем дубликат по ID
  if (AI_TOOLS.some(t => t.id === tool.id)) {
    console.warn('Tool with this ID already exists:', tool.id)
    return false
  }
  
  // Проверяем дубликат по имени среди сгенерированных
  const generatedTools = AI_TOOLS.filter(t => t.id.startsWith('generated-'))
  if (generatedTools.some(t => t.name === tool.name)) {
    console.warn('Tool with this name already exists:', tool.name)
    return false
  }
  
  AI_TOOLS = [...AI_TOOLS, tool]
  console.log('Added new tool:', tool.name, 'Total:', AI_TOOLS.length)
  return true
}

// Очистить сгенерированные инструменты
export function clearGeneratedTools(): void {
  AI_TOOLS = [...STATIC_AI_TOOLS]
  localStorage.removeItem('vibecode-generated-tools')
  localStorage.removeItem('vibecode-tools-version')
}

// Загрузить сгенерированные инструменты из localStorage
export function loadGeneratedTools(): void {
  try {
    // Проверяем версию данных
    const savedVersion = localStorage.getItem('vibecode-tools-version')
    if (savedVersion !== String(DATA_VERSION)) {
      // Версия изменилась - очищаем старые данные
      console.log('Data version changed, clearing old generated tools')
      localStorage.removeItem('vibecode-generated-tools')
      localStorage.setItem('vibecode-tools-version', String(DATA_VERSION))
      return
    }

    const saved = localStorage.getItem('vibecode-generated-tools')
    if (saved) {
      const tools: AIToolDefinition[] = JSON.parse(saved)
      
      // Валидация - проверяем что инструменты имеют правильный формат
      const validTools = tools.filter(tool => 
        tool.id?.startsWith('generated-') &&
        typeof tool.name === 'string' &&
        typeof tool.baseCost === 'number' &&
        typeof tool.baseProduction === 'number'
      )
      
      if (validTools.length > 0) {
        AI_TOOLS = [...STATIC_AI_TOOLS, ...validTools]
        console.log(`Loaded ${validTools.length} generated tools`)
      }
    }
  } catch (e) {
    console.error('Failed to load generated tools:', e)
    // При ошибке очищаем
    localStorage.removeItem('vibecode-generated-tools')
  }
}

// Сохранить сгенерированные инструменты в localStorage
export function saveGeneratedTools(): void {
  try {
    const generatedOnly = AI_TOOLS.filter(t => t.id.startsWith('generated-'))
    localStorage.setItem('vibecode-generated-tools', JSON.stringify(generatedOnly))
    localStorage.setItem('vibecode-tools-version', String(DATA_VERSION))
  } catch (e) {
    console.error('Failed to save generated tools:', e)
  }
}

// Получить инструмент по ID
export function getAIToolById(id: string): AIToolDefinition | undefined {
  return AI_TOOLS.find(t => t.id === id)
}

// Получить индекс инструмента
export function getAIToolIndex(id: string): number {
  return AI_TOOLS.findIndex(t => t.id === id)
}

// Проверить, разблокирован ли инструмент
export function isAIToolUnlocked(toolId: string, ownedTools: Record<string, { count: number }>): boolean {
  const index = getAIToolIndex(toolId)
  if (index === 0) return true
  if (index === -1) return false
  
  const previousTool = AI_TOOLS[index - 1]
  return previousTool ? (ownedTools[previousTool.id]?.count || 0) > 0 : false
}

// Получить все разблокированные инструменты
export function getUnlockedAITools(ownedTools: Record<string, { count: number }>): AIToolDefinition[] {
  return AI_TOOLS.filter(tool => isAIToolUnlocked(tool.id, ownedTools))
}

// Получить следующий инструмент для разблокировки
export function getNextLockedAITool(ownedTools: Record<string, { count: number }>): AIToolDefinition | undefined {
  return AI_TOOLS.find(tool => !isAIToolUnlocked(tool.id, ownedTools))
}

// Проверить, нужно ли генерировать новый инструмент
export function needsNewGeneratedTool(ownedTools: Record<string, { count: number }>): boolean {
  // Считаем сколько инструментов из текущего списка куплено
  const ownedFromCurrentList = AI_TOOLS.filter(tool => 
    ownedTools[tool.id]?.count > 0
  ).length
  
  // Генерируем новый если:
  // 1. Куплены все текущие инструменты
  // 2. И их не меньше чем статичных (18)
  return ownedFromCurrentList >= AI_TOOLS.length && ownedFromCurrentList >= STATIC_TOOLS_COUNT
}

// Получить последние N инструментов
export function getLastNTools(n: number): AIToolDefinition[] {
  return AI_TOOLS.slice(-n)
}

// Получить количество сгенерированных инструментов
export function getGeneratedToolsCount(): number {
  return AI_TOOLS.filter(t => t.id.startsWith('generated-')).length
}

// Инициализация - загружаем сохранённые инструменты
loadGeneratedTools()
