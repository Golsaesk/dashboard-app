# Dashboard App

A personal finance management dashboard built with Next.js, Supabase, and AI.

---

## Features

- **Dashboard** — Financial overview, summary charts, and recent transactions
- **Income** — Track and manage income, category charts, and financial goals
- **Expenses** — Record expenses, manage recurring monthly costs, and view category breakdowns
- **Reports** — Expense trend analysis and monthly summaries
- **AI Financial Health** — AI-powered financial health analysis with scoring
- **Daily Report** — Send daily reports to Telegram with AI-generated insights
- **Demo Mode** — Use the application without registration (Supabase anonymous user)
- **Light/Dark Theme** — Full dark mode support
- **Free/Pro Plans** — Stripe-ready monetization structure

---

## Tech Stack

| Layer            | Tool                                                  |
| ---------------- | ----------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                               |
| Database & Auth  | Supabase                                              |
| State Management | Zustand (auth/settings) + TanStack React Query (data) |
| UI               | Tailwind CSS v4 + shadcn/ui + Radix UI                |
| Animation        | Framer Motion                                         |
| Charts           | Recharts                                              |
| Forms            | React Hook Form + Zod                                 |
| AI               | Groq API (LLaMA 3.3 70B)                              |
| Rate Limiting    | Upstash Redis                                         |
| Unit Testing     | Vitest                                                |
| E2E Testing      | Playwright                                            |
| CI/CD            | GitHub Actions                                        |

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase — get from dashboard.supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Groq — get from console.groq.com
GROQ_API_KEY=gsk_...

# Upstash Redis — get from console.upstash.com (for rate limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Telegram — for daily reports (optional)
TELEGRAM_BOT_TOKEN=123456:ABC...
```

> **Note:** The application works without `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, but rate limiting will not be applied to AI endpoints.
>
> Without `TELEGRAM_BOT_TOKEN`, the Daily Report feature will return an error.

### 3. Set Up Supabase

Create the following tables in the Supabase SQL Editor:

```sql
-- User profiles
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  plan text default 'free',
  telegram_chat_id text,
  created_at timestamptz default now()
);

-- Transactions
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  type text not null check (type in ('income', 'expense', 'cost')),
  category text not null,
  date date,
  note text,
  source text,
  created_at timestamptz default now()
);

-- Recurring costs
create table fixed_costs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  amount numeric not null,
  due_day integer not null check (due_day between 1 and 31),
  created_at timestamptz default now()
);

-- Financial goals
create table goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  target_amount numeric not null,
  saved_amount numeric default 0,
  created_at timestamptz default now()
);
```

Then enable Row Level Security (RLS):

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table fixed_costs enable row level security;
alter table goals enable row level security;

-- Users can only access their own data
create policy "users_own_data" on profiles
for all using (auth.uid() = id);

create policy "users_own_data" on transactions
for all using (auth.uid() = user_id);

create policy "users_own_data" on fixed_costs
for all using (auth.uid() = user_id);

create policy "users_own_data" on goals
for all using (auth.uid() = user_id);
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:3000
```

---

## Useful Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Run production build
npm start

# Lint
npm run lint

# Unit tests
npm test

# Unit tests with UI
npm run test:ui

# Coverage report
npm run test:coverage

# End-to-end tests
npx playwright test

# Check for dead code
npx knip
```

---

## Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages (signin, callback)
│   ├── (main)/             # Main pages (dashboard, income, etc.)
│   └── api/                # API routes (ai-finance-status, daily-report)
├── components/             # Shared components
├── features/               # Feature-based modules
│   ├── auth/               # Sign in, sign up, password recovery
│   ├── finance/            # Transactions
│   ├── fixedCosts/         # Recurring costs
│   └── goals/              # Financial goals
├── store/                  # Zustand stores (auth, settings)
├── lib/                    # Utilities (supabase, auth, rateLimit)
├── helper/                 # Helper functions (finance, chart)
├── type/                   # TypeScript types
└── schema/                 # Zod schemas
```

---

## State Management Architecture

| Data Type                  | Tool        | Reason                                        |
| -------------------------- | ----------- | --------------------------------------------- |
| Auth (user, plan)          | Zustand     | Global UI state, no caching required          |
| Settings (theme, currency) | Zustand     | Local user preferences                        |
| Transactions               | React Query | Server state, caching, and optimistic updates |
| Fixed Costs                | React Query | Same reason                                   |
| Goals                      | React Query | Same reason                                   |

---

## Demo Mode

The application uses Supabase anonymous authentication.

Users can access and use the app without creating an account, with data stored locally in `localStorage`.

AI endpoints are not available in Demo Mode.
