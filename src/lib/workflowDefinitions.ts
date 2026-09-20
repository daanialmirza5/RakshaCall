/**
 * Static registry describing HOW each Live Runtime Workflow should be drawn
 * (node ids, labels, positions, edges). This file contains no runtime
 * logic — it never decides what happened, only how to lay out the nodes
 * that `workflowRuntime` events (from `workflowObservers.ts`) report
 * against. Node `id`s here must match the `nodeId`s used when emitting.
 */

export interface WorkflowNodeDef {
  id: string
  label: string
  description: string
}

export interface WorkflowEdgeDef {
  id: string
  source: string
  target: string
}

export interface WorkflowDefinition {
  id: string
  title: string
  description: string
  nodes: WorkflowNodeDef[]
  edges: WorkflowEdgeDef[]
}

function chain(ids: string[]): WorkflowEdgeDef[] {
  return ids.slice(1).map((target, i) => ({ id: `${ids[i]}->${target}`, source: ids[i], target }))
}

const liveCallNodes: WorkflowNodeDef[] = [
  { id: 'callInput', label: 'Call Input', description: 'The active scenario and this play-through\'s execution id.' },
  { id: 'transcriptStream', label: 'Transcript Stream', description: 'Each line revealed by the real call-playback timer.' },
  { id: 'normalize', label: 'Text Normalization', description: 'The real normalizeForDetection() output for the accumulated caller text.' },
  { id: 'signalMatching', label: 'Signal Matching', description: 'The real detectSignals() pattern matching across all 8 categories.' },
  { id: 'tacticDetection', label: 'Tactic Detection', description: 'Which of the 8 categories actually matched, from the real result.' },
  { id: 'riskScore', label: 'Risk Calculation', description: 'The real scoreFromCategories() weighted + co-occurrence score.' },
  { id: 'riskDecision', label: 'Risk Decision', description: 'The real riskLevelForScore() classification: LOW / MEDIUM / HIGH.' },
  { id: 'intervention', label: 'Intervention', description: 'Whether the real WarningOverlay is actually showing.' },
  { id: 'protectionActions', label: 'Protection Actions', description: 'Review Alert, Get Help, Trusted Contact, Incident Summary — as actually available.' },
]

const detectionNodes: WorkflowNodeDef[] = [
  { id: 'inputText', label: 'Input Text', description: 'The real accumulated caller text being analyzed.' },
  { id: 'normalize', label: 'Normalize', description: 'The real normalizeForDetection() output.' },
  { id: 'signalMatching', label: 'Signal Matching', description: 'The real detectSignals() regex matching, across English/Hinglish/Hindi/Marathi patterns.' },
  { id: 'tacticCategories', label: '8 Tactic Categories', description: 'Real matched categories out of authority/urgency/threat/isolation/surveillance/credential/financial/remote-access.' },
  { id: 'riskScoring', label: 'Risk Scoring', description: 'The real scoreFromCategories() weights + co-occurrence bonus.' },
  { id: 'riskDecision', label: 'Risk Decision', description: 'The real riskLevelForScore() classification.' },
  { id: 'explainableFindings', label: 'Explainable Findings', description: 'The real matched-category labels, in priority order.' },
]

const voiceNodes: WorkflowNodeDef[] = [
  { id: 'microphoneInput', label: 'Microphone Input', description: 'The real useSpeechRecognition mic state.' },
  { id: 'speechRecognition', label: 'Speech Recognition', description: 'The real browser SpeechRecognition listening/ready/error state.' },
  { id: 'languageSelection', label: 'Language', description: 'The real BCP-47 recognition language in use.' },
  { id: 'transcript', label: 'Transcript', description: 'The real recognized transcript text.' },
  { id: 'voiceDetection', label: 'Detection', description: 'The real detection result computed from the recognized transcript.' },
  { id: 'voiceRisk', label: 'Risk / Warning', description: 'The real risk level reached from voice input.' },
  { id: 'speechSynthesis', label: 'Speech Synthesis', description: 'The real caller-voice TTS engine state (idle/speaking/paused).' },
  { id: 'voiceResponse', label: 'Voice Response', description: 'Whether the real caller-voice utterance is currently audible.' },
]

const incidentNodes: WorkflowNodeDef[] = [
  { id: 'detectionEvent', label: 'Detection Event', description: 'A real newly-matched tactic from the live detection result.' },
  { id: 'incidentRecorder', label: 'Incident Recorder', description: 'The real useIncidentReport hook recording this play-through.' },
  { id: 'peakRisk', label: 'Peak Risk', description: 'The real maximum score ever seen this play-through.' },
  { id: 'tacticTimeline', label: 'Tactic Timeline', description: 'The real chronological detection-event list.' },
  { id: 'incidentSummary', label: 'Incident Summary', description: 'The real IncidentReportData snapshot.' },
  { id: 'trustedContact', label: 'Trusted Contact', description: 'Whether the real trusted-contact panel was opened.' },
  { id: 'getHelp', label: 'Get Help', description: 'Whether the real Citizen Action Hub was opened.' },
  { id: 'officialResponse', label: 'Official Response', description: 'Which real official channel link was activated, if any.' },
]

