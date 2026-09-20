# RakshaCall

**Real-time scam-call protection assistant.** Built for **HACKDAY 1.0 — Tech for a Better Tomorrow**.

> Protects a person *while* a scam call is happening — not only after the money has already moved.

## Problem

"Digital arrest" and other impersonation scams (fake CBI/police, fake bank fraud alerts, fake customs/courier seizures, fake SIM-deactivation notices) manipulate victims in real time — using authority impersonation, urgency, threats, isolation ("don't hang up, don't tell anyone"), forced video surveillance, and requests for OTPs or money transfers. Every existing defense (bank fraud monitoring, telecom SIM-binding, RBI risk indicators) acts *after* the fact. Nothing protects the person *during* the manipulation.

## Solution

RakshaCall analyzes a call's conversation as it happens and surfaces a clear, plain-language warning — with detected tactics, a recommended action, and a one-tap "alert a trusted contact" option — the moment it recognizes a known scam pattern.

## How It Works

```
Caller speech (simulated stream / pasted transcript / browser mic)
        │
        ▼
Local, deterministic pattern-matching engine (8 scam-signal categories)
        │
        ▼
Weighted risk score (0–100) + co-occurrence bonus for stacked tactics
        │
        ▼
Risk level: LOW / MEDIUM / HIGH  ──▶  Live risk meter + detected-tactics list
        │
        ▼
HIGH risk ──▶ full-screen plain-language warning + recommended action
        │
        ▼
One-tap "Alert a trusted contact" (simulated preview)
```

## Key Features

- **Live simulated-call demo** — five realistic scam scenarios (digital arrest, fake bank, courier/customs, SIM deactivation, investment scam) stream in as a real conversation, with the risk meter and detected-tactics list updating live as each line arrives.
- **Paste/type or speak a transcript** — analyze any text instantly, or use your browser's microphone (Web Speech API, where supported) to dictate live.
- **Plain-language, two-second warnings** — no jargon, no raw scores shown to the user, just a clear verdict and what to do.
- **Vernacular support** — English, Hindi, and Marathi, fully translated UI and warnings, not just labels.
- **Accessibility-first UI** — large-text mode, high-contrast color system, icon-led warnings, big touch targets, calm (not panic-inducing) escalation for MEDIUM risk.
- **Simulated trusted-contact alert** — composes and "sends" a check-in message, clearly labeled as simulated.
- **Normal-call scenarios included** — proves the system doesn't cry wolf on ordinary calls (courier confirmation, telemarketing, genuine bank KYC, a friendly chat).

## Detection System

The engine (`src/lib/detectionEngine.ts` + `src/data/signals.ts`) is a **fully local, deterministic, rule-based classifier** — chosen deliberately over a hosted/paid LLM:

- **Zero cost, zero setup, zero external dependency** — no API key, no network call, no rate limit, and it cannot fail due to an outage during a live demo.
- **Sub-millisecond, always-available** — the "AI must work without internet" constraint is satisfied by construction, not by a fallback path bolted on afterward.
- **Explainable** — every verdict traces to specific matched phrases, which is what lets the UI show "why" in plain language instead of an opaque score.

**Eight scam-signal categories**, each with its own weight and phrase library: authority impersonation, urgency, threats, isolation tactics, surveillance/video demands, credential extraction (OTP/PIN/password), financial extraction (transfers/fees), and remote-access-app requests. Scores combine category weights with a **co-occurrence bonus** — because real scams work by *stacking* tactics in one call, and that combination is a stronger signal than any single phrase (which keeps a single ambiguous word like "urgent" from tripping a false HIGH alert).

This was scoped as the strongest reliable option for an 8-hour, zero-cost build. A production version could add a hosted or on-device NLP model as an optional *enhancement* layer on top of this deterministic core (see Future Scope) — never as a replacement for it, since the local engine is what guarantees the product still works with no internet and no paid account.

## Technology

