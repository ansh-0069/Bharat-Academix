# Vidya Sahayak — Demo Recording Script
## Bharat Academix CodeQuest 2026 · Team: aarav.singla

**Target video length:** 3–4 minutes  
**Recording tool:** Loom / OBS / Windows Game Bar (Win+G)  
**Browser:** Chrome (best Web Speech API support)  
**Resolution:** 1920×1080 recommended

---

## Pre-Recording Setup Checklist

Before hitting Record:

- [ ] Backend running: `cd backend && uvicorn main:app --reload --port 8000`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Chrome open at `http://localhost:5173`
- [ ] Browser zoom at 100% (Ctrl+0)
- [ ] Microphone tested and working
- [ ] Language set to **Hindi (हिं)**
- [ ] Grade set to **8**
- [ ] Mode set to **Formal**
- [ ] Close all other browser tabs
- [ ] Silence notifications (Win+A → Focus Assist → Priority Only)
- [ ] Have these questions copy-ready (for fallback typing):
  - `प्रकाश संश्लेषण क्या है?`
  - `गति और वेग में क्या अंतर है?`
  - `विद्युत धारा क्या है?`

---

## Scene-by-Scene Script

### 🎬 SCENE 1 — Hook & Problem Statement (0:00–0:30)

**Narrate (voice-over or on-screen text):**

> "250 million students in Tier-2 and Tier-3 India have smartphones — but no AI tutor that speaks their language. Byju's, ChatGPT — they're all English-first. We built something different."

**On screen:** Show the home screen of Vidya Sahayak. Highlight the Devanagari script "विद्या सहायक" in the header.

---

### 🎬 SCENE 2 — Voice Doubt in Hindi (0:30–1:15)

**This is your biggest moment. Go slow and clear.**

1. Point to the mic button and say:
   > "A Class 8 student in Lucknow wants to ask: what is the difference between speed and velocity?"

2. Click the **mic button** 🎙️
3. Speak clearly in Hindi:
   > **"गति और वेग में क्या अंतर है?"**
   *(gati aur veg mein kya antar hai)*
4. Wait for the answer to stream in
5. **Let the TTS play** — the answer will be spoken aloud in Hindi
6. Point to the **confidence badge** (green = High Confidence)

**Narrate:**
> "The answer streams in real-time and is read aloud in Hindi. Notice the confidence badge — green means the system is confident. Red would tell the student to check with their teacher."

---

### 🎬 SCENE 3 — Mode Toggle (Tuition Style) (1:15–1:45)

1. Click the **"Tuition Style"** button in the mode toggle
2. Click the **"Re-explain"** button (or send the same question again)
3. Wait for the new answer

**Narrate:**
> "Now watch what happens when we switch to Tuition Style — the AI rewrites the same answer using analogies a local teacher would use. No more textbook language."

**Point out** how the new answer uses a more conversational Indian analogy (e.g., auto-rickshaw, cricket field).

---

### 🎬 SCENE 4 — Doubt-to-Diagram (1:45–2:15)

1. Clear the input (click X or select all and delete)
2. Type (or speak): `प्रकाश संश्लेषण क्या है?` *(photosynthesis)*
3. Send the question
4. When the answer arrives, click the **"View Diagram"** button
5. The photosynthesis SVG diagram appears with labeled parts

**Narrate:**
> "For science and math topics, the diagram appears automatically. Here's photosynthesis — sun, leaf, CO₂, O₂, glucose — all labeled. Students can see the concept visually, not just read about it."

---

### 🎬 SCENE 5 — Weak-Topic Tracker (2:15–2:50)

1. Ask 2 more questions related to the same topic (science/photosynthesis):
   - Type: `विद्युत धारा क्या है?` *(what is electric current)*
   - Send → wait for answer
   - Type: `कोशिका क्या है?` *(what is a cell)*
   - Send → wait for answer
2. After the 3rd related question, the **"We noticed a pattern"** card should appear
3. Click **"Generate Practice Set"**
4. Show 2–3 of the MCQ questions that appear

**Narrate:**
> "After 3 doubts on the same topic, Vidya Sahayak notices a pattern and offers a practice set. Five multiple-choice questions — instant right/wrong feedback. This is how the app moves from answering doubts to actually improving retention."

---

### 🎬 SCENE 6 — Low-Bandwidth Mode (2:50–3:15)

1. Click the **"Settings"** tab (bottom nav)
2. Toggle **"Low-Bandwidth Mode"** ON
3. Go back to Home, ask any question
4. Point out: audio does NOT autoplay, answer is shorter

**Narrate:**
> "For students on slow connections, one toggle switches to low-bandwidth mode — no audio autoplay, shorter answers. Built for 2G India, not Jio-fiber Bangalore."

---

### 🎬 SCENE 7 — Progress Screen (3:15–3:30)

1. Click the **"Progress"** tab
2. Show the list of topics asked in this session

**Narrate:**
> "The Progress screen shows every topic a student has asked about — so they and their teachers can see what needs more work."

---

### 🎬 SCENE 8 — Language Switcher (3:30–3:50) *(Optional if time allows)*

1. Go back to Home
2. Click **"த Tamil"** language
3. Ask a question in Tamil (type): `ஒளிச்சேர்க்கை என்றால் என்ன?`
4. Show the Tamil response

**Narrate:**
> "Switch to Tamil — the UI adapts, answers come back in Tamil script. The architecture supports any Indian language — Hindi, Tamil, Bengali are wired today; Marathi, Telugu, Kannada are next."

---

### 🎬 SCENE 9 — Closing (3:50–4:00)

Show the home screen one more time.

**Narrate:**
> "Vidya Sahayak — विद्या सहायक. Every doubt, answered in your language. Built for Bharat, not just Bangalore. Team aarav.singla, CodeQuest 2026."

---

## Fallback Plan (If Voice Input Doesn't Work)

If Web Speech API is unreliable during recording:
1. **Type questions directly** into the text input — feature demonstrations are identical
2. Add a note in narration: *"Voice input uses the browser's Speech Recognition API — let me demonstrate by typing the question"*
3. This is completely fine — judges care about the answer quality, diagram, and confidence badge

---

## Tips for Best Recording

- **Practice the script once** without recording to time yourself
- **Speak slowly** during voice input — STT accuracy drops if you rush
- Use **Chrome** on desktop for best Speech API support
- If an answer takes too long, **cut the recording** between send and answer arrival using your editor
- Record in **1080p or higher** so diagram text is legible
- Add **captions/subtitles** if possible — especially for the Hindi/Tamil/Bengali questions

---

## Pre-Tested Questions (All Work with Mock Data)

| Language | Grade | Question | Topic Tag |
|---|---|---|---|
| Hindi | 8 | `गति और वेग में क्या अंतर है?` | motion |
| Hindi | 8 | `विद्युत धारा क्या है?` | simple-circuit |
| Hindi | 8 | `कोशिका क्या है?` | biology |
| Hindi | 6 | `प्रकाश संश्लेषण क्या है?` | photosynthesis |
| Hindi | 7 | `पाइथागोरस प्रमेय क्या है?` | pythagoras |
| Tamil | 8 | `ஒளிச்சேர்க்கை என்றால் என்ன?` | photosynthesis |
| Bengali | 6 | `সালোকসংশ্লেষণ কী?` | photosynthesis |
| English | 9 | `What are Newton's laws of motion?` | motion |

---

*Good luck — the voice-to-answer loop is your strongest moment. Nail that and the rest follows.*
