import { motion } from 'framer-motion'
import {
  Bell,
  Copy,
  Download,
  Ear,
  FileText,
  Globe2,
  Languages,
  Lock,
  Mic,
  PhoneCall,
  PlayCircle,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Siren,
  TriangleAlert,
  Workflow,
} from 'lucide-react'
import { useState } from 'react'
import { useAppSettings } from '../i18n/LanguageContext'
import type { MatchedCategory } from '../lib/detectionEngine'
import type { View } from '../App'
import { CitizenActionHub } from './CitizenActionHub'
import { RiskMeter } from './RiskMeter'
import { TacticsList } from './TacticsList'

const PREVIEW_TACTICS: MatchedCategory[] = [
  { id: 'authority', weight: 15, matchedPhrases: ['cbi'] },
  { id: 'threat', weight: 18, matchedPhrases: ['arrest'] },
  { id: 'isolation', weight: 22, matchedPhrases: ['do not hang up'] },
  { id: 'financialExtraction', weight: 25, matchedPhrases: ['transfer money'] },
]

const STEPS = [
  { n: '01', Icon: Ear, title: 'Listen', body: 'Analyze the conversation as it unfolds — live call, microphone, or a pasted transcript.' },
  { n: '02', Icon: Radar, title: 'Detect', body: 'Identify suspicious social-engineering patterns across 8 manipulation categories.' },
  { n: '03', Icon: TriangleAlert, title: 'Warn', body: 'Explain the risk clearly — the real score and exactly which tactics were found.' },
  { n: '04', Icon: ShieldCheck, title: 'Protect', body: 'Provide immediate safety actions, official reporting channels, and a session summary.' },
]

const FEATURES = [
  {
    Icon: Radar,
    title: 'Scam Pattern Detection',
    body: 'Eight categories of manipulation signals — authority, urgency, threats, isolation, surveillance, credential extraction, financial extraction, and remote access.',
  },
  {
    Icon: ShieldAlert,
    title: 'Live Risk Intelligence',
    body: 'Risk evolves as the conversation progresses, based on how tactics stack together — never a single ambiguous phrase.',
  },
  {
    Icon: Languages,
    title: 'Multilingual Protection',
    body: 'Understands English, Hinglish, Hindi, and Marathi — including mixed-language conversation.',
  },
  {
    Icon: Mic,
    title: 'Voice Assistance',
    body: 'Optional caller-voice playback and microphone-based live analysis, entirely through your browser.',
  },
  {
    Icon: Siren,
    title: 'Emergency Response',
    body: 'One-tap access to the cybercrime helpline, official reporting channels, and a trusted-contact alert.',
  },
  {
    Icon: FileText,
    title: 'Incident Summary',
    body: 'A clear, copyable record of the risk score, detected tactics, and detection timeline for this session.',
  },
]

const TRUST_STRIP = [
  { Icon: Radar, title: 'Real-Time Detection', body: 'Identify suspicious patterns as conversations unfold.' },
  { Icon: TriangleAlert, title: 'Explainable Alerts', body: 'Understand exactly why RakshaCall intervened.' },
  { Icon: Globe2, title: 'Indian Scam Patterns', body: 'Modeled on common Indian social-engineering scripts, in four languages.' },
  { Icon: Lock, title: 'Privacy-First Architecture', body: 'Core detection runs locally — no backend required.' },
]

const PRIVACY_POINTS = [
  { Icon: Lock, title: 'Local Detection', body: 'RakshaCall\'s detection engine runs entirely in your browser — deterministic pattern matching, not a cloud model.' },
  { Icon: ShieldCheck, title: 'No Account Required', body: 'Every feature on this page works without signing up or creating a profile.' },
  { Icon: TriangleAlert, title: 'Explainable', body: 'Every warning shows exactly which detected tactics triggered it — never a black-box score.' },
  { Icon: FileText, title: 'Session-Based Summary', body: 'The incident summary is generated from this session only, and is never sent to a server.' },
]

