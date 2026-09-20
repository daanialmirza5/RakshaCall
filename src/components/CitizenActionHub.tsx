import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Phone, ShieldAlert, ShieldX, X } from 'lucide-react'
import { useEffect } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'

const CYBERCRIME_HELPLINE_TEL = 'tel:1930'
const CYBERCRIME_PORTAL_URL = 'https://cybercrime.gov.in/'
const CHAKSHU_PORTAL_URL = 'https://sancharsaathi.gov.in/sfc/'

/**
 * Emergency / citizen-action guidance: the official cybercrime helpline,
 * reporting portals, and a concise do/don't checklist. Every external
 * destination here is a real, verified Government of India channel — this
 * component only links out to them, it never submits anything on the
 * user's behalf and never claims an action (like a report) was filed.
 */
export function CitizenActionHub({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { strings } = useAppSettings()
  const t = strings.actionHub

  // A JSX onKeyDown on the dialog only fires while focus is inside it, which isn't
  // guaranteed — a document-level listener is what makes Escape-to-close reliable.
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl border border-ink-700 bg-ink-900 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ink-800 p-5">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-100">{t.title}</h2>
                <p className="text-sm text-ink-300">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100"
                aria-label={t.close}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="rounded-2xl border border-danger-500/30 bg-danger-500/10 p-4">
                <div className="flex items-center gap-2 text-danger-300">
                  <Phone className="h-4 w-4" aria-hidden />
                  <h3 className="font-display font-bold">{t.helplineTitle}</h3>
                </div>
                <p className="mt-1.5 text-sm text-ink-200">{t.helplineDescription}</p>
                <a
                  href={CYBERCRIME_HELPLINE_TEL}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-danger-500 px-4 py-3 font-bold text-white transition hover:bg-danger-600"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {t.callButton}
                </a>
                <p className="mt-1.5 text-center text-xs text-ink-500">{t.callHint}</p>
              </div>

              <div className="mt-4 rounded-2xl border border-ink-700 bg-ink-800/50 p-4">
                <h3 className="font-display font-bold text-ink-100">{t.reportingTitle}</h3>
                <p className="mt-1.5 text-sm text-ink-300">{t.reportingDescription}</p>
                <a
                  href={CYBERCRIME_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-700"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  {t.reportingButton}
                </a>
              </div>

              <div className="mt-4 rounded-2xl border border-ink-700 bg-ink-800/50 p-4">
                <h3 className="font-display font-bold text-ink-100">{t.chakshuTitle}</h3>
                <p className="mt-1.5 text-sm text-ink-300">{t.chakshuDescription}</p>
                <a
                  href={CHAKSHU_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-700"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  {t.chakshuButton}
                </a>
                <p className="mt-2 text-xs text-ink-500">{t.chakshuDistinction}</p>
              </div>

              <div className="mt-4 rounded-2xl border border-safe-500/30 bg-safe-500/5 p-4">
                <div className="flex items-center gap-2 text-safe-400">
                  <ShieldAlert className="h-4 w-4" aria-hidden />
                  <h3 className="font-display font-bold text-ink-100">{t.whatToDoTitle}</h3>
                </div>
                <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm text-ink-200">
                  {t.whatToDoSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 rounded-2xl border border-caution-500/30 bg-caution-500/5 p-4">
                <div className="flex items-center gap-2 text-caution-400">
                  <ShieldX className="h-4 w-4" aria-hidden />
                  <h3 className="font-display font-bold text-ink-100">{t.whatNotToDoTitle}</h3>
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-200">
                  {t.whatNotToDoItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-caution-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-center text-xs text-ink-500">{t.officialChannelNote}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
