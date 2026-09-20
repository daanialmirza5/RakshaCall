import type { WorkflowDefinition } from '../../lib/workflowDefinitions'

const COLUMN_WIDTH = 230
const ROW_HEIGHT = 130

const EMERGENCY_LAYOUT: Record<string, { x: number; y: number }> = {
  highRiskDetection: { x: 0, y: 1 },
  protectionWarning: { x: 1, y: 1 },
  userDecision: { x: 2, y: 1 },
  getHelpAction: { x: 3, y: 0 },
  trustedContactAction: { x: 3, y: 2 },
  citizenActionHub: { x: 4, y: 0 },
  officialChannel: { x: 5, y: 0 },
}

/** Simple deterministic layout: a left-to-right chain, with a hand-tuned branch for the one workflow that has one. */
export function computeLayout(definition: WorkflowDefinition): Record<string, { x: number; y: number }> {
  if (definition.id === 'emergencyResponse') {
    const pos: Record<string, { x: number; y: number }> = {}
    for (const [id, { x, y }] of Object.entries(EMERGENCY_LAYOUT)) {
      pos[id] = { x: x * COLUMN_WIDTH, y: y * ROW_HEIGHT }
    }
    return pos
  }
  const pos: Record<string, { x: number; y: number }> = {}
  definition.nodes.forEach((n, i) => {
    pos[n.id] = { x: i * COLUMN_WIDTH, y: 0 }
  })
  return pos
}

/** Renders a node's real `input`/`output` payload into a short, readable preview string. */
export function formatNodeValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return truncate(value, 64)
  if (typeof value === 'number') return String(Math.round(value * 100) / 100)
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'none'
    return truncate(
      value
        .map((item) => (item && typeof item === 'object' && 'id' in item ? String((item as { id: unknown }).id) : String(item)))
        .join(', '),
      64,
    )
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if ('score' in obj && 'level' in obj) return `${obj.score}/100 · ${obj.level}`
    if ('speaker' in obj && 'text' in obj) return `${obj.speaker}: "${truncate(String(obj.text), 40)}"`
    if ('peakScore' in obj) return `peak ${obj.peakScore}`
    return truncate(JSON.stringify(obj), 64)
  }
  return String(value)
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}
