import { useState, useEffect } from 'react';
import { PyramidCanvas } from './PyramidCanvas';
import { FallingPyramidsBackground } from './FallingPyramidsBackground';
import { PortfolioContent } from './PortfolioContent';
import { ChatInterface } from './ChatInterface';
import { DEFAULT_GAME_CONFIG, type Message } from '../types';
import { streamChatMessage } from '../lib/chatApi';

export type Theme = 'light' | 'dark';

export function PortfolioApp() {
  const [pyramidCount, setPyramidCount] = useState(
    DEFAULT_GAME_CONFIG.initialPyramidCount
  );
  const [speedMultiplier, setSpeedMultiplier] = useState(
    DEFAULT_GAME_CONFIG.defaultSpeed
  );
  const [theme, setTheme] = useState<Theme>('dark');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTechInfo, setShowTechInfo] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update document body and localStorage when theme changes
  useEffect(() => {
    document.body.className =
      theme === 'light'
        ? 'bg-white overflow-hidden'
        : 'bg-black overflow-hidden';
    document.documentElement.style.overflow = 'hidden';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handlePyramidCountChange = (delta: number) => {
    setPyramidCount((prev) => {
      const newCount = prev + delta;
      return Math.max(
        DEFAULT_GAME_CONFIG.minPyramids,
        Math.min(DEFAULT_GAME_CONFIG.maxPyramids, newCount)
      );
    });
  };

  const handleSpeedChange = (delta: number) => {
    setSpeedMultiplier((prev) => {
      const newSpeed = prev + delta;
      return Math.max(
        DEFAULT_GAME_CONFIG.minSpeed,
        Math.min(DEFAULT_GAME_CONFIG.maxSpeed, newSpeed)
      );
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    const assistantId = (Date.now() + 1).toString();

    void streamChatMessage(message, {
      onStart: () => {
        setIsChatLoading(false);
        setChatMessages((prev) => [
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
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      },
      onComplete: () => {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, isStreaming: false } : msg
          )
        );
      },
      onError: (error) => {
        setIsChatLoading(false);
        setChatMessages((prev) => {
          const hasAssistantMessage = prev.some(
            (msg) => msg.id === assistantId
          );
          if (hasAssistantMessage) {
            return prev.map((msg) =>
              msg.id === assistantId
                ? {
                    ...msg,
                    content:
                      error.message ||
                      'Sorry, I encountered an error. Please try again.',
                    isStreaming: false,
                  }
                : msg
            );
          }
          return [
            ...prev,
            {
              id: assistantId,
              role: 'assistant',
              content:
                error.message ||
                'Sorry, I encountered an error. Please try again.',
              timestamp: new Date(),
              isStreaming: false,
            },
          ];
        });
      },
    });
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (!isMobileMenuOpen) {
      // Opening menu, close tech info
      setShowTechInfo(false);
    }
  };

  const handleTechInfoToggle = () => {
    setShowTechInfo((prev) => !prev);
    if (!showTechInfo) {
      // Opening tech info, close mobile menu
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <FallingPyramidsBackground theme={theme} />
      <PyramidCanvas
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
      />
      <PortfolioContent
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
        onPyramidCountChange={handlePyramidCountChange}
        onSpeedChange={handleSpeedChange}
        theme={theme}
        onThemeToggle={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        showTechInfo={showTechInfo}
      />
      <ChatInterface
        theme={theme}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        isStreaming={chatMessages.some((msg) => msg.isStreaming === true)}
        showTechInfo={showTechInfo}
        onTechInfoToggle={handleTechInfoToggle}
      />
    </>
  );
}
