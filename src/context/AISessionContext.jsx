import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AISessionContext = createContext(null);

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Welcome to the SWAVIK Private Reserve Concierge. I am your personal fragrance advisor.'
  }
];

export function AISessionProvider({ children }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [flowStep, setFlowStep] = useState('welcome');
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const addMessage = useCallback((message) => {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...message
      }
    ]);
  }, []);

  const resetSession = useCallback(() => {
    setMessages(initialMessages);
    setIsStreaming(false);
    setUserName('');
    setSelectedMood('');
    setFlowStep('welcome');
    setRecommendedProducts([]);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      isStreaming,
      setIsStreaming,
      addMessage,
      resetSession,
      userName,
      setUserName,
      selectedMood,
      setSelectedMood,
      flowStep,
      setFlowStep,
      recommendedProducts,
      setRecommendedProducts,
    }),
    [addMessage, isStreaming, messages, resetSession, userName, selectedMood, flowStep, recommendedProducts]
  );

  return <AISessionContext.Provider value={value}>{children}</AISessionContext.Provider>;
}

export function useAISession() {
  const context = useContext(AISessionContext);
  if (!context) {
    throw new Error('useAISession must be used inside AISessionProvider');
  }
  return context;
}
