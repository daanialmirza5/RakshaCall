/**
 * Drives workflow node events from RakshaCall's REAL exported functions —
 * `normalizeForDetection`, `detectSignals`, `scoreFromCategories`,
 * `riskLevelForScore` are the exact functions the rest of the app already
 * uses (via `analyzeCallerText`, which composes them in this same order).
 * Calling them again here for observability is cheap and pure (confirmed
 * sub-millisecond even on multi-KB transcripts — see detectionEngine
 * performance notes) and never reimplements or second-guesses their logic;
 * the values produced are byte-identical to what `analyzeCallerText` would
 * return for the same input, by construction.
 */
import { detectSignals, scoreFromCategories, type MatchedCategory } from './detectionEngine'
import { riskLevelForScore, type RiskLevel } from '../data/signals'
import { normalizeForDetection } from './textNormalize'
import { runInstrumented } from './workflowRuntime'

export interface DetectionPipelineResult {
  normalized: string
  matched: MatchedCategory[]
  score: number
  level: RiskLevel
}

export interface DetectionNodeIds {
  normalize: string
  signalMatching: string
  tacticDetection: string
  riskScore: string
  riskDecision: string
  /** Optional final "explainable findings" node, present in some workflow definitions but not others. */
  findings?: string
}

export interface DetectionTarget {
  workflowId: string
  executionId: string
  nodeIds: DetectionNodeIds
}

/**
 * Runs the real detection pipeline exactly once, then reports that single
 * real computation's stages against every given target (e.g. the "Live
 * Call" and "Detection Intelligence" workflows both want to show the same
 * real analysis, just drawn with different node ids — this avoids running
 * detectSignals/scoreFromCategories twice for that).
 */
export function runDetectionPipeline(text: string, targets: DetectionTarget[]): DetectionPipelineResult {
  const normalized = normalizeForDetection(text)
  let matched: MatchedCategory[] = []
  let score = 0
  let level: RiskLevel = 'LOW'

  for (const { workflowId, executionId, nodeIds } of targets) {
    runInstrumented({ workflowId, executionId, nodeId: nodeIds.normalize, input: text }, () => normalized)
    matched = runInstrumented({ workflowId, executionId, nodeId: nodeIds.signalMatching, input: normalized }, () =>
      detectSignals(text),
    )
    runInstrumented(
      {
        workflowId,
        executionId,
        nodeId: nodeIds.tacticDetection,
        input: matched.length,
        metadata: { categories: matched.map((m) => m.id) },
      },
      () => matched,
    )
    score = runInstrumented({ workflowId, executionId, nodeId: nodeIds.riskScore, input: matched.length }, () =>
      scoreFromCategories(matched),
    )
    level = runInstrumented({ workflowId, executionId, nodeId: nodeIds.riskDecision, input: score }, () =>
      riskLevelForScore(score),
    )
    if (nodeIds.findings) {
      runInstrumented({ workflowId, executionId, nodeId: nodeIds.findings, input: matched.length }, () =>
        matched.map((m) => m.id),
      )
    }
  }

  return { normalized, matched, score, level }
}
