# Planovar Admin Console

The internal operations dashboard for **Planovar** — used exclusively by the Planovar team to manage users, vendors, bookings, payments, disputes, and platform configuration.

Built with **Next.js 16 · TypeScript · Tailwind CSS · TanStack Query · Recharts**.

> This is an internal tool. It is not accessible to clients or vendors. All actions taken here are logged to the platform audit trail.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in API URL and auth secret (see docs/development.md)

# 4. Start dev server
npm run dev
```

Admin console runs at `http://localhost:3003`.

> The Planovar API (`planovar-api`) must be running for the admin console to work.
> Start it with `make api-dev` from the monorepo root, or `cd ../planovar-api && npm run start:dev`.

---

## Documentation

| Document | Description |
|---|---|
| [Architecture](./docs/architecture.md) | How the admin console fits into the Planovar system |
| [Development](./docs/development.md) | Local setup, environment variables, adding new pages |

---

## Project structure

```
planovar-admin-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/          # Login page (no sidebar)
│   │   └── (dashboard)/        # All authenticated pages (with sidebar)
│   │       ├── overview/       # Platform metrics and charts
│   │       ├── users/          # Client account management
│   │       ├── vendors/        # Vendor management and verification
│   │       ├── bookings/       # Booking oversight
│   │       ├── payments/       # Transaction and payout management
│   │       ├── disputes/       # Dispute resolution queue
│   │       └── subscriptions/  # Subscription plan management
│   ├── components/
│   │   ├── ui/                 # Reusable UI components (buttons, tables, modals)
│   │   └── charts/             # Recharts wrappers (revenue, bookings, growth)
│   ├── lib/                    # API client, utilities, helpers
│   └── types/                  # TypeScript types and interfaces
├── docs/
├── public/
├── .env.example
└── package.json
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | next-auth v5 (beta) — sessions via Planovar API |
| HTTP client | Axios |

---

## Available scripts

```bash
npm run dev      # Start dev server on port 3003
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

Or from the monorepo root:

```bash
make admin-dev      # Dev server on :3003
make admin-build    # Production build
make admin-start    # Production server
```
