/**
 * Chat API client - connects to Mac Mini API via SSE streaming
 */

export interface StreamCallbacks {
  onStart?: () => void;
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

interface ApiErrorBody {
  error?: string;
}

interface ApiCachedBody {
  response?: string;
  error?: string;
}

interface SseChunk {
  content?: string;
  done?: boolean;
}

export async function streamChatMessage(
  message: string,
  { onStart, onChunk, onComplete, onError }: StreamCallbacks
): Promise<void> {
  const apiUrl = import.meta.env.PUBLIC_CHAT_API_URL;
  const apiKey = import.meta.env.PUBLIC_SHARED_API;

  if (apiUrl === undefined || apiUrl === '') {
    onError(new Error('API URL not configured'));
    return;
  }

  if (apiKey === undefined || apiKey === '') {
    onError(new Error('API key not configured'));
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const body = (await response
        .json()
        .catch((): ApiErrorBody => ({}))) as ApiErrorBody;
      onError(new Error(body.error ?? `HTTP ${response.status.toString()}`));
      return;
    }

    if (response.body === null) {
      onError(new Error('No response body'));
      return;
    }

    // Backend may return plain JSON for cached responses regardless of Accept header
    const contentType = response.headers.get('Content-Type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await response.json()) as ApiCachedBody;
      const text = body.response ?? body.error ?? '';
      onStart?.();
      if (text.length > 0) onChunk(text);
      onComplete();
      return;
    }

    onStart?.();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        let chunk: SseChunk;
        try {
          chunk = JSON.parse(line.slice(6)) as SseChunk;
        } catch {
          continue;
        }

        if (chunk.done === true) {
          onComplete();
          return;
        }

        if (chunk.content !== undefined && chunk.content.length > 0) {
          onChunk(chunk.content);
        }
      }
    }

    // Stream ended without a done event - treat as complete
    onComplete();
  } catch (error) {
    onError(
      error instanceof Error ? error : new Error('Unknown streaming error')
    );
  }
}
