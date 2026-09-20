/**
 * Scam-signal definitions for the RakshaCall detection engine.
 *
 * Each category models one real-world social-engineering tactic documented in
 * Indian "digital arrest" / impersonation-scam advisories (police cybercrime
 * units, PIB fact-checks, RBI/bank consumer-awareness bulletins). Patterns
 * match case-insensitively against the caller's spoken/typed lines, after
 * they've been run through `normalizeForDetection()` in detectionEngine.ts.
 *
 * RakshaCall targets Indian callers, so each category covers the same tactic
 * across the languages that tactic is actually spoken in on real scam calls:
 *
 *   - English (plain `\b...\b` regexes)
 *   - Hinglish / romanized Hindi & Marathi (plain `\b...\b` regexes, Latin
 *     script, with a few common spelling variants)
 *   - Hindi (Devanagari, built with `wb()` from patternUtils since `\b`
 *     does not bound Devanagari script correctly)
 *   - Marathi (Devanagari, `wb()` as above; Marathi-specific vocabulary
 *     where it differs from Hindi, e.g. "पाठवा" vs "भेजो" for "send")
 *
 * Weights are severity, not frequency: a single "remote access" request is a
 * near-certain scam signal, while "urgency" language alone is common in many
 * legitimate calls too, so it carries less weight on its own. Patterns that
 * are generic enough to appear in ordinary conversation (e.g. "police",
 * "bank account") are deliberately scoped to the specific phrasing/verb
 * combination a scammer actually uses, rather than the bare noun, so a
 * one-off mention doesn't inflate the score — see detectionEngine.ts for how
 * co-occurrence across categories (not any single phrase) drives risk.
 */

import { altLiteral, wb } from '../lib/patternUtils'

export type SignalCategoryId =
  | 'authority'
  | 'urgency'
  | 'threat'
  | 'isolation'
  | 'surveillance'
  | 'credentialExtraction'
  | 'financialExtraction'
  | 'remoteAccess'

