import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { streamChatMessage } from '../lib/chatApi';
import type { Message } from '../types';

const SUGGESTED_PROMPTS = [
  'What are you looking for in your next role?',
  "How do you evaluate a RAG system's answers?",
  'Why are you leaving freelance work?',
];

export function ConciergeButler() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  // 'hidden' unmounts the bubble entirely (so it doesn't reserve layout
  // space above the avatar between pulses). 'hiding' is a brief transition
  // state: still mounted, faded to opacity 0, so it disappears smoothly
  // instead of vanishing instantly, then it unmounts once the fade
  // finishes. Starts hidden so there's no flash before the effect below
  // can tell desktop (always show) from mobile (pulse) apart.
  const [bubblePhase, setBubblePhase] = useState<
    'hidden' | 'visible' | 'hiding'
  >('hidden');
  const FADE_OUT_MS = 200;

  const isStreaming = messages.some((msg) => msg.isStreaming === true);
  const isBusy = isLoading || isStreaming;

  // On mobile, the speech bubble only pulses into view briefly every 10s
  // instead of staying permanently on screen, it was eating too much of a
  // small viewport. Desktop keeps it always on. Respects reduced-motion by
  // just leaving it visible rather than cycling.
  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let pulseInterval: ReturnType<typeof setInterval> | undefined;
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;
    let unmountTimeout: ReturnType<typeof setTimeout> | undefined;

    const clearTimers = () => {
      if (pulseInterval !== undefined) clearInterval(pulseInterval);
      if (hideTimeout !== undefined) clearTimeout(hideTimeout);
      if (unmountTimeout !== undefined) clearTimeout(unmountTimeout);
    };

    const sync = () => {
      clearTimers();
      const shouldPulse = mobileQuery.matches && !reducedMotionQuery.matches;
      if (!shouldPulse) {
        setBubblePhase('visible');
        return;
      }
      setBubblePhase('hidden');
      pulseInterval = setInterval(() => {
        setBubblePhase('visible');
        hideTimeout = setTimeout(() => {
          setBubblePhase('hiding');
          unmountTimeout = setTimeout(() => {
            setBubblePhase('hidden');
          }, FADE_OUT_MS);
        }, 4000);
      }, 10000);
    };

    sync();
    mobileQuery.addEventListener('change', sync);
    reducedMotionQuery.addEventListener('change', sync);

    return () => {
      clearTimers();
      mobileQuery.removeEventListener('change', sync);
      reducedMotionQuery.removeEventListener('change', sync);
    };
  }, []);

  // Publish the widget's real rendered size as CSS vars, so the page can
  // reserve exactly enough room around it with no hardcoded guesses.
  // Height covers the full footprint (bubble, avatar, or open chat panel).
  // Avatar width is tracked separately: it's what the footer, which sits at
  // the same height as the avatar rather than the bubble above it, needs to
  // dodge horizontally.
  useEffect(() => {
    const el = widgetRef.current;
    if (el === null) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        '--concierge-height',
        `${el.offsetHeight.toString()}px`
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    const el = avatarRef.current;
    if (el === null) return;

    const updateWidth = () => {
      document.documentElement.style.setProperty(
        '--concierge-avatar-width',
        `${el.offsetWidth.toString()}px`
      );
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const sendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();

    void streamChatMessage(message, {
      onStart: () => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
          },
        ]);
      },
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      },
      onComplete: () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, isStreaming: false } : msg
          )
        );
      },
      onError: (error) => {
        setIsLoading(false);
        setMessages((prev) => {
          const hasAssistantMessage = prev.some(
            (msg) => msg.id === assistantId
          );
          const content =
            error.message !== ''
              ? error.message
              : 'Sorry, I hit an error. Try again in a moment.';
          if (hasAssistantMessage) {
            return prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content, isStreaming: false }
                : msg
            );
          }
          return [
            ...prev,
            {
              id: assistantId,
              role: 'assistant',
              content,
              timestamp: new Date(),
              isStreaming: false,
            },
          ];
        });
      },
    });
  };

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '' || isBusy) return;
    sendMessage(trimmed);
    setInputValue('');
  };

  return (
    <div
      ref={widgetRef}
      className="fixed right-4 bottom-4 z-widget flex flex-col items-end gap-3 md:right-6 md:bottom-6"
    >
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Angel's AI concierge"
          className="animate-pop-in z-widget-panel flex h-[min(28rem,70dvh)] w-[min(22rem,90vw)] flex-col border border-[var(--border)] bg-[var(--bg-alt)]"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2.5">
            <p className="m-0 font-mono text-[0.8125rem] font-semibold tracking-wide text-[var(--accent)] uppercase">
              AI Concierge
            </p>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              aria-label="Close chat"
              className="text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center gap-3">
                <p className="m-0 font-mono text-[0.8125rem] text-[var(--text-muted)]">
                  Ask me anything about Angel&apos;s background, skills, or what
                  he&apos;s looking for.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        sendMessage(prompt);
                      }}
                      disabled={isBusy}
                      className="rounded-full border border-[var(--accent)]/40 bg-[var(--surface)] px-3 py-1.5 text-left font-mono text-[0.75rem] font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-40"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-[0.8125rem] text-[var(--text-muted)]">
                  ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-[var(--border)] p-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isBusy}
              placeholder="Ask about Angel..."
              className="flex-1 border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 font-mono text-base text-[var(--text)] placeholder-[var(--text-subtle)] disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={isBusy || inputValue.trim() === ''}
              className="border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 font-mono text-[0.8125rem] font-medium text-[var(--on-accent)] transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {!isOpen && bubblePhase !== 'hidden' && (
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          inert={bubblePhase === 'hiding'}
          className={`relative max-w-[15rem] rounded-2xl border-2 border-[var(--accent)] bg-[var(--surface)] px-4 py-2.5 text-left font-mono text-[0.8125rem] text-[var(--text)] transition-opacity duration-200 ${
            bubblePhase === 'hiding' ? 'opacity-0' : 'animate-pop-in'
          }`}
        >
          Talk with me about my human, he can make RAG chatbots too!
          <span
            aria-hidden="true"
            className="absolute right-10 -bottom-[7px] h-3.5 w-3.5 rotate-45 border-r-2 border-b-2 border-[var(--accent)] bg-[var(--surface)]"
          />
        </button>
      )}

      <button
        ref={avatarRef}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close AI concierge' : 'Open AI concierge'}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--accent)] bg-[var(--surface)] transition-opacity hover:opacity-90"
      >
        <img src="/favicon.png" alt="" className="h-full w-full object-cover" />
      </button>
    </div>
  );
}
