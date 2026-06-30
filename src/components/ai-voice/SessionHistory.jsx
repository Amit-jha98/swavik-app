import { useAISession } from '@/context/AISessionContext.jsx';
import { AIMessageStream } from './AIMessageStream';

export function SessionHistory() {
  const { messages } = useAISession();
  return <AIMessageStream messages={messages} />;
}
