# planovar-admin-console-web — Progress Log

Living log. Newest entries on top. Full plan: repo-root `PLANOVAR_BUILD_PLAN.md`.
This is the **chosen** admin app (the `planovar-admin-web` scaffold is being retired).

## Status snapshot
- **Current phase:** ✅ Phase 6 (data-backed pages wired) — login, dashboard, vendors, users, disputes,
  earnings→subscriptions, audit-trail now run on the live API. Still mock (no backend): content-moderation,
  roles-permissions, platform-settings.
- **Auth:** Better Auth email sign-in via `lib/auth.ts`; bearer token (from `set-auth-token`) in localStorage;
  **ADMIN-role enforced** client-side (`AuthProvider` guard) and server-side (`RolesGuard`). Non-admins bounce to /login.
- **API base:** `.env.local` → `NEXT_PUBLIC_API_URL` (default `http://localhost:3000`). Data layer: `lib/api.ts` + `lib/admin-api.ts`.
- **Build:** `npx tsc --noEmit` clean. Runs via `npm run dev` (Tailwind v4 — see note below).
- **Port:** 3003 (canonical; matches API CORS + Makefile `make admin-dev`). API now also trusts :3004 as a fallback.

## Log

### 2026-06-17 — Categories editor: real image upload + row alignment ✅
- **Image fields are now real uploads** (not URL paste): new `ImageUpload` component (click-to-pick,
  preview thumbnail with Replace/Remove hover overlay, inline error). Card image = full-width 128px
  zone; Icon = 88px square. POSTs to `/upload/category/image` via new `apiUpload()` (FormData + bearer)
  → stores the returned hosted URL. (Live uploads need storage creds configured — see api PROGRESS.)
- **Aligned the Sort order / Popularity boost / Featured row**: all three are now equal-height (44px)
  controls under top labels in a clean 3-col grid (dropped `items-end` + the below-input hint that made
  them ragged). Featured is a full-height toggle box; the wrapper owns the click (toggle is visual-only
  to avoid double-toggling). `npx tsc --noEmit` clean.

### 2026-06-17 — Categories management page (enriched) ✅
- New **`/categories`** page (added to sidebar under OPERATIONS, `tag` icon): full CRUD on the live
  `/admin/categories` API. Table shows thumbnail (image or colour-gradient initial), name/slug, tags,
  keyword count, **listing count** (real metric), featured + active status; Edit / Activate-Deactivate.
- **Editor modal**: name + auto-slug, description, card image URL + icon URL, **accent colour** (presets +
  native picker + hex), **tags** and **search keywords** chip inputs, **Featured** toggle, sort order,
  popularity boost; live preview header. Stat cards: total / active / featured / listings-categorised.
- `lib/admin-api.ts`: `listCategories/createCategory/updateCategory/deleteCategory` + `AdminCategory`/
  `CategoryInput` types + `slugify()`. `npx tsc --noEmit` clean.
- Note: hex/array validation is enforced by the API only in compiled/prod builds (dev runs via tsx which
  skips DTO validation — see api PROGRESS); the editor still constrains input client-side.

### 2026-06-16 — Phase 6: wire admin console to the live API ✅ — verified E2E
- **Foundation:** `lib/api.ts` (fetch wrapper, bearer token, 401→/login, `qs()`), `lib/auth.ts` (sign-in/get-session/
  sign-out + **ADMIN gate**), `lib/auth-context.tsx` (`AuthProvider` guard wrapping the `(admin)` layout;
  spinner while verifying, redirect if not ADMIN). `lib/admin-api.ts` maps API → existing UI shapes.
- **Login** (`app/login`): real `login()` (was a `localStorage` flag); error + loading states, Enter-to-submit,
  fixed "Confirm Password" label → "Password".
- **TopBar:** shows the live user (name/email/initials) + working **Sign out** dropdown.
- **Dashboard:** live stats (pending KYC, open disputes, active subs, active users), recent admin activity from the
  audit log, Action-Required queue derived from real pending vendors + open disputes, and an **MRR-by-tier** bar chart
  (replaced the unbacked weekly line chart).
- **Vendors:** live list; **Approve/Reject KYC** call `PATCH /admin/vendors/:id/kyc` (Re-review = re-approve).
- **Users:** live list + counts; **Suspend/Reactivate** via `PATCH /admin/users/:id/status`; de-mocked transactional
  "Amount/Total Spent" columns (→ Bookings/Joined/Phone) since there's no per-user ledger under subscription-only.
- **Disputes:** live list; **Start Investigation** (`/status`) + **Resolve** (`/resolve`); removed ₦ dispute-amount UI
  (no amount in the model) → shows raiser + booking ref instead.
- **Earnings → Subscription Revenue:** full rewrite on `/admin/subscriptions` + `/admin/revenue` (MRR/ARR, by-tier
  chart, subscriptions table). No transaction/fee/escrow concepts (subscription-only model).
- **Audit Trail:** live `/admin/audit-logs` with search/category filters.
- **Verified E2E** against the dev API: admin sign-in returns a bearer token; all six admin endpoints return 200 with
  real data (18 users, 8 vendors); a non-admin token → **403**; suspending a user wrote a `user.suspended` audit row
  with the admin actor + reason.
- ⏭️ Not wired (no backend yet): content-moderation (no reports/flags model), roles-permissions (no admin-team/RBAC
  CRUD), platform-settings (no settings model). Invite-user + Ban-forever + CSV export remain cosmetic.

### 2026-06-09 — Phase 0 touch-points
- Selected as the single admin app to continue building on. Makefile `admin-dev/build/start` repointed here, port 3003.
- (Earlier) Fixed Tailwind v4 layout bug: the global reset must live inside `@layer base { }` in `app/globals.css`,
  else unlayered rules out-rank utility padding/margins (the "jampacked" bug). Also requires the arm64 `lightningcss`
  native binary — reinstall deps if you see `Cannot find module '../lightningcss.darwin-arm64.node'`.
- No feature work yet — that's Phase 6.

## Next (Phase 6)
- Replace `data/mockData.ts` with real API (TanStack Query) + real auth/RBAC.
- Rework Earnings → subscription-revenue/MRR reporting (no commission/payouts). Reports/flags queue (not refund disputes).
- Platform settings: drop Commission&Fees + Payouts tabs; keep Subscription/Categories/Trust/Notifications (currency USD).
- Wire vendor verification (NIN+CAC), users, content moderation, roles & permissions, audit trail.
