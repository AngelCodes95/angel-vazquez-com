# Contact form worker

Receives the POST from the contact form on angel-vazquez.com and sends it to your inbox via Resend. Deployed separately from the main site (which stays on GitHub Pages) since GitHub Pages can't run server code.

Cloudflare's own native Email Sending was the original plan here, but it turned out to require the Workers Paid plan ($5/mo minimum) just to enable at all, regardless of destination. Resend's free tier (3,000 emails/month, 100/day) covers this easily with no recurring cost, so the Worker calls Resend's API instead. Everything else (validation, honeypot, CORS) is unchanged, only the actual send call is different.

## One-time setup

1. `npm install` in this directory.
2. Sign up for a free Resend account at resend.com, then verify a sending domain under resend.com/domains (you need to own `CONTACT_FROM_EMAIL`'s domain, e.g. `angel-vazquez.com`, and add the DNS records Resend gives you). The visitor's address goes in reply-to, so `CONTACT_FROM_EMAIL` itself is never shown to them, it just needs to exist on a verified domain.
3. Grab an API key from the Resend dashboard (API Keys section).
4. Set it as a Worker secret, never in `wrangler.jsonc`:
   ```
   npx wrangler secret put RESEND_API_KEY
   ```
5. Edit `wrangler.jsonc`'s `vars` if you want different addresses:
   - `CONTACT_FROM_EMAIL`: an address on the domain you verified with Resend.
   - `CONTACT_DESTINATION_EMAIL`: where messages actually land.
   - Re-run `npx wrangler types` after editing so the generated types match.
6. Deploy: `npm run deploy`. Wrangler will print the deployed Worker URL (something like `https://angel-vazquez-contact-form.<your-subdomain>.workers.dev`).
7. Set that URL as `PUBLIC_CONTACT_API_URL` in the main site's `.env` (see repo root `.env`), and as a `PUBLIC_CONTACT_API_URL` GitHub repo secret so the production build picks it up too.

## Local development

`npm run dev` runs the worker locally. `RESEND_API_KEY` needs to be available locally too, run `npx wrangler secret put RESEND_API_KEY` once (it's stored by Wrangler, not in any file here) or add it to a local `.dev.vars` file (gitignored) as `RESEND_API_KEY=re_...` for `wrangler dev`.

## Spam protection

The form has a honeypot field (`company`) — real visitors never fill it in, and submissions that do are silently dropped without sending. That's enough to stop unsophisticated bots. If spam becomes a real problem, add Cloudflare Turnstile to the form and verify the token here before sending — not included now to keep the initial build shippable.

## CORS

Allowed origins are hardcoded in `src/index.ts` (`ALLOWED_ORIGINS`) to `https://angel-vazquez.com` and `http://localhost:4321`. Update that list if you add a staging domain.
