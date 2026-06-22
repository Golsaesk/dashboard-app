# Finova Dashboard

A personal finance dashboard built with Next.js 16 and Supabase. Tracks income, expenses, and savings goals. Includes an AI-powered financial health score, a daily summary sent to Telegram, and a freemium plan system backed by Stripe.

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| Language        | TypeScript 5                                   |
| Auth & Database | Supabase (PostgreSQL + Row-Level Security)     |
| Server State    | TanStack React Query v5                        |
| Client State    | Zustand                                        |
| Forms           | React Hook Form + Zod                          |
| Styling         | Tailwind CSS v4 + shadcn/ui                    |
| AI              | Groq (llama-3.3-70b) via OpenAI-compatible SDK |
| Rate Limiting   | Upstash Redis                                  |
| Payments        | Stripe                                         |
| Animation       | Framer Motion                                  |
| Unit Tests      | Vitest                                         |
| E2E Tests       | Playwright                                     |

## Architecture

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Sign-in and OAuth callback
│   ├── (main)/             # Protected pages behind auth middleware
│   └── api/
│       ├── ai-finance-status/   # POST — LLM financial health score
│       └── daily-report/        # POST — Telegram daily summary
│
├── features/               # Domain modules (self-contained)
│   ├── auth/               # Sign-in/up flows, auth hooks
│   ├── finance/            # Transactions API + useTransaction hook
│   ├── fixedCosts/         # Recurring cost tracking
│   └── goals/              # Savings goal CRUD
│
├── components/             # Shared UI components
│   ├── auth/               # FeatureGate (plan-gated UI)
│   ├── charts/             # Recharts wrappers
│   ├── dashboard/          # Dashboard composition
│   ├── navbar/             # Top nav, filters, calendar, search
│   └── outcome/            # Fixed-cost management UI
│
├── lib/
│   ├── auth/               # requireAuth (server-side guard)
│   ├── rateLimit.ts        # Upstash sliding-window rate limiter
│   └── supabase/           # Browser, server, and admin clients
│
├── providers/              # React context (auth, filters, theme, query)
├── store/                  # Zustand stores (auth, settings)
├── features/finance/utils/ # Pure finance calculations
└── middleware.ts            # Route protection + Supabase session refresh
```

### Key design decisions

**Feature-based structure** — each domain (`finance`, `goals`, `fixedCosts`) owns its API calls, hooks, and utilities. Components import from features; features never import from components.

**Optimistic updates** — all mutations (add, remove, update) apply changes to the React Query cache immediately and roll back on error. No loading spinners for common operations.

**Demo mode** — anonymous Supabase users get a `localStorage`-backed data store so the app is fully usable without creating an account.

**FeatureGate** — a single component wraps any UI that requires a paid plan. It renders an upgrade prompt for free users and transparently passes through for pro users.

**AI routes are server-only** — Groq calls happen in Route Handlers, never from the browser. Each endpoint validates its request body with Zod, enforces per-user rate limits via Upstash, and includes a deterministic fallback when the LLM response cannot be parsed.

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd dashboard-app
npm install
```

### 2. Environment variables

Copy the example file and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable                             | Where to find it                         |
| ------------------------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase → Project Settings → API        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase → Project Settings → API        |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase → Project Settings → API        |
| `GROQ_API_KEY`                       | console.groq.com                         |
| `UPSTASH_REDIS_REST_URL`             | Upstash Console → Redis → REST API       |
| `UPSTASH_REDIS_REST_TOKEN`           | Upstash Console → Redis → REST API       |
| `STRIPE_SECRET_KEY`                  | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `TELEGRAM_BOT_TOKEN`                 | @BotFather on Telegram                   |

### 3. Supabase schema

Run the SQL migrations in `supabase/migrations/` against your project, or apply them manually via the Supabase SQL editor.

Required tables: `transactions`, `fixed_costs`, `goals`, `profiles`.

### 4. Run

```bash
npm run dev
```

The app starts at `https://dashboard-app-9u85.vercel.app/`. If `NEXT_PUBLIC_SUPABASE_URL` is missing or invalid, the homepage shows a configuration error instead of silently failing.

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Vitest unit tests
npm run test:coverage # Coverage report
npm run test:ui       # Vitest UI
```

Playwright e2e tests require a running dev server and a valid auth session saved at `playwright/.auth/user.json`. See `playwright.config.ts` for setup instructions.

## API Routes

### `POST /api/ai-finance-status`

Accepts a list of transactions and fixed costs, builds a financial context object, and sends it to Groq. Returns a structured JSON object:

```ts
{
  score: number // -100 to 100
  summary: string
  insight: string
  suggestion: string
}
```

Rate limited to 10 requests per user per 60 seconds.

### `POST /api/daily-report`

Generates a plain-text financial summary using Groq and sends it to the user's registered Telegram chat. Requires `telegram_chat_id` to be set in the `profiles` table.

Rate limited to 5 requests per user per 60 seconds.

## Testing

```
tests/
├── api/            # Route handler logic
├── components/     # React component tests (jsdom)
│   ├── Dashboard.test.tsx
│   ├── ErrorBoundary.test.tsx
│   ├── FeatureGate.test.tsx
│   └── Transaction.test.tsx
├── store/          # Auth and settings store
└── utils/          # Finance calculations, chart data, currency, schema
```

Vitest runs two projects in parallel: `unit` (Node environment) and `components` (jsdom). Run all:

```bash
npm run test
```

Component tests mock all external dependencies (Supabase, Next.js router, Zustand stores) so they run without any environment setup.

## Plans and Feature Gating

The `FeatureGate` component reads `plan` from the auth Zustand store. Wrap any pro-only UI:

```tsx
<FeatureGate variant="overlay" title="AI Features">
  <AiFinanceStatusCard />
</FeatureGate>
```

`variant="page"` renders a full-page upgrade prompt. `variant="overlay"` blurs the children and overlays an upgrade card.

## CI

Every push and pull request to `main` runs three jobs via GitHub Actions (`.github/workflows/ci.yml`):

| Job    | What it does                                                    |
| ------ | --------------------------------------------------------------- |
| `lint` | Runs ESLint                                                     |
| `unit` | Runs Vitest (unit + component), uploads coverage artifact       |
| `e2e`  | Builds the app, runs Playwright — only after lint and unit pass |

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to GitHub repository secrets for the e2e job to build successfully.
