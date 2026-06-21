'use client';

import { useState, useMemo, useEffect } from 'react';
import { listAuditLogs } from '@/lib/admin-api';
import type { AuditLog } from '@/types';
import UserAvatar from '@/components/ui/UserAvatar';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import Card from '@/components/ui/Card';

// ── Category chip ─────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  Vendor:   { color: '#5B50F0', bg: '#EEEEFF' },
  User:     { color: '#3B82F6', bg: '#EFF6FF' },
  Dispute:  { color: '#F59E0B', bg: '#FFFBEB' },
  Content:  { color: '#10B981', bg: '#ECFDF5' },
  System:   { color: '#6B7280', bg: '#F3F4F6' },
  Settings: { color: '#8B5CF6', bg: '#F5F3FF' },
  Admin:    { color: '#8B5CF6', bg: '#F5F3FF' },
};

function CategoryChip({ category }: { category: string }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.System;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {category}
    </span>
  );
}

// ── Avatar color pool ─────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#5B50F0', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

function avatarColorFor(initials: string) {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) hash += initials.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ── Filter categories ─────────────────────────────────────────────────────────

const FILTER_CATEGORIES = ['All Categories', 'Vendor', 'User', 'Dispute', 'Content', 'System'];

// ── Download icon ─────────────────────────────────────────────────────────────

function DownloadSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AuditTrailPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listAuditLogs()
      .then((rows) => active && setAuditLogs(rows))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load logs'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = auditLogs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.actor.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.target.toLowerCase().includes(q) ||
          log.category.toLowerCase().includes(q),
      );
    }
    if (category !== 'All Categories') {
      result = result.filter((log) => log.category === category);
    }
    return result;
  }, [search, category, auditLogs]);

  return (
    <div className="min-h-screen bg-page-bg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Audit Trail</h1>
          <p className="text-sm text-text-secondary mt-1">Track all admin actions and system events</p>
        </div>
        <Button variant="outline" icon={<DownloadSVG />}>Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-52">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
          />
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary bg-white outline-none focus:ring-2 focus:ring-primary/30"
        >
          {FILTER_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary bg-white outline-none focus:ring-2 focus:ring-primary/30"
          />
          <span className="text-text-secondary text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary bg-white outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Table */}
      <Card padding="p-0">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Audit Logs</h2>
          <span className="text-xs text-text-secondary font-medium">
            Showing {filtered.length} of {auditLogs.length} logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Actor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Action</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Target</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary hidden lg:table-cell">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, idx) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: idx % 2 === 1 ? '#FAFAFA' : '#FFFFFF' }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        text={log.actorInitials}
                        color={avatarColorFor(log.actorInitials)}
                        size={32}
                      />
                      <span className="font-medium text-text-primary whitespace-nowrap">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-text-primary">{log.action}</td>
                  <td className="px-6 py-3.5 text-text-primary font-medium">{log.target}</td>
                  <td className="px-6 py-5">
                    <CategoryChip category={log.category} />
                  </td>
                  <td className="px-6 py-3.5 hidden lg:table-cell">
                    <span className="font-mono text-xs text-text-secondary">{log.ipAddress}</span>
                  </td>
                  <td className="px-6 py-3.5 text-text-secondary text-xs whitespace-nowrap">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="py-16 text-center text-text-secondary text-sm">Loading logs…</div>
          )}
          {error && !loading && (
            <div className="py-16 text-center text-sm" style={{ color: '#DC2626' }}>{error}</div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-16 text-center text-text-secondary text-sm">
              No logs match your search criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
