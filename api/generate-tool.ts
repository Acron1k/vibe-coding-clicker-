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
    const { lastThreeTools, toolIndex } = req.body as { 
      lastThreeTools: ToolInput[]
      toolIndex: number 
    }

    if (!lastThreeTools || lastThreeTools.length < 1) {
      return res.status(400).json({ error: 'lastThreeTools required' })
    }

    console.log(`Generating tool #${toolIndex} for user...`)

    const toolsList = lastThreeTools
      .map((t, i) => `${i + 1}. ${t.icon} ${t.name} - ${t.description}`)
      .join('\n')

    const prompt = `Ты генератор названий для игры про ИИ-инструменты будущего.

Вот последние инструменты в игре:
${toolsList}

Придумай ОДИН следующий инструмент, который МОЩНЕЕ и ФУТУРИСТИЧНЕЕ предыдущих.
Это инструмент №${toolIndex} в игре - он должен быть невероятно продвинутым.

Темы: космические технологии, квантовые вычисления, управление реальностью, создание вселенных, божественные силы, мультивселенные.

КРИТИЧЕСКИ ВАЖНО: Ответь ТОЛЬКО валидным JSON без markdown, без \`\`\`, без пояснений:
{"name": "Название на английском", "description": "Краткое описание на русском (до 50 символов)", "icon": "один эмодзи"}

Примеры хороших ответов:
{"name": "Quantum Dreamer", "description": "Материализует сны в реальность", "icon": "💫"}
{"name": "Reality Compiler", "description": "Компилирует код в физическую материю", "icon": "🌌"}
{"name": "Cosmic Architect", "description": "Проектирует законы физики", "icon": "🏛️"}`

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
