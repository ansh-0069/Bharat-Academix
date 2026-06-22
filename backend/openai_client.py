"""
openai_client.py — OpenAI API wrapper for Vidya Sahayak

Uses the OpenAI SDK with async support.
Model: gpt-4o-mini (fast and cost-effective for educational use).
"""

import asyncio
import json
import os
import re
from typing import AsyncIterator

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

_api_key = os.getenv("OPENAI_API_KEY", "")
if not _api_key or _api_key == "your_openai_api_key_here":
    raise RuntimeError(
        "OPENAI_API_KEY is not set. "
        "Edit backend/.env and add your key from https://platform.openai.com/api-keys"
    )

# Instantiate a single shared async client
client = AsyncOpenAI(api_key=_api_key)

# gpt-4o-mini: fast, cost-effective model for educational use
MODEL_NAME = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Retry / timeout defaults (can be tuned via env)
DEFAULT_RETRIES = int(os.getenv("OPENAI_RETRIES", "3"))
DEFAULT_TIMEOUT = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "30"))


def _extract_json(text: str) -> dict:
    """Strip markdown fences and parse JSON from model response."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()
    return json.loads(text)


async def ask_openai(user_message: str, system_prompt: str) -> dict:
    """
    Send a doubt to OpenAI and return parsed JSON response.
    Used by the non-streaming /ask endpoint (kept for backward compatibility).
    Falls back gracefully if the response is malformed JSON.
    """
    # Retry loop with exponential backoff
    attempt = 0
    last_exc = None
    while attempt < DEFAULT_RETRIES:
        try:
            response = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.4,
                max_tokens=1024,
                timeout=DEFAULT_TIMEOUT,
            )
            raw = response.choices[0].message.content or ""
            last_exc = None
            break
        except Exception as e:
            last_exc = e
            attempt += 1
            if attempt < DEFAULT_RETRIES:
                await asyncio.sleep(2 ** attempt)
    else:
        # All retries failed
        raise RuntimeError(f"OpenAI request failed after {DEFAULT_RETRIES} attempts: {last_exc}")

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


async def ask_openai_stream(
    user_message: str,
    system_prompt: str,
) -> AsyncIterator[str]:
    """
    Async generator that yields raw text chunks from OpenAI.
    The full output will contain the answer text followed by |||METADATA|||
    and then a JSON object. The caller (main.py) handles splitting.
    """
    attempt = 0
    last_exc = None
    while attempt < DEFAULT_RETRIES:
        try:
            stream = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.4,
                max_tokens=1024,
                stream=True,
                timeout=DEFAULT_TIMEOUT,
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
            return
        except Exception as e:
            last_exc = e
            attempt += 1
            if attempt < DEFAULT_RETRIES:
                await asyncio.sleep(2 ** attempt)
    # If we reach here, all retries failed
    raise RuntimeError(f"OpenAI streaming failed after {DEFAULT_RETRIES} attempts: {last_exc}")


async def ask_openai_practice(user_message: str, system_prompt: str) -> dict:
    """Generate 5 MCQ practice questions. Higher token limit."""
    attempt = 0
    last_exc = None
    while attempt < DEFAULT_RETRIES:
        try:
            response = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.6,
                max_tokens=2048,
                timeout=DEFAULT_TIMEOUT * 2,
            )
            raw = response.choices[0].message.content or ""
            last_exc = None
            break
        except Exception as e:
            last_exc = e
            attempt += 1
            if attempt < DEFAULT_RETRIES:
                await asyncio.sleep(2 ** attempt)
    else:
        raise RuntimeError(f"OpenAI practice request failed after {DEFAULT_RETRIES} attempts: {last_exc}")

    try:
        return _extract_json(raw)
    except (json.JSONDecodeError, ValueError):
        return {"questions": [], "_parse_error": True, "_raw": raw}
