// MicButton.tsx
import { Mic, MicOff, Square } from 'lucide-react';

interface Props {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function MicButton({ isListening, isSupported, onStart, onStop }: Props) {
  if (!isSupported) {
    return (
      <div className="mic-container">
        <button className="mic-btn" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled id="mic-btn-unsupported">
          <MicOff size={36} color="white" />
        </button>
        <span className="mic-label" style={{ color: '#DC2626' }}>
          Speech not supported in this browser
        </span>
      </div>
    );
  }

  return (
    <div className="mic-container">
      <button
        id="mic-btn-main"
        className={`mic-btn ${isListening ? 'recording' : ''}`}
        onClick={isListening ? onStop : onStart}
        aria-label={isListening ? 'Stop recording' : 'Start recording'}
      >
        {isListening ? <Square size={32} color="white" fill="white" /> : <Mic size={36} color="white" />}
      </button>
      <span className="mic-label">
        {isListening ? '🔴 Listening… tap to stop' : 'Tap to speak your doubt'}
      </span>
    </div>
  );
}
