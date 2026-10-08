# Contact form worker

Receives the POST from the contact form on angel-vazquez.com and sends it to your inbox via Cloudflare Email Service. Deployed separately from the main site (which stays on GitHub Pages) since GitHub Pages can't run server code.

## One-time setup

1. `npm install` in this directory.
2. Onboard a domain for sending (you need to own `CONTACT_FROM_EMAIL`'s domain in Cloudflare):
   ```
   npx wrangler email sending enable angel-vazquez.com
   ```
3. Edit `wrangler.jsonc`:
   - `CONTACT_FROM_EMAIL`: an address on the domain you just onboarded (e.g. `contact@angel-vazquez.com`). Doesn't need to be a real inbox.
   - `CONTACT_DESTINATION_EMAIL`: where you actually want messages delivered (your secondary email works fine here).
   - Re-run `npx wrangler types` after editing so the generated types match.
4. If you want the destination email out of source control instead of in `wrangler.jsonc`, use a secret instead: remove it from `vars`, add `"CONTACT_DESTINATION_EMAIL"` handling via `env`, and run `npx wrangler secret put CONTACT_DESTINATION_EMAIL`.
5. Deploy: `npm run deploy`. Wrangler will print the deployed Worker URL (something like `https://angel-vazquez-contact-form.<your-subdomain>.workers.dev`).
6. Set that URL as `PUBLIC_CONTACT_API_URL` in the main site's `.env` (see repo root `.env`).

## Local development

`npm run dev` runs the worker locally. The `send_email` binding has `"remote": true`, so local dev sends real email through the live service — there's no sandbox mode for this binding.

## Spam protection

The form has a honeypot field (`company`) — real visitors never fill it in, and submissions that do are silently dropped without sending. That's enough to stop unsophisticated bots. If spam becomes a real problem, add Cloudflare Turnstile to the form and verify the token here before sending — not included now to keep the initial build shippable.

## CORS

Allowed origins are hardcoded in `src/index.ts` (`ALLOWED_ORIGINS`) to `https://angel-vazquez.com` and `http://localhost:4321`. Update that list if you add a staging domain.
