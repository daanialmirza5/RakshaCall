import { Languages, Type } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import { LANGUAGES } from '../i18n/strings'

export function AccessibilityControls() {
  const { lang, setLang, largeText, setLargeText, strings } = useAppSettings()

  return (
    <div className="flex items-center gap-2">
      <label className="relative flex items-center">
        <Languages className="pointer-events-none absolute left-2.5 h-4 w-4 text-ink-300" aria-hidden />
        <span className="sr-only">{strings.accessibility.languageLabel}</span>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as typeof lang)}
          className="appearance-none rounded-lg border border-ink-600 bg-ink-800 py-1.5 pl-8 pr-3 text-sm font-medium text-ink-100 outline-none focus:border-brand-400"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeLabel}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => setLargeText(!largeText)}
        aria-pressed={largeText}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
          largeText
            ? 'border-brand-400 bg-brand-500/15 text-brand-300'
            : 'border-ink-600 bg-ink-800 text-ink-100 hover:bg-ink-700'
        }`}
      >
        <Type className="h-4 w-4" aria-hidden />
        {strings.accessibility.largeText}
      </button>
    </div>
  )
}
