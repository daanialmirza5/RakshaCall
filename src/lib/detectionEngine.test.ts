import { describe, expect, it } from 'vitest'
import { analyzeCallerText } from './detectionEngine'

describe('detectionEngine', () => {
  it('scores a normal, everyday call as LOW risk', () => {
    const text =
      "Hi, this is Rohan from Bluedart. Your package is out for delivery today between 2 and 5 PM. Please keep someone available at home to receive it."
    const result = analyzeCallerText(text)
    expect(result.level).toBe('LOW')
    expect(result.matchedCategories.length).toBe(0)
  })

  it('scores a genuine bank KYC call as LOW or MEDIUM, never HIGH', () => {
    const text =
      "Good afternoon, this is HDFC Bank calling to confirm your KYC update is complete. No action is needed from your side. Have a nice day."
    const result = analyzeCallerText(text)
    expect(result.level).not.toBe('HIGH')
  })

  it('flags a classic digital-arrest / fake-CBI script as HIGH risk', () => {
    const text = `
      This is Officer Sharma calling from CBI cyber crime cell. There is an
      FIR registered against your Aadhaar number for money laundering. This
      is a non-bailable case. You must not disconnect this call and you must
      not tell anyone about this, it is a confidential investigation. Keep
      your video camera on at all times. If you do not cooperate immediately
      you will be arrested within the hour. To verify your identity and clear
      your name, transfer the amount to the RBI verification account we will
      provide, and share the OTP sent to your phone.
    `
    const result = analyzeCallerText(text)
    expect(result.level).toBe('HIGH')
    expect(result.matchedCategories.length).toBeGreaterThanOrEqual(5)
    expect(result.topCategoryIds).toContain('financialExtraction')
    expect(result.topCategoryIds).toContain('isolation')
  })

  it('flags a remote-access-app scam as HIGH risk even with fewer phrases', () => {
    const text =
      "Sir there is a virus in your bank account, please install AnyDesk immediately and give me the code shown on your screen so I can fix it, otherwise your account will be frozen."
    const result = analyzeCallerText(text)
    expect(result.level).toBe('HIGH')
    expect(result.topCategoryIds[0]).toBe('remoteAccess')
  })

  it('flags a courier/customs parcel scam as at least MEDIUM risk', () => {
    const text =
      "This is Customs department. A parcel under your name contains illegal items and has been seized. This is urgent, you must pay a processing fee immediately or legal action will be taken against you."
    const result = analyzeCallerText(text)
    expect(['MEDIUM', 'HIGH']).toContain(result.level)
  })

  it('does not flag a friendly personal chat', () => {
    const text =
      "Hey! Are we still on for dinner tonight? I was thinking we could try that new place near the station. Let me know what time works for you."
    const result = analyzeCallerText(text)
    expect(result.level).toBe('LOW')
  })

  it('handles empty input safely', () => {
    const result = analyzeCallerText('')
    expect(result.score).toBe(0)
    expect(result.level).toBe('LOW')
    expect(result.matchedCategories).toEqual([])
  })

  it('is case-insensitive and punctuation-tolerant', () => {
    const result = analyzeCallerText('DO NOT HANG UP!!! Share the OTP NOW, this is URGENT.')
    expect(result.matchedCategories.length).toBeGreaterThan(0)
  })
})

describe('vernacular detection — English', () => {
  it('flags a digital-arrest script', () => {
    const result = analyzeCallerText(
      'This is CBI calling. There is an FIR against you for money laundering, it is a non-bailable case. Transfer the money immediately or you will be arrested.',
    )
    expect(result.level).toBe('HIGH')
    expect(result.matchedCategories.length).toBeGreaterThanOrEqual(4)
  })

  it('flags a fake-CBI + remote-access combo', () => {
    const result = analyzeCallerText('Officer from CBI here. Install AnyDesk immediately so we can verify your account.')
    expect(result.topCategoryIds[0]).toBe('remoteAccess')
  })

  it('flags a bank-KYC / credential-theft script', () => {
    const result = analyzeCallerText('Your account will be blocked. Share the code sent to your phone immediately to keep it active.')
    expect(['MEDIUM', 'HIGH']).toContain(result.level)
  })

  it('flags a customs-seizure script', () => {
    const result = analyzeCallerText('Customs has seized your parcel. Pay a penalty immediately or legal action will be taken.')
    expect(['MEDIUM', 'HIGH']).toContain(result.level)
  })

  it('flags a SIM-deactivation script', () => {
    const result = analyzeCallerText('This is TRAI. Your SIM will be blocked within one hour unless you verify immediately.')
    expect(result.matchedCategories.length).toBeGreaterThan(0)
  })

  it('flags a remote-access support scam', () => {
    const result = analyzeCallerText('Please download the application and give me the code shown on your screen right now.')
    expect(result.topCategoryIds[0]).toBe('remoteAccess')
  })
})

