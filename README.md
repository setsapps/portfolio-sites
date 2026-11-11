# Portfolio Sites (WORTH RFP showcase)

One Angular 18 workspace, three apps, one shared library.

| App | What it is | Dev URL | Look |
|---|---|---|---|
| `cl-a` | Premium association site in WORTH's sector (women in recreation, tourism & hospitality), pink/rosé system, original copy | http://localhost:4401 | Bodoni Moda + Manrope + script accents, 5 themes (Rosé default) |
| `cl-b` | Immersive **3D scroll journey** (real-time WebGL valley → lake → lodge → aurora) + tourism booking | http://localhost:4402 | Syne + Instrument Serif, 5 themes (Ember default) |
| `cl-c` | **Ludhiana Hospital**: Apollo-level feature set for a single hospital, original warm design | http://localhost:4403 | Fraunces + Plus Jakarta Sans, 6 themes (Saffron default) |

Brand names CL-A / CL-B are placeholders. Swap them in each app's `data.ts` + `index.html` once the clients are confirmed.

## Run

```bash
npm install
npx ng serve cl-a --port 4401
npx ng serve cl-b --port 4402
npx ng serve cl-c --port 4403
```

Build: `npx ng build cl-a` → `dist/cl-a/browser` (same for cl-b, cl-c).

## "Advanced feature" locks (demo gates, no real backend)

`projects/shared/ui.ts`
- **x-lock**: CL-A and CL-B use email + password (+ Google/LinkedIn buttons), then show "members only / request access". CL-C uses **mobile OTP (6 boxes, resend timer, SMS-autofill aware) → doctor referral number → "referral not linked, callback"**. No step unlocks anything.
- **x-checkout**: payment-gateway sheet (Card with live card preview / UPI with QR / Wallets / Bank). "Pay" opens the sign-in lock, so no charge is ever made.
- **x-cookies**: consent banner + preference centre (necessary/analytics/personalisation/marketing toggles), stored per site.
- **x-theme**: theme picker + text size + reduce-motion switch.
- **x-search**: Ctrl+K instant search with keyboard navigation.
- **x-bot**: scripted assistant (routes to pages, opens locks, emergency triage wording on CL-C).

## CL-B video mode

The homepage renders a real-time 3D scene now. Once the Veo clips exist, put frames in `projects/cl-b/public/frames/` and list them in `frames/manifest.json`. The page switches to **Cinematic** frame-scrub automatically, with a toggle back to 3D. Prompts: `docs/CL-B_3D_SCROLL_VIDEO_PROMPTS.md`.

## Deploy (Vercel, free)

Create 3 Vercel projects from this one folder/repo:
- Build command: `npx ng build cl-a` (cl-b / cl-c)
- Output directory: `dist/cl-a/browser` (cl-b / cl-c)
- `vercel.json` (root) handles SPA rewrites and sends `noindex` (staging links stay out of search).

## Screenshots

`docs/screens/*.jpg` at 1440×900, captured headless.

## Honesty notes for the proposal

- Images are Unsplash (free licence) placeholders. Doctor names, prices, timings, jobs and events are **sample data** (footer says so on CL-C).
- No outcome metrics anywhere. Describe these as **recent / in-progress builds**, not launched client results, until each client approves.