export interface SignalCategory {
  id: SignalCategoryId
  weight: number
  patterns: RegExp[]
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  {
    id: 'authority',
    weight: 15,
    patterns: [
      // English
      /\bcbi\b/i,
      /\brbi\b/i,
      /\btrai\b/i,
      /\bcustoms?\b/i,
      /\bcyber ?crime\b/i,
      /\bnarcotics?\b/i,
      /\b(police|inspector|constable)\b/i,
      /\bgovernment officer\b/i,
      /\binvestigation (department|officer|team)\b/i,
      /\b(fir|first information report)\b/i,
      /\bsupreme court\b/i,
      /\baadhaar (card )?(is )?link(ed)?\b/i,
      /\bmy (badge|officer id) number\b/i,
      // Hinglish / romanized
      /\bpolis\b/i,
      /\bthana\b/i,
      /\bpolice station\b/i,
      /\bcrime branch\b/i,
      /\bsarkari (adhikari|afsar)\b/i,
      /\bjaanch adhikari\b/i,
      // Hindi
      wb(altLiteral(['सीबीआई', 'आरबीआई', 'ट्राई', 'पुलिस', 'थाना', 'पुलिस स्टेशन', 'साइबर सेल', 'साइबर क्राइम', 'अपराध शाखा', 'अधिकारी', 'जांच अधिकारी', 'सरकारी अधिकारी', 'कस्टम विभाग', 'इनकम टैक्स विभाग'])),
      // Marathi
      wb(altLiteral(['सीबीआय', 'पोलीस', 'पोलीस स्टेशन', 'सायबर सेल', 'सायबर गुन्हे शाखा', 'चौकशी अधिकारी'])),
    ],
  },
  {
    id: 'urgency',
    weight: 12,
    patterns: [
      // English
      /\bimmediately\b/i,
      /\bright now\b/i,
      /\bwithin (the )?(next )?(one |1 |\d+ )?(hour|minute|min)s?\b/i,
      /\bas soon as possible\b/i,
      /\bbefore it('?s| is) too late\b/i,
      /\blast (chance|warning)\b/i,
      /\bdo it now\b/i,
      /\burgent(ly)?\b/i,
      // Hinglish / romanized
      /\babhi\b/i,
      /\bturant\b/i,
      /\bjaldi\b/i,
      /\bek ghante ke andar\b/i,
      /\baakhri (mauka|chance|chetavani)\b/i,
      // Hindi
      wb(altLiteral(['अभी', 'तुरंत', 'जल्दी', 'एक घंटे के अंदर', 'आखिरी मौका', 'आखिरी चेतावनी'])),
      // Marathi
      wb(altLiteral(['लगेच', 'ताबडतोब', 'झटपट', 'एका तासाच्या आत', 'शेवटची संधी', 'शेवटचा इशारा'])),
    ],
  },
  {
    id: 'threat',
    weight: 18,
    patterns: [
      // English
      /\barrest(ed)?\b/i,
      /\bwarrant\b/i,
      /\bjail\b/i,
      /\bcriminal case\b/i,
      /\blegal action\b/i,
      /\baccount (will be )?(frozen|blocked|suspended)\b/i,
      /\bdigital arrest\b/i,
      /\bnon[- ]?bailable\b/i,
      /\bconfiscat(e|ed|ion)\b/i,
      /\bmoney laundering\b/i,
      /\bcase (has been )?(filed|registered) against you\b/i,
      // Hinglish / romanized
      wb(altLiteral(['giraftar', 'giraftaar', 'girftar', 'girftaar', 'gireftar'])),
      /\barrest ho jaoge\b/i,
      /\bjail ho jayegi\b/i,
      /\bfir darj\b/i,
      /\bcase darj\b/i,
      /\bkhata (block|seal|band|freeze)\b/i,
      // Hindi
      wb(altLiteral(['गिरफ्तार', 'गिरफ्तारी', 'गिरफ्तार कर लिया जाएगा', 'वारंट', 'जेल', 'एफआईआर', 'केस दर्ज', 'मुकदमा दर्ज', 'गैर जमानती', 'गैर-जमानती', 'जब्त', 'खाता ब्लॉक', 'खाता सील', 'खाता जब्त'])),
      // Marathi
      wb(altLiteral(['अटक', 'अटक केली जाईल', 'तुरुंग', 'वॉरंट', 'एफआयआर', 'गुन्हा दाखल', 'जामीन न मिळणारा', 'जप्त', 'खाते गोठवले जाईल', 'खाते सील'])),
    ],
  },
  {
    id: 'isolation',
    weight: 22,
    patterns: [
      // English
      /\b(don'?t|do not|must not|should not|never) (tell|inform|call|contact) (anyone|any ?one|your family|your husband|your wife|your children|your son|your daughter)\b/i,
      /\b(don'?t|do not|must not|should not) (hang up|disconnect|cut the call)\b/i,
      /\bstay on (the )?(call|line)\b/i,
      /\bkeep this confidential\b/i,
      /\bthis is (strictly )?(private|confidential)\b/i,
      /\bdo not discuss (this )?with (anyone|anybody)\b/i,
      /\bit'?s a secret (investigation|matter)\b/i,
      // Hinglish / romanized
      /\bkisi ko mat batana\b/i,
      /\bkisi ko mat batao\b/i,
      /\bfamily ko mat batao\b/i,
      /\bcall mat kaatna\b/i,
      /\bphone mat kaato\b/i,
      /\bchup raho\b/i,
      /\bkisi se baat mat karo\b/i,
      /\byeh gopniya hai\b/i,
      // Hindi
      wb(altLiteral(['किसी को मत बताना', 'किसी को मत बताओ', 'परिवार को मत बताना', 'कॉल मत काटना', 'फोन मत काटो', 'चुप रहो', 'किसी से बात मत करो', 'यह गोपनीय है'])),
      // Marathi
      wb(altLiteral(['कोणालाही सांगू नका', 'कुटुंबाला सांगू नका', 'कॉल बंद करू नका', 'फोन बंद करू नका', 'गप्प रहा', 'कोणाशीही बोलू नका', 'हे गुप्त आहे'])),
    ],
  },
  {
    id: 'surveillance',
    weight: 20,
    patterns: [
      // English
      /\bkeep (your )?(camera|video) on\b/i,
      /\bdon'?t (switch off|turn off) (the )?(camera|video)\b/i,
      /\bshow (me|us) your (surroundings|room|house)\b/i,
      /\bshare your screen\b/i,
      /\bturn on (your )?(video|camera)\b/i,
      /\bstay visible\b/i,
      // Hinglish / romanized
      /\bcamera on rakho\b/i,
      /\bcamera on rakhna\b/i,
      /\bvideo (call )?chalu rakho\b/i,
      /\bscreen ?share(?: (karo|karke dikhao))?\b/i,
      /\bscreen sher\b/i,
      /\bapni screen dikhao\b/i,
      // Hindi
      wb(altLiteral(['कैमरा ऑन रखो', 'कैमरा चालू रखो', 'वीडियो चालू रखो', 'वीडियो कॉल चालू रखो', 'स्क्रीन शेयर करो', 'अपनी स्क्रीन दिखाओ'])),
      // Marathi
      wb(altLiteral(['कॅमेरा सुरू ठेवा', 'व्हिडिओ सुरू ठेवा', 'व्हिडिओ कॉल सुरू ठेवा', 'स्क्रीन शेअर करा', 'तुमची स्क्रीन दाखवा'])),
    ],
  },
  {
    id: 'credentialExtraction',
    weight: 25,
    patterns: [
      // English
      /\botp\b/i,
      /\b(pin|upi pin|atm pin)\b/i,
      /\bpassword\b/i,
      /\bverification code\b/i,
      /\bcvv\b/i,
      /\bshare the code\b/i,
      /\bread (out|me) the (otp|code|number)\b/i,
      // Hinglish / romanized (includes the common "otipi" misspelling of OTP)
      /\botipi\b/i,
      /\botp (batao|bhejo|do|bata do)\b/i,
      /\bpin (batao|bata do)\b/i,
      /\bupi pin batao\b/i,
      /\bpassword batao\b/i,
      /\bcvv batao\b/i,
      /\bcard (ki )?details batao\b/i,
      // Hindi & Marathi (shared Devanagari vocabulary)
      wb(altLiteral(['ओटीपी', 'पिन', 'पासवर्ड', 'सीवीवी', 'ओटीपी बताओ', 'ओटीपी भेजो', 'ओटीपी दो', 'पिन बताओ', 'पासवर्ड बताओ', 'सीवीवी बताओ', 'कार्ड की जानकारी दो', 'ओटीपी सांगा', 'पिन सांगा', 'पासवर्ड सांगा', 'सीव्हीव्ही सांगा', 'कार्ड तपशील द्या'])),
    ],
  },
  {
    id: 'financialExtraction',
    weight: 25,
    patterns: [
      // English
      /\btransfer (the )?(money|funds|amount)\b/i,
      /\b(share|send|give me|tell me|provide) (your |the )?(upi (id|pin)?|bank account (details|number)?|account (number|details))\b/i,
      /\bprocessing fee\b/i,
      /\bpay (a )?(fine|penalty|fee)\b/i,
      /\bsend (money|rs\.?|rupees|inr)\b/i,
      /\brefundable (deposit|amount)\b/i,
      /\bverification (amount|deposit|charge)\b/i,
      /\bfor verification purposes?,? (send|pay|transfer)\b/i,
      // Hinglish / romanized
      /\b(paise|paisa) transfer karo\b/i,
      /\b(paise|paisa) bhejo\b/i,
      /\bpaise path?va\b/i,
      /\bpaise jama kar(o|a)\b/i,
      /\bpaise bharo\b/i,
      /\bkhata number (do|batao)\b/i,
      /\bjurmana bharo\b/i,
      // Hindi
      wb(altLiteral(['पैसे ट्रांसफर करो', 'पैसे भेजो', 'पैसे जमा करो', 'जुर्माना भरो', 'राशि भेजें', 'जमा राशि भेजें', 'वापसी योग्य राशि', 'खाता नंबर बताओ', 'खाता नंबर दो'])),
      // Marathi
      wb(altLiteral(['पैसे पाठवा', 'पैसे भरा', 'पैसे जमा करा', 'दंड भरा', 'परत मिळणारी रक्कम', 'खाते क्रमांक सांगा', 'खाते क्रमांक द्या'])),
    ],
  },
  {
    id: 'remoteAccess',
    weight: 28,
    patterns: [
      // English
      /\banydesk\b/i,
      /\bteamviewer\b/i,
      /\bquick ?support\b/i,
      /\binstall (this |the )?(app|application)\b/i,
      /\bdownload (this |the )?(app|application)\b/i,
      /\bgive me the code (shown|displayed) on your screen\b/i,
      /\bremote access\b/i,
      /\bscreen sharing app\b/i,
      // Hinglish / romanized
      /\bany desk\b/i,
      /\bteam ?viewer\b/i,
      /\banydesk (download|install) karo\b/i,
      /\bteamviewer install karo\b/i,
      /\bapp (install|download) karo\b/i,
      /\bapplication install karo\b/i,
      // Hindi
      wb(altLiteral(['एनीडेस्क', 'टीमव्यूअर', 'एनीडेस्क डाउनलोड करो', 'टीमव्यूअर इंस्टॉल करो', 'ऐप डाउनलोड करो', 'ऐप इंस्टॉल करो', 'स्क्रीन शेयरिंग ऐप'])),
      // Marathi
      wb(altLiteral(['एनीडेस्क डाउनलोड करा', 'टीमव्ह्यूअर इंस्टॉल करा', 'अॅप डाउनलोड करा', 'अॅप इंस्टॉल करा', 'स्क्रीन शेअरिंग अॅप'])),
    ],
  },
]

/** Risk-level thresholds on the 0-100 aggregate score. */
export const RISK_THRESHOLDS = {
  low: 0,
  medium: 25,
  high: 55,
} as const

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export function riskLevelForScore(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.high) return 'HIGH'
  if (score >= RISK_THRESHOLDS.medium) return 'MEDIUM'
  return 'LOW'
}
