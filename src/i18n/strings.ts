import type { SignalCategoryId } from '../data/signals'

export type Lang = 'en' | 'hi' | 'mr'

export const LANGUAGES: { code: Lang; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
]

/** Maps RakshaCall's language codes to the BCP-47 tags the Web Speech APIs (recognition + synthesis) expect. */
export const LANG_TO_BCP47: Record<Lang, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
}

export interface CategoryCopy {
  label: string
  hint: string
}

export interface Strings {
  appName: string
  tagline: string
  poweredByLocal: string
  nav: { home: string; demo: string; paste: string; about: string }
  landing: {
    eyebrow: string
    heroTitle: string
    heroSubtitle: string
    ctaStart: string
    ctaSecondary: string
    ctaPaste: string
    trustLine: string
    honestyNote: string
    statLine: string
  }
  scenarioPicker: {
    title: string
    subtitle: string
    scamLabel: string
    normalLabel: string
    startButton: string
  }
  callScreen: {
    liveLabel: string
    pausedLabel: string
    callEndedLabel: string
    protectionOn: string
    riskLevelLabel: string
    detectedTacticsLabel: string
    noTacticsYet: string
    endCall: string
    restart: string
    youLabel: string
    playbackSpeedLabel: string
    speedAriaLabel: string
    instantDemo: string
    jumpToTrigger: string
    jumpToTriggerHint: string
    pauseCall: string
    resumeCall: string
    newDetection: string
    reviewAlert: string
    timelineLabel: string
    timeline: {
      started: string
      suspicious: string
      escalation: string
      highRisk: string
      intervention: string
    }
    voiceOn: string
    voiceOff: string
    voiceOnHint: string
    voiceOffHint: string
    voiceUnsupportedHint: string
    voiceUnsupported: string
    voiceIdle: string
    callerSpeaking: string
    callerPaused: string
  }
  risk: { LOW: string; MEDIUM: string; HIGH: string }
  riskSubtext: { LOW: string; MEDIUM: string; HIGH: string }
  categories: Record<SignalCategoryId, CategoryCopy>
  warning: {
    highTitle: string
    mediumTitle: string
    explanationIntro: string
    recommendedActionTitle: string
    recommendedActionsHigh: string[]
    recommendedActionsMedium: string[]
    dismiss: string
    imSafe: string
    riskScoreLabel: string
    tacticsCountLabel: string
    patternDisclaimer: string
    immediateActionsTitle: string
    immediateActions: {
      stopTitle: string
      stopBody: string
      noShareTitle: string
      noShareBody: string
      disconnectTitle: string
      disconnectBody: string
      verifyTitle: string
      verifyBody: string
    }
    getHelpButton: string
    viewSummaryButton: string
    mediumGetHelpLink: string
  }
  trustedContact: {
    title: string
    subtitle: string
    contactName: string
    messageTemplate: string
    messageTacticsFallback: string
    alertButton: string
    alertSentTitle: string
    alertSentBody: string
    simulatedLabel: string
    copyButton: string
    copiedLabel: string
    copyFailedLabel: string
  }
  actionHub: {
    title: string
    subtitle: string
    close: string
    helplineTitle: string
    helplineDescription: string
    callButton: string
    callHint: string
    reportingTitle: string
    reportingDescription: string
    reportingButton: string
    chakshuTitle: string
    chakshuDescription: string
    chakshuButton: string
    chakshuDistinction: string
    whatToDoTitle: string
    whatToDoSteps: string[]
    whatNotToDoTitle: string
    whatNotToDoItems: string[]
    officialChannelNote: string
  }
  incidentReport: {
    title: string
    subtitle: string
    close: string
    idLabel: string
    generatedAtLabel: string
    sourceLabel: string
    sourceLiveCall: string
    sourcePaste: string
    scenarioLabel: string
    durationLabel: string
    durationNotAvailable: string
    peakScoreLabel: string
    finalLevelLabel: string
    scamTypeLabel: string
    scamTypeUnknown: string
    scamTypes: {
      digitalArrest: string
      fakeBank: string
      courierCustoms: string
      simDeactivation: string
      investment: string
      normal: string
    }
    detectedTacticsTitle: string
    noTacticsDetected: string
    timelineTitle: string
    timelineEmpty: string
    recommendedActionsTitle: string
    copyButton: string
    copiedLabel: string
    copyFailedLabel: string
    downloadButton: string
    privacyNote: string
    disclaimerNote: string
    endedBannerTitle: string
    endedBannerBody: string
    viewButton: string
  }
  paste: {
    title: string
    subtitle: string
    placeholder: string
    analyzeButton: string
    clearButton: string
    micStart: string
    micListening: string
    liveNote: string
    micPermissionDenied: string
    micNoMic: string
    micError: string
    micUnsupportedNote: string
    micPrivacyNote: string
  }
  accessibility: {
    largeText: string
    languageLabel: string
  }
  footer: { limitationsTitle: string; limitationsBody: string }
}

const categoryCopyEn: Record<SignalCategoryId, CategoryCopy> = {
  authority: { label: 'Claims to be a government/police authority', hint: 'Real officials don\'t investigate over a phone call.' },
  urgency: { label: 'Pressuring you to act immediately', hint: 'Urgency is used to stop you from thinking clearly.' },
  threat: { label: 'Threatening arrest or legal action', hint: 'Genuine legal processes are never resolved by a phone call.' },
  isolation: { label: 'Telling you to stay silent or not hang up', hint: 'A classic tactic to stop you from checking with family.' },
  surveillance: { label: 'Asking you to stay on video / show surroundings', hint: 'No legitimate officer needs to watch you on video.' },
  credentialExtraction: { label: 'Asking for OTP, PIN, or password', hint: 'No bank or government body ever asks for these.' },
  financialExtraction: { label: 'Asking you to transfer money', hint: 'This is the actual goal of almost every such scam.' },
  remoteAccess: { label: 'Asking you to install a remote-access app', hint: 'This lets them take control of your device directly.' },
}

const categoryCopyHi: Record<SignalCategoryId, CategoryCopy> = {
  authority: { label: 'खुद को सरकारी/पुलिस अधिकारी बता रहे हैं', hint: 'असली अधिकारी फोन कॉल पर जांच नहीं करते।' },
  urgency: { label: 'तुरंत कार्रवाई करने का दबाव बना रहे हैं', hint: 'जल्दबाज़ी का इस्तेमाल आपको सोचने से रोकने के लिए होता है।' },
  threat: { label: 'गिरफ्तारी या कानूनी कार्रवाई की धमकी', hint: 'असली कानूनी प्रक्रिया कभी फोन कॉल पर पूरी नहीं होती।' },
  isolation: { label: 'चुप रहने या कॉल न काटने को कह रहे हैं', hint: 'यह आपको परिवार से बात करने से रोकने की चाल है।' },
  surveillance: { label: 'वीडियो चालू रखने / आसपास दिखाने को कह रहे हैं', hint: 'किसी भी असली अधिकारी को यह ज़रूरत नहीं होती।' },
  credentialExtraction: { label: 'OTP, पिन या पासवर्ड मांग रहे हैं', hint: 'कोई भी बैंक या सरकारी संस्था यह कभी नहीं मांगती।' },
  financialExtraction: { label: 'पैसे ट्रांसफर करने को कह रहे हैं', hint: 'यही ऐसे लगभग हर स्कैम का असली मकसद होता है।' },
  remoteAccess: { label: 'रिमोट-एक्सेस ऐप इंस्टॉल करने को कह रहे हैं', hint: 'इससे वे सीधे आपके डिवाइस पर नियंत्रण पा सकते हैं।' },
}

