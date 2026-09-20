import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearHistory, createExecutionId, emit, getEventHistory, runInstrumented, subscribe } from './workflowRuntime'

beforeEach(() => {
  clearHistory()
})

describe('createExecutionId', () => {
  it('matches the RK-XXXX shape', () => {
    expect(createExecutionId()).toMatch(/^RK-[A-Z0-9]{4}$/)
  })

  it('supports a custom prefix', () => {
    expect(createExecutionId('DET')).toMatch(/^DET-[A-Z0-9]{4}$/)
  })

  it('produces different ids across calls', () => {
    const ids = new Set(Array.from({ length: 20 }, () => createExecutionId()))
    expect(ids.size).toBeGreaterThan(1)
  })
})

describe('emit / subscribe / getEventHistory', () => {
  it('delivers emitted events to subscribers', () => {
    const received: unknown[] = []
    const unsubscribe = subscribe((e) => received.push(e))
    emit({ workflowId: 'test', executionId: 'RK-0001', nodeId: 'a', status: 'running' })
    expect(received).toHaveLength(1)
    unsubscribe()
  })

  it('stops delivering events after unsubscribe', () => {
    const received: unknown[] = []
    const unsubscribe = subscribe((e) => received.push(e))
    unsubscribe()
    emit({ workflowId: 'test', executionId: 'RK-0001', nodeId: 'a', status: 'running' })
    expect(received).toHaveLength(0)
  })

  it('supports multiple independent subscribers', () => {
    const a: unknown[] = []
    const b: unknown[] = []
    const unsubA = subscribe((e) => a.push(e))
    const unsubB = subscribe((e) => b.push(e))
    emit({ workflowId: 'test', executionId: 'RK-0001', nodeId: 'a', status: 'running' })
    expect(a).toHaveLength(1)
    expect(b).toHaveLength(1)
    unsubA()
    unsubB()
  })

  it('records history and can filter it by executionId', () => {
    emit({ workflowId: 'test', executionId: 'RK-0001', nodeId: 'a', status: 'running' })
    emit({ workflowId: 'test', executionId: 'RK-0002', nodeId: 'a', status: 'running' })
    expect(getEventHistory()).toHaveLength(2)
    expect(getEventHistory('RK-0001')).toHaveLength(1)
    expect(getEventHistory('RK-0001')[0].executionId).toBe('RK-0001')
  })

  it('stamps every event with a real timestamp', () => {
    const before = Date.now()
    const e = emit({ workflowId: 'test', executionId: 'RK-0001', nodeId: 'a', status: 'running' })
    expect(e.timestamp).toBeGreaterThanOrEqual(before)
    expect(e.timestamp).toBeLessThanOrEqual(Date.now())
  })

  it('bounds history length (does not grow unbounded)', () => {
    for (let i = 0; i < 600; i++) {
      emit({ workflowId: 'test', executionId: 'RK-0001', nodeId: `n${i}`, status: 'running' })
    }
    expect(getEventHistory().length).toBeLessThanOrEqual(500)
  })
})

describe('runInstrumented', () => {
  it('actually calls the wrapped function and returns its real result', () => {
    const fn = vi.fn(() => 42)
    const result = runInstrumented({ workflowId: 'w', executionId: 'RK-0001', nodeId: 'n' }, fn)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(result).toBe(42)
  })

  it('emits a running event before calling fn, and a success event with the real output after', () => {
    const events: { status: string; output?: unknown }[] = []
    const unsubscribe = subscribe((e) => events.push({ status: e.status, output: e.output }))
    runInstrumented({ workflowId: 'w', executionId: 'RK-0001', nodeId: 'n' }, () => 'hello')
    expect(events).toEqual([
      { status: 'running', output: undefined },
      { status: 'success', output: 'hello' },
    ])
    unsubscribe()
  })

  it('includes a real elapsed duration on the success event', () => {
    let duration: number | undefined
    const unsubscribe = subscribe((e) => {
      if (e.status === 'success') duration = e.durationMs
    })
    runInstrumented({ workflowId: 'w', executionId: 'RK-0001', nodeId: 'n' }, () => {
      let x = 0
      for (let i = 0; i < 10000; i++) x += i
      return x
    })
    expect(duration).toBeGreaterThanOrEqual(0)
    unsubscribe()
  })

  it('emits an error event (not success) when the wrapped function throws, and rethrows', () => {
    const events: { status: string }[] = []
    const unsubscribe = subscribe((e) => events.push({ status: e.status }))
    expect(() =>
      runInstrumented({ workflowId: 'w', executionId: 'RK-0001', nodeId: 'n' }, () => {
        throw new Error('boom')
      }),
    ).toThrow('boom')
    expect(events.map((e) => e.status)).toEqual(['running', 'error'])
    unsubscribe()
  })

  it('never emits a success event without the function having actually run', () => {
    let calls = 0
    const events: string[] = []
    const unsubscribe = subscribe((e) => events.push(e.status))
    runInstrumented({ workflowId: 'w', executionId: 'RK-0001', nodeId: 'n' }, () => {
      calls++
      return calls
    })
    expect(calls).toBe(1)
    expect(events.filter((s) => s === 'success')).toHaveLength(1)
    unsubscribe()
  })
})
