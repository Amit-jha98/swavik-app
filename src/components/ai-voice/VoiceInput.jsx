import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

function getSpeechRecognition() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function VoiceInput({ onTranscript, onInterimTranscript, disabled = false }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const isSupported = Boolean(getSpeechRecognition());

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function startListening() {
    setError('');

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setError(event.error === 'not-allowed' ? 'Microphone permission was blocked.' : 'Unable to hear that clearly.');
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (interimText.trim()) {
        onInterimTranscript?.(interimText.trim());
      }

      if (finalText.trim()) {
        onTranscript?.(finalText.trim());
      }
    };

    recognition.start();
  }

  return (
    <div className="grid gap-2">
      <button
        className={`luxury-focus inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-xs uppercase tracking-[0.22em] transition ${
          isListening
            ? 'border-gold-500 bg-gold-500 text-ink-950'
            : 'border-white/10 text-gold-300 hover:border-gold-500/60'
        }`}
        type="button"
        onClick={startListening}
        disabled={disabled || !isSupported}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        {isListening ? 'Listening' : 'Voice'}
      </button>
      {error ? <p className="text-xs leading-5 text-red-300">{error}</p> : null}
      {!isSupported ? <p className="text-xs leading-5 text-cream-100/45">Use Chrome or Edge for voice input.</p> : null}
    </div>
  );
}
