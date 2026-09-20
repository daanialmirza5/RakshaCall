import type { Scenario } from '../types'

/**
 * Fictional demo scenarios written to mirror scam patterns that are widely
 * documented in Indian police cybercrime advisories and consumer-fraud
 * reporting (e.g. "digital arrest" impersonation calls, fake courier/customs
 * seizure calls, fake bank-KYC calls, fake SIM-deactivation notices, and
 * investment "task" scams). No real victim transcripts, names, or case
 * details were used — every line below is invented for demonstration only.
 */
export const SCAM_SCENARIOS: Scenario[] = [
  {
    id: 'digital-arrest',
    title: 'Fake "Digital Arrest" — CBI Impersonation',
    description:
      'A caller claims to be a CBI officer, alleges the victim\'s Aadhaar is linked to a crime, and keeps them isolated on video under threat of arrest.',
    category: 'digital-arrest',
    isScam: true,
    language: 'en',
    callerName: 'Unknown — "Officer A. Sharma"',
    lines: [
      { speaker: 'caller', text: 'Good afternoon. Am I speaking with the registered holder of this Aadhaar number?', delayMs: 500 },
      { speaker: 'user', text: 'Yes, speaking. Who is this?', delayMs: 2600 },
      { speaker: 'caller', text: 'I am calling from CBI cyber crime cell. This is a serious matter — an FIR has been registered against your Aadhaar number in a money laundering case.', delayMs: 3200 },
      { speaker: 'user', text: 'What? I haven\'t done anything wrong.', delayMs: 2600 },
      { speaker: 'caller', text: 'Sir, this is a non-bailable case and it is currently under investigation. You must not disconnect this call under any circumstance.', delayMs: 3000 },
      { speaker: 'caller', text: 'Also, this is a confidential investigation — do not tell anyone about this call, not even your family, until it is resolved.', delayMs: 3400 },
      { speaker: 'caller', text: 'Please turn on your video camera right now and keep it on so we can verify your identity and location for the investigation record.', delayMs: 3400 },
      { speaker: 'user', text: 'This is scary. What do I need to do?', delayMs: 2600 },
      { speaker: 'caller', text: 'To clear your name immediately, you must transfer your savings to a secure RBI verification account for 24 hours. It will be refunded once your case is closed.', delayMs: 3600 },
      { speaker: 'caller', text: 'You must do this within the next one hour, or a warrant will be issued and you will be arrested today.', delayMs: 3400 },
      { speaker: 'caller', text: 'Also read out the OTP that you are about to receive, it is required to open the verification account in your name.', delayMs: 3400 },
    ],
  },
  {
    id: 'fake-bank',
    title: 'Fake Bank Fraud-Alert Call',
    description:
      'Caller poses as a bank fraud-prevention officer and pressures the victim into installing a remote-access app "to secure" their account.',
    category: 'fake-bank',
    isScam: true,
    language: 'en',
    callerName: 'Unknown — "SBI Fraud Prevention"',
    lines: [
      { speaker: 'caller', text: 'Hello, this is the fraud prevention department calling about your bank account. We have detected suspicious activity just now.', delayMs: 500 },
      { speaker: 'user', text: 'Suspicious activity? I didn\'t do any transaction.', delayMs: 2600 },
      { speaker: 'caller', text: 'Exactly sir, that is why we suspect your account has a virus and someone is trying to access it right now. This is urgent.', delayMs: 3200 },
      { speaker: 'caller', text: 'To secure your account immediately, please install AnyDesk from the Play Store so our technical team can check it.', delayMs: 3400 },
      { speaker: 'user', text: 'Okay, installing it now.', delayMs: 2600 },
      { speaker: 'caller', text: 'Good. Now open the app and give me the 9-digit code shown on your screen so I can connect and fix the issue immediately.', delayMs: 3200 },
      { speaker: 'caller', text: 'Please don\'t disconnect the call while I am working on this, it may interrupt the fix and freeze your account.', delayMs: 3200 },
      { speaker: 'caller', text: 'Also share the OTP that will come now, it is needed to confirm the security patch on your account.', delayMs: 3200 },
    ],
  },
  {
    id: 'courier-customs',
    title: 'Fake Courier / Customs Seizure',
    description:
      'Caller claims a parcel in the victim\'s name was seized by customs and demands an urgent "fine" to release it.',
    category: 'courier-customs',
    isScam: true,
    language: 'en',
    callerName: 'Unknown — "FedEx / Customs Dept"',
    lines: [
      { speaker: 'caller', text: 'This is a courtesy call from the courier company. A parcel booked under your name and Aadhaar has been intercepted by customs.', delayMs: 500 },
      { speaker: 'user', text: 'I haven\'t ordered or sent any parcel.', delayMs: 2600 },
      { speaker: 'caller', text: 'Sir, the parcel contains restricted items and your ID proof was used, so this is being escalated to the cyber crime department right now.', delayMs: 3400 },
      { speaker: 'caller', text: 'To avoid legal action and a criminal case being filed against you, you need to pay a customs clearance fee immediately.', delayMs: 3400 },
      { speaker: 'caller', text: 'This must be done within the next 30 minutes or a warrant will be issued in your name. Please don\'t hang up, I am connecting you to my senior officer.', delayMs: 3600 },
      { speaker: 'caller', text: 'Please transfer the verification amount to the account number I am sending, and share the OTP to confirm the payment.', delayMs: 3400 },
    ],
  },
  {
    id: 'sim-deactivation',
    title: 'Fake SIM Deactivation Notice',
    description:
      'Caller claims to be from the telecom regulator and threatens SIM deactivation unless the victim shares personal/banking details.',
    category: 'sim-deactivation',
    isScam: true,
    language: 'en',
    callerName: 'Unknown — "TRAI Helpline"',
    lines: [
      { speaker: 'caller', text: 'This is an automated-style call from TRAI regarding your mobile number. Your SIM is being used for illegal activity.', delayMs: 500 },
      { speaker: 'user', text: 'That\'s not possible, I only use it myself.', delayMs: 2600 },
      { speaker: 'caller', text: 'Sir, we have a complaint registered and your SIM will be blocked within one hour unless you verify your identity immediately.', delayMs: 3400 },
      { speaker: 'caller', text: 'This is urgent — press 9 now to connect to an officer, or your number and linked bank account will be suspended today.', delayMs: 3400 },
      { speaker: 'caller', text: 'To verify, please share the OTP sent to your phone and your registered UPI PIN so we can confirm your identity in our system.', delayMs: 3400 },
    ],
  },
  {
    id: 'investment-task-scam',
    title: 'Fake Investment "Task" Scam',
    description:
      'Caller lures the victim into a too-good-to-be-true investment task scheme that starts friendly and escalates into a payment request.',
    category: 'investment',
    isScam: true,
    language: 'en',
    callerName: 'Unknown — "Wealth Growth Advisor"',
    lines: [
      { speaker: 'caller', text: 'Hi! I\'m calling about the part-time task opportunity you showed interest in — simple product-rating tasks, great daily returns.', delayMs: 500 },
      { speaker: 'user', text: 'Oh yes, I saw an ad for that. How does it work?', delayMs: 2600 },
      { speaker: 'caller', text: 'You just rate a few products daily from our app and we credit commission instantly. Many people are earning 5000 rupees a day already.', delayMs: 3400 },
      { speaker: 'user', text: 'That sounds great, how do I start?', delayMs: 2600 },
      { speaker: 'caller', text: 'To unlock the premium task set with higher returns, you first transfer a small refundable deposit — it comes back with your first payout, doubled.', delayMs: 3600 },
      { speaker: 'caller', text: 'This offer closes today only, so please transfer immediately to lock in the premium slot before it\'s given to someone else.', delayMs: 3400 },
    ],
  },
]

