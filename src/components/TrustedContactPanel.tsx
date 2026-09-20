import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Send, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'

export function TrustedContactPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { strings } = useAppSettings()
  const [sent, setSent] = useState(false)
  const t = strings.trustedContact

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/70 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onClose()
            setSent(false)
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="w-full max-w-sm rounded-3xl border border-ink-700 bg-ink-900 p-6 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-100">{t.title}</h2>
                <p className="text-sm text-ink-300">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  setSent(false)
                }}
                className="rounded-full p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!sent ? (
              <>
                <div className="flex items-center gap-3 rounded-2xl bg-ink-800 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-100">{t.contactName}</p>
                    <p className="truncate text-sm text-ink-300">"{t.messagePreview}"</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSent(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-ink-950 transition hover:bg-brand-400"
                >
                  <Send className="h-4 w-4" />
                  {t.alertButton}
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2 rounded-2xl bg-safe-500/10 p-6 text-center"
              >
                <CheckCircle2 className="h-10 w-10 text-safe-400" />
                <p className="font-display font-bold text-ink-100">{t.alertSentTitle}</p>
                <p className="text-sm text-ink-300">{t.alertSentBody}</p>
              </motion.div>
            )}

            <p className="mt-4 text-center text-xs text-ink-500">{t.simulatedLabel}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
