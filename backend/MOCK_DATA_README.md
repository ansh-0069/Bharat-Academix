# Mock Data System for Prototype

## Overview
This backend now uses **hardcoded mock data** instead of live API calls for the prototype demonstration.

## What Changed
- ✅ **No API keys needed** - Works offline
- ✅ **Fast responses** - No API latency
- ✅ **Cost-free** - No API usage charges
- ✅ **Reliable** - No rate limits or API errors

## Mock Data Coverage

### Classes Supported: 6-10
### Languages: Hindi, Tamil, Bengali

### Sample Questions by Class:

**Class 6:**
- प्रकाश संश्लेषण क्या है? (Photosynthesis)
- अंश और हर क्या होते हैं? (Fractions)
- पानी का चक्र कैसे काम करता है? (Water cycle)
- जड़ और चेतन में क्या अंतर है? (Living/Non-living)
- सौर मंडल में कितने ग्रह हैं? (Solar system)

**Class 7:**
- पाइथागोरस प्रमेय क्या है? (Pythagoras theorem)
- परमाणु और अणु में क्या अंतर है? (Atoms & molecules)
- गुरुत्वाकर्षण क्या है? (Gravity)
- प्रतिशत कैसे निकालते हैं? (Percentages)
- पाचन तंत्र कैसे काम करता है? (Digestive system)

**Class 8:**
- गति और वेग में क्या अंतर है? (Motion & velocity)
- विद्युत धारा क्या है? (Electric current)
- कोशिका क्या है? (Cells)
- समीकरण को हल कैसे करें? (Algebra)
- रासायनिक अभिक्रिया क्या है? (Chemical reactions)

**Class 9:**
- न्यूटन के गति के नियम क्या हैं? (Newton's laws)
- DNA क्या है? (DNA)
- द्विघात समीकरण क्या है? (Quadratic equations)
- ऊर्जा संरक्षण का नियम क्या है? (Energy conservation)

**Class 10:**
- रासायनिक समीकरण को संतुलित कैसे करें? (Balancing equations)
- प्रकाश का परावर्तन क्या है? (Reflection of light)
- त्रिकोणमिति में sin, cos, tan क्या हैं? (Trigonometry)
- इलेक्ट्रॉन विन्यास क्या है? (Electron configuration)
- समांतर श्रेणी क्या है? (Arithmetic progression)

## How It Works

1. **Question Matching**: The system tries to match user questions with hardcoded Q&A pairs
2. **Fallback**: If no match found, returns a random answer from the same class/language
3. **Streaming Simulation**: Responses are streamed character-by-character to simulate live API
4. **Practice Questions**: Generic MCQ questions for any topic

## Files Modified

- `mock_data.py` - Contains all Q&A data
- `main.py` - Updated to use mock data instead of OpenAI
- `openai_client.py` - Commented out but kept for reference

## Switching Back to Live API

To switch back to OpenAI (or Gemini):
1. Uncomment the import in `main.py`
2. Replace `get_mock_answer()` with `ask_openai()` or `ask_gemini()`
3. Add your API key to `.env`

## Adding More Questions

Edit `mock_data.py` and add entries to the `MOCK_QA_DATA` dictionary:

```python
{
    grade: {
        "language": [
            ("question", "answer", "topic_tag", "confidence"),
            # Add more...
        ]
    }
}
```

## Limitations

- Limited question coverage
- Generic practice questions
- No real AI understanding
- Perfect for prototype demos!
