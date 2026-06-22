# Submission Checklist — Bharat Academix CodeQuest 2026
## Team: aarav.singla · Project: Vidya Sahayak (विद्या सहायक)

---

## ✅ Required Deliverables

### 1. Source Code
- [x] Frontend: `frontend/` (React + Vite + TypeScript)
- [x] Backend: `backend/` (FastAPI + Python)
- [x] All dependencies listed: `frontend/package.json`, `backend/requirements.txt`
- [x] Environment config: `backend/.env` (API key placeholder included)
- [x] `.gitignore` in place (no secrets committed)

### 2. Technical Documentation
- [x] `README.md` — Full technical documentation including:
  - [x] Problem statement
  - [x] System architecture diagram
  - [x] All 6 features explained with technical detail
  - [x] API endpoint reference
  - [x] Project structure
  - [x] Setup & running instructions
  - [x] Configuration guide
  - [x] Honest build map
  - [x] Scalability roadmap
  - [x] Security notes

### 3. Presentation Deck
- [x] `presentation/index.html` — Standalone HTML presentation (10 slides):
  - [x] Slide 1: Title & branding
  - [x] Slide 2: Problem statement (with stats)
  - [x] Slide 3: Solution — 6 features
  - [x] Slide 4: Live demo mock-up
  - [x] Slide 5: System architecture
  - [x] Slide 6: Innovation highlights
  - [x] Slide 7: Scalability & impact
  - [x] Slide 8: Tech stack
  - [x] Slide 9: Rubric alignment
  - [x] Slide 10: Team / closing
- [x] Keyboard navigable (← → arrows, Space)
- [x] No external dependencies required (except Google Fonts CDN for fonts)
- [x] Team name displayed: aarav.singla

### 4. Demo Video
- [ ] Record using `DEMO_SCRIPT.md` as guide (3–4 minutes)
- [ ] Cover all 6 key features:
  - [ ] Voice doubt-solving in Hindi
  - [ ] Formal ↔ Tuition-style mode toggle
  - [ ] Doubt-to-diagram (photosynthesis)
  - [ ] Confidence badge (green/amber/red)
  - [ ] Weak-topic tracker + practice MCQ set
  - [ ] Low-bandwidth mode toggle
- [ ] Upload to YouTube / Google Drive / platform specified by hackathon
- [ ] Add video URL to submission form

---

## 🚀 How to Run for Judges

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in **Chrome** (best Speech API support).

---

## 📁 Final File List

```
Bharat Academix/
├── README.md                          ← Technical documentation
├── DEMO_SCRIPT.md                     ← Video recording guide
├── SUBMISSION_CHECKLIST.md            ← This file
├── presentation/
│   └── index.html                     ← Presentation deck (open in browser)
├── backend/
│   ├── main.py, mock_data.py, ...     ← API source code
│   └── requirements.txt
└── frontend/
    ├── src/                           ← React source code
    └── package.json
```

---

*Vidya Sahayak — हर सवाल का जवाब, अपनी भाषा में*  
*Team aarav.singla · Bharat Academix CodeQuest 2026 · Round 2*
