// api/client.ts — Fetch wrappers for Vidya Sahayak backend

export interface AskRequest {
  text: string;
  language: string;
  mode: string;
  session_id: string;
  low_bandwidth: boolean;
  grade: number;          // NEW: Class 6–10
}

export interface AskResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low';
  topic_tag: string;
  diagram_eligible: boolean;
  diagram_data?: {
    numerator?: number;
    denominator?: number;
    side_a?: number;
    side_b?: number;
    hypotenuse?: number;
  } | null;
  show_weak_topic_card: boolean;
  weak_topic_tag: string | null;
}

export interface PracticeRequest {
  topic_tag: string;
  language: string;
  session_id: string;
  grade: number;          // NEW
}

export interface Question {
  question: string;
  options: string[];
  correct_index: number;
}

export interface PracticeResponse {
  questions: Question[];
  topic_tag: string;
}

export interface ProgressTopic {
  topic_tag: string;
  language: string;
  count: number;
}

export interface ProgressResponse {
  session_id: string;
  topics: ProgressTopic[];
}

// SSE event types
export type StreamEvent =
  | { type: 'chunk'; text: string }
  | ({ type: 'done' } & AskResponse)
  | { type: 'error'; message: string };

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

/**
 * Streams the /ask/stream SSE endpoint.
 * Calls onChunk with each text chunk, then onDone with the full response.
 * Throws on error events.
 */
export async function streamAsk(
  req: AskRequest,
  onChunk: (text: string) => void,
  onDone: (response: AskResponse) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/ask/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Stream request failed: ${res.status}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by double newlines
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data: ')) continue;

      const dataStr = line.slice(6).trim();
      let event: StreamEvent;
      try {
        event = JSON.parse(dataStr);
      } catch {
        continue;
      }

      if (event.type === 'chunk') {
        onChunk(event.text);
      } else if (event.type === 'done') {
        const { type: _t, ...response } = event;
        onDone(response as AskResponse);
      } else if (event.type === 'error') {
        throw new Error(event.message);
      }
    }
  }
}

export const api = {
  ask: (req: AskRequest) => post<AskResponse>('/ask', req),
  practice: (req: PracticeRequest) => post<PracticeResponse>('/practice', req),
  progress: (sessionId: string) => get<ProgressResponse>(`/progress/${sessionId}`),
  getQuestions: (language: string, grade: number) => get<{ questions: string[]; language: string; grade: number }>(`/questions?language=${language}&grade=${grade}`),
};
