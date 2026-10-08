/**
 * Shared type definitions
 */

export type Theme = 'light' | 'dark';

/**
 * Chat message interface
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * Chat state interface
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
