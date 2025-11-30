import { AIToolDefinition } from '../data/aiTools'

interface GeneratedToolData {
  name: string
  description: string
  icon: string
}

interface GenerateToolParams {
  lastThreeTools: AIToolDefinition[]
  toolIndex: number
  previousTool: AIToolDefinition
}

/**
 * Генерирует новый ИИ инструмент через API
 */
export async function generateNextTool(params: GenerateToolParams): Promise<AIToolDefinition> {
  const { lastThreeTools, toolIndex, previousTool } = params

  // Вычисляем статы на основе предыдущего инструмента
  const baseCost = Math.floor(previousTool.baseCost * 2.3)
  const baseProduction = Math.floor(previousTool.baseProduction * 2.2)
  const ptGeneration = Math.floor((previousTool.ptGeneration || 0) * 2.1) || Math.floor(toolIndex * 1000)
  const dpGeneration = Math.floor((previousTool.dpGeneration || 0) * 2.0) || Math.floor(toolIndex * 100)

  try {
    const response = await fetch('/api/generate-tool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lastThreeTools: lastThreeTools.map(t => ({
          name: t.name,
          description: t.description,
          icon: t.icon
        })),
        toolIndex
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const generated: GeneratedToolData = await response.json()

    return {
      id: `generated-${toolIndex}`,
      name: generated.name,
      description: generated.description,
      icon: generated.icon,
      baseCost,
      baseProduction,
      tier: 3,
      ptGeneration,
      dpGeneration
    }

  } catch (error) {
    console.error('Tool generation failed:', error)
    
    // Fallback - генерируем локально
    return generateFallbackTool(toolIndex, baseCost, baseProduction, ptGeneration, dpGeneration)
  }
}

/**
 * Fallback генератор если API недоступен
 */
function generateFallbackTool(
  index: number,
  baseCost: number,
  baseProduction: number,
  ptGeneration: number,
  dpGeneration: number
): AIToolDefinition {
  const fallbackNames = [
    { name: 'Quantum Mind', icon: '🧬', desc: 'Квантовое мышление без границ' },
    { name: 'Reality Weaver', icon: '🌀', desc: 'Плетёт ткань реальности' },
    { name: 'Cosmic Oracle', icon: '🔮', desc: 'Видит все временные линии' },
    { name: 'Void Architect', icon: '🕳️', desc: 'Строит в пустоте между мирами' },
    { name: 'Star Forge', icon: '⭐', desc: 'Кузница звёзд и галактик' },
    { name: 'Infinity Engine', icon: '♾️', desc: 'Двигатель бесконечности' },
    { name: 'Dream Compiler', icon: '💭', desc: 'Компилирует сны в код' },
    { name: 'Multiverse Key', icon: '🗝️', desc: 'Ключ ко всем вселенным' },
    { name: 'Time Sculptor', icon: '⏳', desc: 'Лепит время как глину' },
    { name: 'Genesis Core', icon: '💫', desc: 'Ядро творения миров' },
    { name: 'Omega Protocol', icon: 'Ω', desc: 'Финальный протокол эволюции' },
    { name: 'Absolute Mind', icon: '🧠', desc: 'Абсолютный разум вселенной' },
  ]

  const fallbackIndex = (index - 19) % fallbackNames.length
  const fallback = fallbackNames[fallbackIndex]

  return {
    id: `generated-${index}`,
    name: fallback.name,
    description: fallback.desc,
    icon: fallback.icon,
    baseCost,
    baseProduction,
    tier: 3,
    ptGeneration,
    dpGeneration
  }
}

/**
 * Проверяет доступность API генерации
 */
export async function checkGeneratorAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/api/generate-tool', {
      method: 'OPTIONS'
    })
    return response.ok
  } catch {
    return false
  }
}
