# OTP system

A self-contained **OTP (one-time password) verification** flow built with **React 19**, **Vite 7**, **TypeScript**, and **Tailwind CSS v4**. It includes an email capture step, six-digit code entry with keyboard and paste support, resend countdown, server-side verification via an API layer, and a success path.

**Repository:** [github.com/g8tsz/OTP-system-](https://github.com/g8tsz/OTP-system-)

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (CI uses 22)

## Quick start

```bash
git clone https://github.com/g8tsz/OTP-system-.git
cd OTP-system-
npm ci
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

In **demo mode** (default in dev), the in-browser mock API accepts **`123456`** as the correct code. Verification happens server-side in the mock layer — the client never compares codes locally.

## Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start dev server with hot reload    |
| `npm run build`     | Production build (single-file HTML) |
| `npm run preview`   | Serve the production build locally  |
| `npm run typecheck` | Run TypeScript without emitting     |
| `npm run lint`      | Run ESLint                          |
| `npm run format`    | Check Prettier formatting           |
| `npm run test`      | Run Vitest unit tests               |

## Configuration

Copy `.env.example` to `.env`:

| Variable                       | Description                                  |
| ------------------------------ | -------------------------------------------- |
| `VITE_API_URL`                 | Backend URL. Empty = in-browser mock service |
| `VITE_DEMO_MODE`               | Show demo hints; use predictable OTP in mock |
| `VITE_OTP_LENGTH`              | Number of OTP digits (default `6`)           |
| `VITE_RESEND_COOLDOWN_SECONDS` | Resend timer (default `30`)                  |
| `VITE_OTP_EXPIRY_MINUTES`      | Code expiry (default `10`)                   |

## Production build

The project uses [`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile) so `npm run build` emits a **single `dist/index.html`** with inlined JS and CSS.

Set `VITE_DEMO_MODE=false` and `VITE_API_URL` to your backend for production.

### Backend API contract

When `VITE_API_URL` is set, the app expects:

- `POST /auth/send-otp` — `{ email }` → `{ sessionId, expiresAt }`
- `POST /auth/resend-otp` — `{ email, sessionId }` → `{ sessionId, expiresAt }`
- `POST /auth/verify-otp` — `{ email, sessionId, code }` → `{ verified: true }`

Errors: `{ code, message, retryAfterSeconds? }` with HTTP 4xx/5xx.

## Project layout

- `src/components/verification/` — UI flow (`VerificationFlow`, steps, OTP input)
- `src/hooks/` — `useVerificationFlow`, `useCountdown`, `useTheme`
- `src/api/` — HTTP client + in-browser mock with rate limits and expiry
- `src/constants/providers.tsx` — Email provider detection
- `src/utils/` — Email helpers, class names

## CI

GitHub Actions runs lint, format check, typecheck, tests, and build on pushes and PRs to `main` / `master`.

## License

MIT — see [LICENSE](LICENSE).
