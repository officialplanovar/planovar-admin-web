'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '@/components/ui/StatCard';
import {
  listSubscriptions,
  getRevenue,
  type SubscriptionRow,
  type RevenueSummary,
} from '@/lib/admin-api';
import Button from '@/components/ui/Button';
import FilterTabs from '@/components/ui/FilterTabs';
import SearchInput from '@/components/ui/SearchInput';
import Card, { CardHeader } from '@/components/ui/Card';

/* ─── helpers ─────────────────────────────────────────── */
function money(n: number, currency = 'USD') {
  const prefix = currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : '';
  if (n >= 1_000_000) return prefix + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return prefix + (n / 1_000).toFixed(1) + 'K';
  return prefix + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const TIER_COLORS: Record<string, string> = {
  BASIC: '#9CA3AF',
  PREMIUM: '#5B50F0',
  GOLD: '#D9A441',
};

const STATUS_STYLES: Record<string, { c: string; bg: string }> = {
  ACTIVE: { c: '#10B981', bg: '#ECFDF5' },
  TRIALING: { c: '#5B50F0', bg: '#EEEEFF' },
  PAST_DUE: { c: '#F59E0B', bg: '#FFFBEB' },
  CANCELLED: { c: '#EF4444', bg: '#FEF2F2' },
  EXPIRED: { c: '#6B7280', bg: '#F3F4F6' },
};

function SubStatusChip({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.EXPIRED;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: s.c, backgroundColor: s.bg }}>
      {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
    </span>
  );
}

function TierChip({ tier }: { tier: string }) {
  const c = TIER_COLORS[tier] ?? '#5B50F0';
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: c, backgroundColor: `${c}22` }}>
      {tier}
    </span>
  );
}

/* ─── icons ────────────────────────────────────────────── */
function RevenueIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    </div>
  );
}
function ArrIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EFF6FF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
      </svg>
    </div>
  );
}
function SubsIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F5F3FF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#8B5CF6">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
      </svg>
    </div>
  );
}
function GoldIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFFBEB' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#D9A441">
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21.4 8 14 2 9.4h7.6z" />
      </svg>
    </div>
  );
}
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" />
    </svg>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
