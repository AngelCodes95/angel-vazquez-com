import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] border px-3 py-2 font-mono text-[0.8125rem] leading-relaxed ${
          isUser
            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
        }`}
      >
        <p className="m-0 whitespace-pre-wrap break-words">
          {message.content}
          {message.isStreaming === true && (
            <span className="ml-[1px] inline-block animate-pulse">▌</span>
          )}
        </p>
      </div>
    </div>
  );
}
