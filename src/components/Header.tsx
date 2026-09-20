import { ShieldCheck } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { View } from '../App'
import { AccessibilityControls } from './AccessibilityControls'

export function Header({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  const { strings } = useAppSettings()

  const navItem = (target: View, label: string) => (
    <button
      type="button"
      onClick={() => onNavigate(target)}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        view === target ? 'bg-ink-800 text-ink-50' : 'text-ink-300 hover:text-ink-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink-50">
            {strings.appName}
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {navItem('landing', strings.nav.home)}
          {navItem('picker', strings.nav.demo)}
          {navItem('paste', strings.nav.paste)}
        </nav>

        <AccessibilityControls />
      </div>
    </header>
  )
}
