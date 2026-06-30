import { useCallback, useState } from 'react';

export function useGeminiStream() {
  const [isLoading, setIsLoading] = useState(false);

  const sendPrompt = useCallback(async ({ message, history }) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });

      if (!response.ok) {
        throw new Error('The concierge is unavailable. Please try again shortly.');
      }

      const payload = await response.json();
      return payload.text;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendPrompt, isLoading };
}
