import { AnimatePresence, motion } from 'framer-motion'
import {
  Banknote,
  Eye,
  KeyRound,
  Landmark,
  MonitorSmartphone,
  ShieldOff,
  Timer,
  UserX,
} from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { SignalCategoryId } from '../data/signals'
import type { MatchedCategory } from '../lib/detectionEngine'

const CATEGORY_ICONS: Record<SignalCategoryId, typeof Banknote> = {
  authority: Landmark,
  urgency: Timer,
  threat: ShieldOff,
  isolation: UserX,
  surveillance: Eye,
  credentialExtraction: KeyRound,
  financialExtraction: Banknote,
  remoteAccess: MonitorSmartphone,
}

export function TacticsList({ matched }: { matched: MatchedCategory[] }) {
  const { strings } = useAppSettings()

  if (matched.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-700 bg-ink-900/40 p-5 text-sm text-ink-300">
        {strings.callScreen.noTacticsYet}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-5">
      <h3 className="mb-3 text-sm font-medium text-ink-300">{strings.callScreen.detectedTacticsLabel}</h3>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {matched.map((m) => {
            const Icon = CATEGORY_ICONS[m.id]
            const copy = strings.categories[m.id]
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl bg-ink-800/70 p-3"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-danger-400" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink-100">{copy.label}</p>
                  <p className="text-xs text-ink-300">{copy.hint}</p>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}
