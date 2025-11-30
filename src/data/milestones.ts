import { MilestoneDefinition } from '../types'

export const MILESTONES: MilestoneDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Купить первый инструмент',
    condition: { type: 'toolCount', value: 1 },
    rewards: [
      { type: 'vibeCodes', value: 50 },
    ],
  },
  {
    id: 'developer-setup',
    name: "Developer's First Setup",
    description: 'Купить 3 разных инструмента',
    condition: { type: 'toolCount', value: 3 },
    rewards: [
      { type: 'vibeCodes', value: 500 },
      { type: 'devPoints', value: 5 },
    ],
  },
  {
    id: 'click-master',
    name: 'Click Master',
    description: 'Сделать 100 кликов',
    condition: { type: 'clicks', value: 100 },
    rewards: [
      { type: 'vibeCodes', value: 100 },
    ],
  },
  {
    id: 'ide-master',
    name: 'IDE Master',
    description: 'Достичь 2000 VB',
    condition: { type: 'vibeCodes', value: 2000 },
    rewards: [
      { type: 'devPoints', value: 10 },
    ],
  },
  {
    id: 'multi-tool',
    name: 'Multi-Tool Developer',
    description: 'Купить 7 разных инструментов',
    condition: { type: 'toolCount', value: 7 },
    rewards: [
      { type: 'devPoints', value: 25 },
      { type: 'vibeCodes', value: 1000 },
    ],
  },
  {
    id: 'click-veteran',
    name: 'Click Veteran',
    description: 'Сделать 1000 кликов',
    condition: { type: 'clicks', value: 1000 },
    rewards: [
      { type: 'vibeCodes', value: 500 },
      { type: 'devPoints', value: 10 },
    ],
  },
  {
    id: 'enterprise-setup',
    name: 'Enterprise Setup',
    description: 'Достичь 50000 VB',
    condition: { type: 'vibeCodes', value: 50000 },
    rewards: [
      { type: 'devPoints', value: 100 },
    ],
  },
  {
    id: 'vibecode-master',
    name: 'Vibecode Master',
    description: 'Заработать 250000 VB суммарно',
    condition: { type: 'vibeCodes', value: 250000 },
    rewards: [
      { type: 'multiplier', value: 1.5 },
    ],
  },
]

export const getMilestoneById = (id: string): MilestoneDefinition | undefined => {
  return MILESTONES.find(m => m.id === id)
}
