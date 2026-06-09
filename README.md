# Dashboard — AI-Powered Personal Finance Tracker

> Stop guessing. Understand your money with AI.

A full-stack personal finance dashboard that tracks income and expenses, analyzes spending patterns using AI, and sends daily financial reports directly to Telegram. Built with Next.js 16, Supabase, and Groq's LLaMA 3.3 70B.

---

## Screenshots

> _Add your screenshots here after deployment_

---

## Features

### Core

| Feature             | Description                                                                         |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Dashboard**       | Financial overview with summary cards, AI health score, and recent transactions     |
| **Income**          | Log income entries with category tracking, charts, and goal progress                |
| **Expenses**        | Record expenses, manage recurring monthly fixed costs, and view category breakdowns |
| **Reports**         | Monthly spending trend charts and financial summaries                               |
| **Financial Goals** | Set savings targets and track progress with visual progress bars                    |
| **Settings**        | Profile management, currency preference, theme toggle, and account deletion         |

### AI & Automation

| Feature                   | Description                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Financial Health**   | Real-time analysis of your finances with a score from −100 to 100, insights, and actionable suggestions powered by Groq LLaMA 3.3 70B |
| **Daily Telegram Report** | On-demand AI-generated financial report sent directly to your Telegram chat                                                           |
| **Smart Notifications**   | In-app toast notifications for upcoming fixed costs and important events                                                              |

### Platform

| Feature                | Description                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **Demo Mode**          | Try the full app instantly — no account required (Supabase anonymous auth + localStorage)            |
| **Light / Dark Theme** | Full dark mode support across all pages                                                              |
| **Free / Pro Plans**   | Stripe-ready monetization with plan-gated features via `FeatureGate` component                       |
| **Optimistic UI**      | All mutations update the UI instantly before the server responds, with automatic rollback on failure |

---

## Tech Stack

| Layer               | Tool                                   | Version   |
| ------------------- | -------------------------------------- | --------- |
| Framework           | Next.js (App Router)                   | 16.x      |
| Language            | TypeScript                             | 5.x       |
| Database & Auth     | Supabase                               | 2.x       |
| Server State        | TanStack React Query                   | 5.x       |
| Client State        | Zustand                                | 5.x       |
| Styling             | Tailwind CSS v4 + shadcn/ui + Radix UI | 4.x       |
| Animation           | Framer Motion                          | 12.x      |
| Charts              | Recharts                               | 3.x       |
| Forms               | React Hook Form + Zod                  | 7.x / 3.x |
| AI Provider         | Groq API (LLaMA 3.3 70B)               | —         |
| Rate Limiting       | Upstash Redis (sliding window)         | 2.x       |
| Payments            | Stripe (checkout sessions)             | —         |
| Unit Tests          | Vitest                                 | 4.x       |
| E2E Tests           | Playwright                             | 1.x       |
| CI/CD               | GitHub Actions                         | —         |
| Dead Code Detection | Knip                                   | 6.x       |

---

## Architecture

### State Management

Two tools, one clear rule — **React Query owns server data, Zustand owns UI state**:

| Data                       | Tool        | Reason                                         |
| -------------------------- | ----------- | ---------------------------------------------- |
| Auth (user, plan)          | Zustand     | Global UI state — no caching needed            |
| Settings (theme, currency) | Zustand     | Local user preference                          |
| Transactions               | React Query | Server state with caching + optimistic updates |
| Fixed Costs                | React Query | Same                                           |
| Goals                      | React Query | Same                                           |

### Security

Every API route is protected by two independent layers:

1. **Middleware** — rejects unauthenticated requests before they reach route handlers
2. **`requireAuth()`** — server-side `getUser()` call (verifies JWT with Supabase, not just from cookie) inside every API route

All AI endpoints additionally enforce **rate limiting via Upstash Redis** (sliding window) and **Zod input validation**.

### Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Sign-in, OAuth callback
│   ├── (main)/                 # Protected pages
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── outcome/
│   │   ├── reports/
│   │   ├── profile/
│   │   ├── setting/
│   │   └── pricing/
│   └── api/
│       ├── ai-finance-status/  # POST — AI analysis
│       └── daily-report/       # POST — Telegram report
├── components/                 # Shared UI components
├── features/                   # Feature modules (co-located API + hooks + components)
│   ├── auth/
│   ├── finance/
│   ├── fixedCosts/
│   └── goals/
├── store/                      # Zustand stores
├── lib/                        # Infrastructure (supabase, auth, rateLimit)
├── helper/                     # Pure utility functions (finance, chart)
├── hooks/                      # Shared React hooks
├── providers/                  # React context providers
├── schema/                     # Zod validation schemas
└── type/                       # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key
- (Optional) [Upstash Redis](https://console.upstash.com) database
- (Optional) A Telegram bot token

### 1. Clone and Install

```bash
git clone https://github.com/your-username/dashboard-app.git
cd dashboard-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Supabase ──────────────────────────────────────────────────────────────
# Get these from: https://supabase.com/dashboard → your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ─── Groq AI ───────────────────────────────────────────────────────────────
# Get from: https://console.groq.com → API Keys
GROQ_API_KEY=gsk_...

# ─── Upstash Redis (rate limiting) ─────────────────────────────────────────
# Get from: https://console.upstash.com → Create Database → REST API
# App works without these, but AI endpoints won't be rate-limited
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# ─── Telegram (daily reports) ──────────────────────────────────────────────
# Create a bot via @BotFather on Telegram, then get the token
# Users set their own Chat ID in Settings → Profile
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

> **Tip:** `SUPABASE_SERVICE_ROLE_KEY` is only used server-side and never exposed to the browser. Never commit `.env.local` to version control.

### 3. Set Up the Database

Run the following SQL in your **Supabase SQL Editor** (`https://supabase.com/dashboard → your project → SQL Editor`):

#### Create Tables

```sql
create table profiles (
  id              uuid references auth.users on delete cascade primary key,
  full_name       text,
  avatar_url      text,
  plan            text not null default 'free' check (plan in ('free', 'pro')),
  telegram_chat_id text,
  created_at      timestamptz not null default now()
);
create table transactions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  amount      numeric not null check (amount >= 0),
  type        text not null check (type in ('income', 'expense', 'cost')),
  category    text not null,
  date        date,
  note        text,
  source      text,
  created_at  timestamptz not null default now()
);

create table fixed_costs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  title       text not null,
  amount      numeric not null check (amount >= 0),
  due_day     integer not null check (due_day between 1 and 31),
  created_at  timestamptz not null default now()
);
create table goals (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users on delete cascade not null,
  title          text not null,
  target_amount  numeric not null check (target_amount > 0),
  saved_amount   numeric not null default 0 check (saved_amount >= 0),
  created_at     timestamptz not null default now()
);
```

#### Enable Row Level Security

```sql
alter table profiles    enable row level security;
alter table transactions enable row level security;
alter table fixed_costs  enable row level security;
alter table goals        enable row level security;


create policy "users_own_profile"      on profiles     for all using (auth.uid() = id);
create policy "users_own_transactions" on transactions  for all using (auth.uid() = user_id);
create policy "users_own_fixed_costs"  on fixed_costs   for all using (auth.uid() = user_id);
create policy "users_own_goals"        on goals         for all using (auth.uid() = user_id);
```

#### Auto-Create Profile on Sign-Up (optional but recommended)

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4. Enable Anonymous Sign-In

In your Supabase dashboard: **Authentication → Providers → Anonymous** → Enable.

This powers the **Demo Mode** — users can try the full app without creating an account.

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Steps

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local` under **Settings → Environment Variables**
4. Deploy

> **Important:** Without the environment variables set in Vercel, the build will succeed but the app will fail at runtime. Make sure all variables — especially `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — are added before the first deployment.

### Supabase Auth Callback URL

After deploying, add your production URL to Supabase:

**Authentication → URL Configuration → Redirect URLs**

```
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/**
```

---

## Setting Up the Telegram Daily Report

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the prompts to create a bot
3. Copy the bot token and add it as `TELEGRAM_BOT_TOKEN` in your environment variables
4. Start a chat with your new bot (send `/start`)
5. Get your Chat ID by visiting: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
6. In the app, go to **Settings → Profile** and enter your Chat ID
7. Click **Send Daily Report** from the Dashboard

---

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Run unit tests (watch mode)
npm test

# Run unit tests with interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests (requires running dev server)
npx playwright test

# Run E2E tests with UI
npx playwright test --ui

# Detect unused exports and dead code
npx knip
```

---

## Demo Mode

Demo Mode uses Supabase's **anonymous authentication**. When a visitor clicks "Try Demo", they are silently signed in as an anonymous user — no email, no password, no friction.

- All transaction, fixed cost, and goal data is stored in **localStorage** under scoped keys
- Data is isolated per browser session
- **AI features are disabled** in Demo Mode (anonymous users are blocked at the API level)
- Upgrading from demo to a real account is handled by Supabase's `linkIdentity` flow

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Make sure all tests pass before submitting:

```bash
npm test && npx playwright test
```

---

## License

[MIT](LICENSE)
