import { beforeEach, describe, expect, it } from 'vitest'
import { analyzeCallerText } from './detectionEngine'
import { clearHistory, createExecutionId, getEventHistory, subscribe } from './workflowRuntime'
import { runDetectionPipeline, type DetectionNodeIds } from './workflowDrivers'

const nodeIds: DetectionNodeIds = {
  normalize: 'normalize',
  signalMatching: 'signalMatching',
  tacticDetection: 'tacticDetection',
  riskScore: 'riskScore',
  riskDecision: 'riskDecision',
  findings: 'findings',
}

beforeEach(() => {
  clearHistory()
})

describe('runDetectionPipeline', () => {
  it('produces a result identical to the real analyzeCallerText for the same input', () => {
    const text = 'This is CBI, transfer the money immediately or you will be arrested.'
    const authoritative = analyzeCallerText(text)
    const executionId = createExecutionId()
    const pipelineResult = runDetectionPipeline(text, [{ workflowId: 'test', executionId, nodeIds }])

    expect(pipelineResult.score).toBe(authoritative.score)
    expect(pipelineResult.level).toBe(authoritative.level)
    expect(pipelineResult.matched.map((m) => m.id).sort()).toEqual(authoritative.matchedCategories.map((m) => m.id).sort())
  })

  it('matches for a HIGH-risk multilingual transcript too', () => {
    const text = 'Main CBI se bol raha hoon. Turant paise transfer karo warna girftar ho jaoge.'
    const authoritative = analyzeCallerText(text)
    const executionId = createExecutionId()
    const pipelineResult = runDetectionPipeline(text, [{ workflowId: 'test', executionId, nodeIds }])
    expect(pipelineResult.score).toBe(authoritative.score)
    expect(pipelineResult.level).toBe(authoritative.level)
  })

  it('matches for benign text (LOW, no false positive)', () => {
    const text = 'Hi, this is Rohan from Bluedart, your package is out for delivery today.'
    const authoritative = analyzeCallerText(text)
    const executionId = createExecutionId()
    const pipelineResult = runDetectionPipeline(text, [{ workflowId: 'test', executionId, nodeIds }])
    expect(pipelineResult.level).toBe(authoritative.level)
    expect(pipelineResult.level).toBe('LOW')
  })

  it('emits a running+success event for every real stage, in order, with real output', () => {
    const executionId = createExecutionId()
    const events: { nodeId: string; status: string }[] = []
    const unsubscribe = subscribe((e) => {
      if (e.executionId === executionId) events.push({ nodeId: e.nodeId, status: e.status })
    })
    runDetectionPipeline('This is CBI, transfer the money immediately.', [{ workflowId: 'test', executionId, nodeIds }])
    unsubscribe()

    const successOrder = events.filter((e) => e.status === 'success').map((e) => e.nodeId)
    expect(successOrder).toEqual(['normalize', 'signalMatching', 'tacticDetection', 'riskScore', 'riskDecision', 'findings'])
    for (const nodeId of successOrder) {
      expect(events.filter((e) => e.nodeId === nodeId && e.status === 'running')).toHaveLength(1)
      expect(events.filter((e) => e.nodeId === nodeId && e.status === 'success')).toHaveLength(1)
    }
  })

  it('the riskScore node output is the real numeric score, and riskDecision output is the real level', () => {
    const text = 'This is CBI, transfer the money immediately or you will be arrested.'
    const executionId = createExecutionId()
    let scoreOutput: unknown
    let levelOutput: unknown
    const unsubscribe = subscribe((e) => {
      if (e.executionId !== executionId || e.status !== 'success') return
      if (e.nodeId === 'riskScore') scoreOutput = e.output
      if (e.nodeId === 'riskDecision') levelOutput = e.output
    })
    const result = runDetectionPipeline(text, [{ workflowId: 'test', executionId, nodeIds }])
    unsubscribe()
    expect(scoreOutput).toBe(result.score)
    expect(levelOutput).toBe(result.level)
  })

  it('records events under the given executionId, retrievable via getEventHistory', () => {
    const executionId = createExecutionId()
    runDetectionPipeline('urgent, transfer money now', [{ workflowId: 'test', executionId, nodeIds }])
    const history = getEventHistory(executionId)
    expect(history.length).toBeGreaterThan(0)
    expect(history.every((e) => e.executionId === executionId)).toBe(true)
  })

  it('omits the findings event when the workflow definition has no findings node', () => {
    const executionId = createExecutionId()
    const events: string[] = []
    const unsubscribe = subscribe((e) => {
      if (e.executionId === executionId) events.push(e.nodeId)
    })
    const { findings: _findings, ...withoutFindings } = nodeIds
    runDetectionPipeline('test text', [{ workflowId: 'test', executionId, nodeIds: withoutFindings }])
    unsubscribe()
    expect(events).not.toContain('findings')
  })

  it('runs the real computation once but reports it against every given target', () => {
    const executionIdA = createExecutionId()
    const executionIdB = createExecutionId()
    let signalMatchingCalls = 0
    const unsubscribe = subscribe((e) => {
      if (e.nodeId === 'signalMatching' && e.status === 'running') signalMatchingCalls++
    })
    const result = runDetectionPipeline('This is CBI, transfer the money immediately.', [
      { workflowId: 'liveCall', executionId: executionIdA, nodeIds },
      { workflowId: 'detectionIntelligence', executionId: executionIdB, nodeIds },
    ])
    unsubscribe()
    // Two targets both got their own events...
    expect(getEventHistory(executionIdA).some((e) => e.nodeId === 'riskDecision' && e.status === 'success')).toBe(true)
    expect(getEventHistory(executionIdB).some((e) => e.nodeId === 'riskDecision' && e.status === 'success')).toBe(true)
    // ...but the real signal-matching function itself only ran once per target report, not duplicated beyond that.
    expect(signalMatchingCalls).toBe(2)
    expect(result.level).toBeDefined()
  })
})
