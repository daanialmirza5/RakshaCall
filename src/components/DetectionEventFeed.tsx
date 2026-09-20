import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { SignalCategoryId } from '../data/signals'
import type { MatchedCategory } from '../lib/detectionEngine'

const TOAST_LIFETIME_MS = 3000

interface Toast {
  key: string
  categoryId: SignalCategoryId
}

/**
 * Transient "+ Authority impersonation detected" toasts for newly-matched
 * tactics. Diffs against a ref of previously-seen category ids so a tactic
 * that keeps re-matching across multiple lines (e.g. several money-transfer
 * demands) only ever announces once per play-through — `resetSignal`
 * (the playback hook's `playId`) clears that history on restart/instant-demo.
 */
export function DetectionEventFeed({ matched, resetSignal }: { matched: MatchedCategory[]; resetSignal: number }) {
  const { strings } = useAppSettings()
  const [toasts, setToasts] = useState<Toast[]>([])
  const seenRef = useRef<Set<SignalCategoryId>>(new Set())
  const timersRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    seenRef.current = new Set()
    setToasts([])
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current.clear()
  }, [resetSignal])

  useEffect(() => {
    const newlyMatched = matched.filter((m) => !seenRef.current.has(m.id))
    if (newlyMatched.length === 0) return

    const additions: Toast[] = newlyMatched.map((m) => {
      seenRef.current.add(m.id)
      return { key: `${resetSignal}-${m.id}`, categoryId: m.id }
    })
    setToasts((prev) => [...prev, ...additions])

    additions.forEach((toast) => {
      const timeoutId = window.setTimeout(() => {
        timersRef.current.delete(toast.key)
        setToasts((prev) => prev.filter((t) => t.key !== toast.key))
      }, TOAST_LIFETIME_MS)
      timersRef.current.set(toast.key, timeoutId)
    })
    // resetSignal deliberately excluded: it's only read for keying, handled by the effect above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return (
    <div aria-live="polite" className="pointer-events-none flex flex-col gap-1.5">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="w-fit rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-1.5 text-xs font-semibold text-danger-300"
          >
            + {strings.callScreen.newDetection.replace('{tactic}', strings.categories[toast.categoryId].label)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
