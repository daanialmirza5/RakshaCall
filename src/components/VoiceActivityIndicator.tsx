import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { VoiceActivityState } from '../lib/speechSynthesis'

const BAR_COUNT = 4

/**
 * A simulated speaking-activity readout: a status label plus a few small
 * animated bars. Browser TTS doesn't reliably expose its generated audio to
 * an AnalyserNode, so this intentionally does NOT claim to visualize real
 * waveform amplitude — it's synced to the speech-engine state (speaking /
 * paused / idle / muted / unsupported), not to actual audio samples.
 */
export function VoiceActivityIndicator({ state }: { state: VoiceActivityState }) {
  const { strings } = useAppSettings()
  const t = strings.callScreen

  const label =
    state === 'speaking'
      ? t.callerSpeaking
      : state === 'paused'
        ? t.callerPaused
        : state === 'muted'
          ? t.voiceOff
          : state === 'unsupported'
            ? t.voiceUnsupported
            : t.voiceIdle

  const isSpeaking = state === 'speaking'
  const isDim = state === 'muted' || state === 'unsupported'

  return (
    <div className="flex items-center gap-2 text-xs text-ink-400" role="status" aria-live="polite">
      {isDim ? (
        <VolumeX className="h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : (
        <Volume2 className={`h-3.5 w-3.5 shrink-0 ${isSpeaking ? 'text-safe-400' : 'text-ink-400'}`} aria-hidden />
      )}
      <div className="flex h-3.5 items-end gap-0.5">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <motion.span
            key={i}
            className={`w-0.5 rounded-full ${isSpeaking ? 'bg-safe-400' : isDim ? 'bg-ink-700' : 'bg-ink-600'}`}
            animate={isSpeaking ? { height: ['3px', '14px', '6px', '11px', '3px'] } : { height: state === 'paused' ? '7px' : '3px' }}
            transition={isSpeaking ? { duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' } : { duration: 0.2 }}
          />
        ))}
      </div>
      <span>{label}</span>
    </div>
  )
}
