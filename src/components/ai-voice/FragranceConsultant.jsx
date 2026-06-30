import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { useAISession } from '@/context/AISessionContext.jsx';
import { useCart } from '@/context/CartContext.jsx';
import { useGeminiStream } from '@/hooks/useGeminiStream';
import { productSeed } from '@/lib/productSeed';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { VoiceInput } from './VoiceInput';

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.92;
  utterance.pitch = 0.86;
  window.speechSynthesis.speak(utterance);
}

function normalizeCommand(value) {
  return String(value || '').trim().toLowerCase().replace(/[^\w\s]/g, '');
}

export function FragranceConsultant() {
  const [message, setMessage] = useState('');
  const [voiceReplies, setVoiceReplies] = useState(true);
  const { messages, addMessage } = useAISession();
  const { addToCart } = useCart();
  const { sendPrompt, isLoading } = useGeminiStream();
  const navigate = useNavigate();

  function addAssistantMessage(content, shouldSpeak = voiceReplies) {
    addMessage({ role: 'assistant', content });
    if (shouldSpeak) {
      speak(content);
    }
  }

  function handleCommand(content) {
    const command = normalizeCommand(content);

    if (command.includes('show oud') || command.includes('oud collection')) {
      const reply = 'Opening the oud collection for you.';
      addAssistantMessage(reply);
      navigate('/shop?mood=oud');
      return true;
    }

    if (command.includes('add royal oud')) {
      const product = productSeed.find((item) => item.slug === 'royal-oud');
      if (product) {
        addToCart(product);
        addAssistantMessage('Royal Oud has been added to your personal selection.');
      }
      return true;
    }

    if (command.includes('proceed') || command.includes('checkout')) {
      addAssistantMessage('Taking you to private checkout.');
      navigate('/cart');
      return true;
    }

    if (command.includes('track my order')) {
      addAssistantMessage('Opening order tracking.');
      navigate('/track-order');
      return true;
    }

    if (command.includes('repeat that')) {
      const lastAssistant = [...messages].reverse().find((item) => item.role === 'assistant');
      if (lastAssistant?.content) {
        speak(lastAssistant.content);
      }
      return true;
    }

    return false;
  }

  async function submitMessage(content) {
    const cleanContent = String(content || '').trim();
    if (!cleanContent || isLoading) {
      return;
    }

    setMessage('');
    addMessage({ role: 'user', content: cleanContent });

    if (handleCommand(cleanContent)) {
      return;
    }

    try {
      const reply = await sendPrompt({ message: cleanContent, history: messages });
      addAssistantMessage(reply || 'I can help you discover a fragrance, but I need a little more detail.');
    } catch (error) {
      addAssistantMessage(error.message || 'The concierge is unavailable. Please try again shortly.', false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMessage(message);
  }

  function handleVoiceTranscript(transcript) {
    setMessage(transcript);
    submitMessage(transcript);
  }

  return (
    <form className="rounded-md border border-white/10 bg-ink-900 p-6 shadow-velvet" onSubmit={handleSubmit}>
      <p className="text-xs uppercase tracking-[0.32em] text-gold-300">AI voice concierge</p>
      <h1 className="mt-3 font-display text-3xl text-cream-50">Tell Swavik what you want bottled.</h1>
      <textarea
        className="mt-6 min-h-36 w-full rounded-md border border-white/10 bg-ink-950 p-4 text-cream-50 outline-none transition focus:border-gold-500/70"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Describe the occasion, mood, climate, fabric, or memory."
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
        <LuxuryButton disabled={isLoading} className="flex-1">
          {isLoading ? 'Consulting...' : 'Ask SWAVIK AI'}
        </LuxuryButton>
        <VoiceInput
          disabled={isLoading}
          onInterimTranscript={setMessage}
          onTranscript={handleVoiceTranscript}
        />
        <button
          className="luxury-focus inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-cream-100/65 transition hover:border-gold-500/60 hover:text-gold-300"
          type="button"
          onClick={() => {
            window.speechSynthesis?.cancel();
            setVoiceReplies((current) => !current);
          }}
        >
          {voiceReplies ? <Volume2 size={16} /> : <VolumeX size={16} />}
          Reply
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {['Show Oud Collection', 'Add Royal Oud', 'Proceed To Checkout', 'Track My Order'].map((command) => (
          <button
            key={command}
            className="luxury-focus rounded-full border border-white/10 px-3 py-2 text-xs text-cream-100/58 transition hover:border-gold-500/60 hover:text-gold-300"
            type="button"
            onClick={() => submitMessage(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </form>
  );
}
