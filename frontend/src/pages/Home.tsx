// Home.tsx — Main doubt-asking screen
import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Loader2, WifiOff, AlertCircle } from 'lucide-react';
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

  const [inputText, setInputText] = useState('');
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReExplaining, setIsReExplaining] = useState(false);
  const [lastQuestion, setLastQuestion] = useState('');
  const [error, setError] = useState('');
  const [showDiagram, setShowDiagram] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [practiceTopicTag, setPracticeTopicTag] = useState('');
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition(language);
  const { speak, stop, isSpeaking } = useSpeechSynthesis(language);

  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  const submitQuestion = useCallback(async (
    text: string,
    overrideMode?: Mode,
    isReExplain = false,
  ) => {
    if (!text.trim() || isLoading) return;

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
        (chunk) => {
          accumulatedText += chunk;
          setStreamingText(accumulatedText);
        },
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
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      if (err.name === 'AbortError') return;
      setError(err.message || 'Something went wrong. Is the backend running?');
      setStreamingText('');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
      setIsReExplaining(false);
    }
  }, [language, mode, sessionId, lowBandwidth, grade, speak, stop, isLoading]);

  const handleReExplain = useCallback((newMode: Mode) => {
    if (!lastQuestion || isLoading) return;
    setMode(newMode);
    setIsReExplaining(true);
    submitQuestion(lastQuestion, newMode, true);
  }, [lastQuestion, isLoading, setMode, submitQuestion]);

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
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message || 'Could not generate practice set');
    } finally {
      setIsPracticeLoading(false);
    }
  };

  const isBusy = isLoading || isStreaming;

  return (
    <div className="page-content">
      {lowBandwidth && (
        <div className="lowbw-banner">
          <WifiOff size={14} />
          Low-bandwidth mode — shorter answers, manual audio play
        </div>
      )}

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

      <div className="mode-toggle" id="mode-toggle">
        <button
          id="mode-formal-btn"
          className={`mode-btn ${mode === 'formal' ? 'active' : ''}`}
          onClick={() => setMode('formal')}
        >
          Formal
        </button>
        <button
          id="mode-tuition-btn"
          className={`mode-btn ${mode === 'tuition-teacher' ? 'active' : ''}`}
          onClick={() => setMode('tuition-teacher')}
        >
          Tuition Style
        </button>
      </div>

      <MicButton
        isListening={isListening}
        isSupported={isSupported}
        onStart={startListening}
        onStop={handleMicStop}
      />

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
          aria-label="Send question"
        >
          {isBusy
            ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            : <Send size={20} />}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          {error}
        </div>
      )}

      {isStreaming && streamingText && (
        <div className="streaming-card" id="streaming-card">
          <div className="streaming-header">
            <div className="streaming-indicator">
              <div className="streaming-dot" />
              <div className="streaming-dot" />
              <div className="streaming-dot" />
            </div>
            <span className="streaming-label">
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

      {isLoading && !streamingText && (
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      )}

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

      {answer?.show_weak_topic_card && !isStreaming && (
        <WeakTopicCard
          topicTag={answer.weak_topic_tag || answer.topic_tag}
          onGeneratePractice={handleGeneratePractice}
          isLoading={isPracticeLoading}
        />
      )}

      {showDiagram && answer?.topic_tag && (
        <DiagramViewer
          topicTag={answer.topic_tag}
          diagramData={answer?.diagram_data}
          onClose={() => setShowDiagram(false)}
        />
      )}

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
