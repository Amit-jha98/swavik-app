import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Sparkles, Volume2, VolumeX, ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';
import { useAISession } from '@/context/AISessionContext.jsx';
import { useCart } from '@/context/CartContext.jsx';
import { useGeminiStream } from '@/hooks/useGeminiStream';
import { productSeed } from '@/lib/productSeed';
import { formatCurrency } from '@/lib/formatters';
import { BottleStage } from '@/components/luxury/BottleStage';

const SCENT_INTENTS = [
  { label: 'Floral', emoji: '🌹' },
  { label: 'Oud', emoji: '🪵' },
  { label: 'Luxury', emoji: '✨' },
  { label: 'Fresh', emoji: '🍃' },
  { label: 'Arabian', emoji: '🏜️' },
  { label: 'Heritage', emoji: '🏛️' },
];

const luxuryEase = [0.19, 1, 0.22, 1];

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.92;
  utterance.pitch = 0.86;
  window.speechSynthesis.speak(utterance);
}

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function getProductsForMood(mood) {
  const needle = mood.toLowerCase();
  return productSeed.filter((p) => {
    const haystack = [p.category, p.subcategory, p.room, p.mood, ...(p.notes || [])].join(' ').toLowerCase();
    return haystack.includes(needle);
  }).slice(0, 3);
}

function ConciergeAvatar({ size = 56 }) {
  return (
    <div
      className="sfp-concierge-avatar"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
        <circle cx="28" cy="28" r="27" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
        <circle cx="28" cy="20" r="8" fill="rgba(212,175,55,0.25)" />
        <ellipse cx="28" cy="38" rx="12" ry="9" fill="rgba(212,175,55,0.2)" />
        <circle cx="28" cy="28" r="24" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>
      <div className="sfp-concierge-glow" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="sfp-chat-bubble sfp-chat-assistant">
      <ConciergeAvatar size={32} />
      <div className="sfp-bubble-body">
        <div className="sfp-typing-indicator">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message, isLast }) {
  const isAssistant = message.role === 'assistant';
  return (
    <motion.div
      className={`sfp-chat-bubble ${isAssistant ? 'sfp-chat-assistant' : 'sfp-chat-user'}`}
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: luxuryEase }}
    >
      {isAssistant && <ConciergeAvatar size={32} />}
      <div className={`sfp-bubble-body ${isAssistant ? 'sfp-bubble-assistant' : 'sfp-bubble-user'}`}>
        <p>{message.content}</p>
      </div>
    </motion.div>
  );
}

