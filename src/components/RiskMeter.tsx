import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { RiskLevel } from '../data/signals'

const LEVEL_STYLES: Record<RiskLevel, { bar: string; text: string; ring: string; Icon: typeof ShieldCheck }> = {
  LOW: { bar: 'bg-safe-500', text: 'text-safe-400', ring: 'ring-safe-500/40', Icon: ShieldCheck },
  MEDIUM: { bar: 'bg-caution-500', text: 'text-caution-400', ring: 'ring-caution-500/40', Icon: ShieldQuestion },
  HIGH: { bar: 'bg-danger-500', text: 'text-danger-400', ring: 'ring-danger-500/40', Icon: ShieldAlert },
}

export function RiskMeter({ score, level }: { score: number; level: RiskLevel }) {
  const { strings } = useAppSettings()
  const style = LEVEL_STYLES[level]
  const Icon = style.Icon

  return (
    <div className={`rounded-2xl border border-ink-700 bg-ink-900/60 p-5 ring-1 ${style.ring} transition-colors duration-500`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${style.text}`} aria-hidden />
          <span className="text-sm font-medium text-ink-300">{strings.callScreen.riskLevelLabel}</span>
        </div>
        <span className={`font-display text-lg font-bold ${style.text}`}>{strings.risk[level]}</span>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-ink-800">
        <motion.div
          className={`h-full rounded-full ${style.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>

      <p className={`mt-2 text-sm ${style.text}`}>{strings.riskSubtext[level]}</p>
    </div>
  )
}
