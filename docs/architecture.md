# Architecture

## Role in the Planovar system

The admin console is one of four client surfaces that talk to the shared `planovar-api` backend:

```
┌───────────────────────────────────────────────────────┐
│                   Client surfaces                     │
│                                                       │
│  Flutter Client  Flutter Vendor  Next.js Admin  ◄─── you are here
│  (iOS/Android/   (iOS/Android/   (Web only)           │
│   Web)            Web)                                │
└──────────────────────────┬────────────────────────────┘
                           │ HTTPS
                           ▼
                   ┌───────────────┐
                   │ Planovar API  │
                   │ (NestJS :3000)│
                   └───────────────┘
```

The admin console is **web-only** and is never distributed as a mobile app. It talks exclusively to the same REST API that the client and vendor apps use, but with requests authenticated as `ADMIN` role.

---

## What the admin console manages

| Section | Route | Responsibility |
|---|---|---|
| Overview | `/overview` | Platform KPIs, revenue charts, booking volume, user growth |
| Users | `/users` | View and manage CLIENT accounts — suspend, verify, search |
| Vendors | `/vendors` | View and manage VENDOR profiles — verify identity, manage subscription tier |
| Bookings | `/bookings` | View all bookings across the platform, override status if needed |
| Payments | `/payments` | View transactions, manually trigger payouts, review payout history |
| Disputes | `/disputes` | Resolution queue — review evidence, mark resolved, issue refunds |
| Subscriptions | `/subscriptions` | Manage subscription plan config, view active subscriptions |

---

## Authentication flow

The admin console authenticates against the same Better Auth instance running inside `planovar-api`. Admin users have `role = ADMIN` on their `user` record.

```
Admin opens /login
      │
      ▼
next-auth initiates sign-in
      │
      ▼
POST http://localhost:3000/api/auth/sign-in/email
      │
      ▼
Better Auth validates credentials, checks role = ADMIN
      │
      ▼
Session cookie set — all subsequent API calls include it
      │
      ▼
Admin redirected to /overview
```

Non-admin users who authenticate successfully are shown an "Access denied" page — the admin console checks `session.user.role === 'ADMIN'` before rendering any dashboard content.

---

## Data fetching pattern

All data fetching uses **TanStack Query**:

- Queries (`useQuery`) for reading data — with automatic background refetching and cache invalidation
- Mutations (`useMutation`) for writes — with optimistic updates where appropriate
- Axios instance (defined in `src/lib/api.ts`) handles base URL, credentials, and error interceptors

```typescript
// Example: fetching vendor list
const { data, isLoading } = useQuery({
  queryKey: ['vendors', filters],
  queryFn: () => api.get('/vendors', { params: filters }),
})
```

---

## Route groups

The App Router uses two route groups to separate layout concerns:

**`(auth)`** — unauthenticated layout (no sidebar, centered card)
- `/login`

**`(dashboard)`** — authenticated layout (sidebar navigation, header, content area)
- All other routes

Middleware (to be implemented) will redirect unauthenticated requests to `/login` and redirect authenticated non-admin users away from the dashboard.

---

## Form handling

All forms use **React Hook Form** with **Zod** schemas for validation:

```typescript
const schema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
})
```

This gives type-safe form state, validation errors, and submission handling with minimal boilerplate.

---

## Relationship to the API

The admin console does **not** have its own database or business logic. Everything goes through the API:

- Reading data → `GET` requests via TanStack Query
- Writing data → `POST / PATCH / DELETE` via TanStack Query mutations
- Auth → Better Auth session managed by `next-auth` adapter
- File uploads → proxied through the API to Cloudflare R2
- Real-time updates (disputes queue, booking changes) → planned via API polling or WebSocket subscription

The API enforces all business rules. The admin console is purely a presentation and interaction layer.