function ProductRecommendationCard({ product, onSelect, onViewDetail }) {
  return (
    <motion.div
      className="sfp-chat-product-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: luxuryEase }}
      whileHover={{ y: -4 }}
    >
      <div className="sfp-chat-product-visual">
        <BottleStage src={product.asset} alt={product.name} size="small" tone={product.bottleTone} className="w-full min-h-40" />
      </div>
      <div className="sfp-chat-product-info">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold-300">{product.badge}</span>
        <h4 className="mt-1 font-display text-xl text-cream-50">{product.name}</h4>
        <p className="mt-1 text-xs text-cream-100/50">{product.notes.join(' / ')}</p>
        <p className="mt-2 text-sm font-semibold text-gold-300">{formatCurrency(product.price)}</p>
        <div className="mt-3 flex gap-2">
          <button
            className="sfp-chat-product-btn"
            onClick={() => onViewDetail(product)}
            type="button"
          >
            Details
          </button>
          <button
            className="sfp-chat-product-btn sfp-chat-product-btn-primary"
            onClick={() => onSelect(product)}
            type="button"
          >
            <ShoppingBag size={12} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function AIConcierge({ isPopup = false, onComplete }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { messages, addMessage, resetSession } = useAISession();
  const { sendPrompt, isLoading } = useGeminiStream();
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [flowStep, setFlowStep] = useState('welcome'); // welcome, name, preference, heritage, products, detail, freeChat
  const [userName, setUserName] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, recommendedProducts, flowStep]);

  // Auto-start the welcome flow
  useEffect(() => {
    if (flowStep === 'welcome' && messages.length <= 1) {
      if (voiceEnabled) {
        speak('Welcome to the SWAVIK Private Reserve Concierge. I am your personal fragrance advisor.');
      }
      
      const timer = setTimeout(() => {
        addAssistantMessage('Before we begin, may I know your name?');
        setFlowStep('name');
      }, 4000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addAssistantMessage(content, shouldSpeak = voiceEnabled) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ role: 'assistant', content });
      if (shouldSpeak) speak(content);
    }, 800 + Math.random() * 600);
  }

  function handleNameSubmit(name) {
    const cleanName = name.trim();
    if (!cleanName) return;
    setUserName(cleanName);
    addMessage({ role: 'user', content: cleanName });
    setInput('');

    setTimeout(() => {
      addAssistantMessage(`Welcome, ${cleanName}.`);
      
      if (isPopup) {
        setTimeout(() => {
          addAssistantMessage('Allow me to guide you through our heritage.');
          setTimeout(() => {
            if (onComplete) onComplete();
            navigate('/heritage');
          }, 2000);
        }, 1500);
      } else {
        setTimeout(() => {
          addAssistantMessage('What are you looking for today?');
          setFlowStep('preference');
        }, 2200);
      }
    }, 400);
  }

  function handleMoodSelect(mood) {
    setSelectedMood(mood);
    addMessage({ role: 'user', content: `I want ${mood.toLowerCase()} fragrances.` });

    setTimeout(() => {
      addAssistantMessage(`Excellent choice. Allow me to show you our ${mood.toLowerCase()} collection.`);
      setTimeout(() => {
        const products = getProductsForMood(mood);
        setRecommendedProducts(products.length ? products : productSeed.slice(0, 3));
        setFlowStep('products');
        addAssistantMessage(
          `Based on your interest in ${mood}, I have selected ${products.length || 3} fragrances for you.`
        );
      }, 2000);
    }, 500);
  }

  function handleProductSelect(product) {
    addToCart(product);
    setSelectedProduct(product);
    addMessage({ role: 'user', content: `Add ${product.name} to my selection.` });

    setTimeout(() => {
      addAssistantMessage(
        `Excellent choice. ${product.name} has been added to your personal selection. Would you like to discover another fragrance, or proceed to checkout?`
      );
      setFlowStep('detail');
    }, 400);
  }

  function handleProductDetail(product) {
    setSelectedProduct(product);
    addMessage({ role: 'user', content: `Tell me about ${product.name}.` });
    setTimeout(() => {
      addAssistantMessage(
        `${product.name} — ${product.description} The fragrance notes are ${product.notes.join(', ')}. Priced at ${formatCurrency(product.price)} for ${product.size}.`
      );
    }, 400);
  }

  function handleExploreMore() {
    addMessage({ role: 'user', content: 'Show me more fragrances.' });
    setFlowStep('preference');
    setTimeout(() => {
      addAssistantMessage('Of course. What mood are you drawn to?');
    }, 400);
  }

  function handleProceedToCheckout() {
    addMessage({ role: 'user', content: 'Proceed to checkout.' });
    setTimeout(() => {
      addAssistantMessage('Taking you to your private checkout. It has been a pleasure.');
      setTimeout(() => navigate('/cart'), 1500);
    }, 400);
  }

  async function handleFreeChat(content) {
    const clean = content.trim();
    if (!clean || isLoading) return;

    setInput('');
    addMessage({ role: 'user', content: clean });

    // Check for quick commands
    const lc = clean.toLowerCase();
    if (lc.includes('checkout') || lc.includes('proceed')) {
      handleProceedToCheckout();
      return;
    }
    if (lc.includes('explore') || lc.includes('more fragrance')) {
      handleExploreMore();
      return;
    }

    // Delegate to Gemini
    setIsTyping(true);
    try {
      const reply = await sendPrompt({ message: clean, history: messages });
      setIsTyping(false);
      addMessage({ role: 'assistant', content: reply || 'I need a little more detail.' });
      if (voiceEnabled) speak(reply);
      setFlowStep('freeChat');
    } catch (err) {
      setIsTyping(false);
      addMessage({ role: 'assistant', content: 'The concierge is unavailable. Please try again shortly.' });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    if (flowStep === 'name') {
      handleNameSubmit(value);
    } else if (flowStep === 'preference') {
      // Try to match a mood
      const matched = SCENT_INTENTS.find(s => value.toLowerCase().includes(s.label.toLowerCase()));
      if (matched) {
        handleMoodSelect(matched.label);
      } else {
        handleFreeChat(value);
      }
    } else {
      handleFreeChat(value);
    }
  }

  // Voice input
  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      if (interimText) setInput(interimText);
      if (finalText) {
        setInput(finalText);
        // Auto-submit voice result
        if (flowStep === 'name') handleNameSubmit(finalText);
        else if (flowStep === 'preference') {
          const matched = SCENT_INTENTS.find(s => finalText.toLowerCase().includes(s.label.toLowerCase()));
          if (matched) handleMoodSelect(matched.label);
          else handleFreeChat(finalText);
        } else handleFreeChat(finalText);
      }
    };

    recognition.start();
  }

  function handleReset() {
    resetSession();
    setFlowStep('welcome');
    setUserName('');
    setSelectedMood('');
    setRecommendedProducts([]);
    setSelectedProduct(null);
    setInput('');

    setTimeout(() => {
      addAssistantMessage('Before we begin, may I know your name?');
      setFlowStep('name');
    }, 800);
  }

  const placeholder =
    flowStep === 'name' ? 'Enter your name...'
    : flowStep === 'preference' ? 'Describe your mood or select above...'
    : 'Ask me anything about fragrances...';

  return (
    <div className={`sfp-ai-page-layout ${isPopup ? 'sfp-ai-popup' : ''}`}>
      {/* AI Character Side */}
      <div className="sfp-ai-character-pane">
        <motion.img 
          src="/media/cartoon_bottle-removebg.png" 
          alt="Swavik AI Concierge"
          className="sfp-ai-character-img"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: luxuryEase }}
        />
      </div>

      {/* Chat Interface Side */}
      <div className="sfp-concierge-shell">
      {/* Header */}
      <div className="sfp-concierge-header">
        <div className="flex items-center gap-3">
          <ConciergeAvatar size={40} />
          <div>
            <h1 className="font-display text-lg text-cream-50 tracking-wider">SWAVIK Concierge</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-300/70">AI Fragrance Advisor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="sfp-concierge-icon-btn"
            onClick={() => { window.speechSynthesis?.cancel(); setVoiceEnabled(v => !v); }}
            type="button"
            title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            className="sfp-concierge-icon-btn"
            onClick={handleReset}
            type="button"
            title="Start over"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="sfp-concierge-chat">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Preference buttons */}
        <AnimatePresence>
          {flowStep === 'preference' && (
            <motion.div
              className="sfp-preference-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: luxuryEase }}
            >
              {SCENT_INTENTS.map((intent) => (
                <button
                  key={intent.label}
                  className="sfp-preference-btn"
                  onClick={() => handleMoodSelect(intent.label)}
                  type="button"
                >
                  <span className="text-base">{intent.emoji}</span>
                  <span>{intent.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product recommendations */}
        <AnimatePresence>
          {flowStep === 'products' && recommendedProducts.length > 0 && (
            <motion.div
              className="sfp-chat-products-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: luxuryEase }}
            >
              {recommendedProducts.map((product) => (
                <ProductRecommendationCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  onViewDetail={handleProductDetail}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-selection actions */}
        <AnimatePresence>
          {flowStep === 'detail' && (
            <motion.div
              className="sfp-chat-actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: luxuryEase }}
            >
              <button className="sfp-action-btn" onClick={handleExploreMore} type="button">
                <Sparkles size={14} />
                Explore More
              </button>
              <button className="sfp-action-btn sfp-action-btn-primary" onClick={handleProceedToCheckout} type="button">
                <ArrowRight size={14} />
                Proceed To Checkout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick commands in free chat */}
        {flowStep === 'freeChat' && (
          <div className="sfp-quick-commands">
            {['Show Oud Collection', 'Tell Me More', 'Add Royal Oud', 'Proceed To Checkout'].map((cmd) => (
              <button
                key={cmd}
                className="sfp-quick-cmd"
                onClick={() => handleFreeChat(cmd)}
                type="button"
              >
                {cmd}
              </button>
            ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form className="sfp-concierge-input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="sfp-concierge-text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button
          className={`sfp-concierge-mic-btn ${isListening ? 'sfp-mic-active' : ''}`}
          type="button"
          onClick={toggleVoice}
          disabled={!getSpeechRecognition()}
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button
          className="sfp-concierge-send-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          title="Send"
        >
          <Send size={18} />
        </button>
      </form>
      </div>
    </div>
  );
}
