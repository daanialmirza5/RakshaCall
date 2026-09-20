# RakshaCall

A privacy-first, client-only scam-call protection assistant designed to detect social-engineering tactics in real time and help users respond safely.

## Problem

India has seen a sharp rise in social-engineering phone scams that rely on psychological pressure rather than technical exploits:

- **"Digital arrest" scams** — a caller impersonates CBI/police, alleges a fabricated case, and pressures the victim to stay on video and transfer money to "clear their name."
- **Fake bank / fraud-prevention calls** — a caller claims suspicious activity on the victim's account and talks them into installing a remote-access app.
- **Courier / customs seizure scams** — a caller claims a parcel in the victim's name was seized and demands an urgent "clearance fee."
- **SIM deactivation scams** — a caller impersonating a telecom regulator threatens to block a SIM unless the victim shares OTP/PIN.
- **Investment / task scams** — a friendly "opportunity" escalates into a request for an upfront "refundable" deposit.

These scripts share a common structure: authority impersonation, urgency, threats, isolation ("don't hang up," "don't tell anyone"), and a request for money or credentials. By the time a victim recognizes the pattern, they're often already under pressure to act.

## Solution

RakshaCall analyzes a call's conversation — live simulated playback, a live microphone, or a pasted/typed transcript — and:

- Runs a **deterministic, local pattern-matching engine** across the transcript as it arrives
- Recognizes signals across **8 manipulation-tactic categories** (see below)
- Supports **English, Hinglish (romanized Hindi), Hindi (Devanagari), and Marathi**, including mixed-language conversation
- Produces a **risk score and level** (LOW/MEDIUM/HIGH) from how tactics *combine*, not from any single ambiguous phrase
- Shows a clear, **explainable warning** — exactly which tactics triggered it, in plain language
- Offers **immediate safety actions** (stop, don't share, disconnect, verify)
- Provides a **Get Help** hub with the official cybercrime helpline (1930), the National Cyber Crime Reporting Portal, and the Chakshu telecom-fraud reporting facility
- Lets the user **alert a trusted contact** with a message built from the actual detected tactics (a clearly-labeled demo/preview action — no message is actually transmitted)
- Generates a session-only **Incident Summary** (risk score, detected tactics, detection timeline) that can be copied or downloaded as plain text

## Key Innovation

1. **Privacy-first, client-only architecture** — the detection engine runs entirely in the browser
2. **No backend required** for the core product
3. **No external AI API** — detection is deterministic pattern matching, not an LLM call
4. **Deterministic and explainable** — the same input always produces the same result, and every warning shows its reasoning
5. **Real-time intervention** — risk is recalculated as each new line of conversation arrives, not after the fact
6. **Indian scam-pattern awareness** — signal patterns are modeled on documented "digital arrest," fake-bank, courier/customs, SIM-deactivation, and investment scam scripts
7. **Multilingual support** — English, Hinglish, Hindi, and Marathi, including mixed-language lines in the same conversation
8. **Action-oriented emergency response** — not just a warning, but a concrete next step (helpline, reporting channel, trusted contact, incident record)

## Architecture

```text
User / Call Simulation (live playback, microphone, or pasted transcript)
        ↓
Transcript / Speech Input
        ↓
Text Normalization (case, punctuation, whitespace, Unicode)
        ↓
Deterministic Detection Engine (regex-based signal matching)
        ↓
8 Scam Tactic Categories
  authority · urgency · threat · isolation · surveillance ·
  credential extraction · financial extraction · remote access
        ↓
Risk Scoring (category weights + co-occurrence bonus, capped 0–100)
        ↓
Warning / Explanation (score, level, matched tactics, immediate actions)
        ↓
Emergency Hub + Trusted Contact + Incident Summary
```

The entire pipeline above runs client-side in the browser. There is no application server and no external AI service in the request path for detection.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (build tool / dev server)
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Framer Motion** (UI animation)
- **lucide-react** (icons)
- **Web Speech API** — `SpeechRecognition` (microphone → text) and `SpeechSynthesis` (caller-voice playback), both native browser APIs
- **Vitest** + **@testing-library/react** (testing)
- **oxlint** (linting)

No backend framework, database, authentication system, or paid API is used anywhere in the stack.

## Privacy

- **No application backend.** There is no server that RakshaCall's own code talks to.
- **No application database.** Nothing is persisted beyond the current browser session/tab.
- **No external AI API.** Detection is a local, deterministic regex/scoring engine — not a call to an LLM or cloud model.
- **Session-only processing.** The Incident Summary is generated from, and only from, the current session's state; it is not uploaded anywhere.
- **Honest caveat on speech input:** the live-microphone feature uses the browser's native `SpeechRecognition` API. This is a *browser-controlled* capability — some browsers process speech on-device, while others (notably Chrome) may send audio to their own vendor servers to produce the transcript. RakshaCall itself never sends your voice or transcript anywhere; whatever transcript results (from either path) is analyzed entirely by the local detection engine. The app states this distinction directly in the UI rather than claiming "nothing ever leaves your device."
- **Fonts:** the page loads Google Fonts (Inter/Manrope/Noto Sans Devanagari) over HTTPS for typography. This transmits no user data — it's a standard static asset request, not part of the detection pipeline.

## Demo

Suggested judge flow (also the one used for the 2–3 minute walkthrough below):

```text
Landing Page
↓
Start Protection
↓
Instant Demo / Jump to Scam Trigger
↓
High Risk Warning
↓
View Tactics
↓
Get Help
↓
1930 / Reporting Options
↓
Incident Summary
↓
Copy / Download
```

### 2–3 minute walkthrough

**0:00–0:20 — Landing page**
> "RakshaCall is a privacy-first scam-call protection assistant designed to identify social-engineering tactics in real time without requiring a backend or external AI API."

**0:20–0:40 — Start Protection**
Select a scam scenario; briefly show the live transcript, call-progress timeline, and risk meter.

**0:40–1:10 — Jump to Scam Trigger**
Let detection escalate. Show the rising risk score, the detected-tactics list, and the HIGH RISK warning.
> "Instead of only saying this is a scam, RakshaCall explains the tactics being used — such as authority impersonation, urgency, threats, isolation, or credential extraction."

**1:10–1:35 — Get Help**
Open the emergency hub: the 1930 helpline, the official cybercrime reporting portal, and the Chakshu distinction.
> "The product doesn't pretend to submit a complaint. It guides the user to the appropriate official channel."

**1:35–2:00 — Incident Summary**
Open the summary: peak risk, detected tactics, detection timeline. Use Copy / Download.

**2:00–2:30 — Close**
> "The key idea is simple: detect the manipulation early, explain why it is risky, and give the user a safe next action — while keeping the core analysis client-side."

## Limitations

Be honest with judges about what this is and isn't:

- **Deterministic pattern-based detection**, not machine learning — it recognizes known phrasing patterns and their combinations, not arbitrary novel scam scripts.
- **Not a replacement for telecom/network-level protection.** RakshaCall analyzes conversation text; it does not intercept or block real phone calls.
- **Browser speech-recognition behavior varies by browser/vendor** (see Privacy, above).
- **Speech synthesis (caller voice) depends on the voices installed on the user's browser/device** — Hindi/Marathi voices may not be available everywhere, and the app falls back gracefully when they aren't.
- **Official government links (1930, cybercrime.gov.in, Chakshu/Sanchar Saathi) were verified at the time of writing** but are outside RakshaCall's control and could change.
- **The Incident Summary is a session-generated record, not a certified forensic or legally admissible report.**
- **Demo scenarios are fictional**, written to mirror publicly documented scam patterns — they are not real victim data.

## Future Scope

- On-device ML for more flexible, less pattern-brittle detection
- Better multilingual speech understanding (more Indian languages, code-switching robustness)
- Stronger typo/fuzzy matching for romanized-script variation
- Real-time mobile/OS-level call integration
- Telecom-level integration for real call interception (out of scope for a browser-only demo)
- Privacy-preserving on-device models as an alternative to pattern rules
- Personalized false-positive adaptation based on user feedback

*(These are directions, not commitments — none of the above is implemented in this build.)*

---

Built for HACKDAY 1.0 — Tech for a Better Tomorrow.
