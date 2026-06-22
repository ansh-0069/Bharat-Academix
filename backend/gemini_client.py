"""
gemini_client.py — Google Gemini API wrapper for Vidya Sahayak

Uses the google-genai SDK (google.genai.Client) with async support.
Model: gemini-2.5-flash (best available flash model on this key's quota).
"""

import asyncio
import json
import os
import re
from typing import AsyncIterator

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY", "")
if not _api_key or _api_key == "your_gemini_api_key_here":
    raise RuntimeError(
        "GEMINI_API_KEY is not set. "
        "Edit backend/.env and add your key from https://ai.google.dev/"
    )

# Instantiate a single shared async client
client = genai.Client(api_key=_api_key)

# gemini-2.5-flash: best flash model available on this API key
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Retry / timeout defaults (can be tuned via env)
DEFAULT_RETRIES = int(os.getenv("GEMINI_RETRIES", "3"))
DEFAULT_TIMEOUT = float(os.getenv("GEMINI_TIMEOUT_SECONDS", "10"))


def _extract_json(text: str) -> dict:
    """Strip markdown fences and parse JSON from model response."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()
    return json.loads(text)


async def ask_gemini(user_message: str, system_prompt: str) -> dict:
    """
    Send a doubt to Gemini and return parsed JSON response.
    Used by the non-streaming /ask endpoint (kept for backward compatibility).
    Falls back gracefully if the response is malformed JSON.
    """
    # Retry loop with exponential backoff and overall timeout per request
    attempt = 0
    last_exc = None
    while attempt < DEFAULT_RETRIES:
        try:
            coro = client.aio.models.generate_content(
                model=MODEL_NAME,
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.4,
                    max_output_tokens=1024,
                ),
            )
            response = await asyncio.wait_for(coro, timeout=DEFAULT_TIMEOUT)
            raw = response.text or ""
            last_exc = None
            break
        except Exception as e:
            last_exc = e
            attempt += 1
            if attempt < DEFAULT_RETRIES:
                await asyncio.sleep(2 ** attempt)
    else:
        # All retries failed
        raise RuntimeError(f"Gemini request failed after {DEFAULT_RETRIES} attempts: {last_exc}")

    # The streaming prompt now uses |||METADATA||| delimiter.
    # If the non-streaming endpoint is called with such a prompt, parse accordingly.
    from prompts import STREAM_DELIMITER
    if STREAM_DELIMITER in raw:
        parts = raw.split(STREAM_DELIMITER, 1)
        answer_text = parts[0].strip()
        meta_str = parts[1].strip() if len(parts) > 1 else ""
        try:
            meta = _extract_json(meta_str)
            meta["answer"] = answer_text
            return meta
        except (json.JSONDecodeError, ValueError):
            pass

    # Legacy JSON path (whole response is JSON)
    try:
        return _extract_json(raw)
    except (json.JSONDecodeError, ValueError):
        return {
            "answer": raw,
            "confidence": "low",
            "topic_tag": "general",
            "diagram_eligible": False,
            "_parse_error": True,
        }


async def ask_gemini_stream(
    user_message: str,
    system_prompt: str,
) -> AsyncIterator[str]:
    """
    Async generator that yields raw text chunks from Gemini.
    The full output will contain the answer text followed by |||METADATA|||
    and then a JSON object. The caller (main.py) handles splitting.
    """
    attempt = 0
    last_exc = None
    while attempt < DEFAULT_RETRIES:
        try:
            async for chunk in client.aio.models.generate_content_stream(
                model=MODEL_NAME,
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.4,
                    max_output_tokens=1024,
                ),
            ):
                if chunk.text:
                    yield chunk.text
            return
        except Exception as e:
            last_exc = e
            attempt += 1
            if attempt < DEFAULT_RETRIES:
                await asyncio.sleep(2 ** attempt)
    # If we reach here, all retries failed
    raise RuntimeError(f"Gemini streaming failed after {DEFAULT_RETRIES} attempts: {last_exc}")


async def ask_gemini_practice(user_message: str, system_prompt: str) -> dict:
    """Generate 5 MCQ practice questions. Higher token limit."""
    attempt = 0
    last_exc = None
    while attempt < DEFAULT_RETRIES:
        try:
            coro = client.aio.models.generate_content(
                model=MODEL_NAME,
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.6,
                    max_output_tokens=2048,
                ),
            )
            response = await asyncio.wait_for(coro, timeout=DEFAULT_TIMEOUT * 2)
            raw = response.text or ""
            last_exc = None
            break
        except Exception as e:
            last_exc = e
            attempt += 1
            if attempt < DEFAULT_RETRIES:
                await asyncio.sleep(2 ** attempt)
    else:
        raise RuntimeError(f"Gemini practice request failed after {DEFAULT_RETRIES} attempts: {last_exc}")

    try:
        return _extract_json(raw)
    except (json.JSONDecodeError, ValueError):
        return {"questions": [], "_parse_error": True, "_raw": raw}
