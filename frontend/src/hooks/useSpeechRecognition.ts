import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../context/AppContext';

const LANG_CODES: Record<Language, string> = {
  hi: 'hi-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  en: 'en-US',
};

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(language: Language): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const startListening = useCallback(() => {
    if (!isSupported) return;
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_CODES[language];
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results as SpeechRecognitionResultList);
      const text = results.map((r: any) => r[0].transcript).join('');
      setTranscript(text);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  // Stop on unmount
  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  return { transcript, isListening, isSupported, startListening, stopListening, resetTranscript };
}
