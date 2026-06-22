# Vidya Sahayak (विद्या सहायक) — Build Spec & Architecture

**Multilingual Voice-First Doubt-Solving Tutor for Tier-2/3 India**
Built for: Bharat Academix CodeQuest 2026, Round 2 (Prototype Development)

> **How to use this doc:** This is a build spec for an MVP, written to be fed directly into an LLM coding IDE (Cursor / Claude Code / Windsurf / Replit Agent). Every feature is tagged `REAL`, `GEMINI-LIVE`, `HYBRID`, or `HARDCODED` so you always know what's actually running vs. simulated for the demo. Section 7 is the literal prompt to paste into your IDE to scaffold the whole thing.

---

## 1. Product Overview

### 1.1 The Problem

Hundreds of millions of students in Tier-2/3 Indian towns hit a wall the moment a doubt gets even slightly complex: the explanation they need exists, but only in English, in a textbook tone that assumes urban-school context, and often only as text — not as something they can just ask out loud the way they'd ask a tuition teacher.

Existing AI tutors (Byju's, Khan Academy, ChatGPT itself) are English-first and text-first by default. Regional language support is usually a translation layer bolted on top, not a first-class experience — and none of them are built for low-bandwidth, voice-first usage patterns common outside metro cities.

### 1.2 The Solution

Vidya Sahayak is a voice-and-text doubt-solving tutor that:
- works natively in Hindi, Tamil, and Bengali (extensible to more languages)
- explains concepts using locally-relevant analogies instead of generic textbook phrasing
- visually diagrams science/math doubts on demand
- is honest about its own uncertainty
- tracks a student's recurring weak spots to auto-generate practice sets
- wraps all of this in a low-bandwidth fallback mode for patchy connectivity

### 1.3 Why This Wins on the Rubric

| Criterion | How this product addresses it |
|---|---|
| Innovation & Creativity (25%) | Confidence-calibration + local-analogy mode + doubt-to-diagram are not standard hackathon AI-wrapper features — most teams will ship a generic chatbot |
| Technical Implementation (25%) | Real STT/TTS pipeline, real LLM orchestration, a believable data model for weak-topic tracking — demoable end-to-end, not just static slides |
| Problem-Solving Approach (20%) | Directly targets the stated EdTech pain point (English-only resources) with a mechanism, not just a slogan |
| UX & Design (15%) | Voice-first interaction + clean mobile-first UI + low-data mode toggle shows design maturity beyond "it works" |
| Scalability & Impact (15%) | Language pack architecture scales to any Indian language; low-bandwidth mode directly addresses Tier-2/3 infrastructure reality |

---

## 2. The 6 Features (Demo-Ranked)

Ordered the way you should walk judges through the demo — headline feature first, trust-building feature in the middle, scalability story last.

| # | Feature | What judges see in the demo | Build status |
|---|---|---|---|
| 1 | Voice doubt-solving in regional language | Speaks a doubt in Hindi/Tamil/Bengali → gets a spoken + written answer back in the same language | `GEMINI-LIVE` |
| 2 | "Explain Like My Tuition Teacher" mode | Toggle switches the same answer between formal textbook tone and a local-analogy-heavy tone (cricket, kirana shop, farming) | `GEMINI-LIVE` |
| 3 | Doubt-to-Diagram | For science/math doubts, a simple labeled diagram renders alongside the text answer | `HYBRID` (real render, templated content) |
| 4 | Confidence-Calibrated Answers | Every answer is tagged High/Medium/Low confidence, with a nudge to verify with a teacher on Low | `REAL` (logic) + `GEMINI-LIVE` (score) |
| 5 | Weak-Topic Tracker → Auto Practice Set | After 3+ doubts on related topics, a "We noticed a pattern" card appears with a generated 5-question practice quiz | `HARDCODED` trigger, `GEMINI-LIVE` content |
| 6 | Low-Bandwidth / Offline-Lite Mode | Toggle compresses the UI to text-only, SMS-length answers, no audio autoplay | `REAL` (UI logic) |

---

## 3. System Architecture

### 3.1 High-Level Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (React PWA)                   │
│  Mic Input → Web Speech API (STT)                        │
│  Chat UI · Language Selector · Mode Toggles · Diagram View│
└───────────────────────┬────────────────────────────────────┘
                        │ REST (JSON)
┌───────────────────────▼────────────────────────────────────┐
│                  BACKEND (FastAPI / Node)                 │
│  /ask        → Orchestrator                               │
│  /diagram    → Diagram template selector                  │
│  /weak-topics→ Topic frequency tracker (SQLite)            │
│  /practice   → Practice-set generator                      │
└──────┬───────────────────────┬───────────────┬─────────────┘
       │                       │               │
       ▼                       ▼               ▼
 ┌────────────┐        ┌──────────────┐  ┌──────────────┐
 │ Gemini API │        │  SQLite DB   │  │ Diagram Asset│
 │ (1.5 Flash)│        │ doubts log,  │  │ Templates    │
 │ - answer   │        │ topic tags,  │  │ (SVG/Canvas) │
 │ - confidence│       │ session id   │  │              │
 │ - translate│        └──────────────┘  └──────────────┘
 └────────────┘
       │
       ▼
 Browser SpeechSynthesis API (TTS) — plays answer aloud
```

### 3.2 Component Breakdown

| Layer | Choice & Reasoning |
|---|---|
| Frontend | React + Vite, Tailwind CSS, Web Speech API for STT/TTS (browser-native, free, works offline-ish once loaded) |
| Backend | FastAPI (Python) — single service, no microservices needed for MVP scope |
| LLM Layer | Google Gemini 1.5 Flash via API key — handles answer generation, language detection/translation, confidence scoring, analogy rewriting, and practice question generation |
| Database | SQLite — `doubts` table (id, session_id, text, topic_tag, language, timestamp), zero setup overhead, fine for MVP/demo |
| Diagram Engine | Pre-built SVG/Canvas templates (6–8 common topics: water cycle, photosynthesis, Pythagoras theorem, circuit diagram, fractions, etc.) — Gemini fills in labels/values, template provides the visual structure |
| Hosting (demo) | Frontend: Vercel/Netlify. Backend: Render/Railway free tier. Fully sufficient for a live judge demo |

### 3.3 Data Flow for the Headline Feature (Voice Doubt → Answer)

1. Student taps mic, speaks doubt in Hindi (e.g. "prakash sanshlleshan kya hai")
2. Browser Web Speech API transcribes to text client-side
3. Frontend POSTs `{ text, language: 'hi', mode: 'analogy' | 'formal' }` to `/ask`
4. Backend builds a system prompt embedding language + mode + grade-level context, calls Gemini API
5. Gemini returns `{ answer_text, confidence: 'high'|'medium'|'low', topic_tag, diagram_template_id (if applicable) }`
6. Backend logs the doubt + topic_tag to SQLite (powers Feature 5), returns JSON to frontend
7. Frontend renders answer text, fires SpeechSynthesis TTS in the same language, and renders diagram template if topic_tag matches one

---

## 4. Honest Hardcode Map

Being upfront about this protects you in Q&A — judges respect "we scoped this consciously" far more than getting caught pretending something is fully built.

| What's hardcoded / simplified | Why, and the honest line to give judges |
|---|---|
| Diagram templates | `HARDCODED` set of 6–8 SVG templates (not generated from scratch by AI). Gemini only fills in labels/values into placeholders. **If asked:** "For MVP speed we pre-built diagram templates for the most common doubt categories; Gemini dynamically populates them — full generative diagramming is the next milestone." |
| Language coverage | Hindi, Tamil, Bengali are wired and tested. Other Indian languages are listed in the UI language picker but show a "coming soon" toast if selected. **If asked:** "Architecture is language-pack based, so adding a new language is a config change, not a rebuild — we prioritized 3 for the demo." |
| Weak-topic trigger threshold | `HARDCODED` at "3 doubts on related tags within a session" rather than a trained ML model. The practice-set content itself is real, Gemini-generated. **If asked:** "The pattern-detection threshold is rule-based for now; a real ML-based topic-clustering model is the natural v2." |
| Confidence score | `REAL` signal, but it's Gemini self-reporting its confidence via prompted output, not a separately trained calibration model. **If asked:** "It's LLM self-assessed confidence today; a proper calibration layer (e.g. comparing against a verified answer bank) is on the roadmap." |
| User accounts / auth | `HARDCODED` single demo session, no real login system. **If asked:** "Auth is out of scope for the 48-hour build — we used a single demo session ID to focus build time on the tutoring logic itself." |
| Low-bandwidth mode | `REAL` — this is just a CSS/UI state toggle that disables autoplay audio and truncates response length. No actual network throttling simulation, but the behavior change is functionally real. |

---

## 5. UI/UX Notes

### 5.1 Screens

- **Home / Ask screen** — large mic button (primary action), text input fallback, language selector (flag + script, not just English name), mode toggle (Formal ↔ Tuition-style)
- **Answer screen** — answer text in selected language, audio play/pause control, confidence badge (green/amber/red pill), "Show Diagram" button if applicable
- **Diagram view** — rendered SVG with labeled parts, simple zoom
- **Progress screen** — list of topics asked about, frequency, and the "Pattern noticed" card with CTA to generate practice set
- **Practice Set screen** — 5 generated questions, multiple choice, instant right/wrong feedback
- **Settings** — language pack manager, low-bandwidth toggle

### 5.2 Visual Direction

- Warm, approachable palette — deep green/saffron accents (NOT generic SaaS blue) to feel distinctly Indian-EdTech, not a Silicon Valley clone
- Devanagari/Tamil/Bengali script rendered natively and prominently, not as an afterthought subtitle under English
- Big tap targets, minimal text density on the home screen — this should feel usable by someone on a budget Android phone with a cracked screen, not a designer's portfolio piece

---

## 6. Presentation Narrative (Suggested Flow)

1. Open with the problem stat: hundreds of millions of Tier-2/3 students, English-only doubt resources, no voice-native option.
2. **Live demo:** speak a real doubt in Hindi into the mic, get a spoken answer back. This is your hook moment.
3. Flip the mode toggle live — same question, formal vs. tuition-teacher analogy answer side by side. Judges visibly react to tone difference.
4. Show a diagram doubt (e.g. "explain photosynthesis") — diagram renders. Visual proof of technical depth.
5. Point out the confidence badge on a harder question — explain this is a deliberate trust/responsible-AI design choice, not a limitation.
6. Show the Weak-Topic card triggering and the generated practice set — this is your "we thought about retention, not just answering" moment.
7. Close on low-bandwidth mode toggle — ties back to the Tier-2/3 framing and shows scalability awareness.
8. End with the architecture diagram for 15 seconds max — judges skim it, don't read every box.

---

## 7. IDE Build Prompt (Copy-Paste Ready)

Paste the block below into Claude Code, Cursor, Windsurf, or any agentic coding IDE as the first message. It's self-contained — the agent shouldn't need to ask clarifying questions to start scaffolding.

> **Before you paste this:** Get a free Gemini API key from Google AI Studio (ai.google.dev) — takes 2 minutes. Have it ready to paste into a `.env` file when the agent asks.

```
Build an MVP web app called "Vidya Sahayak" — a multilingual voice-first
doubt-solving tutor for Indian students. This is a hackathon MVP, optimize
for a working, demoable build over production polish.

STACK: React + Vite + Tailwind (frontend), FastAPI/Python (backend),
SQLite (db), Google Gemini API (gemini-1.5-flash model) for all LLM calls.

CORE FLOW:
1. User selects a language (Hindi / Tamil / Bengali) and a mode
   (Formal / Tuition-Teacher-Style) from a toggle.
2. User speaks a doubt via mic (use the browser Web Speech API for
   speech-to-text, no external STT service needed) OR types it.
3. Frontend POSTs { text, language, mode } to backend /ask endpoint.
4. Backend constructs a system prompt instructing Gemini to:
   - Answer strictly in the requested language and script
   - If mode=tuition-teacher, use everyday Indian analogies
     (cricket, kirana shop, farming, household examples)
   - If mode=formal, answer in clear textbook style
   - Self-report a confidence level: high / medium / low
   - Classify the doubt into a short topic_tag (e.g. 'fractions',
     'photosynthesis', 'newtons-laws')
   - If the topic_tag matches one of these diagram-eligible topics:
     ['photosynthesis','water-cycle','pythagoras','fractions',
     'simple-circuit','digestive-system'], also return
     diagram_eligible: true
   - Return strict JSON: { answer, confidence, topic_tag, diagram_eligible }
5. Backend logs every doubt to SQLite (session_id, text, topic_tag,
   language, timestamp).
6. Frontend renders the answer text, plays it via browser
   SpeechSynthesis API in the matching language, shows a colored
   confidence badge (green=high, amber=medium, red=low with the text
   'Please verify this with your teacher'), and if diagram_eligible
   is true, shows a 'View Diagram' button.

DIAGRAM FEATURE:
Pre-build 6 simple labeled SVG diagram templates for:
photosynthesis, water cycle, pythagoras theorem, fractions (pie
slices), a simple electrical circuit, and the human digestive
system. Store them as static SVG components. When 'View Diagram'
is clicked, render the matching template based on topic_tag — no
need to generate the SVG dynamically, just match and display.

WEAK-TOPIC TRACKER:
After each /ask call, check SQLite for how many doubts in the
current session share the same topic_tag (or a related tag from a
small hardcoded synonym map, e.g. fractions/decimals/ratios are
'related'). If count >= 3, show a 'We noticed a pattern — want a
practice set?' card. On click, call a /practice endpoint that asks
Gemini to generate 5 multiple-choice questions on that topic in
the selected language, and render them with instant right/wrong
feedback (no need to persist quiz attempts for MVP).

LOW-BANDWIDTH MODE:
A settings toggle that, when on: disables autoplay of TTS audio
(user must tap play manually), and instructs Gemini via the system
prompt to keep answers under 40 words.

UI: Mobile-first, warm color palette (deep green #1F6F50 and saffron
accents, avoid generic blue SaaS look), large tap targets, render
Devanagari/Tamil/Bengali script natively and prominently. Screens
needed: Home/Ask, Answer, Diagram view, Progress/Weak-topics,
Practice Set, Settings.

Set up a .env for GEMINI_API_KEY. Scaffold the full project
structure first (folders, package.json, requirements.txt), then
build backend endpoints, then frontend screens, then wire them
together. Ask me for the Gemini API key when you reach the point
of needing it, don't block earlier steps on it.
```

---

## 8. Known Risks & Fast Mitigations

| Risk | Mitigation |
|---|---|
| Web Speech API has patchy Hindi/Tamil/Bengali STT accuracy in some browsers | Demo on Chrome desktop (best support); have a typed-text fallback ready as primary backup path during live demo |
| Gemini API rate limits / latency live on stage | Pre-warm the API with a throwaway call right before presenting; have 2–3 pre-tested doubt examples memorized so you know they work |
| Judges ask to see a language not yet wired | Have the honest line ready (Section 4) — frame it as scoped prioritization, not a gap |
| TTS pronunciation sounds robotic for regional languages | Frame it explicitly as MVP using free browser-native TTS; mention a production version would integrate a proper Indian-language TTS service (e.g. Sarvam, AI4Bharat) |

---

Good luck with the build — prioritize getting the voice doubt → answer → TTS loop rock solid first, since that's the moment that makes or breaks the live demo. Everything else is additive polish on top of that core loop.
