// Data layer for the admin console: typed fetchers against the Planovar API,
// mapping responses into the UI shapes the pages already use (types/index.ts).

import { apiFetch, apiUpload, qs } from "./api";
import type {
  AdminVendor,
  AdminUser,
  AdminDispute,
  AuditLog as UiAuditLog,
} from "@/types";

// ── shared helpers ─────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#5B50F0", "#0EA5E9", "#10B981", "#F59E0B",
  "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6",
];

export function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function colorFor(seed?: string | null): string {
  const s = seed ?? "";
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(iso);
}

function locationLabel(loc: unknown): string {
  if (!loc || typeof loc !== "object") return "—";
  const l = loc as Record<string, unknown>;
  const parts = [l.city, l.state, l.country].filter(Boolean).map(String);
  return parts.length ? parts.join(", ") : "—";
}

interface Paginated<T> {
  data: T[];
  meta: { total: number; take: number; skip: number };
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardStats {
  pendingKyc: number;
  openDisputes: number;
  activeUsers: number;
  totalUsers: number;
  totalVendors: number;
  activeSubscriptions: number;
  mrr: number;
  currency: string;
}

interface ApiAuditRow {
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
}

function mapAudit(r: ApiAuditRow): UiAuditLog {
  const actor = r.user?.name ?? "System";
  return {
    id: r.id,
    actor,
    actorInitials: initials(actor),
    action: r.action,
    target: r.resourceId ? `${r.resourceType}:${r.resourceId}` : r.resourceType,
    category: r.resourceType.charAt(0).toUpperCase() + r.resourceType.slice(1),
    ipAddress: r.ipAddress ?? "—",
    timestamp: fmtDate(r.createdAt) + " " + new Date(r.createdAt).toLocaleTimeString(),
  };
}

export async function getDashboard(): Promise<{
  stats: DashboardStats;
  recentActivity: UiAuditLog[];
}> {
  const res = await apiFetch<{ stats: DashboardStats; recentActivity: ApiAuditRow[] }>(
    "/admin/dashboard",
  );
  return {
    stats: res.stats,
    recentActivity: (res.recentActivity ?? []).map(mapAudit),
  };
}

// ── Vendors ────────────────────────────────────────────────────────────────
interface ApiVendor {
  id: string;
  businessName: string;
  slug: string;
  businessType?: string | null;
  vendorType?: string | null;
  location: unknown;
  tags: string[];
  subscriptionTier: string;
  kycStatus: "NOT_SUBMITTED" | "SUBMITTED" | "APPROVED" | "REJECTED";
  isVerified: boolean;
  kycSubmittedAt?: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string; phone?: string | null; isActive: boolean } | null;
}

function kycToStatus(k: ApiVendor["kycStatus"]): AdminVendor["status"] {
  if (k === "APPROVED") return "approved";
  if (k === "REJECTED") return "rejected";
  return "pending"; // SUBMITTED + NOT_SUBMITTED both await action
}

function mapVendor(v: ApiVendor): AdminVendor {
  const name = v.businessName;
  return {
    id: v.id,
    name,
    category: v.businessType ?? v.tags?.[0] ?? v.vendorType ?? "Vendor",
    location: locationLabel(v.location),
    status: kycToStatus(v.kycStatus),
    submittedDate: fmtDate(v.kycSubmittedAt ?? v.createdAt),
    email: v.user?.email ?? "—",
    phone: v.user?.phone ?? "—",
    avatarText: initials(name),
    avatarColor: colorFor(v.id),
  };
}

export async function listVendors(): Promise<AdminVendor[]> {
  const res = await apiFetch<Paginated<ApiVendor>>(`/admin/vendors${qs({ take: 200 })}`);
  return res.data.map(mapVendor);
}

export async function reviewVendorKyc(
  id: string,
  decision: "APPROVE" | "REJECT",
  rejectionReason?: string,
): Promise<void> {
  await apiFetch(`/admin/vendors/${id}/kyc`, {
    method: "PATCH",
    body: { decision, ...(rejectionReason ? { rejectionReason } : {}) },
  });
}

// ── Users ──────────────────────────────────────────────────────────────────
interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "CLIENT" | "VENDOR" | "ADMIN";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  vendorProfile?: { id: string; businessName: string; subscriptionTier: string } | null;
  _count?: { bookingsAsClient: number; events: number };
}

function mapUser(u: ApiUser): AdminUser {
  return {
    id: u.id,
    userId: u.id,
    name: u.name,
    email: u.email,
    role: u.role === "VENDOR" ? "vendor" : "client",
    status: u.isActive ? "active" : "suspended",
    ordersCount: u._count?.bookingsAsClient ?? 0,
    amountSpentOrGain: 0, // no transactional ledger under subscription-only model
    lastActive: "—",
    joinedDate: fmtDate(u.createdAt),
    location: "—",
    avatarText: initials(u.name),
    avatarColor: colorFor(u.id),
    phone: u.phone ?? "—",
    services: [],
    products: [],
  };
}

export async function listUsers(): Promise<AdminUser[]> {
  const res = await apiFetch<Paginated<ApiUser>>(`/admin/users${qs({ take: 200 })}`);
  return res.data.map(mapUser);
}

export async function setUserActive(
  id: string,
  isActive: boolean,
  reason?: string,
): Promise<void> {
  await apiFetch(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { isActive, ...(reason ? { reason } : {}) },
  });
}

// ── Disputes ───────────────────────────────────────────────────────────────
interface ApiDispute {
  id: string;
  reason: string;
  description?: string | null;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
  resolution?: string | null;
  createdAt: string;
  booking?: { id: string; eventDate?: string | null; status: string } | null;
  raiser?: { id: string; name: string; email: string } | null;
}

