import { motion } from 'framer-motion'
import { FileText, PlayCircle, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { View } from '../App'

export function Landing({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { strings } = useAppSettings()
  const t = strings.landing

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
          <ShieldCheck className="h-9 w-9" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance text-ink-50 sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-ink-300">{t.heroSubtitle}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate('picker')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-ink-950 transition hover:bg-brand-400 sm:w-auto"
          >
            <PlayCircle className="h-5 w-5" />
            {t.ctaStart}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('paste')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-6 py-3.5 font-semibold text-ink-100 transition hover:bg-ink-800 sm:w-auto"
          >
            <FileText className="h-5 w-5" />
            {t.ctaPaste}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-10 rounded-2xl border border-caution-500/30 bg-caution-500/5 p-4 text-center"
      >
        <p className="font-display text-2xl font-extrabold text-caution-300">{t.statLine}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex items-start gap-3 rounded-2xl border border-ink-800 bg-ink-900/60 p-4"
      >
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
        <p className="text-sm text-ink-400">{t.honestyNote}</p>
      </motion.div>
    </div>
  )
}
