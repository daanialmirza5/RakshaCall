import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Color Palette
    BG_COLOR = RGBColor(248, 250, 252)       # #f8fafc (Slate 50)
    CARD_BG = RGBColor(255, 255, 255)        # #ffffff
    CARD_BORDER = RGBColor(226, 232, 240)    # #e2e8f0 (Slate 200)
    TEXT_MAIN = RGBColor(15, 23, 42)          # #0f172a (Slate 900)
    TEXT_MUTED = RGBColor(100, 116, 139)     # #64748b (Slate 500)
    TEXT_LIGHT = RGBColor(71, 85, 105)       # #475569 (Slate 600)
    
    BRAND_TEAL = RGBColor(13, 148, 136)      # #0d9488 (Teal 600)
    BRAND_EMERALD = RGBColor(5, 150, 105)    # #059669 (Emerald 600)
    ACCENT_BLUE = RGBColor(37, 99, 235)      # #2563eb (Blue 600)
    ALERT_RED = RGBColor(220, 38, 38)        # #dc2626 (Red 600)
    ALERT_BG = RGBColor(254, 242, 242)       # #fef2f2 (Red 50)
    WARN_AMBER = RGBColor(217, 119, 6)       # #d97706 (Amber 600)

    def set_slide_bg(slide):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = BG_COLOR

    def add_header(slide, title_text, category_text="", subtitle_text=""):
        # Header banner box
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p0 = tf.paragraphs[0]
        if category_text:
            p0.text = category_text.upper()
            p0.font.size = Pt(10)
            p0.font.bold = True
            p0.font.color.rgb = BRAND_TEAL
            p0.font.name = 'Segoe UI'
            p1 = tf.add_paragraph()
        else:
            p1 = p0

        p1.text = title_text
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_MAIN
        p1.font.name = 'Segoe UI'

        if subtitle_text:
            p2 = tf.add_paragraph()
            p2.text = subtitle_text
            p2.font.size = Pt(12)
            p2.font.color.rgb = TEXT_MUTED
            p2.font.name = 'Segoe UI'

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.5)
        else:
            shape.line.fill.background()
        return shape

    def add_footer(slide, current_slide):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.3))
        tf = footer_box.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"RakshaCall  ·  HACKDAY 1.0  ·  Real-Time Scam-Call Protection"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = 'Segoe UI'

        page_box = slide.shapes.add_textbox(Inches(11.5), Inches(7.0), Inches(1.0), Inches(0.3))
        tf_p = page_box.text_frame
        tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0
        p_num = tf_p.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.text = f"{current_slide} / 7"
        p_num.font.size = Pt(9)
        p_num.font.bold = True
        p_num.font.color.rgb = TEXT_MUTED
        p_num.font.name = 'Segoe UI'

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide1)

    # Top accent bar
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = BRAND_EMERALD
    top_bar.line.fill.background()

    # Left content column
    left_card = add_card(slide1, Inches(0.8), Inches(0.8), Inches(6.0), Inches(5.8), bg_color=CARD_BG)
    
    tb1 = slide1.shapes.add_textbox(Inches(1.2), Inches(1.1), Inches(5.2), Inches(5.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0

    p = tf1.paragraphs[0]
    p.text = "HACKDAY 1.0  ·  TECH FOR A BETTER TOMORROW"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = BRAND_TEAL
    p.font.name = 'Segoe UI'

    p = tf1.add_paragraph()
    p.text = "RakshaCall 🛡️"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    p.font.name = 'Segoe UI'
    p.space_after = Pt(4)

    p = tf1.add_paragraph()
    p.text = "Real-Time Scam-Call Protection Assistant"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.font.name = 'Segoe UI'
    p.space_after = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Detect. Explain. Warn. Protect."
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = BRAND_EMERALD
    p.font.name = 'Segoe UI'
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "Protecting citizens from high-pressure social engineering, digital arrest, and financial extortion while the call is happening — not after funds are lost."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_LIGHT
    p.font.name = 'Segoe UI'
    p.space_after = Pt(16)

    # Team Box
    p = tf1.add_paragraph()
    p.text = "TEAM: daanialmirza"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    p.font.name = 'Segoe UI'

    p = tf1.add_paragraph()
    p.text = "• Daanial Baig (Team Leader)  |  +91 90041 22132\n• Aayush Patil (Team Member)  |  +91 88790 95131"
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_LIGHT
    p.font.name = 'Segoe UI'
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "🚀 Live Demo: daanialmirza5.github.io/RakshaCall/"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = BRAND_TEAL
    p.font.name = 'Segoe UI'

    # Right Hero Image
    img_path = 'docs/screenshots/01-landing-page.png'
    if os.path.exists(img_path):
        add_card(slide1, Inches(7.1), Inches(0.8), Inches(5.4), Inches(5.8), bg_color=CARD_BG)
        slide1.shapes.add_picture(img_path, Inches(7.2), Inches(0.9), width=Inches(5.2), height=Inches(5.6))

    add_footer(slide1, 1)

    # =========================================================================
    # SLIDE 2: THE PROBLEM
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide2)
    add_header(slide2, "Scam Calls Manipulate People in Real Time", "The Threat Landscape",
               "Scammers don't just steal data — they psychologically coerce victims before they realize what is happening.")

    # Flow Container Card
    add_card(slide2, Inches(0.8), Inches(1.6), Inches(11.7), Inches(1.3), bg_color=CARD_BG)
    tb_flow = slide2.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(11.3), Inches(1.1))
    tf_flow = tb_flow.text_frame
    tf_flow.word_wrap = True
    p = tf_flow.paragraphs[0]
    p.text = "THE ANATOMY OF A PSYCHOLOGICAL SCAM CALL"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ALERT_RED
    p.font.name = 'Segoe UI'

    p2 = tf_flow.add_paragraph()
    p2.text = "SCAMMER  ➔  Authority Impersonation  ➔  Urgency & Threats  ➔  Isolation  ➔  OTP / Money / Remote Access  ➔  VICTIM"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_MAIN
    p2.font.name = 'Segoe UI'

    # 3 Column Cards
    col_w = Inches(3.7)
    gap = Inches(0.3)

    # Card 1: Key Scam Modalities
    c1 = add_card(slide2, Inches(0.8), Inches(3.1), col_w, Inches(3.6))
    tb_c1 = slide2.shapes.add_textbox(Inches(1.0), Inches(3.2), Inches(3.3), Inches(3.4))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    p = tf_c1.paragraphs[0]
    p.text = "🚨 Predatory Modalities"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ALERT_RED
    p.font.name = 'Segoe UI'
    
    bullets1 = [
        "Digital Arrest: Fake CBI/Police video surveillance",
        "Fake Bank KYC: Urgent account block threats",
        "Customs / Courier: Seized illegal parcels",
        "SIM Deactivation: Immediate telecom shutoff",
        "Task / Investment: Upfront deposit extortion"
    ]
    for b in bullets1:
        p = tf_c1.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT
        p.font.name = 'Segoe UI'

    # Card 2: The Core Vulnerability
    c2 = add_card(slide2, Inches(0.8) + col_w + gap, Inches(3.1), col_w, Inches(3.6))
    tb_c2 = slide2.shapes.add_textbox(Inches(1.0) + col_w + gap, Inches(3.2), Inches(3.3), Inches(3.4))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    p = tf_c2.paragraphs[0]
    p.text = "⚡ Psychological Traps"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = WARN_AMBER
    p.font.name = 'Segoe UI'
    
    bullets2 = [
        "Enforced Secrecy: 'Do not tell family or police'",
        "High-Stress Panic: 'Transfer in 10 mins or arrest'",
        "Credential Extraction: OTPs, PINs, Passwords",
        "Targeted Victims: Seniors & non-technical citizens",
        "~₹3,000+ Cr estimated lost to Digital Arrest in 2025 alone"
    ]
    for b in bullets2:
        p = tf_c2.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_LIGHT
        p.font.name = 'Segoe UI'

    # Card 3: The Fatal Defense Gap
    c3 = add_card(slide2, Inches(0.8) + (col_w + gap)*2, Inches(3.1), col_w, Inches(3.6), bg_color=ALERT_BG, border_color=ALERT_RED)
    tb_c3 = slide2.shapes.add_textbox(Inches(1.0) + (col_w + gap)*2, Inches(3.2), Inches(3.3), Inches(3.4))
    tf_c3 = tb_c3.text_frame
    tf_c3.word_wrap = True
    p = tf_c3.paragraphs[0]
    p.text = "❌ Why Defenses Fail"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ALERT_RED
    p.font.name = 'Segoe UI'
    
    bullets3 = [
        "Bank Fraud Alerts: Trigger AFTER money is moved",
        "Telecom Filters: Block spam numbers, not live voices",
        "Cybercrime Portals: Report incidents days later",
        "Zero Real-Time Guidance: Victim is alone during call",
        "👉 Need protection DURING the manipulation!"
    ]
    for b in bullets3:
        p = tf_c3.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(10.5)
        p.font.bold = (b.startswith("👉"))
        p.font.color.rgb = ALERT_RED if b.startswith("👉") else TEXT_LIGHT
        p.font.name = 'Segoe UI'

    add_footer(slide2, 2)

    # =========================================================================
    # SLIDE 3: OUR SOLUTION (MEET RAKSHACALL)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide3)
    add_header(slide3, "Meet RakshaCall", "The Real-Time Defense Assistant",
               "A conversational safety assistant that detects scam tactics and protects citizens while the conversation is happening.")

    # Flow Banner
    add_card(slide3, Inches(0.8), Inches(1.6), Inches(11.7), Inches(0.9), bg_color=CARD_BG)
    tb_sflow = slide3.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(11.3), Inches(0.7))
    tf_sflow = tb_sflow.text_frame
    p = tf_sflow.paragraphs[0]
    p.text = "CONVERSATION  ➔  DETECT  ➔  ASSESS RISK  ➔  WARN  ➔  PROTECT  ➔  HELP"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = BRAND_TEAL
    p.font.name = 'Segoe UI'

    # Left Column: Feature Grid
    left_w = Inches(5.6)
    add_card(slide3, Inches(0.8), Inches(2.7), left_w, Inches(4.0))
    tb_feat = slide3.shapes.add_textbox(Inches(1.0), Inches(2.8), Inches(5.2), Inches(3.8))
    tf_feat = tb_feat.text_frame
    tf_feat.word_wrap = True

    features = [
        ("🛡️ Real-Time Detection", "Continuous stream evaluation of dialogue as words are spoken"),
        ("🔎 Explainable Tactics", "Clear classification across 8 social-engineering vector categories"),
        ("🚨 Risk Escalation", "Dynamic progressive threat scoring (0–100) across Low, Med, High"),
        ("🛑 Safety Intervention", "Full-screen actionable takeover: STOP · DO NOT SHARE · DISCONNECT"),
        ("👨‍👩‍👧 Trusted Contact Check-In", "One-tap emergency check-in alert to family or guardians"),
        ("🇮🇳 Indian Scam Aware", "Native recognition of English, Hinglish, Hindi, and Marathi")
    ]
    for idx, (title, desc) in enumerate(features):
        p = tf_feat.paragraphs[0] if idx == 0 else tf_feat.add_paragraph()
        p.text = f"{title}: {desc}"
        p.font.size = Pt(10.5)
        p.font.name = 'Segoe UI'
        p.font.color.rgb = TEXT_MAIN

    # Right Column: Screenshot
    img_path = 'docs/screenshots/03-live-call-transcript.png'
    if os.path.exists(img_path):
        add_card(slide3, Inches(6.7), Inches(2.7), Inches(5.8), Inches(4.0))
        slide3.shapes.add_picture(img_path, Inches(6.8), Inches(2.8), width=Inches(5.6), height=Inches(3.8))

    add_footer(slide3, 3)

    # =========================================================================
    # SLIDE 4: HOW RAKSHACALL WORKS
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide4)
    add_header(slide4, "From Conversation to Protection", "Deterministic & Explainable Engine",
               "Zero black-box AI, zero cloud latency, and 100% on-device privacy.")

    # 6 Step Cards
    step_w = Inches(1.8)
    step_gap = Inches(0.18)
    steps = [
        ("1. Input", "Call Stream\nMic Audio\nPasted Text", BRAND_TEAL),
        ("2. Normalize", "Unicode\nTransliteration\nCase & Spacing", BRAND_TEAL),
        ("3. Signals", "8 Multi-Vector\nScam Tactic\nCategories", ACCENT_BLUE),
        ("4. Scoring", "Co-occurrence\nBoost & Math\nWeights (0–100)", ACCENT_BLUE),
        ("5. Classifier", "LOW (0–24)\nMEDIUM (25–54)\nHIGH (55–100)", WARN_AMBER),
        ("6. Action", "Screen Takeover\nTrusted Alert\n1930 Helpline", ALERT_RED)
    ]

    for i, (stitle, sdesc, scolor) in enumerate(steps):
        s_left = Inches(0.8) + i * (step_w + step_gap)
        add_card(slide4, s_left, Inches(1.6), step_w, Inches(1.5), bg_color=CARD_BG)
        tb_st = slide4.shapes.add_textbox(s_left + Inches(0.1), Inches(1.7), step_w - Inches(0.2), Inches(1.3))
        tf_st = tb_st.text_frame
        tf_st.word_wrap = True
        p = tf_st.paragraphs[0]
        p.text = stitle
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = scolor
        p.font.name = 'Segoe UI'

        p2 = tf_st.add_paragraph()
        p2.text = sdesc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_LIGHT
        p2.font.name = 'Segoe UI'

    # Bottom Left: 8 Categories
    add_card(slide4, Inches(0.8), Inches(3.3), Inches(5.6), Inches(3.4))
    tb_cat = slide4.shapes.add_textbox(Inches(1.0), Inches(3.4), Inches(5.2), Inches(3.2))
    tf_cat = tb_cat.text_frame
    tf_cat.word_wrap = True
    p = tf_cat.paragraphs[0]
    p.text = "🎯 8 Observable Social-Engineering Categories"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.font.name = 'Segoe UI'

    cat_list = [
        "• Authority Impersonation: CBI, Police, Customs, RBI officials",
        "• Urgency & Threat: Immediate arrest, bank account blocking",
        "• Isolation & Secrecy: 'Do not hang up, do not tell family'",
        "• Financial Demand: 'Refundable verification fees', penalties",
        "• OTP & Credential Harvesting: UPI PIN, CVV, OTP requests",
        "• Remote Access: AnyDesk, TeamViewer, QuickSupport requests"
    ]
    for c in cat_list:
        p = tf_cat.add_paragraph()
        p.text = c
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_LIGHT
        p.font.name = 'Segoe UI'

    # Bottom Right: Detection Screenshot
    img_path = 'docs/screenshots/04-live-call-detection.png'
    if os.path.exists(img_path):
        add_card(slide4, Inches(6.7), Inches(3.3), Inches(5.8), Inches(3.4))
        slide4.shapes.add_picture(img_path, Inches(6.8), Inches(3.4), width=Inches(5.6), height=Inches(3.2))

    add_footer(slide4, 4)

    # =========================================================================
    # SLIDE 5: LIVE PROTECTION EXPERIENCE
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide5)
    add_header(slide5, "When Risk Becomes High, RakshaCall Acts", "Immediate Safety Directives",
               "Breaking the psychological manipulation loop with four unambiguous citizen commands.")

    # 4 Directives Banner
    card_w4 = Inches(2.75)
    gap4 = Inches(0.23)
    directives = [
        ("🛑 STOP", "Do not transfer any money or pay verification fees.", ALERT_RED, ALERT_BG),
        ("🔒 DO NOT SHARE", "Never disclose OTPs, PINs, CVVs, or passwords.", ALERT_RED, ALERT_BG),
        ("📞 DISCONNECT", "Immediately hang up the suspicious call.", WARN_AMBER, CARD_BG),
        ("🔍 VERIFY", "Independently contact official numbers directly.", BRAND_TEAL, CARD_BG)
    ]

    for i, (dtitle, ddesc, dcol, dbg) in enumerate(directives):
        d_left = Inches(0.8) + i * (card_w4 + gap4)
        add_card(slide5, d_left, Inches(1.6), card_w4, Inches(1.1), bg_color=dbg, border_color=dcol)
        tb_d = slide5.shapes.add_textbox(d_left + Inches(0.1), Inches(1.7), card_w4 - Inches(0.2), Inches(0.9))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p = tf_d.paragraphs[0]
        p.text = dtitle
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = dcol
        p.font.name = 'Segoe UI'

        p2 = tf_d.add_paragraph()
        p2.text = ddesc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_LIGHT
        p2.font.name = 'Segoe UI'

    # 3 Screenshots in lower section
    # Left: High Risk Warning
    img_w3 = Inches(3.7)
    img_h3 = Inches(3.8)

    img_warning = 'docs/screenshots/05-risk-warning.png'
    if os.path.exists(img_warning):
        add_card(slide5, Inches(0.8), Inches(2.9), img_w3, img_h3)
        slide5.shapes.add_picture(img_warning, Inches(0.9), Inches(3.0), width=img_w3 - Inches(0.2), height=img_h3 - Inches(0.2))

    # Center: Trusted Contact
    img_trusted = 'docs/screenshots/15-trusted-contact.png'
    if os.path.exists(img_trusted):
        add_card(slide5, Inches(0.8) + img_w3 + Inches(0.3), Inches(2.9), img_w3, img_h3)
        slide5.shapes.add_picture(img_trusted, Inches(0.8) + img_w3 + Inches(0.4), Inches(3.0), width=img_w3 - Inches(0.2), height=img_h3 - Inches(0.2))

    # Right: Emergency Action Hub
    img_hub = 'docs/screenshots/16-emergency-action-hub.png'
    if os.path.exists(img_hub):
        add_card(slide5, Inches(0.8) + (img_w3 + Inches(0.3))*2, Inches(2.9), img_w3, img_h3)
        slide5.shapes.add_picture(img_hub, Inches(0.8) + (img_w3 + Inches(0.3))*2 + Inches(0.1), Inches(3.0), width=img_w3 - Inches(0.2), height=img_h3 - Inches(0.2))

    add_footer(slide5, 5)

    # =========================================================================
    # SLIDE 6: LIVE RUNTIME OBSERVATORY
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide6)
    add_header(slide6, "See What RakshaCall Is Doing — Live", "Runtime Observability for Judges & Engineers",
               "A dedicated technical observatory providing live visibility into internal function execution without cluttering citizen UX.")

    # Left Column: Observatory Details
    left_w6 = Inches(5.5)
    add_card(slide6, Inches(0.8), Inches(1.6), left_w6, Inches(5.1))
    tb_obs = slide6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.1), Inches(4.7))
    tf_obs = tb_obs.text_frame
    tf_obs.word_wrap = True

    p = tf_obs.paragraphs[0]
    p.text = "🔬 Browser-Native Cross-Tab Synchronization"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.font.name = 'Segoe UI'

    obs_bullets = [
        "• Real Execution Graph: Reflects actual function calls, state transitions, and timestamps — not an animation.",
        "• BroadcastChannel Pub/Sub: Runs in a separate tab or side-by-side window, synchronizing live with the active call session.",
        "• 7 Observable Workflows:\n  1. Live Call Protection (stream orchestration)\n  2. Detection Intelligence (regex/math matrix)\n  3. Voice & Speech Activity (TTS synthesis)\n  4. Incident & Response (forensics builder)\n  5. Manual Analysis (pasted text engine)\n  6. Emergency Response (action triggers)\n  7. Session Lifecycle (state reset & tear-down)",
        "• Node-Level Inspections: Status (running/success), execution duration, inputs, and extracted quotes."
    ]
    for b in obs_bullets:
        p = tf_obs.add_paragraph()
        p.text = b
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_LIGHT
        p.font.name = 'Segoe UI'

    # Right Column: Screenshot of Workflow Graph
    img_wf = 'docs/screenshots/06-live-runtime-workflow.png'
    if os.path.exists(img_wf):
        add_card(slide6, Inches(6.6), Inches(1.6), Inches(5.9), Inches(5.1))
        slide6.shapes.add_picture(img_wf, Inches(6.7), Inches(1.7), width=Inches(5.7), height=Inches(4.9))

    add_footer(slide6, 6)

    # =========================================================================
    # SLIDE 7: IMPACT + LIVE DEMO
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide7)
    add_header(slide7, "RakshaCall — From Detection to Action", "Impact, Deliverables & Live Access",
               "Protecting citizens during the scam call — when intervention matters most.")

    # Left Column: Why It Matters
    left_w7 = Inches(5.5)
    add_card(slide7, Inches(0.8), Inches(1.6), left_w7, Inches(5.1))
    tb_imp = slide7.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.1), Inches(4.7))
    tf_imp = tb_imp.text_frame
    tf_imp.word_wrap = True

    p = tf_imp.paragraphs[0]
    p.text = "🌟 Core Hackathon Value"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = BRAND_EMERALD
    p.font.name = 'Segoe UI'

    impact_points = [
        ("✓ Solves the 'Golden Hour' Dilemma", "Intervenes before money leaves the victim's account."),
        ("✓ 100% Privacy-Preserving", "Zero audio/text leaves the user's browser. Zero backend."),
        ("✓ Zero Cost & Zero API Dependencies", "Immune to cloud outages, subscription costs, or API keys."),
        ("✓ Explainable & Transparent", "Every risk score points to exact phrases and tactic categories."),
        ("✓ Multilingual Indian Context", "Supports English, Hinglish, Hindi, and Marathi code-mixing."),
        ("✓ 203/203 Vitest Suite Passed", "Production-tested reliability and complete CI/CD automation.")
    ]
    for ititle, idesc in impact_points:
        p = tf_imp.add_paragraph()
        p.text = f"{ititle}: {idesc}"
        p.font.size = Pt(10)
        p.font.name = 'Segoe UI'
        p.font.color.rgb = TEXT_LIGHT

    # Right Column: Live Links & Team Box
    right_w7 = Inches(5.9)
    add_card(slide7, Inches(6.6), Inches(1.6), right_w7, Inches(5.1), bg_color=CARD_BG)
    tb_demo = slide7.shapes.add_textbox(Inches(6.9), Inches(1.8), Inches(5.3), Inches(4.7))
    tf_demo = tb_demo.text_frame
    tf_demo.word_wrap = True

    p = tf_demo.paragraphs[0]
    p.text = "🚀 Verified Live Resources"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.font.name = 'Segoe UI'

    p = tf_demo.add_paragraph()
    p.text = "• Live Application Demo:\n  https://daanialmirza5.github.io/RakshaCall/\n"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = BRAND_TEAL
    p.font.name = 'Segoe UI'

    p = tf_demo.add_paragraph()
    p.text = "• Live Runtime Observatory:\n  https://daanialmirza5.github.io/RakshaCall/#/observatory\n"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.font.name = 'Segoe UI'

    p = tf_demo.add_paragraph()
    p.text = "• Open Source Repository:\n  https://github.com/daanialmirza5/RakshaCall\n"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_MAIN
    p.font.name = 'Segoe UI'

    p = tf_demo.add_paragraph()
    p.text = "• Verified Demo Video:\n  docs/demo/RakshaCall-Demo.mp4\n"
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_LIGHT
    p.font.name = 'Segoe UI'

    p = tf_demo.add_paragraph()
    p.text = "TEAM: daanialmirza  ·  HACKDAY 1.0\nDaanial Baig & Aayush Patil"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    p.font.name = 'Segoe UI'

    add_footer(slide7, 7)

    # Save presentation
    output_filename = "RakshaCall_Hackathon_Presentation_7_Slides.pptx"
    prs.save(output_filename)
    print(f"Presentation successfully saved to {output_filename}")

if __name__ == '__main__':
    create_presentation()
