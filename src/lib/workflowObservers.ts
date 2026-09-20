import { useEffect, useRef, useState } from 'react'
import type { Scenario } from '../types'
import { accumulatedCallerText } from './callPlaybackUtils'
import type { CallPlaybackState } from './useCallPlayback'
import type { CallVoiceState } from './useCallVoice'
import type { IncidentReportData } from './incidentReportUtils'
import type { MicState } from './speechRecognition'
import { runDetectionPipeline } from './workflowDrivers'
import { createExecutionId, markStatus } from './workflowRuntime'

/**
 * Observer hooks that report REAL state transitions (from hooks the screen
 * already owns — useCallPlayback, useCallVoice, useIncidentReport,
 * useSpeechRecognition) onto the Live Runtime Workflow event bus. These are
 * purely additive: they never modify the hooks they observe, mirroring the
 * same composition pattern already used by useCallVoice/useIncidentReport
 * around useCallPlayback. No timers, no fake progression — every emit here
 * happens inside a `useEffect` keyed on the real value that changed.
 */

const LIVE_CALL_NODE_IDS = {
  normalize: 'normalize',
  signalMatching: 'signalMatching',
  tacticDetection: 'tacticDetection',
  riskScore: 'riskScore',
  riskDecision: 'riskDecision',
} as const

const DETECTION_INTELLIGENCE_NODE_IDS = {
  normalize: 'normalize',
  signalMatching: 'signalMatching',
  tacticDetection: 'tacticCategories',
  riskScore: 'riskScoring',
  riskDecision: 'riskDecision',
  findings: 'explainableFindings',
} as const

const MANUAL_NODE_IDS = {
  normalize: 'normalize',
  signalMatching: 'signalMatching',
  tacticDetection: 'tacticDetection',
  riskScore: 'riskCalculation',
  riskDecision: 'riskCalculation',
  findings: 'explainableFindings',
} as const

export interface CallScreenWorkflowInputs {
  scenario: Scenario
  playback: CallPlaybackState
  voice: CallVoiceState
  incidentData: IncidentReportData
  showWarning: boolean
  reportOpen: boolean
  actionHubOpen: boolean
}

