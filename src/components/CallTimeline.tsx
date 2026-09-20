import { useAppSettings } from '../i18n/LanguageContext'
import type { TimelineStage } from '../lib/callPlaybackUtils'

const STAGES: TimelineStage[] = ['started', 'suspicious', 'escalation', 'highRisk', 'intervention']

/**
 * Lightweight, read-only progress indicator: where this call is in the
 * detection story. Each stage gets a fixed-width slot (rather than
 * flex-shrinking labels to nothing) so text never overlaps on narrow
 * screens — the whole strip scrolls horizontally instead.
 */
export function CallTimeline({ stage }: { stage: TimelineStage }) {
  const { strings } = useAppSettings()
  const labels = strings.callScreen.timeline
  const currentIndex = STAGES.indexOf(stage)

  return (
    <div className="overflow-x-auto">
      <ol aria-label={strings.callScreen.timelineLabel} className="flex w-max min-w-full items-center px-0.5">
        {STAGES.map((s, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <li key={s} className="flex items-center">
              <div className="flex w-20 shrink-0 flex-col items-center gap-1 sm:w-24">
                <span
                  aria-current={active ? 'step' : undefined}
                  className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${
                    active
                      ? 'bg-danger-400 ring-4 ring-danger-400/25'
                      : done
                        ? 'bg-brand-400'
                        : 'bg-ink-700'
                  }`}
                />
                <span
                  className={`text-center text-[10px] leading-tight ${
                    active ? 'font-semibold text-ink-100' : 'text-ink-500'
                  }`}
                >
                  {labels[s]}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <span className={`mb-3.5 h-px w-6 shrink-0 transition-colors sm:w-10 ${done ? 'bg-brand-400' : 'bg-ink-700'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
