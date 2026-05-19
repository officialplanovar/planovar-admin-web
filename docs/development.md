# Development guide

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| Planovar API | Running on `:3000` |

---

## First-time setup

```bash
cd planovar-admin-web
npm install
cp .env.example .env.local
```

Then fill in `.env.local` — see the [Environment variables](#environment-variables) section below.

---

## Running the dev server

```bash
npm run dev
# or from monorepo root:
make admin-dev
```

Runs at `http://localhost:3003`.

> The API must be running. Start it first:
> ```bash
> make api-dev          # from monorepo root
> # or
> cd ../planovar-api && npm run start:dev
> ```

---

## Environment variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Planovar API. `http://localhost:3000` in dev |
| `NEXTAUTH_SECRET` | Yes | Random string for next-auth session encryption. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Full URL of the admin console. `http://localhost:3003` in dev |

`.env.example`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-in-production
NEXTAUTH_URL=http://localhost:3003
```

---

## Project conventions

### File naming

| Thing | Convention | Example |
|---|---|---|
| Pages | `page.tsx` inside route folder | `app/(dashboard)/users/page.tsx` |
| Layouts | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Components | PascalCase | `UserTable.tsx` |
| Hooks | camelCase, `use` prefix | `useVendors.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types | PascalCase, co-located or in `src/types/` | `Vendor.ts` |

### Component structure

Keep components small and single-purpose. A typical page file should mostly compose smaller components:

```tsx
// app/(dashboard)/vendors/page.tsx
import { VendorFilters } from '@/components/vendors/VendorFilters'
import { VendorTable } from '@/components/vendors/VendorTable'

export default function VendorsPage() {
  return (
    <div>
      <VendorFilters />
      <VendorTable />
    </div>
  )
}
```

### API calls

All API calls go through the Axios instance in `src/lib/api.ts` (to be created). Never use `fetch` directly — the centralised client handles base URL, auth cookies, and error normalisation.

```typescript
// src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,   // sends Better Auth session cookie
})
```

### Data fetching

Use TanStack Query for all server state. Keep query keys consistent — define them as constants:

```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  vendors: {
    all: ['vendors'] as const,
    list: (filters: VendorFilters) => ['vendors', 'list', filters] as const,
    detail: (id: string) => ['vendors', 'detail', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (filters: BookingFilters) => ['bookings', 'list', filters] as const,
  },
}
```

### Forms

Use React Hook Form + Zod for all forms. Define the schema first, derive the type from it, then pass to `useForm`:

```typescript
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const resolveDisputeSchema = z.object({
  resolution: z.string().min(20, 'Resolution must be at least 20 characters'),
  refundAmount: z.number().min(0).optional(),
})

type ResolveDisputeForm = z.infer<typeof resolveDisputeSchema>

const form = useForm<ResolveDisputeForm>({
  resolver: zodResolver(resolveDisputeSchema),
})
```

---

## Adding a new page

1. Create the route folder under `src/app/(dashboard)/`:
   ```
   src/app/(dashboard)/categories/
   └── page.tsx
   ```

2. Write the page component. It will automatically use the dashboard layout (sidebar + header).

3. Add a navigation link to the sidebar component (to be created at `src/components/layout/Sidebar.tsx`).

4. Create any supporting components in `src/components/<section>/`.

5. Create a custom hook in `src/lib/hooks/use-<resource>.ts` for the data fetching logic.

---

## Adding a new chart

Charts use **Recharts**. Wrap them in a component inside `src/components/charts/`:

```tsx
// src/components/charts/RevenueChart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { date: string; revenue: number }[]
}

export function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## Building for production

```bash
npm run build
npm run start
# or with a custom port:
npm run start -- -p 3003
```

Or from the monorepo root:

```bash
make admin-build
make admin-start
```

---

## Troubleshooting

**Admin console loads but API calls fail with CORS errors**
The API's `main.ts` CORS config must include `http://localhost:3003` in the allowed origins list. Verify it does and restart the API.

**Sign-in redirects back to `/login` immediately**
The signed-in user's `role` is not `ADMIN`. Check the `user` table in Prisma Studio — the user must have `role = 'ADMIN'`.

**`NEXTAUTH_SECRET` error on startup**
Generate a proper secret: `openssl rand -base64 32` and add it to `.env.local`.

**TypeScript errors after pulling changes**
Run `npm install` — a dependency may have been added. Then restart the TS server in VS Code (`Cmd+Shift+P → TypeScript: Restart TS Server`).