const manualNodes: WorkflowNodeDef[] = [
  { id: 'pasteInput', label: 'Paste / Manual Input', description: 'The real text currently in the Paste Analyze textarea.' },
  { id: 'validateInput', label: 'Validate Input', description: 'Whether the real input is non-empty and worth analyzing.' },
  { id: 'normalize', label: 'Normalize Text', description: 'The real normalizeForDetection() output.' },
  { id: 'signalMatching', label: 'Signal Matching', description: 'The real detectSignals() output.' },
  { id: 'tacticDetection', label: 'Tactic Detection', description: 'The real matched categories.' },
  { id: 'riskCalculation', label: 'Risk Calculation', description: 'The real score + level.' },
  { id: 'explainableFindings', label: 'Explainable Findings', description: 'The real matched-category labels shown to the user.' },
]

const emergencyNodes: WorkflowNodeDef[] = [
  { id: 'highRiskDetection', label: 'High Risk Detection', description: 'The real detection result reaching HIGH.' },
  { id: 'protectionWarning', label: 'Protection Warning', description: 'Whether the real WarningOverlay is showing.' },
  { id: 'userDecision', label: 'User Decision', description: 'Which real action button the user actually clicked.' },
  { id: 'getHelpAction', label: 'Get Help', description: 'Real click on "Get Help & Report".' },
  { id: 'trustedContactAction', label: 'Trusted Contact', description: 'Real click on "Alert Amit (Son)".' },
  { id: 'citizenActionHub', label: 'Citizen Action Hub', description: 'The real emergency-guidance panel opening.' },
  { id: 'officialChannel', label: 'Official Channel', description: 'Real click on a 1930 / cybercrime.gov.in / Chakshu link — navigation/guidance only, never a submitted report.' },
]

const sessionNodes: WorkflowNodeDef[] = [
  { id: 'createExecution', label: 'Create Execution', description: 'A new play-through begins (real playId).' },
  { id: 'loadScenario', label: 'Load Scenario', description: 'The real scenario selected.' },
  { id: 'startPlayback', label: 'Start Playback', description: 'The real playback status becoming "playing".' },
  { id: 'transcriptEvents', label: 'Transcript Events', description: 'Real lines revealed so far.' },
  { id: 'detectionEvents', label: 'Detection Events', description: 'Real newly-matched tactics so far.' },
  { id: 'riskState', label: 'Risk State', description: 'The real current score/level.' },
  { id: 'incidentState', label: 'Incident State', description: 'The real peak score and timeline length.' },
  { id: 'pauseResume', label: 'Pause / Resume', description: 'The real playback status (playing/paused).' },
  { id: 'restartOrChange', label: 'Restart / Scenario Change', description: 'Real playId increments.' },
  { id: 'cleanupComplete', label: 'Cleanup / Complete', description: 'Real status reaching "ended", or the screen unmounting.' },
]

export const WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  {
    id: 'liveCall',
    title: 'Live Call Protection',
    description: 'The real-time pipeline behind an active call simulation, from transcript to intervention.',
    nodes: liveCallNodes,
    edges: chain(liveCallNodes.map((n) => n.id)),
  },
  {
    id: 'detectionIntelligence',
    title: 'Detection Intelligence',
    description: 'How RakshaCall turns text into an explainable, scored finding.',
    nodes: detectionNodes,
    edges: chain(detectionNodes.map((n) => n.id)),
  },
  {
    id: 'voiceSpeech',
    title: 'Voice & Speech Pipeline',
    description: 'Microphone input through to the caller-voice response, via the same detection engine.',
    nodes: voiceNodes,
    edges: chain(voiceNodes.map((n) => n.id)),
  },
  {
    id: 'incidentResponse',
    title: 'Incident & Response',
    description: 'How a detection event becomes a session incident record and a user response.',
    nodes: incidentNodes,
    edges: chain(incidentNodes.map((n) => n.id)),
  },
  {
    id: 'manualAnalysis',
    title: 'Manual Analysis',
    description: 'The Paste Analyze pipeline, from typed/pasted text to explainable findings.',
    nodes: manualNodes,
    edges: chain(manualNodes.map((n) => n.id)),
  },
  {
    id: 'emergencyResponse',
    title: 'Emergency & Protection Response',
    description: 'What happens after a HIGH-risk detection, driven by the user\'s real choices.',
    nodes: emergencyNodes,
    edges: [
      ...chain(['highRiskDetection', 'protectionWarning', 'userDecision']),
      { id: 'userDecision->getHelpAction', source: 'userDecision', target: 'getHelpAction' },
      { id: 'userDecision->trustedContactAction', source: 'userDecision', target: 'trustedContactAction' },
      { id: 'getHelpAction->citizenActionHub', source: 'getHelpAction', target: 'citizenActionHub' },
      { id: 'citizenActionHub->officialChannel', source: 'citizenActionHub', target: 'officialChannel' },
    ],
  },
  {
    id: 'sessionLifecycle',
    title: 'Session Lifecycle',
    description: 'How RakshaCall manages a call session\'s state from start to cleanup.',
    nodes: sessionNodes,
    edges: chain(sessionNodes.map((n) => n.id)),
  },
]

export function getWorkflowDefinition(id: string): WorkflowDefinition | undefined {
  return WORKFLOW_DEFINITIONS.find((w) => w.id === id)
}
