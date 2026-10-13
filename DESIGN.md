---
name: angel-vazquez.com (professional contact card)
colors:
  primary: "#5E82A0 (light) / #89AFC9 (dark): dusty grey-blue, Angel's eye color"
  neutral: 'near-white / near-black, see tokens below'
typography:
  base:
    fontFamily: 'Commit Mono (body, prose, form fields), Geist Variable (name/headings)'
    fontSize: '15px body'
rounded:
  sm: '0'
  md: '0'
---

## Overview

A single-page professional contact card, modeled directly on jamie-wong.com: one continuous flowing document, not a marketing page with boxed sections. No sticky nav, no badges. Identity block (name, social links) at the top, then first-person prose. "Book a call" and "Send a message" are two sleek, low-profile outlined buttons at the bottom of the copy, not inline text links and not filled CTAs. Clicking either pops a centered modal into the viewport (backdrop, smooth scale/fade transition, Escape and click-outside to close), the same interaction pattern as the concierge widget. The only intentional exceptions to "no chrome" are the thin borders on buttons/modals/form fields and the concierge widget (circular avatar + comic speech bubble), which is deliberately the one playful element against an otherwise plain page.

Copy on this site never uses em or en dashes. Use a colon, comma, or period instead.

## Colors

Light (`:root` default):

| Token           | Value     | Use                                                                                                                                                   |
| --------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`          | `#FFFFFF` | Page background (no alternating sections)                                                                                                             |
| `--bg-alt`      | `#F3F4F6` | Concierge widget panel background only, deliberately distinct from `--bg` so the chat reads as a floating panel, not a page section                   |
| `--surface`     | `#FFFFFF` | Modal panel background, and message bubbles/input nested inside the concierge panel (white-on-tinted, the layering that separates it from `--bg-alt`) |
| `--border`      | `#E5E5E5` | Buttons, modal panels, form field underlines. Nowhere else.                                                                                           |
| `--text`        | `#171717` | All prose and headings (one tone, weight does the work)                                                                                               |
| `--text-subtle` | `#8A8A8A` | Meta only: labels, copyright line                                                                                                                     |
| `--accent`      | `#5E82A0` | Links, hover states, concierge avatar/bubble border                                                                                                   |
| `--on-accent`   | `#FFFFFF` | Text on top of an accent-filled surface (concierge send button only)                                                                                  |

Dark (`[data-theme="dark"]` or system dark with no explicit choice):

| Token           | Value     |
| --------------- | --------- |
| `--bg`          | `#141414` |
| `--bg-alt`      | `#1E1E1E` |
| `--surface`     | `#282828` |
| `--border`      | `#3A3A3A` |
| `--text`        | `#F2F2F2` |
| `--text-subtle` | `#8A8A8A` |
| `--accent`      | `#89AFC9` |
| `--on-accent`   | `#141414` |

`--accent` marks links, hover states, and the two outlined buttons' hover/focus color. Never a background fill for page sections.

## Typography

- **Commit Mono** (self-hosted in `public/fonts/`): all prose, buttons, form fields, meta text, the concierge chat.
- **Geist Variable** (`@fontsource-variable/geist`): the name/wordmark only (`<h1>`). Nothing else uses it right now. There are no other headings on the page.

## Do's and Don'ts

- Don't add section backgrounds or card borders to the page body. It's one continuous flow on a single background color.
- "Book a call" and "Send a message" are thin-bordered, low-profile buttons at the bottom of the copy. Not inline links, not filled/boxed CTAs, not embedded mid-sentence.
- Clicking either button opens a centered modal (backdrop + smooth pop-in transition), not an inline-expanding panel. See the `.modal-backdrop` / `.modal-panel` classes and `animate-pop-in` keyframe in `global.css`, shared with the concierge widget's panel.
- Don't add a box-shadow anywhere.
- Don't round corners beyond 0, except the concierge avatar and speech bubble (intentional comic-style exception).
- Don't let the dark palette drift toward purple/indigo.
- Don't add motion that isn't gated behind `prefers-reduced-motion` (see `useReducedMotion.ts` and the reduced-motion block in `global.css`).
- Never use an em dash or en dash in site copy. Restructure the sentence, or use a colon, comma, or period.
