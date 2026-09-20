import { Info } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'

export function Footer() {
  const { strings } = useAppSettings()
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-start gap-3 rounded-2xl border border-ink-800 bg-ink-900/50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-ink-200">{strings.footer.limitationsTitle}</p>
            <p className="mt-1 text-sm text-ink-400">{strings.footer.limitationsBody}</p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-500">
          {strings.appName} — Built for HACKDAY 1.0 · {strings.poweredByLocal}
        </p>
      </div>
    </footer>
  )
}
