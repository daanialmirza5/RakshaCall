import { FastForward, Pause, Play, Zap } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { PlaybackMode, PlaybackStatus } from '../lib/callPlaybackUtils'
import type { SpeedMultiplier } from '../lib/useCallPlayback'

const SPEEDS: SpeedMultiplier[] = [1, 2, 3]

interface PlaybackControlsProps {
  mode: PlaybackMode
  status: PlaybackStatus
  hasTrigger: boolean
  onSetSpeed: (speed: SpeedMultiplier) => void
  onInstantDemo: () => void
  onJumpToTrigger: () => void
  onPause: () => void
  onResume: () => void
}

const pillBase =
  'flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition min-h-[2.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:cursor-not-allowed disabled:opacity-40'

export function PlaybackControls({
  mode,
  status,
  hasTrigger,
  onSetSpeed,
  onInstantDemo,
  onJumpToTrigger,
  onPause,
  onResume,
}: PlaybackControlsProps) {
  const { strings } = useAppSettings()
  const t = strings.callScreen

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-ink-700 bg-ink-900/40 p-3">
      <div role="group" aria-label={t.playbackSpeedLabel} className="flex items-center gap-1.5">
        <span className="hidden text-xs font-medium text-ink-400 sm:inline">{t.playbackSpeedLabel}</span>
        <div className="flex gap-1">
          {SPEEDS.map((speed) => {
            const isActive = mode.kind === 'speed' && mode.multiplier === speed
            return (
              <button
                key={speed}
                type="button"
                aria-pressed={isActive}
                aria-label={t.speedAriaLabel.replace('{x}', String(speed))}
                onClick={() => onSetSpeed(speed)}
                className={`${pillBase} min-w-[2.75rem] justify-center ${
                  isActive ? 'bg-brand-500 text-white' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
                }`}
              >
                {speed}×
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={mode.kind === 'instant'}
        onClick={onInstantDemo}
        className={`${pillBase} ${mode.kind === 'instant' ? 'bg-brand-500 text-white' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'}`}
      >
        <Zap className="h-4 w-4" aria-hidden />
        {t.instantDemo}
      </button>

      <button
        type="button"
        onClick={status === 'playing' ? onPause : onResume}
        disabled={status === 'ended'}
        aria-label={status === 'playing' ? t.pauseCall : t.resumeCall}
        className={`${pillBase} bg-ink-800 text-ink-200 hover:bg-ink-700`}
      >
        {status === 'playing' ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        {status === 'playing' ? t.pauseCall : t.resumeCall}
      </button>

      <button
        type="button"
        onClick={onJumpToTrigger}
        disabled={!hasTrigger}
        title={t.jumpToTriggerHint}
        aria-label={`${t.jumpToTrigger}. ${t.jumpToTriggerHint}`}
        className={`${pillBase} ml-auto bg-danger-500/15 text-danger-300 hover:bg-danger-500/25`}
      >
        <FastForward className="h-4 w-4" aria-hidden />
        {t.jumpToTrigger}
      </button>
    </div>
  )
}
