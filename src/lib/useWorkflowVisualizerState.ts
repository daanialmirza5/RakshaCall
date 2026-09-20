import { useEffect, useRef, useState } from 'react'
import { getEventHistory, requestRuntimeSync, subscribe, type WorkflowEvent } from './workflowRuntime'

export interface WorkflowVisualizerState {
  executionId: string | null
  nodeStates: Record<string, WorkflowEvent>
  log: WorkflowEvent[]
}

const MAX_LOG = 200

function getInitialState(workflowId: string): WorkflowVisualizerState {
  const history = getEventHistory().filter((e) => e.workflowId === workflowId)
  if (history.length > 0) {
    const latestExecutionId = history[history.length - 1].executionId
    const relevant = history.filter((e) => e.executionId === latestExecutionId).slice(-MAX_LOG)
    const nodeStates: Record<string, WorkflowEvent> = {}
    relevant.forEach((e) => {
      nodeStates[e.nodeId] = e
    })
    return { executionId: latestExecutionId, nodeStates, log: relevant }
  }
  return { executionId: null, nodeStates: {}, log: [] }
}

/**
 * Live view over one workflow's event stream. Seeds itself from any events
 * that already happened (e.g. the user started a call before opening this
 * view), then stays live via `subscribe`. A new executionId for this
 * workflow (restart / new session) clears the previous run's node states —
 * no stale nodes carried across executions.
 */
export function useWorkflowVisualizerState(workflowId: string): WorkflowVisualizerState {
  const [prevWorkflowId, setPrevWorkflowId] = useState(workflowId)
  const [state, setState] = useState<WorkflowVisualizerState>(() => getInitialState(workflowId))
  const executionIdRef = useRef<string | null>(state.executionId)

  let activeState = state
  if (prevWorkflowId !== workflowId) {
    setPrevWorkflowId(workflowId)
    const seed = getInitialState(workflowId)
    setState(seed)
    activeState = seed
  }

  useEffect(() => {
    requestRuntimeSync()
    const seed = getInitialState(workflowId)
    executionIdRef.current = seed.executionId

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

  return activeState
}