const categoryCopyMr: Record<SignalCategoryId, CategoryCopy> = {
  authority: { label: 'सरकारी/पोलीस अधिकारी असल्याचा दावा करत आहेत', hint: 'खरे अधिकारी फोन कॉलवर चौकशी करत नाहीत.' },
  urgency: { label: 'लगेच कारवाई करण्यासाठी दबाव टाकत आहेत', hint: 'घाईचा वापर तुम्हाला विचार करण्यापासून रोखण्यासाठी होतो.' },
  threat: { label: 'अटक किंवा कायदेशीर कारवाईची धमकी', hint: 'खरी कायदेशीर प्रक्रिया फोन कॉलवर कधीच पूर्ण होत नाही.' },
  isolation: { label: 'गप्प राहा किंवा कॉल बंद करू नका असे सांगत आहेत', hint: 'ही युक्ती तुम्हाला कुटुंबाशी बोलण्यापासून रोखते.' },
  surveillance: { label: 'व्हिडिओ सुरू ठेवा / आजूबाजूचे दाखवा असे सांगत आहेत', hint: 'कोणत्याही खऱ्या अधिकाऱ्याला याची गरज नसते.' },
  credentialExtraction: { label: 'OTP, पिन किंवा पासवर्ड मागत आहेत', hint: 'कोणतीही बँक किंवा सरकारी संस्था हे कधीच मागत नाही.' },
  financialExtraction: { label: 'पैसे ट्रान्सफर करण्यास सांगत आहेत', hint: 'हाच अशा जवळजवळ प्रत्येक फसवणुकीचा खरा हेतू असतो.' },
  remoteAccess: { label: 'रिमोट-अ‍ॅक्सेस अ‍ॅप इन्स्टॉल करण्यास सांगत आहेत', hint: 'यामुळे ते थेट तुमच्या डिव्हाइसवर ताबा मिळवू शकतात.' },
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    appName: 'RakshaCall',
    tagline: 'Real-time protection while a scam call is happening — not after.',
    poweredByLocal: 'Runs fully on-device · No account · No paid AI required',
    nav: { home: 'Home', demo: 'Live Demo', paste: 'Analyze Transcript', about: 'About' },
    landing: {
      eyebrow: 'Real-time scam call protection',
      heroTitle: 'Stay ahead of scam calls.',
      heroSubtitle:
        'RakshaCall detects high-risk social-engineering patterns during suspicious calls and helps you understand what\'s happening before you take action.',
      ctaStart: 'Start Protection',
      ctaSecondary: 'Try Live Demo',
      ctaPaste: 'Analyze a Transcript',
      trustLine: 'Privacy-first · Explainable alerts · Built for Indian scam patterns',
      honestyNote:
        'This hackathon build analyzes a simulated call stream or a pasted/typed transcript, and optionally your browser microphone — it does not intercept real telecom phone calls. See "Limitations" for details.',
      statLine: 'Impersonation "digital arrest" scams alone caused an estimated ₹3,000+ crore in losses across India in 2025.',
    },
    scenarioPicker: {
      title: 'Choose a demo scenario',
      subtitle: 'Fictional, realistic scenarios modeled on publicly documented scam patterns. No real victim data.',
      scamLabel: 'Scam-pattern scenarios',
      normalLabel: 'Normal-call scenarios',
      startButton: 'Start Simulated Call',
    },
    callScreen: {
      liveLabel: 'LIVE',
      pausedLabel: 'PAUSED',
      callEndedLabel: 'Call Ended',
      protectionOn: 'Protection Active',
      riskLevelLabel: 'Current Risk Level',
      detectedTacticsLabel: 'Detected Tactics',
      noTacticsYet: 'No suspicious tactics detected yet.',
      endCall: 'End Call',
      restart: 'Restart Call',
      youLabel: 'You',
      playbackSpeedLabel: 'Playback Speed',
      speedAriaLabel: 'Set playback speed to {x}×',
      instantDemo: 'Instant Demo',
      jumpToTrigger: 'Jump to Scam Trigger',
      jumpToTriggerHint: 'Skip ahead to the moment this call is flagged high risk.',
      pauseCall: 'Pause Call',
      resumeCall: 'Resume Call',
      newDetection: '{tactic} detected',
      reviewAlert: 'Review Alert',
      timelineLabel: 'Call progress',
      timeline: {
        started: 'Call Started',
        suspicious: 'Suspicious Signal',
        escalation: 'Escalation',
        highRisk: 'High-Risk Trigger',
        intervention: 'Intervention',
      },
      voiceOn: 'Voice On',
      voiceOff: 'Voice Off',
      voiceOnHint: 'Turn on caller voice',
      voiceOffHint: 'Turn off caller voice',
      voiceUnsupportedHint: "Voice isn't supported in this browser",
      voiceUnsupported: 'Voice unsupported',
      voiceIdle: 'Voice ready',
      callerSpeaking: 'Caller speaking',
      callerPaused: 'Caller paused',
    },
    risk: { LOW: 'Low Risk', MEDIUM: 'Caution', HIGH: 'High Risk' },
    riskSubtext: {
      LOW: 'This call looks normal so far.',
      MEDIUM: 'Some unusual patterns detected — stay alert.',
      HIGH: 'This strongly matches a known scam pattern.',
    },
    categories: categoryCopyEn,
    warning: {
      highTitle: 'This looks like a scam call',
      mediumTitle: 'Something feels off about this call',
      explanationIntro: 'We noticed:',
      recommendedActionTitle: 'What you should do',
      recommendedActionsHigh: [
        'Hang up the call now.',
        'Never share an OTP, PIN, or password with anyone on a call.',
        'Real police/CBI/bank officials never ask for money or video surveillance over a phone call.',
        'Verify independently by calling the organization\'s official number.',
      ],
      recommendedActionsMedium: [
        'Slow down — do not act on anything urgently right now.',
        'Do not share any OTP, PIN, or bank details.',
        'If unsure, hang up and call the organization back on their official number.',
      ],
      dismiss: 'Dismiss',
      imSafe: 'I\'m safe, dismiss',
      riskScoreLabel: 'Risk Score',
      tacticsCountLabel: '{count} manipulation tactics detected',
      patternDisclaimer: 'High-risk scam pattern detected. Verify independently before taking any action.',
      immediateActionsTitle: 'Right now',
      immediateActions: {
        stopTitle: 'STOP',
        stopBody: 'Do not transfer any money — not a "fee", "deposit", or "refundable" payment.',
        noShareTitle: 'DO NOT SHARE',
        noShareBody: 'Never give an OTP, UPI PIN, CVV, or password to anyone on a call.',
        disconnectTitle: 'DISCONNECT',
        disconnectBody: 'End this call now if it feels safe to do so.',
        verifyTitle: 'VERIFY',
        verifyBody: "Contact the organization directly using their official number — never one given by the caller.",
      },
      getHelpButton: 'Get Help & Report',
      viewSummaryButton: 'View Incident Summary',
      mediumGetHelpLink: 'Not sure what to do?',
    },
    trustedContact: {
      title: 'Alert a trusted contact',
      subtitle: 'Send a quick heads-up so someone can check in on you.',
      contactName: 'Amit (Son)',
      messageTemplate: 'RakshaCall detected a high-risk suspicious call. Signs included: {tactics}. Please check on me when you can.',
      messageTacticsFallback: 'an unusual pattern',
      alertButton: 'Alert Amit (Son)',
      alertSentTitle: 'Alert prepared',
      alertSentBody: 'This message has been prepared and would be sent to your trusted contact.',
      simulatedLabel: 'Demo / Preview — no real message is sent.',
      copyButton: 'Copy Message',
      copiedLabel: 'Copied!',
      copyFailedLabel: "Couldn't copy — you can select and copy the text above instead.",
    },
    actionHub: {
      title: 'Get Help & Report',
      subtitle: 'Immediate steps, official helplines, and reporting channels.',
      close: 'Close',
      helplineTitle: 'Cybercrime Helpline',
      helplineDescription: 'Call 1930 to report a financial cybercrime and get help freezing a fraudulent transaction.',
      callButton: 'Call 1930',
      callHint: "Opens your phone's dialer, where your device supports it.",
      reportingTitle: 'Report Financial Cybercrime',
      reportingDescription: 'File a report on the official National Cyber Crime Reporting Portal (Government of India).',
      reportingButton: 'Open cybercrime.gov.in',
      chakshuTitle: 'Report a Suspicious Call / SMS (Chakshu)',
      chakshuDescription:
        "For reporting suspicious calls, SMS, or WhatsApp messages to the telecom regulator — this is not the same as reporting a financial loss.",
      chakshuButton: 'Open Sanchar Saathi (Chakshu)',
      chakshuDistinction:
        "If you've already lost money, use the Cybercrime Helpline above instead — Chakshu is for reporting the suspicious communication itself.",
      whatToDoTitle: 'What to do now',
      whatToDoSteps: [
        'End the call if it is safe to do so.',
        'Don\'t transfer money — no "verification", "security", or "refundable" payment is real.',
        'Never share an OTP, UPI PIN, CVV, password, or card details.',
        'Contact someone you trust and tell them what happened.',
        'Report the incident through an official channel.',
      ],
      whatNotToDoTitle: 'What not to do',
      whatNotToDoItems: [
        "Don't transfer money.",
        "Don't share an OTP.",
        "Don't share a UPI PIN.",
        "Don't install a remote-access app (AnyDesk, TeamViewer, etc.).",
        "Don't share your screen.",
        "Don't stay isolated — tell a family member or friend.",
        "Don't trust caller ID alone — it can be faked.",
        'Don\'t move money to a "safe account" on someone\'s instruction.',
      ],
      officialChannelNote: 'These are official Government of India channels. RakshaCall does not submit anything on your behalf — it only links you to them.',
    },
    incidentReport: {
      title: 'Incident Summary',
      subtitle: 'A local summary of what RakshaCall detected in this session.',
      close: 'Close',
      idLabel: 'Incident ID',
      generatedAtLabel: 'Generated',
      sourceLabel: 'Source',
      sourceLiveCall: 'Live call simulation',
      sourcePaste: 'Pasted/typed transcript',
      scenarioLabel: 'Scenario',
      durationLabel: 'Duration',
      durationNotAvailable: 'Not applicable',
      peakScoreLabel: 'Peak risk score',
      finalLevelLabel: 'Final risk level',
      scamTypeLabel: 'Likely scam type',
      scamTypeUnknown: 'Not determined',
      scamTypes: {
        digitalArrest: 'Digital Arrest / Police Impersonation',
        fakeBank: 'Fake Bank / Fraud-Prevention Call',
        courierCustoms: 'Courier / Customs Seizure Scam',
        simDeactivation: 'SIM Deactivation / Telecom Impersonation',
        investment: 'Investment / Task Scam',
        normal: 'Not a scam pattern',
      },
      detectedTacticsTitle: 'Detected Tactics',
      noTacticsDetected: 'No suspicious tactics were detected.',
      timelineTitle: 'Detection Timeline',
      timelineEmpty: 'No detection events recorded.',
      recommendedActionsTitle: 'Recommended Actions',
      copyButton: 'Copy Summary',
      copiedLabel: 'Copied!',
      copyFailedLabel: "Couldn't copy — you can select and copy the text below instead.",
      downloadButton: 'Download as Text',
      privacyNote:
        "RakshaCall's detection analysis runs locally in this browser. This report is generated only from information available in this session and is not stored anywhere else.",
      disclaimerNote:
        'This is a Scam Detection Report generated from a local, automated analysis — it is not a certified or legally admissible document. Always verify independently.',
      endedBannerTitle: 'Call ended',
      endedBannerBody: 'You can review a summary of what RakshaCall detected during this call.',
      viewButton: 'View Incident Summary',
    },
    paste: {
      title: 'Analyze a transcript',
      subtitle: 'Paste or type what the caller said, and RakshaCall will analyze it instantly — fully on-device.',
      placeholder: 'e.g. "This is CBI, there is a case against you, do not hang up..."',
      analyzeButton: 'Analyze',
      clearButton: 'Clear',
      micStart: 'Speak instead',
      micListening: 'Listening…',
      liveNote: 'runs instantly as you type — fully on-device, no button needed.',
      micPermissionDenied:
        "Microphone access is required for live voice analysis. You can enable it in your browser's permission settings, or type/paste the conversation below instead.",
      micNoMic: 'No microphone was found on this device. You can type/paste the conversation below instead.',
      micError:
        'Voice recognition had a problem and stopped. You can try listening again, or type/paste the conversation below instead.',
      micUnsupportedNote:
        "Voice input isn't supported in this browser. You can type/paste the conversation below instead.",
      micPrivacyNote:
        "Your transcript is analyzed locally by RakshaCall's detection engine either way. Speech-to-text itself is your browser's own feature — some browsers process it on-device, others (e.g. Chrome) may send the audio to their own servers to generate the text. RakshaCall never sends your voice or transcript anywhere.",
    },
    accessibility: { largeText: 'Large Text', languageLabel: 'Language' },
    footer: {
      limitationsTitle: 'What\'s real vs. simulated in this build',
      limitationsBody:
        'Detection runs on a fully local, deterministic pattern-matching engine — no data leaves your device and no paid AI API is used. The "live call" is a simulated transcript stream (or your own browser microphone via Web Speech, where supported); this does not intercept real telecom calls. The trusted-contact alert is a simulated preview, not a real sent message.',
    },
  },
  hi: {
    appName: 'RakshaCall',
    tagline: 'स्कैम कॉल के दौरान ही रीयल-टाइम सुरक्षा — बाद में नहीं।',
    poweredByLocal: 'पूरी तरह डिवाइस पर चलता है · कोई अकाउंट नहीं · कोई पेड AI ज़रूरी नहीं',
    nav: { home: 'होम', demo: 'लाइव डेमो', paste: 'ट्रांसक्रिप्ट जांचें', about: 'जानकारी' },
    landing: {
      eyebrow: 'रीयल-टाइम स्कैम कॉल सुरक्षा',
      heroTitle: 'स्कैम कॉल से एक कदम आगे रहें।',
      heroSubtitle:
        'RakshaCall संदिग्ध कॉल के दौरान हाई-रिस्क सोशल-इंजीनियरिंग पैटर्न पहचानता है और आपको कुछ करने से पहले यह समझने में मदद करता है कि क्या हो रहा है।',
      ctaStart: 'सुरक्षा शुरू करें',
      ctaSecondary: 'लाइव डेमो आज़माएं',
      ctaPaste: 'ट्रांसक्रिप्ट जांचें',
      trustLine: 'प्राइवेसी-फर्स्ट · समझाने योग्य अलर्ट · भारतीय स्कैम पैटर्न के लिए बना',
      honestyNote:
        'यह हैकाथॉन बिल्ड एक सिम्युलेटेड कॉल स्ट्रीम या पेस्ट/टाइप किए गए ट्रांसक्रिप्ट का विश्लेषण करता है, और चाहें तो आपके ब्राउज़र माइक्रोफ़ोन का — यह असली टेलीकॉम फोन कॉल को इंटरसेप्ट नहीं करता। विवरण के लिए "Limitations" देखें।',
      statLine: 'अकेले "डिजिटल अरेस्ट" स्कैम से 2025 में भारत में अनुमानित ₹3,000+ करोड़ का नुकसान हुआ।',
    },
    scenarioPicker: {
      title: 'एक डेमो सीनारियो चुनें',
      subtitle: 'सार्वजनिक रूप से दर्ज स्कैम पैटर्न पर आधारित काल्पनिक, यथार्थवादी सीनारियो। कोई असली पीड़ित डेटा नहीं।',
      scamLabel: 'स्कैम-पैटर्न सीनारियो',
      normalLabel: 'सामान्य कॉल सीनारियो',
      startButton: 'सिम्युलेटेड कॉल शुरू करें',
    },
    callScreen: {
      liveLabel: 'लाइव',
      pausedLabel: 'रुका हुआ',
      callEndedLabel: 'कॉल समाप्त',
      protectionOn: 'सुरक्षा सक्रिय',
      riskLevelLabel: 'मौजूदा जोखिम स्तर',
      detectedTacticsLabel: 'पहचानी गई रणनीतियां',
      noTacticsYet: 'अभी तक कोई संदिग्ध रणनीति नहीं मिली।',
      endCall: 'कॉल समाप्त करें',
      restart: 'कॉल फिर से शुरू करें',
      youLabel: 'आप',
      playbackSpeedLabel: 'प्लेबैक स्पीड',
      speedAriaLabel: 'प्लेबैक स्पीड {x}× पर सेट करें',
      instantDemo: 'इंस्टेंट डेमो',
      jumpToTrigger: 'स्कैम ट्रिगर पर जाएं',
      jumpToTriggerHint: 'उस पल पर सीधे जाएं जहां यह कॉल हाई रिस्क के रूप में चिह्नित होती है।',
      pauseCall: 'कॉल रोकें',
      resumeCall: 'कॉल जारी रखें',
      newDetection: '{tactic} का पता चला',
      reviewAlert: 'चेतावनी फिर देखें',
      timelineLabel: 'कॉल की प्रगति',
      timeline: {
        started: 'कॉल शुरू',
        suspicious: 'संदिग्ध संकेत',
        escalation: 'बढ़ता खतरा',
        highRisk: 'उच्च-जोखिम ट्रिगर',
        intervention: 'हस्तक्षेप',
      },
      voiceOn: 'आवाज़ चालू',
      voiceOff: 'आवाज़ बंद',
      voiceOnHint: 'कॉलर की आवाज़ चालू करें',
      voiceOffHint: 'कॉलर की आवाज़ बंद करें',
      voiceUnsupportedHint: 'इस ब्राउज़र में आवाज़ सपोर्ट नहीं है',
      voiceUnsupported: 'आवाज़ उपलब्ध नहीं',
      voiceIdle: 'आवाज़ तैयार है',
      callerSpeaking: 'कॉलर बोल रहा है',
      callerPaused: 'कॉलर रुका हुआ है',
    },
    risk: { LOW: 'कम जोखिम', MEDIUM: 'सावधानी', HIGH: 'उच्च जोखिम' },
    riskSubtext: {
      LOW: 'अभी तक यह कॉल सामान्य लग रही है।',
      MEDIUM: 'कुछ असामान्य पैटर्न मिले हैं — सतर्क रहें।',
      HIGH: 'यह एक जाने-माने स्कैम पैटर्न से काफी मिलता-जुलता है।',
    },
    categories: categoryCopyHi,
    warning: {
      highTitle: 'यह एक स्कैम कॉल लगता है',
      mediumTitle: 'इस कॉल में कुछ ठीक नहीं लगता',
      explanationIntro: 'हमने पाया:',
      recommendedActionTitle: 'आपको क्या करना चाहिए',
      recommendedActionsHigh: [
        'अभी कॉल काट दें।',
        'फोन पर किसी को भी OTP, पिन या पासवर्ड कभी न बताएं।',
        'असली पुलिस/CBI/बैंक अधिकारी कभी फोन पर पैसे या वीडियो निगरानी नहीं मांगते।',
        'संस्था के आधिकारिक नंबर पर कॉल करके स्वयं पुष्टि करें।',
      ],
      recommendedActionsMedium: [
        'धीरे चलें — अभी जल्दबाज़ी में कुछ न करें।',
        'कोई OTP, पिन या बैंक विवरण साझा न करें।',
        'अगर यकीन न हो, तो कॉल काटें और संस्था के आधिकारिक नंबर पर वापस कॉल करें।',
      ],
      dismiss: 'बंद करें',
      imSafe: 'मैं सुरक्षित हूं, बंद करें',
      riskScoreLabel: 'जोखिम स्कोर',
      tacticsCountLabel: '{count} हेरफेर की रणनीतियां मिलीं',
      patternDisclaimer: 'हाई-रिस्क स्कैम पैटर्न मिला है। कोई भी कार्रवाई करने से पहले स्वयं पुष्टि करें।',
      immediateActionsTitle: 'अभी करें',
      immediateActions: {
        stopTitle: 'रुकें',
        stopBody: 'कोई पैसा ट्रांसफर न करें — कोई "फीस", "डिपॉज़िट" या "रिफंडेबल" भुगतान असली नहीं होता।',
        noShareTitle: 'साझा न करें',
        noShareBody: 'फोन पर किसी को भी OTP, UPI पिन, CVV या पासवर्ड कभी न दें।',
        disconnectTitle: 'कॉल काटें',
        disconnectBody: 'अगर सुरक्षित लगे तो अभी कॉल काट दें।',
        verifyTitle: 'पुष्टि करें',
        verifyBody: 'संस्था के आधिकारिक नंबर पर सीधे संपर्क करें — कॉलर द्वारा दिए गए नंबर पर कभी नहीं।',
      },
      getHelpButton: 'मदद पाएं और रिपोर्ट करें',
      viewSummaryButton: 'घटना सारांश देखें',
      mediumGetHelpLink: 'समझ नहीं आ रहा क्या करें?',
    },
    trustedContact: {
      title: 'किसी भरोसेमंद संपर्क को सूचित करें',
      subtitle: 'ताकि कोई आपका हाल-चाल जांच सके।',
      contactName: 'अमित (बेटा)',
      messageTemplate: 'RakshaCall को एक हाई-रिस्क संदिग्ध कॉल का पता चला। संकेत: {tactics}। कृपया जब हो सके मेरा हाल-चाल जानें।',
      messageTacticsFallback: 'एक असामान्य पैटर्न',
      alertButton: 'अमित (बेटा) को सूचित करें',
      alertSentTitle: 'अलर्ट तैयार किया गया',
      alertSentBody: 'यह संदेश तैयार किया गया है और आपके भरोसेमंद संपर्क को भेजा जाएगा।',
      simulatedLabel: 'डेमो / प्रीव्यू — कोई असली संदेश नहीं भेजा जाता।',
      copyButton: 'संदेश कॉपी करें',
      copiedLabel: 'कॉपी हो गया!',
      copyFailedLabel: 'कॉपी नहीं हो सका — आप ऊपर दिए टेक्स्ट को चुनकर खुद कॉपी कर सकते हैं।',
    },
    actionHub: {
      title: 'मदद पाएं और रिपोर्ट करें',
      subtitle: 'तुरंत उठाए जाने वाले कदम, आधिकारिक हेल्पलाइन और रिपोर्टिंग चैनल।',
      close: 'बंद करें',
      helplineTitle: 'साइबर क्राइम हेल्पलाइन',
      helplineDescription: 'वित्तीय साइबर अपराध की रिपोर्ट करने और धोखाधड़ी का लेन-देन रोकने में मदद के लिए 1930 पर कॉल करें।',
      callButton: '1930 पर कॉल करें',
      callHint: 'जहां आपका डिवाइस सपोर्ट करता है, वहां यह फोन डायलर खोलता है।',
      reportingTitle: 'वित्तीय साइबर अपराध की रिपोर्ट करें',
      reportingDescription: 'आधिकारिक राष्ट्रीय साइबर क्राइम रिपोर्टिंग पोर्टल (भारत सरकार) पर रिपोर्ट दर्ज करें।',
      reportingButton: 'cybercrime.gov.in खोलें',
      chakshuTitle: 'संदिग्ध कॉल / SMS की रिपोर्ट करें (चक्षु)',
      chakshuDescription: 'संदिग्ध कॉल, SMS या WhatsApp संदेशों की टेलीकॉम रेगुलेटर को रिपोर्ट करने के लिए — यह वित्तीय नुकसान की रिपोर्ट करने जैसा नहीं है।',
      chakshuButton: 'संचार साथी (चक्षु) खोलें',
      chakshuDistinction: 'अगर आपका पैसा पहले ही जा चुका है, तो ऊपर दी गई साइबर क्राइम हेल्पलाइन का उपयोग करें — चक्षु सिर्फ संदिग्ध संचार की रिपोर्ट के लिए है।',
      whatToDoTitle: 'अभी क्या करें',
      whatToDoSteps: [
        'अगर सुरक्षित लगे तो कॉल काट दें।',
        'पैसे ट्रांसफर न करें — कोई भी "वेरिफिकेशन", "सिक्योरिटी" या "रिफंडेबल" भुगतान असली नहीं होता।',
        'कभी भी OTP, UPI पिन, CVV, पासवर्ड या कार्ड की जानकारी साझा न करें।',
        'किसी भरोसेमंद व्यक्ति से संपर्क करें और उन्हें बताएं कि क्या हुआ।',
        'आधिकारिक चैनल के ज़रिए घटना की रिपोर्ट करें।',
      ],
      whatNotToDoTitle: 'क्या न करें',
      whatNotToDoItems: [
        'पैसे ट्रांसफर न करें।',
        'OTP साझा न करें।',
        'UPI पिन साझा न करें।',
        'रिमोट-एक्सेस ऐप (AnyDesk, TeamViewer आदि) इंस्टॉल न करें।',
        'अपनी स्क्रीन शेयर न करें।',
        'अकेले न रहें — परिवार या दोस्त को बताएं।',
        'सिर्फ कॉलर ID पर भरोसा न करें — यह नकली हो सकती है।',
        'किसी के कहने पर पैसे "सेफ अकाउंट" में न भेजें।',
      ],
      officialChannelNote: 'ये भारत सरकार के आधिकारिक चैनल हैं। RakshaCall आपकी ओर से कुछ भी सबमिट नहीं करता — यह सिर्फ आपको इनसे जोड़ता है।',
    },
    incidentReport: {
      title: 'घटना सारांश',
      subtitle: 'इस सेशन में RakshaCall ने जो पहचाना उसका एक लोकल सारांश।',
      close: 'बंद करें',
      idLabel: 'घटना ID',
      generatedAtLabel: 'तैयार किया गया',
      sourceLabel: 'स्रोत',
      sourceLiveCall: 'लाइव कॉल सिमुलेशन',
      sourcePaste: 'पेस्ट/टाइप किया गया ट्रांसक्रिप्ट',
      scenarioLabel: 'सीनारियो',
      durationLabel: 'अवधि',
      durationNotAvailable: 'लागू नहीं',
      peakScoreLabel: 'अधिकतम जोखिम स्कोर',
      finalLevelLabel: 'अंतिम जोखिम स्तर',
      scamTypeLabel: 'संभावित स्कैम प्रकार',
      scamTypeUnknown: 'निर्धारित नहीं',
      scamTypes: {
        digitalArrest: 'डिजिटल अरेस्ट / पुलिस प्रतिरूपण',
        fakeBank: 'फर्जी बैंक / फ्रॉड-प्रिवेंशन कॉल',
        courierCustoms: 'कूरियर / कस्टम्स ज़ब्ती स्कैम',
        simDeactivation: 'सिम डीएक्टिवेशन / टेलीकॉम प्रतिरूपण',
        investment: 'इन्वेस्टमेंट / टास्क स्कैम',
        normal: 'स्कैम पैटर्न नहीं',
      },
      detectedTacticsTitle: 'पहचानी गई रणनीतियां',
      noTacticsDetected: 'कोई संदिग्ध रणनीति नहीं मिली।',
      timelineTitle: 'डिटेक्शन टाइमलाइन',
      timelineEmpty: 'कोई डिटेक्शन इवेंट दर्ज नहीं हुआ।',
      recommendedActionsTitle: 'अनुशंसित कार्रवाई',
      copyButton: 'सारांश कॉपी करें',
      copiedLabel: 'कॉपी हो गया!',
      copyFailedLabel: 'कॉपी नहीं हो सका — आप नीचे दिए टेक्स्ट को चुनकर खुद कॉपी कर सकते हैं।',
      downloadButton: 'टेक्स्ट के रूप में डाउनलोड करें',
      privacyNote:
        "RakshaCall का डिटेक्शन विश्लेषण इस ब्राउज़र पर पूरी तरह लोकल चलता है। यह रिपोर्ट केवल इस सेशन में उपलब्ध जानकारी से तैयार होती है और कहीं और स्टोर नहीं होती।",
      disclaimerNote: 'यह एक लोकल, ऑटोमेटेड विश्लेषण से तैयार स्कैम डिटेक्शन रिपोर्ट है — यह कोई प्रमाणित या कानूनी रूप से मान्य दस्तावेज़ नहीं है। हमेशा स्वयं पुष्टि करें।',
      endedBannerTitle: 'कॉल समाप्त हुई',
      endedBannerBody: 'आप इस कॉल के दौरान RakshaCall द्वारा पहचानी गई बातों का सारांश देख सकते हैं।',
      viewButton: 'घटना सारांश देखें',
    },
    paste: {
      title: 'ट्रांसक्रिप्ट जांचें',
      subtitle: 'कॉलर ने जो कहा उसे पेस्ट या टाइप करें, RakshaCall इसे तुरंत डिवाइस पर ही जांच लेगा।',
      placeholder: 'जैसे "यह CBI है, आपके खिलाफ केस है, कॉल मत काटिए..."',
      analyzeButton: 'जांचें',
      clearButton: 'साफ करें',
      micStart: 'बोलकर बताएं',
      micListening: 'सुन रहे हैं…',
      liveNote: 'आपके टाइप करते ही तुरंत चलता है — पूरी तरह डिवाइस पर, किसी बटन की ज़रूरत नहीं।',
      micPermissionDenied:
        'लाइव वॉइस एनालिसिस के लिए माइक्रोफ़ोन एक्सेस ज़रूरी है। आप इसे अपने ब्राउज़र की परमिशन सेटिंग्स में चालू कर सकते हैं, या नीचे बातचीत टाइप/पेस्ट कर सकते हैं।',
      micNoMic: 'इस डिवाइस पर कोई माइक्रोफ़ोन नहीं मिला। आप नीचे बातचीत टाइप/पेस्ट कर सकते हैं।',
      micError: 'वॉइस रिकग्निशन में समस्या आई और वह रुक गया। आप दोबारा सुनने की कोशिश कर सकते हैं, या नीचे बातचीत टाइप/पेस्ट कर सकते हैं।',
      micUnsupportedNote: 'इस ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है। आप नीचे बातचीत टाइप/पेस्ट कर सकते हैं।',
      micPrivacyNote:
        'आपकी ट्रांसक्रिप्ट हर हाल में RakshaCall के लोकल डिटेक्शन इंजन पर ही जांची जाती है। स्पीच-टू-टेक्स्ट आपके ब्राउज़र की अपनी सुविधा है — कुछ ब्राउज़र इसे डिवाइस पर ही प्रोसेस करते हैं, तो कुछ (जैसे Chrome) टेक्स्ट बनाने के लिए ऑडियो को अपने सर्वर पर भेज सकते हैं। RakshaCall खुद आपकी आवाज़ या ट्रांसक्रिप्ट कहीं नहीं भेजता।',
    },
    accessibility: { largeText: 'बड़ा टेक्स्ट', languageLabel: 'भाषा' },
    footer: {
      limitationsTitle: 'इस बिल्ड में क्या असली है और क्या सिम्युलेटेड',
      limitationsBody:
        'डिटेक्शन पूरी तरह लोकल, डिटरमिनिस्टिक पैटर्न-मैचिंग इंजन पर चलता है — कोई डेटा आपके डिवाइस से बाहर नहीं जाता और कोई पेड AI API इस्तेमाल नहीं होता। "लाइव कॉल" एक सिम्युलेटेड ट्रांसक्रिप्ट स्ट्रीम है (या जहां सपोर्टेड हो वहां आपका ब्राउज़र माइक्रोफ़ोन); यह असली टेलीकॉम कॉल को इंटरसेप्ट नहीं करता। भरोसेमंद संपर्क अलर्ट एक सिम्युलेटेड प्रीव्यू है, असली भेजा गया संदेश नहीं।',
    },
  },
  mr: {
    appName: 'RakshaCall',
    tagline: 'स्कॅम कॉल सुरू असतानाच रिअल-टाइम संरक्षण — नंतर नाही.',
    poweredByLocal: 'पूर्णपणे डिव्हाइसवर चालते · खाते आवश्यक नाही · पेड AI आवश्यक नाही',
    nav: { home: 'होम', demo: 'लाइव्ह डेमो', paste: 'ट्रान्सक्रिप्ट तपासा', about: 'माहिती' },
    landing: {
      eyebrow: 'रिअल-टाइम स्कॅम कॉल संरक्षण',
      heroTitle: 'स्कॅम कॉल्सच्या एक पाऊल पुढे रहा.',
      heroSubtitle:
        'RakshaCall संशयास्पद कॉल दरम्यान हाय-रिस्क सोशल-इंजिनिअरिंग पॅटर्न ओळखतो आणि तुम्ही काही करण्यापूर्वी काय घडत आहे हे समजून घेण्यास मदत करतो.',
      ctaStart: 'संरक्षण सुरू करा',
      ctaSecondary: 'लाइव्ह डेमो पहा',
      ctaPaste: 'ट्रान्सक्रिप्ट तपासा',
      trustLine: 'प्रायव्हसी-फर्स्ट · स्पष्ट करण्यायोग्य अलर्ट · भारतीय स्कॅम पॅटर्नसाठी तयार',
      honestyNote:
        'हे हॅकेथॉन बिल्ड सिम्युलेटेड कॉल स्ट्रीम किंवा पेस्ट/टाइप केलेल्या ट्रान्सक्रिप्टचे विश्लेषण करते, आणि पर्यायाने तुमच्या ब्राउझर मायक्रोफोनचे — हे खऱ्या टेलिकॉम फोन कॉल्सना इंटरसेप्ट करत नाही. तपशीलांसाठी "Limitations" पहा.',
      statLine: 'एकट्या "डिजिटल अरेस्ट" स्कॅममुळे 2025 मध्ये भारतात अंदाजे ₹3,000+ कोटींचे नुकसान झाले.',
    },
    scenarioPicker: {
      title: 'डेमो सीनारियो निवडा',
      subtitle: 'सार्वजनिकरीत्या नोंदवलेल्या स्कॅम पॅटर्नवर आधारित काल्पनिक, वास्तववादी सीनारियो. खरा पीडित डेटा नाही.',
      scamLabel: 'स्कॅम-पॅटर्न सीनारियो',
      normalLabel: 'सामान्य कॉल सीनारियो',
      startButton: 'सिम्युलेटेड कॉल सुरू करा',
    },
    callScreen: {
      liveLabel: 'लाइव्ह',
      pausedLabel: 'थांबले',
      callEndedLabel: 'कॉल संपला',
      protectionOn: 'संरक्षण सक्रिय',
      riskLevelLabel: 'सध्याची जोखीम पातळी',
      detectedTacticsLabel: 'ओळखलेल्या युक्त्या',
      noTacticsYet: 'अद्याप कोणतीही संशयास्पद युक्ती आढळली नाही.',
      endCall: 'कॉल संपवा',
      restart: 'कॉल पुन्हा सुरू करा',
      youLabel: 'तुम्ही',
      playbackSpeedLabel: 'प्लेबॅक स्पीड',
      speedAriaLabel: 'प्लेबॅक स्पीड {x}× वर सेट करा',
      instantDemo: 'इन्स्टंट डेमो',
      jumpToTrigger: 'स्कॅम ट्रिगरवर जा',
      jumpToTriggerHint: 'हा कॉल हाय-रिस्क म्हणून चिन्हांकित होतो त्या क्षणी थेट जा.',
      pauseCall: 'कॉल थांबवा',
      resumeCall: 'कॉल सुरू ठेवा',
      newDetection: '{tactic} आढळले',
      reviewAlert: 'इशारा पुन्हा पहा',
      timelineLabel: 'कॉलची प्रगती',
      timeline: {
        started: 'कॉल सुरू झाला',
        suspicious: 'संशयास्पद संकेत',
        escalation: 'वाढता धोका',
        highRisk: 'उच्च-जोखीम ट्रिगर',
        intervention: 'हस्तक्षेप',
      },
      voiceOn: 'आवाज़ सुरू',
      voiceOff: 'आवाज़ बंद',
      voiceOnHint: 'कॉलरचा आवाज सुरू करा',
      voiceOffHint: 'कॉलरचा आवाज बंद करा',
      voiceUnsupportedHint: 'या ब्राउझरमध्ये आवाज सपोर्ट नाही',
      voiceUnsupported: 'आवाज उपलब्ध नाही',
      voiceIdle: 'आवाज तयार आहे',
      callerSpeaking: 'कॉलर बोलत आहे',
      callerPaused: 'कॉलर थांबला आहे',
    },
    risk: { LOW: 'कमी जोखीम', MEDIUM: 'सावधगिरी', HIGH: 'उच्च जोखीम' },
    riskSubtext: {
      LOW: 'हा कॉल आतापर्यंत सामान्य वाटतो.',
      MEDIUM: 'काही असामान्य पॅटर्न आढळले — सावध रहा.',
      HIGH: 'हे एका ज्ञात स्कॅम पॅटर्नशी जुळते.',
    },
    categories: categoryCopyMr,
    warning: {
      highTitle: 'हा स्कॅम कॉल वाटतो',
      mediumTitle: 'या कॉलमध्ये काहीतरी विचित्र वाटते',
      explanationIntro: 'आम्हाला आढळले:',
      recommendedActionTitle: 'तुम्ही काय करावे',
      recommendedActionsHigh: [
        'आता कॉल बंद करा.',
        'फोनवर कोणालाही OTP, पिन किंवा पासवर्ड कधीही सांगू नका.',
        'खरे पोलीस/CBI/बँक अधिकारी कधीही फोनवर पैसे किंवा व्हिडिओ पाळत मागत नाहीत.',
        'संस्थेच्या अधिकृत नंबरवर कॉल करून स्वतः खात्री करा.',
      ],
      recommendedActionsMedium: [
        'हळू करा — आत्ता घाईघाईने काहीही करू नका.',
        'कोणताही OTP, पिन किंवा बँक तपशील शेअर करू नका.',
        'खात्री नसल्यास, कॉल बंद करा आणि संस्थेच्या अधिकृत नंबरवर परत कॉल करा.',
      ],
      dismiss: 'बंद करा',
      imSafe: 'मी सुरक्षित आहे, बंद करा',
      riskScoreLabel: 'जोखीम स्कोअर',
      tacticsCountLabel: '{count} फसवणुकीच्या युक्त्या आढळल्या',
      patternDisclaimer: 'हाय-रिस्क स्कॅम पॅटर्न आढळला आहे. कोणतीही कृती करण्यापूर्वी स्वतः खात्री करा.',
      immediateActionsTitle: 'आत्ताच करा',
      immediateActions: {
        stopTitle: 'थांबा',
        stopBody: 'कोणतेही पैसे ट्रान्सफर करू नका — कोणतेही "फी", "डिपॉझिट" किंवा "परत मिळणारे" पेमेंट खरे नसते.',
        noShareTitle: 'शेअर करू नका',
        noShareBody: 'फोनवर कोणालाही OTP, UPI पिन, CVV किंवा पासवर्ड कधीही देऊ नका.',
        disconnectTitle: 'कॉल बंद करा',
        disconnectBody: 'सुरक्षित वाटत असल्यास आत्ताच कॉल बंद करा.',
        verifyTitle: 'खात्री करा',
        verifyBody: 'संस्थेच्या अधिकृत नंबरवर थेट संपर्क करा — कॉलरने दिलेल्या नंबरवर कधीही नाही.',
      },
      getHelpButton: 'मदत मिळवा आणि रिपोर्ट करा',
      viewSummaryButton: 'घटना सारांश पहा',
      mediumGetHelpLink: 'काय करावे समजत नाही?',
    },
    trustedContact: {
      title: 'विश्वासू संपर्काला सतर्क करा',
      subtitle: 'जेणेकरून कोणीतरी तुमची विचारपूस करू शकेल.',
      contactName: 'अमित (मुलगा)',
      messageTemplate: 'RakshaCall ला एक हाय-रिस्क संशयास्पद कॉल आढळला. संकेत: {tactics}. कृपया शक्य होईल तेव्हा माझी विचारपूस करा.',
      messageTacticsFallback: 'एक असामान्य पॅटर्न',
      alertButton: 'अमितला (मुलगा) सतर्क करा',
      alertSentTitle: 'अलर्ट तयार केला',
      alertSentBody: 'हा संदेश तयार करण्यात आला आहे आणि तुमच्या विश्वासू संपर्काला पाठवला जाईल.',
      simulatedLabel: 'डेमो / प्रीव्ह्यू — कोणताही खरा संदेश पाठवला जात नाही.',
      copyButton: 'संदेश कॉपी करा',
      copiedLabel: 'कॉपी झाले!',
      copyFailedLabel: 'कॉपी करता आले नाही — तुम्ही वरील मजकूर निवडून स्वतः कॉपी करू शकता.',
    },
    actionHub: {
      title: 'मदत मिळवा आणि रिपोर्ट करा',
      subtitle: 'तातडीने उचलायची पावले, अधिकृत हेल्पलाइन आणि रिपोर्टिंग चॅनेल.',
      close: 'बंद करा',
      helplineTitle: 'सायबर क्राइम हेल्पलाइन',
      helplineDescription: 'आर्थिक सायबर गुन्ह्याची तक्रार करण्यासाठी आणि फसवा व्यवहार थांबवण्यास मदतीसाठी 1930 वर कॉल करा.',
      callButton: '1930 वर कॉल करा',
      callHint: 'तुमचे डिव्हाइस सपोर्ट करत असल्यास हे फोन डायलर उघडते.',
      reportingTitle: 'आर्थिक सायबर गुन्ह्याची तक्रार करा',
      reportingDescription: 'अधिकृत राष्ट्रीय सायबर क्राइम रिपोर्टिंग पोर्टलवर (भारत सरकार) तक्रार नोंदवा.',
      reportingButton: 'cybercrime.gov.in उघडा',
      chakshuTitle: 'संशयास्पद कॉल / SMS ची तक्रार करा (चक्षु)',
      chakshuDescription: 'संशयास्पद कॉल, SMS किंवा WhatsApp संदेशांची टेलिकॉम नियामकाकडे तक्रार करण्यासाठी — हे आर्थिक नुकसानीची तक्रार करण्यासारखे नाही.',
      chakshuButton: 'संचार साथी (चक्षु) उघडा',
      chakshuDistinction: 'तुमचे पैसे आधीच गेले असतील, तर वरील सायबर क्राइम हेल्पलाइन वापरा — चक्षु फक्त संशयास्पद संवादाची तक्रार करण्यासाठी आहे.',
      whatToDoTitle: 'आत्ता काय करावे',
      whatToDoSteps: [
        'सुरक्षित वाटत असल्यास कॉल बंद करा.',
        'पैसे ट्रान्सफर करू नका — कोणतेही "व्हेरिफिकेशन", "सिक्युरिटी" किंवा "परत मिळणारे" पेमेंट खरे नसते.',
        'कधीही OTP, UPI पिन, CVV, पासवर्ड किंवा कार्ड तपशील शेअर करू नका.',
        'विश्वासू व्यक्तीशी संपर्क करा आणि काय घडले ते सांगा.',
        'अधिकृत चॅनेलद्वारे घटनेची तक्रार करा.',
      ],
      whatNotToDoTitle: 'काय करू नये',
      whatNotToDoItems: [
        'पैसे ट्रान्सफर करू नका.',
        'OTP शेअर करू नका.',
        'UPI पिन शेअर करू नका.',
        'रिमोट-अ‍ॅक्सेस अ‍ॅप (AnyDesk, TeamViewer इ.) इन्स्टॉल करू नका.',
        'तुमची स्क्रीन शेअर करू नका.',
        'एकटे राहू नका — कुटुंबाला किंवा मित्राला सांगा.',
        'फक्त कॉलर ID वर विश्वास ठेवू नका — ती बनावट असू शकते.',
        'कोणाच्या सांगण्यावरून पैसे "सेफ अकाउंट" मध्ये पाठवू नका.',
      ],
      officialChannelNote: 'ही भारत सरकारची अधिकृत चॅनेल्स आहेत. RakshaCall तुमच्या वतीने काहीही सबमिट करत नाही — ते फक्त तुम्हाला यांच्याशी जोडते.',
    },
    incidentReport: {
      title: 'घटना सारांश',
      subtitle: 'या सेशनमध्ये RakshaCall ला जे आढळले त्याचा एक लोकल सारांश.',
      close: 'बंद करा',
      idLabel: 'घटना ID',
      generatedAtLabel: 'तयार केले',
      sourceLabel: 'स्रोत',
      sourceLiveCall: 'लाइव्ह कॉल सिम्युलेशन',
      sourcePaste: 'पेस्ट/टाइप केलेला ट्रान्सक्रिप्ट',
      scenarioLabel: 'सीनारियो',
      durationLabel: 'कालावधी',
      durationNotAvailable: 'लागू नाही',
      peakScoreLabel: 'सर्वोच्च जोखीम स्कोअर',
      finalLevelLabel: 'अंतिम जोखीम पातळी',
      scamTypeLabel: 'संभाव्य स्कॅम प्रकार',
      scamTypeUnknown: 'निश्चित नाही',
      scamTypes: {
        digitalArrest: 'डिजिटल अरेस्ट / पोलीस तोतयागिरी',
        fakeBank: 'बनावट बँक / फ्रॉड-प्रिव्हेन्शन कॉल',
        courierCustoms: 'कुरियर / कस्टम्स जप्ती स्कॅम',
        simDeactivation: 'सिम डिअ‍ॅक्टिव्हेशन / टेलिकॉम तोतयागिरी',
        investment: 'इन्व्हेस्टमेंट / टास्क स्कॅम',
        normal: 'स्कॅम पॅटर्न नाही',
      },
      detectedTacticsTitle: 'ओळखलेल्या युक्त्या',
      noTacticsDetected: 'कोणतीही संशयास्पद युक्ती आढळली नाही.',
      timelineTitle: 'डिटेक्शन टाइमलाइन',
      timelineEmpty: 'कोणतीही डिटेक्शन इव्हेंट नोंदवली गेली नाही.',
      recommendedActionsTitle: 'शिफारस केलेल्या कृती',
      copyButton: 'सारांश कॉपी करा',
      copiedLabel: 'कॉपी झाले!',
      copyFailedLabel: 'कॉपी करता आले नाही — तुम्ही खालील मजकूर निवडून स्वतः कॉपी करू शकता.',
      downloadButton: 'मजकूर म्हणून डाउनलोड करा',
      privacyNote:
        'RakshaCall चे डिटेक्शन विश्लेषण या ब्राउझरवर पूर्णपणे लोकल चालते. हा अहवाल फक्त या सेशनमध्ये उपलब्ध माहितीवरून तयार होतो आणि इतरत्र कुठेही साठवला जात नाही.',
      disclaimerNote: 'हा एक लोकल, ऑटोमेटेड विश्लेषणातून तयार केलेला स्कॅम डिटेक्शन अहवाल आहे — हा कोणताही प्रमाणित किंवा कायदेशीररीत्या ग्राह्य दस्तऐवज नाही. नेहमी स्वतः खात्री करा.',
      endedBannerTitle: 'कॉल संपला',
      endedBannerBody: 'या कॉल दरम्यान RakshaCall ला काय आढळले याचा सारांश तुम्ही पाहू शकता.',
      viewButton: 'घटना सारांश पहा',
    },
    paste: {
      title: 'ट्रान्सक्रिप्ट तपासा',
      subtitle: 'कॉलरने जे सांगितले ते पेस्ट किंवा टाइप करा, RakshaCall ते लगेच डिव्हाइसवरच तपासेल.',
      placeholder: 'उदा. "हे CBI आहे, तुमच्याविरुद्ध केस आहे, कॉल बंद करू नका..."',
      analyzeButton: 'तपासा',
      clearButton: 'साफ करा',
      micStart: 'बोलून सांगा',
      micListening: 'ऐकत आहे…',
      liveNote: 'तुम्ही टाइप करताच लगेच चालते — पूर्णपणे डिव्हाइसवर, कोणत्याही बटणाची गरज नाही.',
      micPermissionDenied:
        'लाइव्ह व्हॉइस विश्लेषणासाठी मायक्रोफोन अ‍ॅक्सेस आवश्यक आहे. तुम्ही ते तुमच्या ब्राउझरच्या परवानगी सेटिंग्जमध्ये सुरू करू शकता, किंवा खाली संभाषण टाइप/पेस्ट करू शकता.',
      micNoMic: 'या डिव्हाइसवर कोणताही मायक्रोफोन आढळला नाही. तुम्ही खाली संभाषण टाइप/पेस्ट करू शकता.',
      micError: 'व्हॉइस रेकग्निशनमध्ये अडचण आली आणि ते थांबले. तुम्ही पुन्हा ऐकण्याचा प्रयत्न करू शकता, किंवा खाली संभाषण टाइप/पेस्ट करू शकता.',
      micUnsupportedNote: 'या ब्राउझरमध्ये व्हॉइस इनपुट सपोर्ट नाही. तुम्ही खाली संभाषण टाइप/पेस्ट करू शकता.',
      micPrivacyNote:
        'तुमची ट्रान्सक्रिप्ट नेहमी RakshaCall च्या लोकल डिटेक्शन इंजिनवरच तपासली जाते. स्पीच-टू-टेक्स्ट ही तुमच्या ब्राउझरची स्वतःची सुविधा आहे — काही ब्राउझर ते डिव्हाइसवरच प्रोसेस करतात, तर काही (उदा. Chrome) मजकूर तयार करण्यासाठी ऑडिओ त्यांच्या सर्व्हरवर पाठवू शकतात. RakshaCall स्वतः तुमचा आवाज किंवा ट्रान्सक्रिप्ट कुठेही पाठवत नाही.',
    },
    accessibility: { largeText: 'मोठा मजकूर', languageLabel: 'भाषा' },
    footer: {
      limitationsTitle: 'या बिल्डमध्ये खरे काय आणि सिम्युलेटेड काय',
      limitationsBody:
        'डिटेक्शन पूर्णपणे लोकल, डिटरमिनिस्टिक पॅटर्न-मॅचिंग इंजिनवर चालते — कोणताही डेटा तुमच्या डिव्हाइसबाहेर जात नाही आणि कोणतेही पेड AI API वापरले जात नाही. "लाइव्ह कॉल" ही सिम्युलेटेड ट्रान्सक्रिप्ट स्ट्रीम आहे (किंवा सपोर्ट असल्यास तुमचा ब्राउझर मायक्रोफोन); हे खऱ्या टेलिकॉम कॉल्सना इंटरसेप्ट करत नाही. विश्वासू संपर्क अलर्ट हे सिम्युलेटेड प्रीव्ह्यू आहे, खरा पाठवलेला संदेश नाही.',
    },
  },
}