describe('vernacular detection — Hinglish (romanized)', () => {
  it('flags a fake-CBI FIR opener', () => {
    const result = analyzeCallerText('Main CBI officer bol raha hoon, aapke naam pe FIR hai.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('authority')
  })

  it('flags an urgent money-transfer demand', () => {
    const result = analyzeCallerText('Turant paise transfer karo.')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(expect.arrayContaining(['urgency', 'financialExtraction']))
  })

  it('flags an arrest threat', () => {
    const result = analyzeCallerText('Agar call cut kiya toh arrest ho jaoge.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('threat')
  })

  it('flags an isolation instruction', () => {
    const result = analyzeCallerText('Kisi ko mat batana.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('isolation')
  })

  it('flags a surveillance instruction', () => {
    const result = analyzeCallerText('Camera on rakho.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('surveillance')
  })

  it('flags an OTP request', () => {
    const result = analyzeCallerText('OTP batao.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('credentialExtraction')
  })

  it('flags a remote-access app request', () => {
    const result = analyzeCallerText('AnyDesk download karo.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('remoteAccess')
  })

  it('flags a full digital-arrest-style Hinglish script as HIGH', () => {
    const result = analyzeCallerText(
      'Main CBI se bol raha hoon. Aapke naam pe FIR darj hui hai, yeh non bailable case hai. Kisi ko mat batana aur call mat kaatna. Turant paise transfer karo, warna girftar ho jaoge.',
    )
    expect(result.level).toBe('HIGH')
  })
})

describe('vernacular detection — Hindi (Devanagari)', () => {
  it('flags an arrest threat', () => {
    const result = analyzeCallerText('आपको गिरफ्तार कर लिया जाएगा।')
    expect(result.matchedCategories.map((m) => m.id)).toContain('threat')
  })

  it('flags an urgent money-transfer demand', () => {
    const result = analyzeCallerText('तुरंत पैसे भेजो।')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(expect.arrayContaining(['urgency', 'financialExtraction']))
  })

  it('flags an isolation instruction', () => {
    const result = analyzeCallerText('किसी को मत बताना।')
    expect(result.matchedCategories.map((m) => m.id)).toContain('isolation')
  })

  it('flags an OTP request', () => {
    const result = analyzeCallerText('ओटीपी बताओ।')
    expect(result.matchedCategories.map((m) => m.id)).toContain('credentialExtraction')
  })

  it('flags an account-block threat', () => {
    const result = analyzeCallerText('खाता ब्लॉक कर दिया जाएगा।')
    expect(result.matchedCategories.map((m) => m.id)).toContain('threat')
  })

  it('flags an FIR / authority claim', () => {
    const result = analyzeCallerText('आपके खिलाफ एफआईआर दर्ज हुई है।')
    expect(result.matchedCategories.length).toBeGreaterThan(0)
  })

  it('flags a video-surveillance instruction', () => {
    const result = analyzeCallerText('वीडियो कॉल चालू रखो।')
    expect(result.matchedCategories.map((m) => m.id)).toContain('surveillance')
  })

  it('flags a full digital-arrest-style Hindi script as HIGH', () => {
    const result = analyzeCallerText(
      'मैं सीबीआई अधिकारी बोल रहा हूं। आपके खिलाफ मनी लॉन्ड्रिंग का एफआईआर दर्ज हुई है, यह गैर जमानती मामला है। किसी को मत बताना, कॉल मत काटना। वीडियो चालू रखो। तुरंत पैसे ट्रांसफर करो वरना आपको गिरफ्तार कर लिया जाएगा।',
    )
    expect(result.level).toBe('HIGH')
  })
})

describe('vernacular detection — Marathi (Devanagari)', () => {
  it('flags an arrest threat', () => {
    const result = analyzeCallerText('तुम्हाला अटक केली जाईल.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('threat')
  })

  it('flags an urgent money-transfer demand', () => {
    const result = analyzeCallerText('लगेच पैसे पाठवा.')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(expect.arrayContaining(['urgency', 'financialExtraction']))
  })

  it('flags an isolation instruction', () => {
    const result = analyzeCallerText('कोणालाही सांगू नका.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('isolation')
  })

  it('flags a surveillance instruction', () => {
    const result = analyzeCallerText('व्हिडिओ कॉल सुरू ठेवा.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('surveillance')
  })

  it('flags an OTP request', () => {
    const result = analyzeCallerText('ओटीपी सांगा.')
    expect(result.matchedCategories.map((m) => m.id)).toContain('credentialExtraction')
  })

  it('flags a police-impersonation + account-freeze combo', () => {
    const result = analyzeCallerText('मी पोलीस स्टेशनमधून बोलत आहे. तुमचे खाते गोठवले जाईल.')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(expect.arrayContaining(['authority', 'threat']))
  })

  it('flags a full digital-arrest-style Marathi script as HIGH', () => {
    const result = analyzeCallerText(
      'मी सीबीआय अधिकारी बोलत आहे. तुमच्याविरुद्ध एफआयआर दाखल आहे, हा जामीन न मिळणारा गुन्हा आहे. कोणालाही सांगू नका, कॉल बंद करू नका. व्हिडिओ सुरू ठेवा. लगेच पैसे पाठवा नाहीतर तुम्हाला अटक केली जाईल.',
    )
    expect(result.level).toBe('HIGH')
  })
})

describe('mixed-language transcripts', () => {
  it('detects signals split across English and Hindi in the same line', () => {
    const result = analyzeCallerText('Sir this is CBI, तुरंत पैसे ट्रांसफर करो otherwise arrest ho jaoge.')
    expect(result.level).toBe('HIGH')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(
      expect.arrayContaining(['authority', 'urgency', 'threat', 'financialExtraction']),
    )
  })

  it('detects signals split across English and Marathi in the same line', () => {
    const result = analyzeCallerText('This is the police, तुमचे खाते गोठवले जाईल unless you cooperate.')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(expect.arrayContaining(['authority', 'threat']))
  })

  it('detects signals split across Hindi and Marathi phrases in the same call', () => {
    const result = analyzeCallerText('ओटीपी बताओ. लगेच पैसे पाठवा. कोणालाही सांगू नका.')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(
      expect.arrayContaining(['credentialExtraction', 'urgency', 'financialExtraction', 'isolation']),
    )
  })
})

describe('false-positive resistance', () => {
  const benignCases = [
    'I reported my lost wallet to the police.',
    'I reported my lost phone to the police.',
    'The bank called me about my account.',
    'My friend works for the police.',
    'I need to pay my electricity bill.',
    'The courier is arriving tomorrow.',
    'My father received a bank KYC message.',
    'Hi, this is Rohan from Bluedart, your package is out for delivery today.',
  ]

  it.each(benignCases)('does not mark "%s" as HIGH risk', (text) => {
    const result = analyzeCallerText(text)
    expect(result.level).not.toBe('HIGH')
  })

  it('a single neutral authority mention alone stays LOW risk', () => {
    const result = analyzeCallerText('I reported my lost wallet to the police.')
    expect(result.level).toBe('LOW')
  })

  it('authority + threat + urgency + financial demand together score much higher than authority alone', () => {
    const bare = analyzeCallerText('This is the police.')
    const stacked = analyzeCallerText('This is CBI, you will be arrested immediately unless you transfer the money now.')
    expect(stacked.score).toBeGreaterThan(bare.score)
    expect(stacked.level).toBe('HIGH')
  })
})

describe('edge cases', () => {
  it('handles whitespace-only input', () => {
    const result = analyzeCallerText('   \n\t  ')
    expect(result.score).toBe(0)
    expect(result.level).toBe('LOW')
  })

  it('handles punctuation-only input', () => {
    const result = analyzeCallerText('!!!...???,,,;;;')
    expect(result.score).toBe(0)
  })

  it('handles mixed-case scam phrases', () => {
    const result = analyzeCallerText('AnYdEsK DoWnLoAd KaRo')
    expect(result.matchedCategories.map((m) => m.id)).toContain('remoteAccess')
  })

  it('handles excessive repeated whitespace inside a phrase', () => {
    const result = analyzeCallerText('PAISE!!!   TRANSFER      KARO')
    expect(result.matchedCategories.map((m) => m.id)).toContain('financialExtraction')
  })

  it('handles excessive repeated whitespace inside a Devanagari phrase', () => {
    const result = analyzeCallerText('पैसे   ट्रांसफर   करो')
    expect(result.matchedCategories.map((m) => m.id)).toContain('financialExtraction')
  })

  it('does not crash on emoji-only input', () => {
    expect(() => analyzeCallerText('😀😀😀 🙏🏽')).not.toThrow()
  })

  it('does not crash on a URL', () => {
    const result = analyzeCallerText('Please visit https://example.com/verify?id=12345&token=abcxyz to continue.')
    expect(result.score).toBe(0)
  })

  it('does not crash on bare numbers or OTP-like digit strings', () => {
    expect(() => analyzeCallerText('482913')).not.toThrow()
    expect(() => analyzeCallerText('1234567890')).not.toThrow()
  })

  it('does not crash on an application name by itself', () => {
    const result = analyzeCallerText('QuickSupport')
    expect(result.matchedCategories.map((m) => m.id)).toContain('remoteAccess')
  })

  it('does not crash on a single partial word', () => {
    expect(() => analyzeCallerText('transfer')).not.toThrow()
  })

  it('does not crash on repeated phrases', () => {
    const result = analyzeCallerText('urgent urgent urgent urgent urgent urgent urgent')
    expect(result.matchedCategories.map((m) => m.id)).toEqual(['urgency'])
  })

  it('does not crash on very long transcripts and stays deterministic', () => {
    const long = 'blah blah normal conversation filler text. '.repeat(2000) + 'transfer the money immediately'
    const first = analyzeCallerText(long)
    const second = analyzeCallerText(long)
    expect(first).toEqual(second)
  })

  it('is deterministic — same input always produces the same result', () => {
    const text = 'This is CBI, transfer the money immediately, otherwise arrest ho jaoge.'
    const results = Array.from({ length: 5 }, () => analyzeCallerText(text))
    results.forEach((r) => expect(r).toEqual(results[0]))
  })
})
