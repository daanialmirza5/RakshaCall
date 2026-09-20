import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { clearHistory, emit } from './workflowRuntime'
import { useWorkflowVisualizerState } from './useWorkflowVisualizerState'

beforeEach(() => {
  clearHistory()
})

describe('useWorkflowVisualizerState', () => {
  it('starts empty when there is no history for the workflow', () => {
    const { result } = renderHook(() => useWorkflowVisualizerState('liveCall'))
    expect(result.current.executionId).toBeNull()
    expect(result.current.log).toEqual([])
  })

  it('seeds from existing history for the given workflow on mount', () => {
    emit({ workflowId: 'liveCall', executionId: 'RK-0001', nodeId: 'callInput', status: 'success' })
    emit({ workflowId: 'liveCall', executionId: 'RK-0001', nodeId: 'transcriptStream', status: 'success' })
    emit({ workflowId: 'otherWorkflow', executionId: 'RK-9999', nodeId: 'x', status: 'success' })

    const { result } = renderHook(() => useWorkflowVisualizerState('liveCall'))
    expect(result.current.executionId).toBe('RK-0001')
    expect(result.current.log).toHaveLength(2)
    expect(result.current.nodeStates.callInput?.status).toBe('success')
    expect(result.current.nodeStates.transcriptStream?.status).toBe('success')
  })

  it('only seeds from the latest execution when the workflow has multiple past executions', () => {
    emit({ workflowId: 'liveCall', executionId: 'RK-OLD', nodeId: 'callInput', status: 'success' })
    emit({ workflowId: 'liveCall', executionId: 'RK-NEW', nodeId: 'callInput', status: 'success' })

    const { result } = renderHook(() => useWorkflowVisualizerState('liveCall'))
    expect(result.current.executionId).toBe('RK-NEW')
    expect(result.current.log).toHaveLength(1)
  })

  it('updates live as new events for the subscribed workflow are emitted', () => {
    const { result } = renderHook(() => useWorkflowVisualizerState('liveCall'))
    act(() => {
      emit({ workflowId: 'liveCall', executionId: 'RK-0001', nodeId: 'callInput', status: 'success', output: 'digital-arrest' })
    })
    expect(result.current.executionId).toBe('RK-0001')
    expect(result.current.nodeStates.callInput?.output).toBe('digital-arrest')
  })

  it('ignores events for a different workflow', () => {
    const { result } = renderHook(() => useWorkflowVisualizerState('liveCall'))
    act(() => {
      emit({ workflowId: 'manualAnalysis', executionId: 'MAN-0001', nodeId: 'pasteInput', status: 'success' })
    })
    expect(result.current.executionId).toBeNull()
    expect(result.current.log).toEqual([])
  })

  it('resets node states when a new execution begins for the same workflow (no stale nodes)', () => {
    const { result } = renderHook(() => useWorkflowVisualizerState('liveCall'))
    act(() => {
      emit({ workflowId: 'liveCall', executionId: 'RK-0001', nodeId: 'callInput', status: 'success' })
      emit({ workflowId: 'liveCall', executionId: 'RK-0001', nodeId: 'transcriptStream', status: 'success' })
    })
    expect(Object.keys(result.current.nodeStates)).toHaveLength(2)

    act(() => {
      emit({ workflowId: 'liveCall', executionId: 'RK-0002', nodeId: 'callInput', status: 'success' })
    })
    expect(result.current.executionId).toBe('RK-0002')
    expect(Object.keys(result.current.nodeStates)).toEqual(['callInput'])
  })

  it('resets when switching to a different workflowId', () => {
    emit({ workflowId: 'liveCall', executionId: 'RK-0001', nodeId: 'callInput', status: 'success' })
    const { result, rerender } = renderHook(({ id }) => useWorkflowVisualizerState(id), { initialProps: { id: 'liveCall' } })
    expect(result.current.executionId).toBe('RK-0001')

    rerender({ id: 'manualAnalysis' })
    expect(result.current.executionId).toBeNull()
    expect(result.current.log).toEqual([])
  })
})