export const NORMAL_SCENARIOS: Scenario[] = [
  {
    id: 'courier-delivery',
    title: 'Genuine Courier Delivery Call',
    description: 'A real delivery agent confirming a scheduled drop-off. No pressure, no personal data requested.',
    category: 'normal',
    isScam: false,
    language: 'en',
    callerName: 'Delivery Partner — Rahul',
    lines: [
      { speaker: 'caller', text: 'Hi, this is Rahul from Bluedart. I have your package for delivery today.', delayMs: 500 },
      { speaker: 'user', text: 'Oh nice, what time will you reach?', delayMs: 2600 },
      { speaker: 'caller', text: 'Around 4 PM, is someone available at home to receive it?', delayMs: 2800 },
      { speaker: 'user', text: 'Yes, I\'ll be home. Thanks!', delayMs: 2400 },
      { speaker: 'caller', text: 'Great, see you then. Have a nice day!', delayMs: 2400 },
    ],
  },
  {
    id: 'telemarketing',
    title: 'Routine Telemarketing Call',
    description: 'A standard sales pitch — pushy but not a scam pattern, and easy to decline.',
    category: 'normal',
    isScam: false,
    language: 'en',
    callerName: 'Sales — Credit Card Offer',
    lines: [
      { speaker: 'caller', text: 'Good morning! We have a special pre-approved credit card offer for you with zero annual fee.', delayMs: 500 },
      { speaker: 'user', text: 'I\'m not interested right now, thanks.', delayMs: 2600 },
      { speaker: 'caller', text: 'No problem at all, would you like me to call back next month?', delayMs: 2800 },
      { speaker: 'user', text: 'Sure, that\'s fine.', delayMs: 2200 },
      { speaker: 'caller', text: 'Great, have a wonderful day.', delayMs: 2200 },
    ],
  },
  {
    id: 'genuine-kyc',
    title: 'Genuine Bank KYC Confirmation',
    description: 'A real bank call confirming a KYC update is complete — informational only, nothing requested.',
    category: 'normal',
    isScam: false,
    language: 'en',
    callerName: 'HDFC Bank — Customer Care',
    lines: [
      { speaker: 'caller', text: 'Hello, this is HDFC Bank calling to confirm your recent KYC document update has been processed successfully.', delayMs: 500 },
      { speaker: 'user', text: 'Oh great, thanks for letting me know.', delayMs: 2600 },
      { speaker: 'caller', text: 'You\'re welcome, no action is needed from your side. Is there anything else I can help you with?', delayMs: 2800 },
      { speaker: 'user', text: 'No, that\'s all. Thank you.', delayMs: 2200 },
      { speaker: 'caller', text: 'Thank you for banking with us, have a great day.', delayMs: 2200 },
    ],
  },
  {
    id: 'friend-chat',
    title: 'Friendly Personal Call',
    description: 'A casual conversation between friends — the baseline "nothing to see here" case.',
    category: 'normal',
    isScam: false,
    language: 'en',
    callerName: 'Priya (Contact)',
    lines: [
      { speaker: 'caller', text: 'Hey! Are we still on for dinner tonight?', delayMs: 500 },
      { speaker: 'user', text: 'Yes! Where should we go?', delayMs: 2400 },
      { speaker: 'caller', text: 'I was thinking that new place near the station, heard the food is great.', delayMs: 2800 },
      { speaker: 'user', text: 'Sounds perfect, see you at 8?', delayMs: 2400 },
      { speaker: 'caller', text: 'See you then!', delayMs: 2000 },
    ],
  },
]

export const ALL_SCENARIOS: Scenario[] = [...SCAM_SCENARIOS, ...NORMAL_SCENARIOS]