function disputeStatus(s: ApiDispute["status"]): AdminDispute["status"] {
  if (s === "OPEN") return "open";
  if (s === "UNDER_REVIEW") return "investigating";
  return "resolved";
}

function mapDispute(d: ApiDispute): AdminDispute {
  return {
    id: d.id,
    refNumber: `DSP-${d.id.slice(0, 8).toUpperCase()}`,
    title: d.reason,
    clientName: d.raiser?.name ?? "—",
    vendorName: d.booking?.id ? `Booking ${d.booking.id.slice(0, 8)}` : "—",
    serviceAmount: 0,
    status: disputeStatus(d.status),
    createdAt: fmtDate(d.createdAt),
    messages: d.description
      ? [
          {
            senderName: d.raiser?.name ?? "Client",
            senderRole: "client",
            timestamp: fmtDate(d.createdAt),
            text: d.description,
          },
        ]
      : [],
    evidenceFiles: [],
  };
}

export async function listDisputes(): Promise<AdminDispute[]> {
  const res = await apiFetch<ApiDispute[]>("/disputes");
  return res.map(mapDispute);
}

export async function resolveDispute(id: string, resolution: string): Promise<void> {
  await apiFetch(`/disputes/${id}/resolve`, {
    method: "PATCH",
    body: { resolution },
  });
}

export async function setDisputeStatus(id: string, status: "UNDER_REVIEW"): Promise<void> {
  await apiFetch(`/disputes/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

// ── Subscriptions / revenue (replaces transactional "earnings") ─────────────
export interface SubscriptionRow {
  id: string;
  status: string;
  billingCycle: string;
  currentPeriodEnd?: string | null;
  provider?: string | null;
  createdAt: string;
  tier: string;
  planName: string;
  priceMonthly: number;
  currency: string;
  vendorName: string;
  vendorEmail: string;
}

interface ApiSubscription {
  id: string;
  status: string;
  billingCycle: string;
  currentPeriodEnd?: string | null;
  provider?: string | null;
  createdAt: string;
  plan: { tier: string; name: string; priceMonthly: string; priceYearly: string; currency: string };
  vendor: { id: string; businessName: string; user?: { name: string; email: string } | null };
}

export async function listSubscriptions(): Promise<SubscriptionRow[]> {
  const res = await apiFetch<Paginated<ApiSubscription>>(`/admin/subscriptions${qs({ take: 200 })}`);
  return res.data.map((s) => ({
    id: s.id,
    status: s.status,
    billingCycle: s.billingCycle,
    currentPeriodEnd: s.currentPeriodEnd,
    provider: s.provider,
    createdAt: fmtDate(s.createdAt),
    tier: s.plan.tier,
    planName: s.plan.name,
    priceMonthly: Number(s.plan.priceMonthly),
    currency: s.plan.currency,
    vendorName: s.vendor.businessName,
    vendorEmail: s.vendor.user?.email ?? "—",
  }));
}

// ── Categories ─────────────────────────────────────────────────────────────
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  imageUrl: string | null;
  color: string | null;
  tags: string[];
  keywords: string[];
  featured: boolean;
  popularityScore: number;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  listingCount: number;
  childCount: number;
}

interface ApiCategory extends Omit<AdminCategory, 'listingCount' | 'childCount'> {
  _count?: { listings: number; children: number };
}

function mapCategory(c: ApiCategory): AdminCategory {
  return {
    ...c,
    tags: c.tags ?? [],
    keywords: c.keywords ?? [],
    listingCount: c._count?.listings ?? 0,
    childCount: c._count?.children ?? 0,
  };
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  imageUrl?: string | null;
  color?: string | null;
  tags?: string[];
  keywords?: string[];
  featured?: boolean;
  popularityScore?: number;
  sortOrder?: number;
  isActive?: boolean;
}

/** Strip empty/undefined so the API's whitelist validation stays happy. */
function cleanCategoryPayload(input: CategoryInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return out;
}

export async function listCategories(): Promise<AdminCategory[]> {
  const rows = await apiFetch<ApiCategory[]>('/admin/categories');
  return rows.map(mapCategory);
}

export async function createCategory(input: CategoryInput): Promise<AdminCategory> {
  const c = await apiFetch<ApiCategory>('/admin/categories', {
    method: 'POST',
    body: cleanCategoryPayload(input),
  });
  return mapCategory(c);
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<AdminCategory> {
  // Arrays/booleans must pass through even when "empty" — only drop undefined.
  const body: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) if (v !== undefined) body[k] = v;
  const c = await apiFetch<ApiCategory>(`/admin/categories/${id}`, { method: 'PATCH', body });
  return mapCategory(c);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' });
}

/** Uploads an image to the category folder; returns the hosted URL. */
export async function uploadCategoryImage(file: File): Promise<string> {
  const res = await apiUpload<{ url: string }>('/upload/category/image', file);
  return res.url;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface RevenueSummary {
  currency: string;
  ngnToUsdRate?: number;
  activeSubscriptions: number;
  mrr: number;
  arr: number;
  byTier: Record<string, { count: number; mrr: number }>;
}

export async function getRevenue(): Promise<RevenueSummary> {
  return apiFetch<RevenueSummary>("/admin/revenue");
}

// ── Audit log ──────────────────────────────────────────────────────────────
export async function listAuditLogs(params: {
  search?: string;
  resourceType?: string;
} = {}): Promise<UiAuditLog[]> {
  const res = await apiFetch<Paginated<ApiAuditRow>>(
    `/admin/audit-logs${qs({ take: 200, ...params })}`,
  );
  return res.data.map(mapAudit);
}
