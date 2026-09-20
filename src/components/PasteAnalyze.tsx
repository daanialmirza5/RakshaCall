import { Mic, MicOff, Sparkles, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { analyzeCallerText } from '../lib/detectionEngine'
import { useSpeechRecognition } from '../lib/speechRecognition'
import { useAppSettings } from '../i18n/LanguageContext'
import { RiskMeter } from './RiskMeter'
import { TacticsList } from './TacticsList'
import { WarningOverlay } from './WarningOverlay'

export function PasteAnalyze() {
  const { strings } = useAppSettings()
  const [text, setText] = useState('')
  const [warningDismissed, setWarningDismissed] = useState(false)
  const speech = useSpeechRecognition()
  const t = strings.paste

  const combinedText = speech.listening || speech.transcript ? `${text} ${speech.transcript}`.trim() : text
  const result = useMemo(() => analyzeCallerText(combinedText), [combinedText])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink-50">{t.title}</h1>
        <p className="mt-2 text-ink-300">{t.subtitle}</p>
      </div>

      <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setWarningDismissed(false)
          }}
          placeholder={t.placeholder}
          rows={6}
          className="w-full resize-none rounded-xl border border-ink-700 bg-ink-950 p-4 text-ink-100 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setText('')
              speech.reset()
              setWarningDismissed(false)
            }}
            className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-2 text-sm font-medium text-ink-200 hover:bg-ink-800"
          >
            <Trash2 className="h-4 w-4" />
            {t.clearButton}
          </button>

          {speech.supported && (
            <button
              type="button"
              onClick={() => (speech.listening ? speech.stop() : speech.start())}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                speech.listening
                  ? 'bg-danger-500 text-white hover:bg-danger-600'
                  : 'bg-ink-800 text-ink-100 hover:bg-ink-700'
              }`}
            >
              {speech.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {speech.listening ? t.micListening : t.micStart}
            </button>
          )}
        </div>
      </div>

      {combinedText.trim().length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RiskMeter score={result.score} level={result.level} />
          <TacticsList matched={result.matchedCategories} />
        </div>
      )}

      {combinedText.trim().length === 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          <Sparkles className="h-4 w-4" />
          {t.liveNote}
        </div>
      )}

      {!warningDismissed && (
        <div className="mt-5">
          <WarningOverlay level={result.level} matched={result.matchedCategories} onDismiss={() => setWarningDismissed(true)} />
        </div>
      )}
    </div>
  )
}
