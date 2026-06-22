# Vidya Sahayak (विद्या सहायक)
## Technical Documentation — Bharat Academix CodeQuest 2026

**A voice-first, multilingual doubt-solving tutor for Tier-2/3 India**  
Team: **aarav.singla**

---

## 1. Product Overview

### 1.1 Problem Statement

Over 250 million students in Tier-2 and Tier-3 Indian towns have access to smartphones but limited access to quality tutoring. Existing AI tutors (ChatGPT, Byju's, Khan Academy) are:
- **English-first by default** — regional language support is a translation layer, not a first-class experience
- **Text-first** — not designed for voice-native interaction patterns common on budget Android phones
- **High-bandwidth** — not optimized for patchy 2G/3G connectivity
- **Urban-context** — use analogies and examples that don't resonate with students in non-metro areas

### 1.2 Solution

Vidya Sahayak is a voice-and-text doubt-solving tutor that:
- Works natively in **Hindi, Tamil, and Bengali** (extensible to all 22 scheduled Indian languages)
- Explains concepts using **locally-relevant analogies** (cricket, kirana shop, farming) via a "Tuition Style" mode
- **Visually diagrams** science/math doubts on demand (6 built-in SVG templates)
- Is **honest about uncertainty** — every answer shows a confidence badge; low-confidence answers nudge students to verify with their teacher
- **Tracks recurring weak spots** to auto-generate practice question sets
- Has a **low-bandwidth fallback mode** for patchy connectivity

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIENT (React PWA)                         │
│  Mic Input → Web Speech API (STT, browser-native)             │
│  Chat UI · Language Selector · Mode Toggle · Diagram View     │
│  SpeechSynthesis API (TTS, browser-native) ← Audio Output     │
└─────────────────────────┬────────────────────────────────────┘
                          │ REST + Server-Sent Events (SSE)
┌─────────────────────────▼────────────────────────────────────┐
│                   BACKEND (FastAPI / Python)                   │
│  /ask           → Orchestrator (non-streaming)                │
│  /ask/stream    → SSE streaming orchestrator                  │
│  /practice      → Practice-set generator                      │
│  /progress/{id} → Session progress reader                     │
│  /questions     → Available question list                     │
│  /health        → Health check                                │
│                                                               │
│  Middleware: Rate Limiter · CORS · Request Size Guard          │
└──────┬────────────────────┬──────────────────┬───────────────┘
       │                    │                  │
       ▼                    ▼                  ▼
 ┌───────────┐      ┌──────────────┐   ┌──────────────────┐
 │ AI Layer  │      │  SQLite DB   │   │  Diagram Engine   │
 │ Mock data │      │ doubts table │   │  6 SVG templates  │
 │ (OpenAI-  │      │ session_id   │   │  photo·water·     │
 │  ready)   │      │ topic_tags   │   │  pyth·frac·       │
 └───────────┘      └──────────────┘   │  circuit·digest   │
                                       └──────────────────┘
```

### 2.1 Component Breakdown

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18 + Vite + TypeScript | Fast dev server, type-safe, component model suits modular feature set |
| **Styling** | Custom CSS (TailwindCSS-inspired design tokens) | No build-time dependency, full control |
| **Speech I/O** | Web Speech API (browser-native) | Free, works on Chrome/Edge without external API, covers STT + TTS |
| **Backend** | FastAPI (Python 3.10+) | Async, OpenAPI docs auto-generated, streaming SSE support built-in |
| **Streaming** | Server-Sent Events (SSE) | HTTP/1.1 compatible, no WebSocket overhead, works through most proxies |
| **Database** | SQLite | Zero setup, file-based, sufficient for MVP — schema supports PostgreSQL migration |
| **AI Layer** | Mock data (demo) / OpenAI-compatible (production) | Swap by uncommenting `openai_client.py` and setting `OPENAI_API_KEY` in `.env` |
| **Icons** | Lucide React | Consistent, tree-shakeable icon library |

---

## 3. Feature Breakdown

### Feature 1: Voice Doubt-Solving

**What it does:** Student taps the microphone, speaks a doubt in their chosen language, and receives a spoken + written answer back in the same language.

**Technical flow:**
1. User clicks mic button → `useSpeechRecognition` hook activates `window.SpeechRecognition`
2. `lang` attribute set to `hi-IN` / `ta-IN` / `bn-IN` / `en-IN` based on selected language
3. Transcript populates the text input in real-time
4. On mic stop, `submitQuestion()` is called automatically
5. Backend returns answer via SSE stream
6. Frontend `useSpeechSynthesis` hook calls `window.speechSynthesis.speak()` in matching language

**Build status:** `REAL` — Web Speech API, no external service

---

### Feature 2: Formal ↔ Tuition-Style Mode

**What it does:** A toggle switches answer style between formal textbook language and tuition-teacher style with Indian-context analogies.

**Technical flow:**
1. `mode` field (`formal` | `tuition-teacher`) sent with every `/ask` request
2. Backend `build_ask_system_prompt()` injects mode-specific instructions into the system prompt
3. In `tuition-teacher` mode: AI instructed to use cricket, kirana shop, farming, household analogies
4. "Re-explain" button on answer card allows switching mode without re-typing the question

**Build status:** `REAL` (UI logic) + `GEMINI-LIVE` / OpenAI-ready (LLM prompt)

---

### Feature 3: Doubt-to-Diagram

**What it does:** For eligible topics, a "View Diagram" button renders a labeled SVG diagram alongside the answer.

**Eligible topics:** `photosynthesis` · `water-cycle` · `pythagoras` · `fractions` · `simple-circuit` · `digestive-system`

**Technical flow:**
1. Backend's `_build_ask_response()` checks if `topic_tag` is in `DIAGRAM_TOPICS`
2. If yes, `diagram_eligible: true` is returned in the response
3. Frontend shows "View Diagram" button on `AnswerCard`
4. `DiagramViewer` component renders the matching pre-built SVG component

**Build status:** `HYBRID` — diagram rendering is real; SVG templates are pre-built (not AI-generated)

**Diagram components:** `PhotosynthesisDiagram`, `WaterCycleDiagram`, `PythagorasDiagram`, `FractionsDiagram`, `SimpleCircuitDiagram`, `DigestiveSystemDiagram`

---

### Feature 4: Confidence-Calibrated Answers

**What it does:** Every answer is tagged High / Medium / Low confidence with a color-coded badge. Low-confidence answers show: *"Please verify this with your teacher."*

**Technical implementation:**
- `verify_confidence()` in `prompts.py` applies rule-based overrides:
  - Questions with "who" / "when" / dates → `medium` at minimum
  - Off-topic questions → `low`
  - Well-defined science/math topics → pass through as-is
- `ConfidenceBadge` component renders green (high), amber (medium), red (low)

**Build status:** `REAL` (logic) — self-assessed by AI in production, rule-corrected

---

### Feature 5: Weak-Topic Tracker → Practice Set

**What it does:** After 3+ doubts on related topics in a session, a "We noticed a pattern" card appears offering a 5-question MCQ practice set.

**Technical flow:**
1. Every `log_doubt()` call writes `(session_id, text, topic_tag, language, timestamp)` to SQLite
2. `get_topic_count_in_session()` counts how many doubts share the same (or synonymous) topic tag
3. Topic synonyms defined in `get_related_tags()`: e.g., `fractions`/`decimals`/`ratios` are grouped
4. If count ≥ 3: `show_weak_topic_card: true` in response → `WeakTopicCard` renders
5. User clicks "Generate Practice" → `/practice` endpoint returns 5 MCQ questions
6. `PracticeSet` component renders with instant right/wrong feedback (no persistence needed)

**Build status:** `REAL` trigger logic + mock/AI-generated questions

---

### Feature 6: Low-Bandwidth Mode

**What it does:** A settings toggle that disables TTS autoplay and requests shorter answers (≤40 words).

**Technical implementation:**
- `lowBandwidth` boolean in `AppContext` → persisted to `localStorage`
- If `low_bandwidth: true` in `/ask` request: backend adds "answer in ≤40 words" to system prompt
- Frontend: `speak()` only called automatically if `!lowBandwidth`; user must tap play manually

**Build status:** `REAL` (pure UI/prompt logic, no network throttling simulation)

---

## 4. API Reference

### `POST /ask`

Non-streaming endpoint.

**Request body:**
```json
{
  "text": "प्रकाश संश्लेषण क्या है?",
  "language": "hi",          // hi | ta | bn | en
  "mode": "formal",          // formal | tuition-teacher
  "session_id": "demo",
  "low_bandwidth": false,
  "grade": 8                 // 6–10
}
```

**Response:**
```json
{
  "answer": "प्रकाश संश्लेषण वह प्रक्रिया है...",
  "confidence": "high",      // high | medium | low
  "topic_tag": "photosynthesis",
  "diagram_eligible": true,
  "diagram_data": null,
  "show_weak_topic_card": false,
  "weak_topic_tag": null
}
```

---

### `POST /ask/stream`

SSE streaming endpoint. Same request body as `/ask`. Events:

```
data: {"type": "chunk", "text": "प्रकाश"}
data: {"type": "chunk", "text": " संश्लेषण"}
...
data: {"type": "done", "answer": "...", "confidence": "high", "topic_tag": "photosynthesis", ...}
```

---

### `POST /practice`

Generate 5 MCQ practice questions.

**Request:** `{ "topic_tag": "photosynthesis", "language": "hi", "session_id": "demo", "grade": 8 }`  
**Response:** `{ "questions": [{ "question": "...", "options": ["A","B","C","D"], "correct_index": 0 }], "topic_tag": "photosynthesis" }`

---

### `GET /progress/{session_id}`

Returns doubts logged in a session for the Progress screen.

---

### `GET /questions?language=hi&grade=8`

Returns the list of pre-loaded mock questions for a given language/grade — used to populate the input dropdown.

---

### `GET /health`

Returns `{ "status": "ok", "service": "Vidya Sahayak API", "version": "2.0.0" }`.

---

## 5. Project Structure

```
Bharat Academix/
├── backend/
│   ├── main.py              # FastAPI app — all endpoints, rate limiter, CORS
│   ├── mock_data.py         # 60+ Q&A pairs across 5 classes × 4 languages
│   ├── database.py          # SQLite init, log_doubt(), get_topic_count_in_session()
│   ├── prompts.py           # System prompt builders, topic synonyms, confidence verifier
│   ├── openai_client.py     # OpenAI client (commented out — swap for production)
│   ├── gemini_client.py     # Gemini client (deprecated)
│   ├── requirements.txt
│   └── .env                 # OPENAI_API_KEY, ALLOWED_ORIGINS, rate limit config
│
└── frontend/
    ├── src/
    │   ├── App.tsx           # Shell: header, bottom nav, routing
    │   ├── pages/
    │   │   ├── Home.tsx      # Main Q&A interface (language, grade, mode, mic, answer)
    │   │   ├── Progress.tsx  # Session topic history
    │   │   └── Settings.tsx  # Low-bandwidth toggle, language pack info
    │   ├── components/
    │   │   ├── AnswerCard.tsx       # Answer display with confidence badge, re-explain
    │   │   ├── ConfidenceBadge.tsx  # Green/amber/red pill
    │   │   ├── DiagramViewer.tsx    # Diagram template router
    │   │   ├── MicButton.tsx        # Animated microphone button
    │   │   ├── PracticeSet.tsx      # MCQ practice with instant feedback
    │   │   ├── WeakTopicCard.tsx    # "Pattern noticed" prompt card
    │   │   └── diagrams/
    │   │       ├── PhotosynthesisDiagram.tsx
    │   │       ├── WaterCycleDiagram.tsx
    │   │       ├── PythagorasDiagram.tsx
    │   │       ├── FractionsDiagram.tsx
    │   │       ├── SimpleCircuitDiagram.tsx
    │   │       └── DigestiveSystemDiagram.tsx
    │   ├── context/
    │   │   └── AppContext.tsx  # Global: language, grade, mode, lowBandwidth, sessionId
    │   ├── hooks/
    │   │   ├── useSpeechRecognition.ts  # Web Speech API STT wrapper
    │   │   ├── useSpeechSynthesis.ts    # Web Speech API TTS wrapper
    │   │   └── useBackendHealth.ts      # /health poller
    │   └── api/
    │       └── client.ts      # streamAsk(), api.practice(), api.getQuestions()
    ├── index.html
    ├── vite.config.ts
    └── package.json
    
├── presentation/
│   └── index.html           # Standalone HTML presentation deck (10 slides)
│
├── README.md                # This document (technical documentation)
├── DEMO_SCRIPT.md           # Step-by-step demo recording guide
├── SUBMISSION_CHECKLIST.md  # Submission checklist
└── vidya_sahayak_build_spec.md  # Original build specification
```

---

## 6. Setup & Running

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+
- **Chrome** or **Edge** browser (best Web Speech API support)

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure environment variables
# Edit .env to set OPENAI_API_KEY for live AI responses
# Default runs with mock data — no API key needed for demo

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend available at: `http://localhost:5173`

---

## 7. Configuration

All configuration lives in `backend/.env`:

```env
# AI (set for live responses; omit to use mock data)
OPENAI_API_KEY=sk-...

# CORS (comma-separated allowed origins)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Rate limiting
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_REQUESTS=120

# Max request size (bytes)
MAX_REQUEST_BYTES=65536
```

### Switching from Mock Data to Live AI

1. Add a valid `OPENAI_API_KEY` to `backend/.env`
2. In `backend/main.py`, comment out the `mock_data` import lines and uncomment the `openai_client` lines
3. Restart the backend — all endpoints now use live LLM responses

---

## 8. Honest Build Map

Being transparent about what's real vs. hardcoded:

| Component | Status | Honest Line for Judges |
|---|---|---|
| Voice STT (Web Speech API) | ✅ Real | Browser-native, no external API |
| Voice TTS (SpeechSynthesis) | ✅ Real | Browser-native; production would use Sarvam/AI4Bharat for better Indian-language pronunciation |
| Streaming (SSE) | ✅ Real | True server-sent events, character-chunked |
| Weak-topic tracker | ✅ Real | Rule-based threshold (≥3 doubts); ML clustering is v2 |
| Low-bandwidth mode | ✅ Real | UI state change + prompt modification |
| Confidence calibration | ✅ Real | Rule-based override on top of AI self-report |
| Q&A answers | 🟡 Mock data | 60+ hardcoded Q&A pairs; OpenAI client ready to swap in |
| Diagram labels | 🟡 Templated | 6 pre-built SVG templates; AI populates labels in production |
| Practice questions | 🟡 Mock data | Hardcoded; AI-generated in production |
| User authentication | ❌ None | Single demo session; out of scope for 48h build |

---

## 9. Scalability Roadmap

### Near-term (v1.1)
- Plug in OpenAI / Gemini API for live responses (code already written)
- Add Marathi, Telugu, Kannada (language-pack config change only)
- Deploy: Backend → Render/Railway; Frontend → Vercel/Netlify; DB → PostgreSQL

### Medium-term (v2.0)
- Sarvam AI / AI4Bharat TTS for better Indian-language pronunciation
- ML-based topic clustering (replace rule-based weak-topic detection)
- Student accounts and cross-session progress tracking
- Offline-capable PWA with cached answers for common questions

### Long-term
- School/teacher dashboard (class-level weak topic analytics)
- National curriculum alignment (NCERT chapter tagging)
- Audio-first feature phone support (IVR-style interaction)

---

## 10. Security Notes

- **Rate limiting:** 120 requests per IP per 60-second window (configurable)
- **CORS:** Restricted to `ALLOWED_ORIGINS` — not wildcard in production
- **Request size:** Capped at 64KB (configurable via `MAX_REQUEST_BYTES`)
- **API key:** Never exposed to frontend; only used in backend environment
- **No PII:** No user accounts, no personal data collected in demo

---

*Built with ❤️ for Indian students — विद्या सहायक*  
*Team aarav.singla · Bharat Academix CodeQuest 2026*
