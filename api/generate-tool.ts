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
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const { lastThreeTools, toolIndex } = req.body as { 
      lastThreeTools: ToolInput[]
      toolIndex: number 
    }

    if (!lastThreeTools || lastThreeTools.length < 1) {
      return res.status(400).json({ error: 'lastThreeTools required' })
    }

    const toolsList = lastThreeTools
      .map((t, i) => `${i + 1}. ${t.icon} ${t.name} - ${t.description}`)
      .join('\n')

    const prompt = `Ты генератор названий для игры про ИИ-инструменты будущего.

Вот последние инструменты в игре:
${toolsList}

Придумай ОДИН следующий инструмент, который МОЩНЕЕ и ФУТУРИСТИЧНЕЕ предыдущих.
Это инструмент №${toolIndex} в игре - он должен быть невероятно продвинутым.

Темы: космические технологии, квантовые вычисления, управление реальностью, создание вселенных, божественные силы.

ВАЖНО: Ответь ТОЛЬКО валидным JSON без markdown, без \`\`\`:
{"name": "Название на английском", "description": "Краткое описание на русском (до 50 символов)", "icon": "один эмодзи"}

Пример ответа:
{"name": "Quantum Dreamer", "description": "Материализует сны в реальность", "icon": "💫"}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vibecode-clicker.vercel.app',
        'X-Title': 'Vibecode Clicker'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-3-fast:free',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.9
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter error:', errorText)
      return res.status(500).json({ error: 'AI generation failed', details: errorText })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(500).json({ error: 'Empty response from AI' })
    }

    // Parse JSON from response
    let generatedTool: GeneratedTool
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        generatedTool = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch (parseError) {
      console.error('Parse error:', content)
      // Fallback tool
      generatedTool = {
        name: `AI Tool ${toolIndex}`,
        description: 'Загадочный ИИ инструмент будущего',
        icon: '🔮'
      }
    }

    // Validate and sanitize
    const result: GeneratedTool = {
      name: String(generatedTool.name || `Tool ${toolIndex}`).slice(0, 30),
      description: String(generatedTool.description || 'Мощный ИИ инструмент').slice(0, 60),
      icon: String(generatedTool.icon || '🤖').slice(0, 4)
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ 
      error: 'Internal error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
