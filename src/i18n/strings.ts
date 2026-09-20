import type { SignalCategoryId } from '../data/signals'

export type Lang = 'en' | 'hi' | 'mr'

export const LANGUAGES: { code: Lang; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
]

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
    heroTitle: string
    heroSubtitle: string
    ctaStart: string
    ctaPaste: string
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
  }
  trustedContact: {
    title: string
    subtitle: string
    contactName: string
    messagePreview: string
    alertButton: string
    alertSentTitle: string
    alertSentBody: string
    simulatedLabel: string
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
      heroTitle: 'Stay protected, while it\'s still happening.',
      heroSubtitle:
        'RakshaCall listens to a call\'s conversation in real time and warns you the moment it recognizes a scam pattern — authority impersonation, threats, isolation tactics, OTP or money requests — before you act.',
      ctaStart: 'Try the Live Demo',
      ctaPaste: 'Analyze a Transcript',
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
    },
    trustedContact: {
      title: 'Alert a trusted contact',
      subtitle: 'Send a quick heads-up so someone can check in on you.',
      contactName: 'Amit (Son)',
      messagePreview:
        'RakshaCall detected a likely scam call in progress. Please try calling to check in when you can.',
      alertButton: 'Alert Amit (Son)',
      alertSentTitle: 'Alert prepared',
      alertSentBody: 'This message has been prepared and would be sent to your trusted contact.',
      simulatedLabel: 'Simulated for this demo — no real message is sent.',
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
      heroTitle: 'जब तक हो रहा है, तभी सुरक्षित रहें।',
      heroSubtitle:
        'RakshaCall बातचीत को रीयल-टाइम में सुनता है और जैसे ही किसी स्कैम पैटर्न को पहचानता है — अधिकारी बनना, धमकी, अलग-थलग करना, OTP या पैसे मांगना — आपको तुरंत आगाह करता है, इससे पहले कि आप कुछ करें।',
      ctaStart: 'लाइव डेमो आज़माएं',
      ctaPaste: 'ट्रांसक्रिप्ट जांचें',
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
    },
    trustedContact: {
      title: 'किसी भरोसेमंद संपर्क को सूचित करें',
      subtitle: 'ताकि कोई आपका हाल-चाल जांच सके।',
      contactName: 'अमित (बेटा)',
      messagePreview: 'RakshaCall ने एक संभावित स्कैम कॉल का पता लगाया है। कृपया जब हो सके कॉल करके देखें।',
      alertButton: 'अमित (बेटा) को सूचित करें',
      alertSentTitle: 'अलर्ट तैयार किया गया',
      alertSentBody: 'यह संदेश तैयार किया गया है और आपके भरोसेमंद संपर्क को भेजा जाएगा।',
      simulatedLabel: 'यह डेमो के लिए सिम्युलेटेड है — कोई असली संदेश नहीं भेजा जाता।',
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
      heroTitle: 'जोपर्यंत घडत आहे, तोपर्यंत सुरक्षित रहा.',
      heroSubtitle:
        'RakshaCall संभाषण रिअल-टाइममध्ये ऐकतो आणि स्कॅम पॅटर्न ओळखताच — अधिकारी असल्याचे भासवणे, धमकी, वेगळे पाडणे, OTP किंवा पैसे मागणे — तुम्ही काही करण्यापूर्वीच तुम्हाला सावध करतो.',
      ctaStart: 'लाइव्ह डेमो पहा',
      ctaPaste: 'ट्रान्सक्रिप्ट तपासा',
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
    },
    trustedContact: {
      title: 'विश्वासू संपर्काला सतर्क करा',
      subtitle: 'जेणेकरून कोणीतरी तुमची विचारपूस करू शकेल.',
      contactName: 'अमित (मुलगा)',
      messagePreview: 'RakshaCall ला संभाव्य स्कॅम कॉल आढळला आहे. कृपया शक्य होईल तेव्हा कॉल करून विचारपूस करा.',
      alertButton: 'अमितला (मुलगा) सतर्क करा',
      alertSentTitle: 'अलर्ट तयार केला',
      alertSentBody: 'हा संदेश तयार करण्यात आला आहे आणि तुमच्या विश्वासू संपर्काला पाठवला जाईल.',
      simulatedLabel: 'हे डेमोसाठी सिम्युलेटेड आहे — कोणताही खरा संदेश पाठवला जात नाही.',
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
    },
    accessibility: { largeText: 'मोठा मजकूर', languageLabel: 'भाषा' },
    footer: {
      limitationsTitle: 'या बिल्डमध्ये खरे काय आणि सिम्युलेटेड काय',
      limitationsBody:
        'डिटेक्शन पूर्णपणे लोकल, डिटरमिनिस्टिक पॅटर्न-मॅचिंग इंजिनवर चालते — कोणताही डेटा तुमच्या डिव्हाइसबाहेर जात नाही आणि कोणतेही पेड AI API वापरले जात नाही. "लाइव्ह कॉल" ही सिम्युलेटेड ट्रान्सक्रिप्ट स्ट्रीम आहे (किंवा सपोर्ट असल्यास तुमचा ब्राउझर मायक्रोफोन); हे खऱ्या टेलिकॉम कॉल्सना इंटरसेप्ट करत नाही. विश्वासू संपर्क अलर्ट हे सिम्युलेटेड प्रीव्ह्यू आहे, खरा पाठवलेला संदेश नाही.',
    },
  },
}
