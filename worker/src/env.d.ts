export {};

// RESEND_API_KEY is a secret (wrangler secret put), so it never appears in
// wrangler.jsonc and `wrangler types` can't see it to generate this for us.
// Declared by hand, merges with the generated Env interface.
declare global {
  interface Env {
    RESEND_API_KEY: string;
  }
}
