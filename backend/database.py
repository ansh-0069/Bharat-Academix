"""
database.py — SQLite setup and queries for Vidya Sahayak
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "vidya_sahayak.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database and create tables if they don't exist."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS doubts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                text TEXT NOT NULL,
                topic_tag TEXT NOT NULL,
                language TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        """)
        conn.commit()


def log_doubt(session_id: str, text: str, topic_tag: str, language: str):
    """Log a doubt to the database."""
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO doubts (session_id, text, topic_tag, language, timestamp)
            VALUES (?, ?, ?, ?, ?)
            """,
            (session_id, text, topic_tag, language, datetime.utcnow().isoformat()),
        )
        conn.commit()


def get_topic_count_in_session(session_id: str, related_tags: list[str]) -> int:
    """Return how many doubts in this session match any of the related tags."""
    if not related_tags:
        return 0
    placeholders = ",".join("?" * len(related_tags))
    with get_connection() as conn:
        row = conn.execute(
            f"""
            SELECT COUNT(*) as count FROM doubts
            WHERE session_id = ? AND topic_tag IN ({placeholders})
            """,
            [session_id] + related_tags,
        ).fetchone()
    return row["count"] if row else 0


def get_session_progress(session_id: str) -> list[dict]:
    """Return topic frequency counts for a session."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT topic_tag, language, COUNT(*) as count
            FROM doubts
            WHERE session_id = ?
            GROUP BY topic_tag, language
            ORDER BY count DESC
            """,
            (session_id,),
        ).fetchall()
    return [dict(row) for row in rows]
