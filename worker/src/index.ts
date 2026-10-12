interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot field. Real visitors never fill this in; bots often do. */
  company?: string;
}

const ALLOWED_ORIGINS = new Set([
  'https://angel-vazquez.com',
  'http://localhost:4321',
]);

const MAX_FIELD_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin =
    origin !== null && ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (typeof body !== 'object' || body === null) return false;
  const record = body as Record<string, unknown>;
  const { name, email, message } = record;
  return (
    typeof name === 'string' &&
    name.trim() !== '' &&
    name.length <= MAX_FIELD_LENGTH &&
    typeof email === 'string' &&
    EMAIL_PATTERN.test(email) &&
    typeof message === 'string' &&
    message.trim() !== '' &&
    message.length <= MAX_FIELD_LENGTH
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400, headers });
    }

    if (!isValidPayload(body)) {
      return new Response('Invalid submission', { status: 422, headers });
    }

    // Honeypot: a real visitor never fills this in. Silently accept
    // without sending, so bots get no signal that they were caught.
    if (typeof body.company === 'string' && body.company !== '') {
      return new Response(null, { status: 204, headers });
    }

    const { email, message } = body;
    // Strip any CR/LF before this reaches the Subject line. Resend's API is
    // a structured JSON call, not raw MIME text we build ourselves, so
    // header injection here is unproven either way, but stripping is free
    // and removes the ambiguity entirely.
    const name = body.name.replace(/[\r\n]+/g, ' ').trim();

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `angel-vazquez.com contact form <${env.CONTACT_FROM_EMAIL}>`,
          to: [env.CONTACT_DESTINATION_EMAIL],
          reply_to: email,
          subject: `New message from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Resend rejected the email', response.status, errorBody);
        return new Response('Failed to send message', {
          status: 502,
          headers,
        });
      }
    } catch (error) {
      console.error('Failed to send contact email', error);
      return new Response('Failed to send message', { status: 502, headers });
    }

    return new Response(null, { status: 204, headers });
  },
} satisfies ExportedHandler<Env>;
