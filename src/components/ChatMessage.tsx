import type { Message } from '../types';
import type { Theme } from './PortfolioApp';

interface ChatMessageProps {
  message: Message;
  theme: Theme;
}

export function ChatMessage({ message, theme }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? theme === 'light'
              ? 'bg-black text-white'
              : 'bg-white text-black'
            : theme === 'light'
              ? 'bg-black/10 text-black'
              : 'bg-white/10 text-white'
        }`}
        style={{
          fontFamily: "'Syne Mono', monospace",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <p
          className="text-[clamp(0.85rem,2.2vw,1rem)] lg:text-[clamp(1.063rem,2.75vw,1.25rem)] m-0 whitespace-pre-wrap break-words"
          style={{
            fontFamily: "'Commit Mono', monospace",
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          {message.content}
          {message.isStreaming === true && (
            <span
              className={`inline-block ml-[1px] animate-pulse ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}
            >
              ▌
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
