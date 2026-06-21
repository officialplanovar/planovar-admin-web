"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  getDashboard,
  getRevenue,
  listVendors,
  listDisputes,
  type DashboardStats,
  type RevenueSummary,
} from "@/lib/admin-api";
import type { AuditLog } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";

// ── Stat card icons ──────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EEEEFF" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#5B50F0">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    </div>
  );
}

function FlagIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEF2F2" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
      </svg>
    </div>
  );
}

function WarningIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFFBEB" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    </div>
  );
}

function UsersIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </div>
  );
}

// ── Action Required data ─────────────────────────────────────────────────────

interface ActionItem {
  id: string;
  type: "Vendor" | "Dispute" | "Content";
  item: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  waiting: string;
}

function TypeChipLocal({ type }: { type: ActionItem["type"] }) {
  const map: Record<ActionItem["type"], { c: string; bg: string }> = {
    Vendor:  { c: "#5B50F0", bg: "#EEEEFF" },
    Dispute: { c: "#EF4444", bg: "#FEF2F2" },
    Content: { c: "#F59E0B", bg: "#FFFBEB" },
  };
  const { c, bg } = map[type];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ color: c, backgroundColor: bg }}>
      {type}
    </span>
  );
}

function PriorityChip({ priority }: { priority: ActionItem["priority"] }) {
  const map: Record<ActionItem["priority"], { c: string; bg: string }> = {
    High:   { c: "#EF4444", bg: "#FEF2F2" },
    Medium: { c: "#F59E0B", bg: "#FFFBEB" },
    Low:    { c: "#10B981", bg: "#ECFDF5" },
  };
  const { c, bg } = map[priority];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ color: c, backgroundColor: bg }}>
      {priority}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#5B50F0", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

const TIER_COLORS: Record<string, string> = {
  BASIC: "#9CA3AF",
  PREMIUM: "#5B50F0",
  GOLD: "#D9A441",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getDashboard(), getRevenue(), listVendors(), listDisputes()])
      .then(([dash, rev, vendors, disputes]) => {
        if (!active) return;
        setStats(dash.stats);
        setRevenue(rev);
        setRecentLogs(dash.recentActivity.slice(0, 5));
        const pendingVendors: ActionItem[] = vendors
          .filter((v) => v.status === "pending")
          .slice(0, 4)
          .map((v) => ({
            id: `v-${v.id}`,
            type: "Vendor",
            item: v.name,
            detail: "Pending verification",
            priority: "High",
            waiting: v.submittedDate,
          }));
        const openDisputes: ActionItem[] = disputes
          .filter((d) => d.status !== "resolved")
          .slice(0, 4)
          .map((d) => ({
            id: `d-${d.id}`,
            type: "Dispute",
            item: d.refNumber,
            detail: d.title,
            priority: d.status === "open" ? "High" : "Medium",
            waiting: d.createdAt,
          }));
        setActionItems([...pendingVendors, ...openDisputes].slice(0, 6));
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed to load dashboard"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const fmtMoney = (n: number) =>
    `${revenue?.currency === "USD" ? "$" : ""}${n.toLocaleString()}`;

  const tierData = revenue
    ? Object.entries(revenue.byTier).map(([tier, v]) => ({ tier, mrr: v.mrr, count: v.count }))
    : [];

  return (
    <div className="min-h-screen bg-page-bg p-6 space-y-8">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Here's what's happening on the platform today"
      />

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<ShieldIcon />}
          value={loading ? "—" : String(stats?.pendingKyc ?? 0)}
          label="Pending Verifications"
        />
        <StatCard
          icon={<FlagIcon />}
          value={loading ? "—" : String(stats?.openDisputes ?? 0)}
          label="Open Disputes"
        />
        <StatCard
          icon={<WarningIcon />}
          value={loading ? "—" : String(stats?.activeSubscriptions ?? 0)}
          label="Active Subscriptions"
        />
        <StatCard
          icon={<UsersIcon />}
          value={loading ? "—" : (stats?.activeUsers ?? 0).toLocaleString()}
          label="Active Users"
        />
      </div>

      {/* Revenue by tier (MRR) */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-base font-bold text-text-primary">Recurring Revenue by Tier (MRR)</h2>
          {revenue && (
            <span className="text-sm font-semibold" style={{ color: "#5B50F0" }}>
              {fmtMoney(revenue.mrr)} MRR · {fmtMoney(revenue.arr)} ARR
            </span>
          )}
        </div>
        {tierData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">
            {loading ? "Loading…" : "No active subscriptions yet"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={tierData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="tier" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 13 }}
                formatter={(value, _name, item) => {
                  const n = typeof value === "number" ? value : Number(value);
                  const count = (item as { payload?: { count?: number } })?.payload?.count ?? 0;
                  return [`${fmtMoney(n)} · ${count} subs`, "MRR"] as [string, string];
                }}
              />
              <Bar dataKey="mrr" radius={[8, 8, 0, 0]}>
                {tierData.map((d) => (
                  <Cell key={d.tier} fill={TIER_COLORS[d.tier] ?? "#5B50F0"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Admin Activity */}
        <Card>
          <CardHeader title="Recent Admin Activity" />
          {recentLogs.length === 0 ? (
            <p className="text-sm text-text-secondary mt-4">
              {loading ? "Loading…" : "No admin activity recorded yet."}
            </p>
          ) : (
            <ul className="space-y-0 mt-4 flex flex-col gap-4">
              {recentLogs.map((log, idx) => (
                <li key={log.id} className="flex items-start gap-4 py-3.5 border-b border-[#F3F4F6] last:border-0">
                  <UserAvatar
                    text={log.actorInitials}
                    color={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
                    size={36}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary leading-snug">
                      <span className="font-semibold">{log.actor}</span>{" "}
                      {log.action.toLowerCase()}{" "}
                      <span className="font-medium">{log.target}</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#5B50F0" }}>
                      {log.timestamp}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Action Required */}
        <Card>
          <CardHeader title="Action Required" />
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-secondary text-xs border-b border-border">
                  <th className="px-4 py-4 font-semibold">Type</th>
                  <th className="px-4 py-4 font-semibold">Item</th>
                  <th className="px-4 py-4 font-semibold hidden xl:table-cell">Detail</th>
                  <th className="px-4 py-4 font-semibold">Priority</th>
                  <th className="px-4 py-4 font-semibold hidden md:table-cell">Since</th>
                </tr>
              </thead>
              <tbody>
                {actionItems.length === 0 ? (
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-secondary text-sm">
                      {loading ? "Loading…" : "Nothing needs attention 🎉"}
                    </td>
                  </tr>
                ) : (
                  actionItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td className="px-4 py-4">
                        <TypeChipLocal type={item.type} />
                      </td>
                      <td className="px-4 py-4 font-medium text-text-primary whitespace-nowrap max-w-[140px] truncate">
                        {item.item}
                      </td>
                      <td className="px-4 py-4 text-text-secondary hidden xl:table-cell whitespace-nowrap max-w-[160px] truncate">
                        {item.detail}
                      </td>
                      <td className="px-4 py-4">
                        <PriorityChip priority={item.priority} />
                      </td>
                      <td className="px-4 py-4 text-text-secondary hidden md:table-cell whitespace-nowrap">
                        {item.waiting}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
