// Home.tsx — Main doubt-asking screen
// Upgrades: #1 Streaming answers · #2 Re-explain toggle · #3 Grade selector
import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Loader2, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Mode } from '../context/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { streamAsk, api } from '../api/client';
import type { AskResponse, Question } from '../api/client';
import MicButton from '../components/MicButton';
import AnswerCard from '../components/AnswerCard';
import WeakTopicCard from '../components/WeakTopicCard';
import DiagramViewer from '../components/DiagramViewer';
import PracticeSet from '../components/PracticeSet';

const LANGUAGES = [
  { code: 'hi' as const, script: 'हिं', label: 'Hindi' },
  { code: 'ta' as const, script: 'த', label: 'Tamil' },
  { code: 'bn' as const, script: 'বাং', label: 'Bengali' },
];

const GRADES = [6, 7, 8, 9, 10];

export default function Home() {
  const { language, setLanguage, mode, setMode, lowBandwidth, sessionId, grade, setGrade } = useApp();

  // ── Input state ────────────────────────────────────────────────────────────
  const [inputText, setInputText] = useState('');

  // ── Answer state ───────────────────────────────────────────────────────────
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [streamingText, setStreamingText] = useState('');   // live text during stream
  const [isStreaming, setIsStreaming] = useState(false);    // tokens actively arriving
  const [isLoading, setIsLoading] = useState(false);       // whole request in flight
  const [isReExplaining, setIsReExplaining] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');    // for re-explain

  // ── Other UI state ─────────────────────────────────────────────────────────
  const [error, setError] = useState('');
  const [showDiagram, setShowDiagram] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [practiceTopicTag, setPracticeTopicTag] = useState('');
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);

  // Abort controller so we can cancel an in-flight stream
  const abortRef = useRef<AbortController | null>(null);

  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition(language);
  const { speak, stop, isSpeaking } = useSpeechSynthesis(language);

  // Populate input from STT transcript in real time
  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  // ── Core streaming submit ──────────────────────────────────────────────────
  const submitQuestion = useCallback(async (
    text: string,
    overrideMode?: Mode,   // used by re-explain to bypass stale closure
    isReExplain = false,
  ) => {
    if (!text.trim() || isLoading) return;

    // Cancel any in-flight stream
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const effectiveMode = overrideMode ?? mode;

    setIsLoading(true);
    setIsStreaming(true);
    setStreamingText('');
    setAnswer(null);
    setError('');
    setShowDiagram(false);
    setLastQuestion(text.trim());
    stop();

    if (!isReExplain) {
      // Only reset practice state on genuinely new questions
      setShowPractice(false);
      setPracticeQuestions([]);
    }

    let accumulatedText = '';

    try {
      await streamAsk(
        {
          text: text.trim(),
          language,
          mode: effectiveMode,
          session_id: sessionId,
          low_bandwidth: lowBandwidth,
          grade,
        },
        // onChunk — called for each text token
        (chunk) => {
          accumulatedText += chunk;
          setStreamingText(accumulatedText);
        },
        // onDone — called with full parsed response
        (result) => {
          setAnswer(result);
          setStreamingText('');
          setIsStreaming(false);
          if (!lowBandwidth) {
            setTimeout(() => speak(result.answer), 300);
          }
        },
        abortRef.current.signal,
      );
    } catch (e: any) {
      if (e.name === 'AbortError') return; // cancelled intentionally
      setError(e.message || 'Something went wrong. Is the backend running?');
      setStreamingText('');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
      setIsReExplaining(false);
    }
  }, [language, mode, sessionId, lowBandwidth, grade, speak, stop, isLoading]);

  // ── Re-explain handler ─────────────────────────────────────────────────────
  const handleReExplain = useCallback((newMode: Mode) => {
    if (!lastQuestion || isLoading) return;
    setMode(newMode);         // Update global toggle so it stays in sync
    setIsReExplaining(true);
    submitQuestion(lastQuestion, newMode, true);
  }, [lastQuestion, isLoading, setMode, submitQuestion]);

  // ── Mic handlers ───────────────────────────────────────────────────────────
  const handleMicStop = useCallback(() => {
    stopListening();
    if (transcript.trim()) {
      setTimeout(() => submitQuestion(transcript.trim()), 300);
    }
  }, [stopListening, transcript, submitQuestion]);

  const handleSend = () => {
    submitQuestion(inputText);
    resetTranscript();
  };

  // ── Practice set ───────────────────────────────────────────────────────────
  const handleGeneratePractice = async () => {
    if (!answer) return;
    setIsPracticeLoading(true);
    try {
      const result = await api.practice({
        topic_tag: answer.weak_topic_tag || answer.topic_tag,
        language,
        session_id: sessionId,
        grade,
      });
      setPracticeQuestions(result.questions);
      setPracticeTopicTag(result.topic_tag);
      setShowPractice(true);
    } catch (e: any) {
      setError(e.message || 'Could not generate practice set');
    } finally {
      setIsPracticeLoading(false);
    }
  };

  // Whether the UI is busy (disable inputs)
  const isBusy = isLoading || isStreaming;

  return (
    <div className="page-content">

      {/* ── Low bandwidth banner ─────────────────────────────────────────── */}
      {lowBandwidth && (
        <div className="lowbw-banner">
          <WifiOff size={13} />
          Low-Bandwidth Mode: shorter answers, manual audio play
        </div>
      )}

      {/* ── Language selector ────────────────────────────────────────────── */}
      <p className="section-title">Language / भाषा / மொழி / ভাষা</p>
      <div className="lang-selector" id="lang-selector">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            id={`lang-${lang.code}`}
            className={`lang-pill ${language === lang.code ? 'active' : ''}`}
            onClick={() => { setLanguage(lang.code); setAnswer(null); setInputText(''); setStreamingText(''); }}
          >
            <span className="lang-pill-script">{lang.script}</span>
            <span className="lang-pill-label">{lang.label}</span>
          </button>
        ))}
      </div>

      {/* ── Grade selector (NEW) ─────────────────────────────────────────── */}
      <div className="grade-selector" id="grade-selector">
        <span className="grade-label">Class</span>
        {GRADES.map(g => (
          <button
            key={g}
            id={`grade-${g}`}
            className={`grade-pill ${grade === g ? 'active' : ''}`}
            onClick={() => { setGrade(g); setAnswer(null); setStreamingText(''); }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* ── Mode toggle ──────────────────────────────────────────────────── */}
      <div className="mode-toggle" id="mode-toggle">
        <button
          id="mode-formal-btn"
          className={`mode-btn ${mode === 'formal' ? 'active' : ''}`}
          onClick={() => setMode('formal')}
        >
          📖 Formal
        </button>
        <button
          id="mode-tuition-btn"
          className={`mode-btn ${mode === 'tuition-teacher' ? 'active' : ''}`}
          onClick={() => setMode('tuition-teacher')}
        >
          🏏 Tuition Style
        </button>
      </div>

      {/* ── Mic button ───────────────────────────────────────────────────── */}
      <MicButton
        isListening={isListening}
        isSupported={isSupported}
        onStart={startListening}
        onStop={handleMicStop}
      />

      {/* ── Text input row ───────────────────────────────────────────────── */}
      <div className="input-row">
        <input
          id="doubt-input"
          className="text-input"
          type="text"
          placeholder={
            language === 'hi' ? 'यहाँ अपना सवाल टाइप करें…' :
            language === 'ta' ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்…' :
            'এখানে আপনার প্রশ্ন টাইপ করুন…'
          }
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isBusy && handleSend()}
          disabled={isBusy}
        />
        <button
          id="send-btn"
          className="send-btn"
          onClick={handleSend}
          disabled={!inputText.trim() || isBusy}
        >
          {isBusy
            ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            : <Send size={20} />}
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
          padding: '12px 14px', fontSize: 13, color: '#B91C1C', marginBottom: 16,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Streaming card (NEW) — shows text arriving live ──────────────── */}
      {isStreaming && streamingText && (
        <div className="streaming-card" id="streaming-card">
          <div className="streaming-header">
            <div className="streaming-indicator">
              <div className="streaming-dot" />
              <div className="streaming-dot" />
              <div className="streaming-dot" />
            </div>
            <span style={{ fontSize: 11, color: '#5A7A6A', fontWeight: 600 }}>
              {isReExplaining
                ? `Re-explaining in ${mode === 'formal' ? 'Formal' : 'Tuition'} style…`
                : 'Vidya Sahayak is answering…'}
            </span>
          </div>
          <div className={`streaming-body streaming-cursor lang-${language}`}>
            {streamingText}
          </div>
        </div>
      )}

      {/* Initial loading dots (before first chunk arrives) */}
      {isLoading && !streamingText && (
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      )}

      {/* ── Answer card ──────────────────────────────────────────────────── */}
      {answer && !isStreaming && (
        <AnswerCard
          answer={answer}
          language={language}
          currentMode={mode}
          grade={grade}
          isSpeaking={isSpeaking}
          onSpeak={() => speak(answer.answer)}
          onStop={stop}
          onViewDiagram={() => setShowDiagram(true)}
          onReExplain={handleReExplain}
          lowBandwidth={lowBandwidth}
          isReExplaining={isReExplaining}
        />
      )}

      {/* ── Weak topic card ───────────────────────────────────────────────── */}
      {answer?.show_weak_topic_card && !isStreaming && (
        <WeakTopicCard
          topicTag={answer.weak_topic_tag || answer.topic_tag}
          onGeneratePractice={handleGeneratePractice}
          isLoading={isPracticeLoading}
        />
      )}

      {/* ── Diagram viewer ───────────────────────────────────────────────── */}
      {showDiagram && answer?.topic_tag && (
        <DiagramViewer
          topicTag={answer.topic_tag}
          onClose={() => setShowDiagram(false)}
        />
      )}

      {/* ── Practice set ─────────────────────────────────────────────────── */}
      {showPractice && practiceQuestions.length > 0 && (
        <PracticeSet
          questions={practiceQuestions}
          topicTag={practiceTopicTag}
          language={language}
          onClose={() => setShowPractice(false)}
        />
      )}
    </div>
  );
}