export function useCallScreenWorkflows({
  scenario,
  playback,
  voice,
  incidentData,
  showWarning,
  reportOpen,
  actionHubOpen,
}: CallScreenWorkflowInputs): string {
  const [executionId, setExecutionId] = useState(() => createExecutionId())
  const lastLineCountRef = useRef(0)
  const everHighRef = useRef(false)

  // A fresh play-through -> a fresh execution shared by every call-screen workflow.
  useEffect(() => {
    const id = createExecutionId()
    setExecutionId(id)
    lastLineCountRef.current = 0
    everHighRef.current = false
    markStatus({ workflowId: 'sessionLifecycle', executionId: id, nodeId: 'createExecution', status: 'success', output: id })
    markStatus({
      workflowId: 'sessionLifecycle',
      executionId: id,
      nodeId: 'loadScenario',
      status: 'success',
      output: scenario.title,
    })
    markStatus({
      workflowId: 'liveCall',
      executionId: id,
      nodeId: 'callInput',
      status: 'success',
      output: { scenario: scenario.title, executionId: id },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.playId])

  // Real playback status -> session lifecycle nodes.
  useEffect(() => {
    markStatus({
      workflowId: 'sessionLifecycle',
      executionId,
      nodeId: 'startPlayback',
      status: playback.status === 'playing' || playback.status === 'ended' ? 'success' : 'idle',
      output: playback.status,
    })
    markStatus({
      workflowId: 'sessionLifecycle',
      executionId,
      nodeId: 'pauseResume',
      status: playback.status === 'paused' ? 'success' : 'idle',
      output: playback.status,
    })
    if (playback.status === 'ended') {
      markStatus({ workflowId: 'sessionLifecycle', executionId, nodeId: 'cleanupComplete', status: 'success', output: 'ended' })
    }
  }, [playback.status, executionId])

  useEffect(() => {
    markStatus({
      workflowId: 'sessionLifecycle',
      executionId,
      nodeId: 'restartOrChange',
      status: playback.playId > 0 ? 'success' : 'idle',
      output: playback.playId,
    })
  }, [playback.playId, executionId])

  // Real newly-revealed lines -> transcriptStream + the real detection pipeline.
  useEffect(() => {
    const lines = playback.visibleLines
    if (lines.length === 0 || lines.length === lastLineCountRef.current) return
    lastLineCountRef.current = lines.length
    const newest = lines[lines.length - 1]

    markStatus({
      workflowId: 'liveCall',
      executionId,
      nodeId: 'transcriptStream',
      status: 'success',
      output: { speaker: newest.speaker, text: newest.text },
    })
    markStatus({ workflowId: 'sessionLifecycle', executionId, nodeId: 'transcriptEvents', status: 'success', output: lines.length })

    if (newest.speaker !== 'caller') return

    const text = accumulatedCallerText(lines, lines.length - 1)
    const { matched, score, level } = runDetectionPipeline(text, [
      { workflowId: 'liveCall', executionId, nodeIds: LIVE_CALL_NODE_IDS },
      { workflowId: 'detectionIntelligence', executionId, nodeIds: DETECTION_INTELLIGENCE_NODE_IDS },
    ])

    markStatus({ workflowId: 'sessionLifecycle', executionId, nodeId: 'detectionEvents', status: 'success', output: matched.length })
    markStatus({
      workflowId: 'sessionLifecycle',
      executionId,
      nodeId: 'riskState',
      status: 'success',
      output: { score, level },
    })

    if (level === 'HIGH') everHighRef.current = true
    markStatus({
      workflowId: 'liveCall',
      executionId,
      nodeId: 'intervention',
      status: level === 'LOW' ? 'skipped' : 'success',
      output: level,
    })
    markStatus({
      workflowId: 'emergencyResponse',
      executionId,
      nodeId: 'highRiskDetection',
      status: level === 'HIGH' ? 'success' : 'skipped',
      output: { score, level },
    })
  }, [playback.visibleLines, executionId])

  // Real warning-overlay visibility -> protectionActions + emergency nodes.
  useEffect(() => {
    markStatus({
      workflowId: 'liveCall',
      executionId,
      nodeId: 'protectionActions',
      status: playback.result.level === 'LOW' ? 'idle' : 'success',
      output: { level: playback.result.level, reviewAlertAvailable: playback.result.level !== 'LOW' },
    })
    markStatus({
      workflowId: 'emergencyResponse',
      executionId,
      nodeId: 'protectionWarning',
      status: showWarning ? 'success' : everHighRef.current ? 'skipped' : 'idle',
      output: showWarning,
    })
  }, [showWarning, playback.result.level, executionId])

  // Real Get Help / Incident Summary panel opens -> emergencyResponse + incidentResponse.
  useEffect(() => {
    if (!actionHubOpen) return
    markStatus({ workflowId: 'emergencyResponse', executionId, nodeId: 'userDecision', status: 'success', output: 'getHelp' })
    markStatus({ workflowId: 'emergencyResponse', executionId, nodeId: 'getHelpAction', status: 'success', output: true })
    markStatus({ workflowId: 'emergencyResponse', executionId, nodeId: 'citizenActionHub', status: 'success', output: true })
    markStatus({ workflowId: 'incidentResponse', executionId, nodeId: 'getHelp', status: 'success', output: true })
  }, [actionHubOpen, executionId])

  useEffect(() => {
    if (!reportOpen) return
    markStatus({
      workflowId: 'incidentResponse',
      executionId,
      nodeId: 'incidentSummary',
      status: 'success',
      output: { peakScore: incidentData.peakScore, tactics: incidentData.matchedCategories.length },
    })
  }, [reportOpen, executionId, incidentData.peakScore, incidentData.matchedCategories.length])

  // Real incident tracking (from useIncidentReport's own real state).
  useEffect(() => {
    markStatus({
      workflowId: 'incidentResponse',
      executionId,
      nodeId: 'incidentRecorder',
      status: 'success',
      output: incidentData.incidentId,
    })
    markStatus({ workflowId: 'incidentResponse', executionId, nodeId: 'peakRisk', status: 'success', output: incidentData.peakScore })
    markStatus({
      workflowId: 'incidentResponse',
      executionId,
      nodeId: 'tacticTimeline',
      status: incidentData.timeline.length > 0 ? 'success' : 'idle',
      output: incidentData.timeline.length,
    })
    markStatus({
      workflowId: 'sessionLifecycle',
      executionId,
      nodeId: 'incidentState',
      status: 'success',
      output: { peakScore: incidentData.peakScore, events: incidentData.timeline.length },
    })
    for (const entry of incidentData.timeline) {
      markStatus({
        workflowId: 'incidentResponse',
        executionId,
        nodeId: 'detectionEvent',
        status: 'success',
        output: entry.categoryId,
        metadata: { atMs: entry.atMs },
      })
    }
  }, [executionId, incidentData.incidentId, incidentData.peakScore, incidentData.timeline])

  // Real caller-voice (TTS) engine state -> the speech-synthesis half of Voice & Speech.
  useEffect(() => {
    markStatus({
      workflowId: 'voiceSpeech',
      executionId,
      nodeId: 'speechSynthesis',
      status: voice.activityState === 'unsupported' ? 'error' : voice.activityState === 'muted' ? 'skipped' : 'success',
      output: voice.activityState,
    })
    markStatus({
      workflowId: 'voiceSpeech',
      executionId,
      nodeId: 'voiceResponse',
      status: voice.activityState === 'speaking' ? 'running' : voice.activityState === 'paused' ? 'success' : 'idle',
      output: voice.activityState,
    })
  }, [voice.activityState, executionId])

  return executionId
}

export function usePasteAnalyzeWorkflow(
  text: string,
  matchedCount: number,
  score: number,
  level: string,
  speechSupported: boolean,
  micState: MicState,
  micTranscript: string,
  micLang: string,
): string {
  const [executionId] = useState(() => createExecutionId('MAN'))
  const lastTextRef = useRef<string | null>(null)

  useEffect(() => {
    const trimmed = text.trim()
    markStatus({
      workflowId: 'manualAnalysis',
      executionId,
      nodeId: 'pasteInput',
      status: trimmed.length > 0 ? 'success' : 'idle',
      output: trimmed.length,
    })
    markStatus({
      workflowId: 'manualAnalysis',
      executionId,
      nodeId: 'validateInput',
      status: trimmed.length > 0 ? 'success' : 'skipped',
      output: trimmed.length > 0,
    })
    if (trimmed.length === 0 || trimmed === lastTextRef.current) return
    lastTextRef.current = trimmed

    runDetectionPipeline(text, [
      { workflowId: 'manualAnalysis', executionId, nodeIds: MANUAL_NODE_IDS },
      { workflowId: 'detectionIntelligence', executionId, nodeIds: DETECTION_INTELLIGENCE_NODE_IDS },
    ])
  }, [text, executionId])

  useEffect(() => {
    markStatus({
      workflowId: 'voiceSpeech',
      executionId,
      nodeId: 'microphoneInput',
      status: !speechSupported ? 'error' : micState === 'listening' ? 'running' : 'idle',
      output: micState,
    })
    markStatus({
      workflowId: 'voiceSpeech',
      executionId,
      nodeId: 'speechRecognition',
      status: !speechSupported ? 'error' : micState === 'permission-denied' || micState === 'no-mic' || micState === 'error' ? 'error' : micState === 'listening' ? 'running' : 'idle',
      output: micState,
    })
    markStatus({ workflowId: 'voiceSpeech', executionId, nodeId: 'languageSelection', status: 'success', output: micLang })
  }, [speechSupported, micState, micLang, executionId])

  useEffect(() => {
    if (!micTranscript.trim()) return
    markStatus({ workflowId: 'voiceSpeech', executionId, nodeId: 'transcript', status: 'success', output: micTranscript })
  }, [micTranscript, executionId])

  useEffect(() => {
    if (matchedCount === 0 && score === 0) return
    markStatus({
      workflowId: 'voiceSpeech',
      executionId,
      nodeId: 'voiceDetection',
      status: 'success',
      output: { matchedCount, score },
    })
    markStatus({ workflowId: 'voiceSpeech', executionId, nodeId: 'voiceRisk', status: 'success', output: level })
  }, [matchedCount, score, level, executionId])

  return executionId
}
