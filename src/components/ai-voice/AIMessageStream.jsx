export function AIMessageStream({ messages = [] }) {
  return (
    <div className="grid gap-3">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`rounded-md border p-4 ${
            message.role === 'assistant' ? 'border-gold-500/20 bg-gold-500/5' : 'border-white/10 bg-white/5'
          }`}
        >
          <p className="text-sm leading-7 text-cream-100/80">{message.content}</p>
        </article>
      ))}
    </div>
  );
}
