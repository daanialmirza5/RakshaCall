/**
 * Live Runtime Workflow — a local, in-memory observability layer over
 * RakshaCall's REAL execution. This is not a backend, not a WebSocket, not
 * telemetry sent anywhere: it's a plain pub/sub event bus living in this
 * browser tab, and `runInstrumented` below only ever wraps genuine function
 * calls (real timing via `performance.now()`, real return values as
 * `output`). There is no `setTimeout`-driven fake progression anywhere in
 * this module — every event corresponds to an actual call that actually
 * happened, in the order it actually happened.
 */

export type WorkflowStatus = 'idle' | 'queued' | 'running' | 'success' | 'error' | 'skipped'

export interface WorkflowEvent {
  workflowId: string
  executionId: string
  nodeId: string
  status: WorkflowStatus
  timestamp: number
  durationMs?: number
  input?: unknown
  output?: unknown
  metadata?: Record<string, unknown>
}

type Listener = (event: WorkflowEvent) => void

const MAX_HISTORY = 500
const listeners = new Set<Listener>()
let eventHistory: WorkflowEvent[] = []

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomSuffix(length: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('')
  }
  return Array.from({ length }, () => ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]).join('')
}

/** A local execution identifier — cosmetic only, never a server job id. */
export function createExecutionId(prefix = 'RK'): string {
  return `${prefix}-${randomSuffix(4)}`
}

export function emit(event: Omit<WorkflowEvent, 'timestamp'>): WorkflowEvent {
  const full: WorkflowEvent = { ...event, timestamp: Date.now() }
  eventHistory.push(full)
  if (eventHistory.length > MAX_HISTORY) eventHistory = eventHistory.slice(-MAX_HISTORY)
  listeners.forEach((listener) => listener(full))
  return full
}

/** Subscribes to every emitted event; returns an unsubscribe function. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getEventHistory(executionId?: string): WorkflowEvent[] {
  return executionId ? eventHistory.filter((e) => e.executionId === executionId) : [...eventHistory]
}

/** Clears recorded history (does not affect current execution ids held by callers). */
export function clearHistory(): void {
  eventHistory = []
}

export interface InstrumentParams {
  workflowId: string
  executionId: string
  nodeId: string
  input?: unknown
  metadata?: Record<string, unknown>
}

/**
 * Runs a REAL function and emits running -> success/error events around it,
 * with real elapsed time and the function's real return value as `output`.
 * This is the only way node events are produced — there is no path that
 * emits a "success" event without an actual function having actually run.
 */
export function runInstrumented<T>(params: InstrumentParams, fn: () => T): T {
  emit({ ...params, status: 'running' })
  const start = performance.now()
  try {
    const output = fn()
    emit({ ...params, status: 'success', durationMs: performance.now() - start, output })
    return output
  } catch (error) {
    emit({
      ...params,
      status: 'error',
      durationMs: performance.now() - start,
      output: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

/** For nodes that represent a real state transition rather than a function call (e.g. "user clicked Get Help"). */
export function markStatus(params: Omit<WorkflowEvent, 'timestamp'>): void {
  emit(params)
}