export function Landing({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { strings } = useAppSettings()
  const t = strings.landing
  const [actionHubOpen, setActionHubOpen] = useState(false)

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(15,118,110,0.08), transparent)' }}
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {t.eyebrow}
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-extrabold tracking-tight text-ink-50 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-ink-300">{t.heroSubtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('picker')}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-600"
              >
                <PlayCircle className="h-5 w-5" aria-hidden />
                {t.ctaStart}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('picker')}
                className="flex items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-6 py-3.5 font-semibold text-ink-100 transition hover:bg-ink-800"
              >
                {t.ctaSecondary}
              </button>
            </div>
            <p className="mt-4 text-sm text-ink-500">{t.trustLine}</p>
          </motion.div>

          {/* Hero product preview — real components, example data, clearly a session snapshot. */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="mx-auto max-w-sm rounded-2xl border border-ink-700 bg-ink-900 p-5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-display text-sm font-bold text-ink-50">
                  <ShieldCheck className="h-4 w-4 text-brand-400" aria-hidden />
                  RakshaCall
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-safe-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-safe-500" />
                  Protection Active
                </span>
              </div>
              <RiskMeter score={71} level="HIGH" />
              <div className="mt-3">
                <TacticsList matched={PREVIEW_TACTICS} />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-500">Example session preview — not a live call.</p>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {TRUST_STRIP.map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-display font-bold text-ink-50">{title}</p>
                <p className="mt-0.5 text-sm text-ink-400">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">How RakshaCall protects you</h2>
          <p className="mt-3 text-ink-400">From the first suspicious line to a clear next step.</p>
        </div>
        <div className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink-700 lg:block" aria-hidden />
          {STEPS.map(({ n, Icon, title, body }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ink-700 bg-ink-900 text-brand-500">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-4 text-xs font-bold tracking-wide text-ink-500">{n}</p>
              <p className="mt-1 font-display text-lg font-bold text-ink-50">{title}</p>
              <p className="mt-1.5 text-sm text-ink-400">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="protection" className="border-t border-ink-800 bg-ink-900/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
              Protection that understands the conversation
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-ink-700 bg-ink-900 p-6 transition hover:border-brand-400/40 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-4 font-display font-bold text-ink-50">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO PREVIEW */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">See RakshaCall in action</h2>
            <p className="mt-3 max-w-md text-ink-400">
              A simulated call reaches a point where multiple high-risk patterns appear together — RakshaCall explains exactly why it intervened.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('picker')}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-500 hover:text-brand-600"
            >
              {t.ctaSecondary}
              <span aria-hidden>→</span>
            </button>
          </div>
          <div className="rounded-2xl border border-danger-500/30 bg-ink-900 p-5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-display font-bold text-danger-300">
                <ShieldAlert className="h-4 w-4" aria-hidden />
                High Risk
              </span>
              <span className="font-display text-2xl font-extrabold text-danger-300">71/100</span>
            </div>
            <p className="mt-1 text-sm font-medium text-ink-400">4 indicators detected</p>
            <ul className="mt-4 space-y-1.5">
              {['Authority', 'Threat', 'Isolation', 'Financial demand'].map((tag) => (
                <li key={tag} className="flex items-center gap-2 text-sm text-ink-200">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger-400" />
                  {tag}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-ink-800/60 p-3 text-xs text-ink-400">
              RakshaCall intervened because multiple high-risk patterns appeared together.
            </p>
          </div>
        </div>
      </section>

      {/* LIVE RUNTIME WORKFLOW */}
      <section className="border-t border-ink-800 bg-ink-900/40 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-400">
            <Workflow className="h-3.5 w-3.5" aria-hidden />
            Client-side runtime · No backend telemetry
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
            See RakshaCall think in real time
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-400">
            Watch the same client-side runtime that powers RakshaCall process a suspicious call from transcript to
            detection, risk assessment, and user protection — every node reflects a real function call, not an animation.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('architecture')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-5 py-3 font-semibold text-ink-100 transition hover:bg-ink-800"
          >
            <Workflow className="h-4 w-4" aria-hidden />
            View Runtime Observatory
          </button>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="border-t border-ink-800 bg-ink-900/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
              Protection without unnecessary data collection.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVACY_POINTS.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
                <Icon className="h-5 w-5 text-brand-400" aria-hidden />
                <p className="mt-3 font-display font-bold text-ink-50">{title}</p>
                <p className="mt-1.5 text-sm text-ink-400">{body}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-500">{t.honestyNote}</p>
        </div>
      </section>

      {/* EMERGENCY RESPONSE */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
            When every second matters, know what to do.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: TriangleAlert, title: 'Stop', body: 'End the suspicious interaction.' },
            { Icon: Lock, title: "Don't Share", body: 'Protect credentials and financial information.' },
            { Icon: PhoneCall, title: 'Get Help', body: 'Call 1930 — the cybercrime helpline.' },
            { Icon: Bell, title: 'Report', body: 'Use official reporting channels.' },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-ink-700 bg-ink-900 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-danger-500/10 text-danger-400">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-3 font-display font-bold text-ink-50">{title}</p>
              <p className="mt-1 text-sm text-ink-400">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setActionHubOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-5 py-3 font-semibold text-ink-100 transition hover:bg-ink-800"
          >
            <Siren className="h-4 w-4" aria-hidden />
            View Protection Guide
          </button>
        </div>
      </section>

      {/* INCIDENT SUMMARY PREVIEW */}
      <section className="border-t border-ink-800 bg-ink-900/40 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5 font-mono text-xs shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)]">
              <p className="font-display font-bold text-ink-50">Incident Summary</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-display text-xl font-extrabold text-danger-300">HIGH RISK</span>
                <span className="font-display text-xl font-extrabold text-ink-50">71/100</span>
              </div>
              <p className="mt-1 text-ink-500">4 tactics detected</p>
              <hr className="my-3 border-ink-700" />
              <p className="text-ink-500">Detection timeline</p>
              <ul className="mt-1 space-y-0.5 text-ink-300">
                <li>14:32 Authority</li>
                <li>14:33 Threat</li>
                <li>14:34 Financial demand</li>
                <li className="text-danger-300">14:34 HIGH RISK</li>
              </ul>
              <div className="mt-4 flex gap-2">
                <span className="flex items-center gap-1 rounded-lg border border-ink-600 px-2.5 py-1.5 text-ink-300">
                  <Copy className="h-3 w-3" aria-hidden /> Copy Summary
                </span>
                <span className="flex items-center gap-1 rounded-lg border border-ink-600 px-2.5 py-1.5 text-ink-300">
                  <Download className="h-3 w-3" aria-hidden /> Download
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-500 lg:text-left">Illustrative preview — a real summary is built from your actual session.</p>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
              Every alert comes with an explanation.
            </h2>
            <p className="mt-3 max-w-md text-ink-400">
              Risk score, detected tactics, and a detection timeline — copyable or downloadable, generated only from your current session.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
          Don't let pressure make the decision for you.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-400">
          Let RakshaCall help you recognize the warning signs and take the next safe step.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate('picker')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition hover:bg-brand-600 sm:w-auto"
          >
            <PlayCircle className="h-5 w-5" aria-hidden />
            {t.ctaStart}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('paste')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-6 py-3.5 font-semibold text-ink-100 transition hover:bg-ink-800 sm:w-auto"
          >
            <FileText className="h-5 w-5" aria-hidden />
            {t.ctaPaste}
          </button>
        </div>
      </section>

      <CitizenActionHub open={actionHubOpen} onClose={() => setActionHubOpen(false)} />
    </div>
  )
}
