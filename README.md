# Vidya Sahayak — Quick Start Guide

## Prerequisites
- Python 3.10+ 
- Node.js 18+
- A free [Google Gemini API key](https://ai.google.dev/)

## Setup

### 1. Backend
```bash
cd backend
pip install -r requirements.txt

# Add your Gemini API key
# Edit backend/.env and replace: GEMINI_API_KEY=your_gemini_api_key_here

uvicorn main:app --reload --port 8000
```

### 2. Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in Chrome (best Web Speech API support).

## Features
1. **Voice Doubt Solving** — Tap the mic, speak in Hindi/Tamil/Bengali/English
2. **Formal ↔ Tuition Style** — Toggle the answer tone
3. **Diagrams** — Ask about photosynthesis, water cycle, Pythagoras, fractions, circuits, or digestion
4. **Confidence Badges** — Green/amber/red signal on every answer
5. **Weak Topic Tracker** — After 3 related doubts, get a practice set
6. **Low-Bandwidth Mode** — Settings → toggle off autoplay + shorter answers

## Demo Tips
- Use **Chrome desktop** for best STT accuracy
- Pre-tested doubts for demo:
  - Hindi: "प्रकाश संश्लेषण क्या है?" (photosynthesis)
  - Tamil: "பித்தகோரஸ் தேற்றம் என்னவெனில்?" (Pythagoras)
  - Bengali: "ভগ্নাংশ কী?" (fractions)