| Layer | Choice | Why it's free |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Open source, no account needed |
| Styling | Tailwind CSS v4 | Open source |
| Animation | Framer Motion | Open source |
| Icons | Lucide | Open source |
| Detection | Local TypeScript rules engine | Runs entirely in the browser, no API |
| Speech input | Browser-native Web Speech API | Built into Chromium browsers, no key, no signup |
| State | In-memory React state + `localStorage` (language/text-size preference only) | No database needed for a single-session demo |
| Testing | Vitest (unit) + manual/automated browser smoke testing | Open source |
| Hosting | GitHub Pages via GitHub Actions | Free static hosting tied to the repo, no card |

**No paid API, no credit card, no signup is required to run or deploy this project.**

## Demo

1. Open the app (see **Running Locally** or the deployed URL below).
2. Click **"Try the Live Demo"** → pick a scam scenario (e.g. *Fake "Digital Arrest" — CBI Impersonation*).
3. Watch the transcript stream in like a real call — the risk meter climbs and detected tactics appear live.
4. When risk hits HIGH, a full-screen warning explains what was detected and what to do, with a one-tap simulated "Alert a trusted contact" action.
5. Try a **normal-call scenario** to see the system correctly stay calm/green.
6. Or go to **"Analyze Transcript"** and paste/type/speak any text for instant analysis.

## Setup

```bash
git clone <this-repo-url>
cd RakshaCall-
npm install
```

No environment variables are required — see `.env.example` for the (unused, optional) extension point.

## Running Locally

```bash
npm run dev        # start the dev server (prints a local URL)
npm run test:run   # run the detection-engine unit tests
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Deployment

Deployed via **GitHub Pages** using the included GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds and publishes on every push to `main` — genuinely free, no billing, no credit card.

**One-time setup** (repo owner, via the GitHub UI): *Settings → Pages → Source → GitHub Actions*. Once set, the workflow deploys automatically.

Public URL once enabled: `https://daanialmirza5.github.io/RakshaCall/`

## Privacy

- Conversation/transcript text is processed **entirely client-side**, in the browser — nothing is sent to a server or third party.
- No account, login, or personal data collection.
- `localStorage` is used only for two harmless preferences (selected language, large-text toggle) — never for conversation content.
- The "trusted contact alert" is a simulated preview; no message is actually transmitted anywhere.

## Limitations

This is an honest hackathon MVP, not a production security product:

- **No real telecom/call interception.** This does not tap into GSM/VoIP calls. Input is a simulated transcript stream, a pasted/typed transcript, or your own browser microphone reading a script aloud — never someone else's live phone call.
- **No consent/wiretap infrastructure.** A production version needs an explicit call-recording/consent flow and would likely integrate at the OS call-screening layer (e.g. Android `CallScreeningService`) rather than assume raw audio access.
- **Detection is deterministic pattern-matching**, not a trained ML/LLM classifier — it catches known phrasings and their common variants well, but a sufficiently novel paraphrase could evade it (see Future Scope).
- **The trusted-contact alert is simulated** — no real SMS/push is sent (avoiding any paid SMS provider was a hard constraint for this build).
- **Speech-to-text (Web Speech API) is browser-dependent** — supported in Chromium-based browsers, not in Firefox or most non-Chromium browsers, so it's offered as an optional input path alongside typed/pasted text, never a required one.
- **No accuracy claims are made.** Detection is demonstrated against a written test suite of realistic scam and normal transcripts (`src/lib/detectionEngine.test.ts`), not validated against real-world call data, which does not exist for this project and should not be fabricated.

## Future Scope

- OS-level call-screening integration (Android `CallScreeningService` / iOS equivalent) for genuine on-device call analysis under explicit user consent.
- An optional, opt-in on-device or hosted NLP/LLM layer to catch paraphrased scam language the deterministic engine misses, layered *on top of* the local engine rather than replacing it, so the product keeps working offline and free.
- Real trusted-contact delivery (SMS/push) via a consented, properly authenticated channel.
- Telecom, bank, and family-safety-app integrations for broader reach — not implemented or claimed today.
- A larger, community-sourced (and appropriately anonymized) scam-pattern library, and more Indian languages.

---

Built solo/small-team in ~8 hours for HACKDAY 1.0, using only free, no-credit-card-required tools throughout.
