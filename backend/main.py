"""
main.py — FastAPI application for Vidya Sahayak
Endpoints: /ask, /ask/stream, /practice, /progress/{session_id}, /health
"""

import json
import re

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from database import init_db, log_doubt, get_topic_count_in_session, get_session_progress
from mock_data import get_mock_answer, get_mock_practice_questions, get_questions_list
# from openai_client import ask_openai, ask_openai_stream, ask_openai_practice
from prompts import (
    build_ask_system_prompt,
    build_practice_system_prompt,
    get_related_tags,
    DIAGRAM_TOPICS,
    STREAM_DELIMITER,
    verify_confidence,
)


# Simple in-memory rate limiter (per-IP sliding window). Not for multi-instance production.
from starlette.requests import Request
import time
from typing import Dict, List

RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "120"))
_rate_store: Dict[str, List[float]] = {}


def _is_romanized(text: str, language: str) -> bool:
    """Detect if a non-English question was typed in Roman script (Hinglish/Tanglish/Banglish).
    Heuristic: language != 'en' AND text is pure ASCII (no native script characters).
    Examples: 'photosynthesis kya hai' → True, 'प्रकाश संश्लेषण' → False.
    """
    return language != 'en' and bool(text.strip()) and text.strip().isascii()


LANGUAGE_NAMES_FULL = {"hi": "Hindi", "ta": "Tamil", "bn": "Bengali", "en": "English"}

app = FastAPI(title="Vidya Sahayak API", version="2.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Configure CORS from environment to avoid allowing all origins in production.
allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
allow_origins = [o.strip() for o in allowed.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins or ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if "*" in allow_origins:
    # Warn on wildcard in ALLOWED_ORIGINS - acceptable in local dev but not for prod.
    print("WARNING: ALLOWED_ORIGINS contains '*'. Consider restricting origins for production.")


@app.middleware("http")
async def _rate_limit_middleware(request: Request, call_next):
    # Check request size via Content-Length header
    max_bytes = int(os.getenv("MAX_REQUEST_BYTES", str(64 * 1024)))
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > max_bytes:
                return HTTPException(status_code=413, detail="Request too large")
        except ValueError:
            pass

    # Use client host as key
    client_host = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    entries = _rate_store.get(client_host, [])
    # Keep only recent entries
    entries = [t for t in entries if t > window_start]
    if len(entries) >= RATE_LIMIT_REQUESTS:
        # Too many requests
        from fastapi.responses import JSONResponse

        return JSONResponse(status_code=429, content={"detail": "Too many requests"})
    entries.append(now)
    _rate_store[client_host] = entries

    response = await call_next(request)
    return response


@app.on_event("startup")
async def startup():
    init_db()


# ── Request / Response models ─────────────────────────────────────────────────

class AskRequest(BaseModel):
    text: str
    language: str = "hi"           # hi | ta | bn
    mode: str = "formal"           # formal | tuition-teacher
    session_id: str = "demo"
    low_bandwidth: bool = False
    grade: int = 8                  # NEW: Class 6–10


class AskResponse(BaseModel):
    answer: str
    confidence: str                # high | medium | low
    topic_tag: str
    diagram_eligible: bool
    diagram_data: dict | None = None
    show_weak_topic_card: bool
    weak_topic_tag: str | None = None


class PracticeRequest(BaseModel):
    topic_tag: str
    language: str = "hi"
    session_id: str = "demo"
    grade: int = 8                  # NEW


class Question(BaseModel):
    question: str
    options: list[str]
    correct_index: int


class PracticeResponse(BaseModel):
    questions: list[Question]
    topic_tag: str


# ── Shared helper ─────────────────────────────────────────────────────────────

def _build_ask_response(
    result: dict,
    session_id: str,
    question_text: str,
    language: str,
) -> dict:
    """Shared logic: validate result, log to DB, check weak-topic threshold."""
    answer = result.get("answer", "Sorry, I could not generate an answer.")
    confidence = result.get("confidence", "low")
    topic_tag = result.get("topic_tag", "general")
    diagram_data = result.get("diagram_data")
    diagram_eligible = bool(result.get("diagram_eligible", False))

    confidence = verify_confidence(topic_tag, language, answer, confidence)

    # Only flag diagram_eligible for supported templates
    if topic_tag not in DIAGRAM_TOPICS:
        diagram_eligible = False

    log_doubt(session_id, question_text, topic_tag, language)

    related_tags = get_related_tags(topic_tag)
    count = get_topic_count_in_session(session_id, related_tags)
    show_weak_topic_card = count >= 3

    return {
        "answer": answer,
        "confidence": confidence,
        "topic_tag": topic_tag,
        "diagram_eligible": diagram_eligible,
        "diagram_data": diagram_data,
        "show_weak_topic_card": show_weak_topic_card,
        "weak_topic_tag": topic_tag if show_weak_topic_card else None,
    }


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/ask", response_model=AskResponse)
async def ask(req: AskRequest):
    """Non-streaming endpoint using mock data for prototype."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Question text is required")

    try:
        # Use mock data instead of API
        result = get_mock_answer(req.text, req.language, req.grade)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Mock data error: {str(e)}")

    data = _build_ask_response(result, req.session_id, req.text, req.language)
    return AskResponse(**data)


@app.post("/ask/stream")
async def ask_stream(req: AskRequest):
    """
    Streaming endpoint using mock data - simulates streaming for prototype.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Question text is required")

    async def event_stream():
        try:
            # Get mock answer
            result = get_mock_answer(req.text, req.language, req.grade)
            answer_text = result.get("answer", "")
            
            # Simulate streaming by sending character by character
            chunk_size = 5  # Send 5 characters at a time
            for i in range(0, len(answer_text), chunk_size):
                chunk = answer_text[i:i+chunk_size]
                yield f"data: {json.dumps({'type': 'chunk', 'text': chunk})}\n\n"
                await asyncio.sleep(0.05)  # Small delay to simulate streaming
            
            # Send final metadata
            data = _build_ask_response(result, req.session_id, req.text, req.language)
            yield f"data: {json.dumps({'type': 'done', **data})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@app.post("/practice", response_model=PracticeResponse)
async def practice(req: PracticeRequest):
    """Generate practice questions using mock data."""
    try:
        raw_questions = get_mock_practice_questions(req.topic_tag, req.language, req.grade)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Mock data error: {str(e)}")

    questions = []
    for q in raw_questions:
        if not isinstance(q, dict):
            continue
        question_text = q.get("question", "")
        options = q.get("options", [])
        correct_index = q.get("correct_index", 0)
        if question_text and len(options) == 4 and isinstance(correct_index, int):
            questions.append(Question(question=question_text, options=options, correct_index=correct_index))

    if not questions:
        raise HTTPException(status_code=502, detail="Could not generate valid practice questions. Please try again.")

    return PracticeResponse(questions=questions, topic_tag=req.topic_tag)


@app.get("/progress/{session_id}")
async def progress(session_id: str):
    data = get_session_progress(session_id)
    return {"session_id": session_id, "topics": data}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "Vidya Sahayak API", "version": "2.0.0"}


@app.get("/questions")
async def get_questions(language: str = "hi", grade: int = 8):
    """Get list of available mock questions for the given language and grade."""
    try:
        questions = get_questions_list(language, grade)
        return {"questions": questions, "language": language, "grade": grade}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching questions: {str(e)}")
