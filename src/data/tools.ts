import { ToolDefinition } from '../types'
import { AI_TOOLS } from './aiTools'

// Re-export AI_TOOLS as the main tool list
export const TOOLS: ToolDefinition[] = AI_TOOLS

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOLS.find(t => t.id === id)
}

export const getToolsByTier = (tier: number): ToolDefinition[] => {
  return TOOLS.filter(t => t.tier === tier)
}

export const COST_MULTIPLIER = 1.15
