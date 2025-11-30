import { AIToolDefinition } from '../data/aiTools'

interface GeneratedToolData {
  name: string
  description: string
  icon: string
}

interface GenerateToolParams {
  allTools: AIToolDefinition[]  // ALL tools for duplicate prevention
  toolIndex: number
  previousTool: AIToolDefinition
}

/**
 * Генерирует новый ИИ инструмент через API
 * БЕЗ FALLBACK - только реальная генерация через ИИ
 */
export async function generateNextTool(params: GenerateToolParams): Promise<AIToolDefinition> {
  const { allTools, toolIndex, previousTool } = params

  // Вычисляем статы на основе предыдущего инструмента
  const baseCost = Math.floor(previousTool.baseCost * 2.3)
  const baseProduction = Math.floor(previousTool.baseProduction * 2.2)
  const ptGeneration = Math.floor((previousTool.ptGeneration || 0) * 2.1) || Math.floor(toolIndex * 1000)
  const dpGeneration = Math.floor((previousTool.dpGeneration || 0) * 2.0) || Math.floor(toolIndex * 100)

  console.log('Generating tool #' + toolIndex + ' via AI...')

  const response = await fetch('/api/generate-tool', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      allTools: allTools.map(t => ({
        name: t.name,
        description: t.description,
        icon: t.icon
      })),
      toolIndex
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API error:', response.status, errorText)
    throw new Error(`Ошибка генерации: ${response.status}. ${errorText}`)
  }

  const generated: GeneratedToolData = await response.json()

  if (!generated.name || !generated.description || !generated.icon) {
    console.error('Invalid response:', generated)
    throw new Error('ИИ вернул некорректные данные')
  }

  console.log('Generated:', generated.name)

  return {
    id: `generated-${toolIndex}-${Date.now()}`,
    name: generated.name,
    description: generated.description,
    icon: generated.icon,
    baseCost,
    baseProduction,
    tier: 3,
    ptGeneration,
    dpGeneration
  }
}
