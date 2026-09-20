import { useEffect, useRef, useState } from 'react'
import { getEventHistory, subscribe, type WorkflowEvent } from './workflowRuntime'

export interface WorkflowVisualizerState {
  executionId: string | null
  nodeStates: Record<string, WorkflowEvent>
  log: WorkflowEvent[]
}

const MAX_LOG = 200

/**
 * Live view over one workflow's event stream. Seeds itself from any events
 * that already happened (e.g. the user started a call before opening this
 * view), then stays live via `subscribe`. A new executionId for this
 * workflow (restart / new session) clears the previous run's node states —
 * no stale nodes carried across executions.
 */
export function useWorkflowVisualizerState(workflowId: string): WorkflowVisualizerState {
  const [state, setState] = useState<WorkflowVisualizerState>({ executionId: null, nodeStates: {}, log: [] })
  const executionIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Seed from whatever already happened for this workflow (e.g. the user
    // started a call before opening this view) before subscribing live.
    const history = getEventHistory().filter((e) => e.workflowId === workflowId)
    let seed: WorkflowVisualizerState = { executionId: null, nodeStates: {}, log: [] }
    if (history.length > 0) {
      const latestExecutionId = history[history.length - 1].executionId
      const relevant = history.filter((e) => e.executionId === latestExecutionId).slice(-MAX_LOG)
      const nodeStates: Record<string, WorkflowEvent> = {}
      relevant.forEach((e) => {
        nodeStates[e.nodeId] = e
      })
      seed = { executionId: latestExecutionId, nodeStates, log: relevant }
    }
    executionIdRef.current = seed.executionId
    setState(seed)

    const unsubscribe = subscribe((event) => {
      if (event.workflowId !== workflowId) return
      setState((prev) => {
        const isNewExecution = executionIdRef.current !== event.executionId
        executionIdRef.current = event.executionId
        const nodeStates = isNewExecution ? { [event.nodeId]: event } : { ...prev.nodeStates, [event.nodeId]: event }
        const log = isNewExecution ? [event] : [...prev.log.slice(-(MAX_LOG - 1)), event]
        return { executionId: event.executionId, nodeStates, log }
      })
    })
    return unsubscribe
  }, [workflowId])

  return state
}
