import { Handle, Position } from '@xyflow/react'
import { AlertTriangle, Check, CircleDashed, Clock, MinusCircle } from 'lucide-react'
import type { WorkflowStatus } from '../../lib/workflowRuntime'
import { formatNodeValue } from './workflowLayout'

export interface WorkflowGraphNodeData {
  label: string
  status: WorkflowStatus
  output?: unknown
  durationMs?: number
  [key: string]: unknown
}

const STATUS_STYLE: Record<WorkflowStatus, { border: string; bg: string; text: string; Icon: typeof Check | null; spin?: boolean }> = {
  idle: { border: 'border-ink-600', bg: 'bg-ink-900', text: 'text-ink-400', Icon: CircleDashed },
  queued: { border: 'border-ink-600', bg: 'bg-ink-900', text: 'text-ink-400', Icon: Clock },
  running: { border: 'border-brand-400', bg: 'bg-brand-500/5', text: 'text-brand-500', Icon: Clock, spin: true },
  success: { border: 'border-safe-500/40', bg: 'bg-safe-500/5', text: 'text-safe-500', Icon: Check },
  error: { border: 'border-danger-500/50', bg: 'bg-danger-500/5', text: 'text-danger-400', Icon: AlertTriangle },
  skipped: { border: 'border-ink-700', bg: 'bg-ink-800/40', text: 'text-ink-500', Icon: MinusCircle },
}

const STATUS_LABEL: Record<WorkflowStatus, string> = {
  idle: 'Idle',
  queued: 'Queued',
  running: 'Running',
  success: 'Success',
  error: 'Error',
  skipped: 'Skipped',
}

export function WorkflowGraphNode({ data, selected }: { data: WorkflowGraphNodeData; selected?: boolean }) {
  const style = STATUS_STYLE[data.status]
  const Icon = style.Icon

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${data.label}: ${STATUS_LABEL[data.status]}`}
      className={`w-52 rounded-xl border-2 ${style.border} ${style.bg} p-3 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 ${
        selected ? 'ring-2 ring-brand-400' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-ink-500" />
      <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${style.text}`}>
        {Icon && <Icon className={`h-3 w-3 ${style.spin ? 'animate-spin' : ''}`} aria-hidden />}
        {STATUS_LABEL[data.status]}
      </div>
      <p className="mt-1 truncate text-sm font-bold text-ink-50">{data.label}</p>
      {data.output !== undefined && <p className="mt-1 truncate text-xs text-ink-400">{formatNodeValue(data.output)}</p>}
      {typeof data.durationMs === 'number' && <p className="mt-0.5 text-[10px] text-ink-500">{data.durationMs.toFixed(2)}ms</p>}
      <Handle type="source" position={Position.Right} className="!bg-ink-500" />
    </div>
  )
}