type TierTab = 'all' | 'BASIC' | 'PREMIUM' | 'GOLD';

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState<TierTab>('all');
  const [search, setSearch] = useState('');
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [display, setDisplay] = useState<'NGN' | 'USD'>('NGN');

  useEffect(() => {
    let active = true;
    Promise.all([listSubscriptions(), getRevenue()])
      .then(([s, r]) => {
        if (!active) return;
        setSubs(s);
        setRevenue(r);
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load revenue'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  // Stored amounts are NGN; the toggle recalculates to USD at the API's rate.
  const baseCurrency = revenue?.currency ?? 'NGN';
  const rate = revenue?.ngnToUsdRate ?? 1600;
  const currency = display;
  const fmt = (amount: number) => {
    if (display === 'USD' && baseCurrency === 'NGN') return money(amount / rate, 'USD');
    if (display === 'NGN' && baseCurrency === 'USD') return money(amount * rate, 'NGN');
    return money(amount, baseCurrency);
  };

  const filtered = subs.filter((s) => {
    if (activeTab !== 'all' && s.tier !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.vendorName.toLowerCase().includes(q) ||
        s.vendorEmail.toLowerCase().includes(q) ||
        s.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tabs: { key: TierTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: subs.length },
    { key: 'BASIC', label: 'Basic', count: subs.filter((s) => s.tier === 'BASIC').length },
    { key: 'PREMIUM', label: 'Premium', count: subs.filter((s) => s.tier === 'PREMIUM').length },
    { key: 'GOLD', label: 'Gold', count: subs.filter((s) => s.tier === 'GOLD').length },
  ];

  const tierData = revenue
    ? Object.entries(revenue.byTier).map(([tier, v]) => ({ tier, mrr: v.mrr, count: v.count }))
    : [];

  return (
    <div className="min-h-screen p-6 pb-10 flex flex-col gap-8" style={{ backgroundColor: '#F5F4FA' }}>
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Subscription Revenue</h1>
          <p className="text-sm text-text-secondary mt-1">
            Recurring revenue from vendor subscriptions (no per-transaction fees under the subscription model)
          </p>
        </div>
        {/* NGN ⇄ USD toggle */}
        <div className="flex items-center rounded-lg border border-border bg-white p-0.5 text-sm font-semibold">
          {(['NGN', 'USD'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setDisplay(c)}
              className="px-3 py-1.5 rounded-md transition-colors"
              style={display === c
                ? { background: '#5B50F0', color: '#fff' }
                : { color: '#6B7280' }}
            >
              {c === 'NGN' ? '₦ NGN' : '$ USD'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#FEF2F2', color: '#DC2626' }}>{error}</div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<RevenueIcon />} value={loading ? '—' : fmt(revenue?.mrr ?? 0)} label="Monthly Recurring (MRR)" />
        <StatCard icon={<ArrIcon />} value={loading ? '—' : fmt(revenue?.arr ?? 0)} label="Annual Recurring (ARR)" />
        <StatCard icon={<SubsIcon />} value={loading ? '—' : String(revenue?.activeSubscriptions ?? 0)} label="Active Subscriptions" />
        <StatCard icon={<GoldIcon />} value={loading ? '—' : String(revenue?.byTier?.GOLD?.count ?? 0)} label="Gold Vendors" />
      </div>

      {/* bar chart */}
      <Card>
        <CardHeader title="Recurring Revenue by Tier" subtitle="Monthly recurring revenue (MRR), normalised for yearly plans" />
        <div className="mt-5">
          {tierData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-text-secondary text-sm">
              {loading ? 'Loading…' : 'No active subscriptions yet'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={tierData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis
                  tickFormatter={(v: number) => fmt(v)}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 13 }}
                  formatter={(value, _n, item) => {
                    const n = typeof value === 'number' ? value : Number(value);
                    const count = (item as { payload?: { count?: number } })?.payload?.count ?? 0;
                    return [`${fmt(n)} · ${count} subs`, 'MRR'] as [string, string];
                  }}
                />
                <Bar dataKey="mrr" radius={[6, 6, 0, 0]}>
                  {tierData.map((d) => (
                    <Cell key={d.tier} fill={TIER_COLORS[d.tier] ?? '#5B50F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterTabs
          tabs={tabs}
          active={activeTab}
          onChange={(key) => setActiveTab(key as TierTab)}
        />
        <div className="flex items-center gap-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriptions..."
          />
          <Button variant="outline" icon={<DownloadIcon />}>Export CSV</Button>
        </div>
      </div>

      {/* subscriptions table */}
      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Vendor</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Tier</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Billing</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Price / mo</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Renews</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Started</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={7} className="px-5 py-10 text-center text-text-secondary text-sm">Loading subscriptions…</td>
                </tr>
              )}
              {!loading && filtered.map((s) => (
                <tr key={s.id} className="hover:bg-page-bg transition-colors" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td className="px-5 py-5">
                    <p className="font-semibold text-text-primary">{s.vendorName}</p>
                    <p className="text-xs text-text-secondary">{s.vendorEmail}</p>
                  </td>
                  <td className="px-5 py-5"><TierChip tier={s.tier} /></td>
                  <td className="px-4 py-3.5 text-text-secondary capitalize">{s.billingCycle.toLowerCase()}</td>
                  <td className="px-4 py-3.5 text-text-primary font-semibold">{fmt(s.priceMonthly)}</td>
                  <td className="px-5 py-5"><SubStatusChip status={s.status} /></td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">{s.createdAt}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={7} className="px-5 py-10 text-center text-text-secondary text-sm">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
