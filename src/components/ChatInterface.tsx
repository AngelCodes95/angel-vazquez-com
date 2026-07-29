import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChatMessage } from './ChatMessage';
import type { Message } from '../types';
import type { Theme } from './PortfolioApp';

interface ChatInterfaceProps {
  theme: Theme;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  showTechInfo: boolean;
  onTechInfoToggle: () => void;
}

export function ChatInterface({
  theme,
  messages,
  onSendMessage,
  isLoading,
  isStreaming,
  showTechInfo,
  onTechInfoToggle,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [showDevDetails, setShowDevDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!showTechInfo) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onTechInfoToggle();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showTechInfo, onTechInfoToggle]);

  const isInputDisabled = isLoading || isStreaming;

  const handleSubmit = () => {
    if (inputValue.trim() && !isInputDisabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isInputDisabled && inputValue.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black';
  const borderColor = theme === 'light' ? 'border-black/20' : 'border-white/20';
  const buttonBgColor = theme === 'light' ? 'bg-black' : 'bg-white';
  const buttonTextColor = theme === 'light' ? 'text-white' : 'text-black';
  const placeholderClass =
    theme === 'light' ? 'placeholder-black/40' : 'placeholder-white/40';

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(330px,95vw,770px)] lg:w-[clamp(330px,95vw,963px)] z-base flex flex-col items-center justify-center">
      {/* Messages container - positioned above input with proper spacing */}
      <div className="w-full max-h-[50vh] overflow-y-auto px-4 mb-6">
        {messages.length === 0 ? (
          <div
            className={`text-center mb-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            <p className="text-[clamp(1.4rem,3.5vw,2rem)] lg:text-[clamp(1.75rem,4.375vw,2.5rem)] m-0 font-bold">
              Instead of scrolling through my portfolio, just ask my AI
              Concierge!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} theme={theme} />
          ))
        )}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                theme === 'light'
                  ? 'bg-black/10 text-black'
                  : 'bg-white/10 text-white'
              }`}
              style={{
                fontFamily: "'Syne Mono', monospace",
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              <p className="text-[clamp(0.75rem,2vw,0.875rem)] m-0">...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input field */}
      <div className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={isInputDisabled}
            placeholder="Ask about Angel..."
            className={`flex-1 ${bgColor} ${textColor} ${borderColor} ${placeholderClass} border rounded-lg px-4 py-3 text-[clamp(0.85rem,2.2vw,1rem)] lg:text-[clamp(1.063rem,2.75vw,1.25rem)] focus:outline-none focus:ring-2 ${
              theme === 'light' ? 'focus:ring-black/20' : 'focus:ring-white/20'
            } disabled:opacity-50 shadow-lg backdrop-blur-sm`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isInputDisabled || !inputValue.trim()}
            className={`${buttonBgColor} ${buttonTextColor} px-6 py-3 rounded-lg text-[clamp(0.85rem,2.2vw,1rem)] lg:text-[clamp(1.063rem,2.75vw,1.25rem)] font-medium transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            SEND
          </button>
        </div>
        {messages.length === 0 && (
          <p
            className={`w-full text-center mt-2 text-[clamp(0.65rem,1.3vw,0.75rem)] lg:text-[clamp(0.813rem,1.625vw,0.938rem)] ${
              theme === 'light' ? 'text-black/50' : 'text-white/50'
            }`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            First reply may take a few extra seconds
          </p>
        )}
        <div className="w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTechInfoToggle();
            }}
            className={`mx-auto block mt-2 text-[clamp(0.65rem,1.3vw,0.75rem)] lg:text-[clamp(0.813rem,1.625vw,0.938rem)] ${
              theme === 'light'
                ? 'text-black/50 hover:text-black/80'
                : 'text-white/50 hover:text-white/80'
            } transition-colors underline`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            What is this and how does it work under the hood?
          </button>
        </div>

        {showTechInfo &&
          createPortal(
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal-backdrop"
                onClick={onTechInfoToggle}
                aria-hidden="true"
              />

              {/* Modal */}
              <div
                role="dialog"
                aria-modal="true"
                aria-label="About this AI Concierge"
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-modal w-[clamp(300px,90vw,620px)] max-h-[85vh] overflow-y-auto rounded-xl p-6 pt-12 ${
                  theme === 'light'
                    ? 'bg-white text-black/80 border border-black/10'
                    : 'bg-black text-white/80 border border-white/20'
                } shadow-2xl`}
                style={{
                  fontFamily: "'Syne Mono', monospace",
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                {/* Close button - absolute, top-3 + h-9 = 3rem = pt-12, so text starts exactly below */}
                <button
                  onClick={onTechInfoToggle}
                  aria-label="Close"
                  className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-base font-bold transition-all duration-200 ${
                    theme === 'light'
                      ? 'text-black/70 hover:text-black border border-black/20 hover:border-black/50 shadow-[0_0_8px_rgba(0,0,0,0.2)] hover:shadow-[0_0_14px_rgba(0,0,0,0.4)]'
                      : 'text-white/70 hover:text-white border border-white/20 hover:border-white/50 shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:shadow-[0_0_14px_rgba(255,255,255,0.5)]'
                  }`}
                >
                  ✕
                </button>

                <div
                  className={`text-[clamp(0.75rem,1.8vw,0.875rem)] space-y-3`}
                >
                  <div>
                    <p className="m-0 mb-2">
                      <strong>In plain terms:</strong>
                    </p>
                    <p className="m-0">
                      I built this to answer questions about my background,
                      skills, and projects, so you don't have to scroll a
                      resume. It only knows what I've actually written about
                      myself. If it doesn't know something, it says so instead
                      of making stuff up.
                    </p>
                  </div>
                  <div>
                    <p className="m-0 mb-2">
                      <strong>Under the hood:</strong>
                    </p>
                    <p className="m-0 mb-2">
                      Self-hosted{' '}
                      <strong>
                        RAG (Retrieval-Augmented Generation) pipeline
                      </strong>
                      , running in a Docker container on my Mac Mini at home,
                      exposed through a Cloudflare Tunnel.
                    </p>
                    <button
                      onClick={() => {
                        setShowDevDetails((prev) => !prev);
                      }}
                      className={`text-[clamp(0.7rem,1.5vw,0.8rem)] ${
                        theme === 'light'
                          ? 'text-black/60 hover:text-black/90'
                          : 'text-white/60 hover:text-white/90'
                      } transition-colors underline`}
                    >
                      {showDevDetails
                        ? 'Hide info for other devs'
                        : 'Info for other devs'}
                    </button>
                    {showDevDetails && (
                      <ul className="m-0 ml-4 mt-2 space-y-1">
                        <li>
                          <strong>Hybrid retrieval:</strong> ChromaDB vector
                          search, reranked with Cohere so results are actually
                          relevant, not just similar
                        </li>
                        <li>
                          <strong>Resilient inference:</strong> Mistral runs
                          locally via Ollama. If it's busy, it fails over to
                          Groq's cloud API (Llama 3.3 70B) so you're not stuck
                          waiting
                        </li>
                        <li>
                          <strong>Defense in depth:</strong> input gets checked
                          for PII (personal info) and prompt injection. Output
                          gets scanned too, before anything reaches you
                        </li>
                        <li>
                          <strong>Performance:</strong> common questions get
                          cached, answers stream back over SSE (Server-Sent
                          Events)
                        </li>
                        <li>
                          <strong>Operational hardening:</strong> IPs get hashed
                          before logging, rate limiting runs through Redis,
                          nothing is tied to your identity
                        </li>
                      </ul>
                    )}
                  </div>
                  <p className="m-0">
                    <strong>Tech stack:</strong> TypeScript, Docker, Express.js,
                    ChromaDB, Ollama (Mistral), Groq (Llama 3.3 70B fallback),
                    Cohere Rerank, Redis, Cloudflare Tunnel
                  </p>
                  <p className="m-0 text-[clamp(0.7rem,1.5vw,0.8rem)]">
                    Limited to 21 questions a day per visitor, plus burst
                    protection. Hardened against prompt injection and jailbreak
                    attempts.
                  </p>
                  <p className="m-0 text-[clamp(0.7rem,1.5vw,0.8rem)] italic">
                    <strong>Note:</strong> Small language models can be
                    unpredictable. I'm still improving this, so answer quality
                    may vary. For specific details, you can always check my{' '}
                    <a
                      href="https://portfolio.angel-vazquez.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`underline ${theme === 'light' ? 'text-black/90 hover:text-black' : 'text-white/90 hover:text-white'} transition-colors`}
                    >
                      full portfolio
                    </a>
                    .
                  </p>
                </div>
              </div>
            </>,
            document.body
          )}
      </div>
    </div>
  );
}
