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
        <button className="mic-btn" style={{ opacity: 0.45, cursor: 'not-allowed' }} disabled id="mic-btn-unsupported">
          <MicOff size={34} color="white" strokeWidth={2} />
        </button>
        <span className="mic-label" style={{ color: 'var(--danger)' }}>
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
        {isListening
          ? <Square size={30} color="white" fill="white" strokeWidth={0} />
          : <Mic size={34} color="white" strokeWidth={2} />}
      </button>
      <span className="mic-label">
        {isListening ? 'Listening… tap to stop' : 'Tap to speak your doubt'}
      </span>
    </div>
  );
}
