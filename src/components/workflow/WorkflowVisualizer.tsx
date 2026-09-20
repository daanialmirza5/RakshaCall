import { Background, Controls, ReactFlow, type Edge, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Radio, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { WORKFLOW_DEFINITIONS } from '../../lib/workflowDefinitions'
import { useWorkflowVisualizerState } from '../../lib/useWorkflowVisualizerState'
import { computeLayout, formatNodeValue } from './workflowLayout'
import { WorkflowGraphNode, type WorkflowGraphNodeData } from './WorkflowGraphNode'

const nodeTypes = { workflowNode: WorkflowGraphNode }

/**
 * The Live Runtime Workflow visualizer — a read-only observability layer
 * over `workflowRuntime`'s real event stream. It never drives anything: it
 * only renders whatever RakshaCall's real code has actually reported via
 * `runInstrumented`/`markStatus` in `workflowDrivers.ts` /
 * `workflowObservers.ts`. Fully client-side; nothing here is sent
 * anywhere.
 */
export function WorkflowVisualizer({
  onClose,
  defaultWorkflowId,
}: {
  onClose?: () => void
  defaultWorkflowId?: string
}) {
  const [workflowId, setWorkflowId] = useState(
    () => WORKFLOW_DEFINITIONS.find((w) => w.id === defaultWorkflowId)?.id ?? WORKFLOW_DEFINITIONS[0].id,
  )
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const definition = WORKFLOW_DEFINITIONS.find((w) => w.id === workflowId) ?? WORKFLOW_DEFINITIONS[0]
  const { executionId, nodeStates, log } = useWorkflowVisualizerState(workflowId)

  const layout = useMemo(() => computeLayout(definition), [definition])

  const nodes: Node<WorkflowGraphNodeData>[] = useMemo(
    () =>
      definition.nodes.map((n) => {
        const event = nodeStates[n.id]
        return {
          id: n.id,
          type: 'workflowNode',
          position: layout[n.id] ?? { x: 0, y: 0 },
          data: { label: n.label, status: event?.status ?? 'idle', output: event?.output, durationMs: event?.durationMs },
        }
      }),
    [definition, layout, nodeStates],
  )

  const edges: Edge[] = useMemo(
    () =>
      definition.edges.map((e) => {
        const sourceDone = nodeStates[e.source]?.status === 'success'
        const targetActive = nodeStates[e.target] && nodeStates[e.target].status !== 'idle'
        const active = sourceDone && targetActive
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          animated: nodeStates[e.target]?.status === 'running',
          style: { stroke: active ? 'var(--color-brand-400)' : 'var(--color-ink-600)', strokeWidth: active ? 2 : 1.5 },
        }
      }),
    [definition, nodeStates],
  )

  const selectedNodeDef = definition.nodes.find((n) => n.id === selectedNodeId)
  const selectedEvent = selectedNodeId ? nodeStates[selectedNodeId] : undefined

  return (
    <div className="flex h-[85vh] max-h-[900px] w-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-800 px-5 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ink-50">Live Runtime Workflow</h2>
            <span className="flex items-center gap-1 rounded-full bg-safe-500/10 px-2 py-0.5 text-[11px] font-semibold text-safe-500">
              <Radio className="h-2.5 w-2.5 animate-pulse" aria-hidden />
              LIVE
            </span>
          </div>
          <p className="text-xs text-ink-500">
            {executionId ? (
              <>
                Execution: <span className="font-mono">{executionId}</span>
              </>
            ) : (
              'Waiting for a real execution to observe — start a call or analyze a transcript.'
            )}{' '}
            · Client-side runtime · No backend telemetry
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close runtime observatory view"
            className="rounded-full p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>

      {/* Workflow selector */}
      <div role="tablist" aria-label="Workflow" className="flex gap-1 overflow-x-auto border-b border-ink-800 px-3 py-2">
        {WORKFLOW_DEFINITIONS.map((w) => (
          <button
            key={w.id}
            type="button"
            role="tab"
            aria-selected={w.id === workflowId}
            onClick={() => {
              setWorkflowId(w.id)
              setSelectedNodeId(null)
            }}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              w.id === workflowId ? 'bg-brand-500 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100'
            }`}
          >
            {w.title}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Graph */}
        <div className="min-h-[320px] border-b border-ink-800 lg:border-b-0 lg:border-r">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            fitView
            proOptions={{ hideAttribution: true }}
            colorMode="light"
          >
            <Background gap={20} color="var(--color-ink-700)" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Side panel: node detail or execution log */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          {selectedNodeDef ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display font-bold text-ink-50">{selectedNodeDef.label}</p>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="text-xs font-semibold text-ink-400 hover:text-ink-100"
                >
                  Back to log
                </button>
              </div>
              <p className="text-xs text-ink-400">{selectedNodeDef.description}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-ink-500">Status</dt>
                  <dd className="text-ink-100">{selectedEvent?.status ?? 'idle'}</dd>
                </div>
                {typeof selectedEvent?.durationMs === 'number' && (
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Real elapsed time</dt>
                    <dd className="text-ink-100">{selectedEvent.durationMs.toFixed(3)} ms</dd>
                  </div>
                )}
                {selectedEvent?.input !== undefined && (
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Input</dt>
                    <dd className="break-words text-ink-100">{formatNodeValue(selectedEvent.input)}</dd>
                  </div>
                )}
                {selectedEvent?.output !== undefined && (
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Output</dt>
                    <dd className="break-words text-ink-100">{formatNodeValue(selectedEvent.output)}</dd>
                  </div>
                )}
                {selectedEvent?.timestamp && (
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Timestamp</dt>
                    <dd className="text-ink-100">{new Date(selectedEvent.timestamp).toLocaleTimeString()}</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Live Execution Log</p>
              {log.length === 0 ? (
                <p className="text-sm text-ink-500">No events yet for this workflow in this session.</p>
              ) : (
                <ol className="space-y-1.5 font-mono text-xs">
                  {[...log]
                    .slice()
                    .reverse()
                    .map((e, i) => (
                      <li key={`${e.nodeId}-${e.timestamp}-${i}`} className="flex items-start gap-1.5 text-ink-300">
                        <span className="shrink-0 text-ink-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
                        <span
                          className={
                            e.status === 'success'
                              ? 'text-safe-500'
                              : e.status === 'error'
                                ? 'text-danger-400'
                                : e.status === 'running'
                                  ? 'text-brand-500'
                                  : 'text-ink-500'
                          }
                        >
                          {e.status === 'success' ? '✓' : e.status === 'error' ? '✕' : e.status === 'running' ? '→' : '○'}
                        </span>
                        <span className="text-ink-200">{definition.nodes.find((n) => n.id === e.nodeId)?.label ?? e.nodeId}</span>
                      </li>
                    ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
