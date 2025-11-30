import type { VercelRequest, VercelResponse } from '@vercel/node'

interface ToolInput {
  name: string
  description: string
  icon: string
}

interface GeneratedTool {
  name: string
  description: string
  icon: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not found in environment')
    return res.status(500).json({ error: 'API key not configured. Add OPENROUTER_API_KEY to Vercel environment variables.' })
  }

  try {
    const { allTools, toolIndex } = req.body as { 
      allTools: ToolInput[]
      toolIndex: number 
    }

    if (!allTools || allTools.length < 1) {
      return res.status(400).json({ error: 'allTools required' })
    }

    console.log(`Generating tool #${toolIndex} for user (${allTools.length} existing tools)...`)

    // Get last 5 for context, but list ALL names to prevent duplicates
    const lastFive = allTools.slice(-5)
    const contextList = lastFive
      .map((t, i) => `${i + 1}. ${t.icon} ${t.name} - ${t.description}`)
      .join('\n')
    
    // All existing names for duplicate prevention
    const existingNames = allTools.map(t => t.name).join(', ')

    // Determine tier based on tool position for progressive naming
    let tierHint: string
    let examples: string
    
    if (toolIndex <= 25) {
      tierHint = `Это ранний инструмент (#${toolIndex}). Используй РЕАЛЬНЫЕ паттерны именования ИИ-индустрии:
- Названия как у реальных ИИ: GPT-5, Claude 4, Gemini Pro, Llama 3
- Добавляй суффиксы: Pro, Ultra, Max, Plus, Advanced, X, Turbo
- Или версии: 2.0, 3.5, Next, Neo
- Фокус на продуктивности и автоматизации`
      examples = `{"name": "Copilot Ultra", "description": "Пишет идеальный код за секунды", "icon": "✨"}
{"name": "Claude 4 Max", "description": "Анализирует любые документы мгновенно", "icon": "📊"}
{"name": "Gemini Pro X", "description": "Мультимодальный анализ нового поколения", "icon": "🔮"}`
    } else if (toolIndex <= 35) {
      tierHint = `Это продвинутый инструмент (#${toolIndex}). Используй футуристичные но узнаваемые названия:
- Агенты и системы: Agent Smith, Neural Core, Synapse Pro
- Научные термины: Quantum, Neural, Synth, Hyper, Meta
- Автономные системы будущего`
      examples = `{"name": "Neural Architect", "description": "Строит нейросети без кода", "icon": "🧠"}
{"name": "Quantum Agent", "description": "Автономный агент с квантовым мышлением", "icon": "⚛️"}
{"name": "Meta Synapse", "description": "Объединяет тысячи ИИ в один", "icon": "🌐"}`
    } else {
      tierHint = `Это легендарный инструмент (#${toolIndex}). Используй эпические космические названия:
- Божественные и космические: Omega, Infinity, Celestial, Cosmic
- Создатели реальности: Architect, Creator, Genesis, Prime
- Мультивселенные концепции`
      examples = `{"name": "Omega Prime", "description": "Создаёт ИИ, создающие ИИ", "icon": "👁️"}
{"name": "Celestial Forge", "description": "Кузница цифровых вселенных", "icon": "🌌"}
{"name": "Infinity Core", "description": "Бесконечная вычислительная мощность", "icon": "♾️"}`
    }

    const prompt = `Ты генератор названий для игры про ИИ-инструменты.

Последние 5 инструментов для контекста:
${contextList}

${tierHint}

ЗАПРЕЩЁННЫЕ НАЗВАНИЯ (уже существуют, НЕ повторяй): ${existingNames}

Придумай ОДИН УНИКАЛЬНЫЙ инструмент. Название ДОЛЖНО звучать как настоящий ИИ-продукт и ОТЛИЧАТЬСЯ от всех существующих!

КРИТИЧЕСКИ ВАЖНО: Ответь ТОЛЬКО валидным JSON без markdown, без \`\`\`, без пояснений:
{"name": "Название на английском (2-3 слова)", "description": "Описание на русском (до 50 символов)", "icon": "один эмодзи"}

Примеры хороших ответов:
${examples}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vibecode-clicker.vercel.app',
        'X-Title': 'Vibecode Clicker'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast:free',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.95
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter error:', response.status, errorText)
      return res.status(500).json({ 
        error: 'AI service error', 
        details: `Status ${response.status}: ${errorText}` 
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    console.log('AI response:', content)

    if (!content) {
      return res.status(500).json({ error: 'Empty response from AI' })
    }

    // Parse JSON from response - NO FALLBACK, must succeed
    let generatedTool: GeneratedTool
    
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', content)
      return res.status(500).json({ 
        error: 'AI returned invalid format', 
        details: 'No JSON object found in response',
        raw: content 
      })
    }
    
    try {
      generatedTool = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('JSON parse error:', jsonMatch[0])
      return res.status(500).json({ 
        error: 'Failed to parse AI response', 
        details: String(parseError),
        raw: jsonMatch[0]
      })
    }

    // Validate required fields
    if (!generatedTool.name || !generatedTool.description || !generatedTool.icon) {
      console.error('Missing required fields:', generatedTool)
      return res.status(500).json({ 
        error: 'AI response missing required fields',
        received: generatedTool
      })
    }

    // Sanitize
    const result: GeneratedTool = {
      name: String(generatedTool.name).trim().slice(0, 30),
      description: String(generatedTool.description).trim().slice(0, 60),
      icon: String(generatedTool.icon).trim().slice(0, 4)
    }

    console.log('Generated tool:', result)
    return res.status(200).json(result)

  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
