'use client';

import React, { useState, useMemo } from 'react';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';
import { SeverityChip, TypeChip } from '@/components/ui/StatusChip';
import { contentFlags } from '@/data/mockData';
import type { ContentFlag } from '@/types';
import Button from '@/components/ui/Button';
import FilterTabs from '@/components/ui/FilterTabs';
import SearchInput from '@/components/ui/SearchInput';
import FormField from '@/components/ui/FormField';
import { Select } from '@/components/ui/FormField';

// ── Icons ─────────────────────────────────────────────────────────────────────

function FlagStatIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
      </svg>
    </div>
  );
}

function RobotIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm7 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM1 17h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2z" />
      </svg>
    </div>
  );
}

function StarStatIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFBEB' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </div>
  );
}

function ClockStatIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#8B5CF6">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
    </svg>
  );
}

function TypeIcon({ type }: { type: ContentFlag['type'] }) {
  const icons: Record<ContentFlag['type'], React.ReactNode> = {
    listing: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
      </svg>
    ),
    review: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
    message: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
    ),
    profile: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  };
  const colors: Record<ContentFlag['type'], string> = {
    listing: '#5B50F0',
    review: '#8B5CF6',
    message: '#6B7280',
    profile: '#F59E0B',
  };
  return (
    <span style={{ color: colors[type] }}>
      {icons[type]}
    </span>
  );
}

// ── Dialogs ──────────────────────────────────────────────────────────────────

function ReviewDialog({
  open,
  onClose,
  flag,
  onDismiss,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  flag: ContentFlag | null;
  onDismiss: () => void;
  onRemove: () => void;
}) {
  const [note, setNote] = useState('');
  if (!flag) return null;
  return (
    <Modal open={open} onClose={onClose} title="Review Flagged Content" width="max-w-lg">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <TypeChip type={flag.type} />
        <SeverityChip severity={flag.severity} />
        <span className="text-xs text-text-secondary">Reason: {flag.reason}</span>
      </div>

      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#F3F4F6' }}>
        <p className="text-sm font-semibold text-text-primary mb-1">{flag.title}</p>
        <p className="text-sm text-text-secondary">{flag.excerpt}</p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-text-primary mb-1.5">Internal Note</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note for the team..."
          className="w-full resize-none outline-none"
          style={{
            border: '1.5px solid #E5E7EB',
            borderRadius: '0.75rem',
            padding: '10px 12px',
            fontSize: '0.875rem',
            background: '#FAFAFA',
            color: '#0F172A',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#5B50F0'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Button variant="outline" fullWidth onClick={onDismiss}>Dismiss Report</Button>
        </div>
        <div className="flex-1">
          <Button variant="danger" fullWidth onClick={onRemove}>Remove Content</Button>
        </div>
      </div>
    </Modal>
  );
}

function DismissDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Dismiss Report" width="max-w-sm">
      <p className="text-sm text-text-secondary mb-6">
        Are you sure you want to dismiss this report? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <div className="flex-1">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        </div>
        <div className="flex-1">
          <Button variant="outline" fullWidth onClick={onClose}>Dismiss</Button>
        </div>
      </div>
    </Modal>
  );
}

function RemoveDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');
  const [notify, setNotify] = useState(true);

  const violationReasons = [
    'Spam',
    'Inappropriate Content',
    'Misinformation',
    'Policy Violation',
    'Other',
  ];

  return (
    <Modal open={open} onClose={onClose} title="Remove Content" width="max-w-lg">
      <div className="space-y-4 mb-5">
        <FormField label="Violation Reason">
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select a reason...</option>
            {violationReasons.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Message to user">
          <textarea
            rows={3}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Explain why the content is being removed..."
            className="w-full resize-none outline-none"
            style={{
              border: '1.5px solid #E5E7EB',
              borderRadius: '0.75rem',
              padding: '10px 12px',
              fontSize: '0.875rem',
              background: '#FAFAFA',
              color: '#0F172A',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#5B50F0'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
          />
        </FormField>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: '#5B50F0' }}
          />
          <span className="text-sm text-text-primary">Notify user via email</span>
        </label>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        </div>
        <div className="flex-1">
          <Button variant="danger" fullWidth onClick={onClose}>Remove Content</Button>
        </div>
      </div>
    </Modal>
  );
}

interface ModerationRule {
  id: string;
  label: string;
  severity: 'high' | 'medium' | 'low';
  enabled: boolean;
}

const defaultRules: ModerationRule[] = [
  { id: 'r1', label: 'Auto-flag listings with prohibited keywords', severity: 'high', enabled: true },
  { id: 'r2', label: 'Flag reviews under 10 characters', severity: 'low', enabled: true },
  { id: 'r3', label: 'Auto-remove reported messages (3+ reports)', severity: 'medium', enabled: true },
  { id: 'r4', label: 'Flag new vendor profiles for review', severity: 'low', enabled: false },
  { id: 'r5', label: 'Escalate high-severity flags automatically', severity: 'high', enabled: true },
];

function RulesDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rules, setRules] = useState<ModerationRule[]>(defaultRules);

  function toggle(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }

  const severityColors: Record<string, { c: string; bg: string }> = {
    high: { c: '#EF4444', bg: '#FEF2F2' },
    medium: { c: '#F59E0B', bg: '#FFFBEB' },
    low: { c: '#6B7280', bg: '#F3F4F6' },
  };

  return (
    <Modal open={open} onClose={onClose} title="Moderation Rules" width="max-w-lg">
      <div className="space-y-3 mb-6">
        {rules.map((rule) => {
          const sc = severityColors[rule.severity];
          return (
            <div
              key={rule.id}
              className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 border"
              style={{ borderColor: '#E5E7EB' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary leading-snug mb-1">{rule.label}</p>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ color: sc.c, backgroundColor: sc.bg }}
                >
                  Severity: {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                </span>
              </div>
              {/* Toggle */}
              <button
                onClick={() => toggle(rule.id)}
                className="flex-shrink-0 w-11 h-6 rounded-full transition-colors relative"
                style={{ backgroundColor: rule.enabled ? '#5B50F0' : '#D1D5DB' }}
                aria-checked={rule.enabled}
                role="switch"
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: rule.enabled ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          );
        })}
      </div>

      <Button variant="primary" fullWidth onClick={onClose}>Save Rules</Button>
    </Modal>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type ContentType = 'all' | ContentFlag['type'];

const TYPE_TABS: { key: ContentType; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: 15 },
  { key: 'listing', label: 'Listings', count: 2 },
  { key: 'review', label: 'Reviews', count: 1 },
  { key: 'message', label: 'Messages', count: 1 },
  { key: 'profile', label: 'Profiles', count: 1 },
];

export default function ContentModerationPage() {
  const [typeFilter, setTypeFilter] = useState<ContentType>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [flags, setFlags] = useState<ContentFlag[]>(contentFlags);

  const [reviewFlag, setReviewFlag] = useState<ContentFlag | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Convert TYPE_TABS to FilterTabs format
  const selectedIds = Array.from(selected);

  const filtered = useMemo(() => {
    let list = flags;
    if (typeFilter !== 'all') list = list.filter((f) => f.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.excerpt.toLowerCase().includes(q) ||
          f.reporterName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [flags, typeFilter, search]);

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((f) => f.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openReview(flag: ContentFlag) {
    setReviewFlag(flag);
    setReviewOpen(true);
  }

  function handleReviewDismiss() {
    setReviewOpen(false);
    setDismissOpen(true);
  }

  function handleReviewRemove() {
    setReviewOpen(false);
    setRemoveOpen(true);
  }

  return (
    <div className="min-h-screen bg-page-bg p-6">
      {/* Header */}
      <PageHeader
        title="Content Moderation"
        subtitle="Review and action flagged content"
        actions={
          <button
            onClick={() => setRulesOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
          >
            <SettingsIcon />
            Rules
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<FlagStatIcon />} value="12" label="Open Reports" />
        <StatCard icon={<RobotIcon />} value="3" label="Auto-flagged" />
        <StatCard icon={<StarStatIcon />} value="47" label="Reviews Flagged" />
        <StatCard icon={<ClockStatIcon />} value="18m" label="Avg Review Time" />
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: type tabs + select all */}
          <div className="flex items-center gap-3 flex-wrap">
            <FilterTabs
              tabs={TYPE_TABS.map((t) => ({ key: t.key, label: `${t.label} (${t.count})` }))}
              active={typeFilter}
              onChange={(key) => setTypeFilter(key as ContentType)}
            />

            <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary select-none">
              <input
                type="checkbox"
                checked={selected.size === filtered.length && filtered.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#5B50F0' }}
              />
              Select All
            </label>
          </div>

          {/* Right: bulk actions + search */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              disabled={selectedIds.length === 0}
            >
              Bulk Actions ({selectedIds.length})
            </Button>

            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flagged content..."
            />
          </div>
        </div>
      </div>

      {/* Flagged Content Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-text-secondary">
            No flagged content matches your filters.
          </div>
        ) : (
          <div>
            {filtered.map((flag) => (
              <div
                key={flag.id}
                className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors border-b border-[#F3F4F6] last:border-0"
              >
                {/* Checkbox */}
                <div className="pt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selected.has(flag.id)}
                    onChange={() => toggleOne(flag.id)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#5B50F0' }}
                  />
                </div>

                {/* Type icon */}
                <div className="pt-0.5 flex-shrink-0">
                  <TypeIcon type={flag.type} />
                </div>

                {/* Chips */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                  <TypeChip type={flag.type} />
                  <SeverityChip severity={flag.severity} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate mb-1.5">
                    {flag.title}
                  </p>
                  <p className="text-sm text-text-secondary truncate mb-1">{flag.excerpt}</p>
                  <p className="text-xs text-text-hint">
                    Reported by{' '}
                    <span className="font-medium text-text-secondary">{flag.reporterName}</span>
                    {' · '}
                    {flag.reason}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="flex-shrink-0 text-xs text-text-hint pt-0.5 min-w-[40px] text-right">
                  {flag.createdAt}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setFlags((prev) => prev.filter((f) => f.id !== flag.id));
                      setSelected((prev) => {
                        const next = new Set(prev);
                        next.delete(flag.id);
                        return next;
                      });
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReview(flag)}
                  >
                    Review
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDismissOpen(true)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        flag={reviewFlag}
        onDismiss={handleReviewDismiss}
        onRemove={handleReviewRemove}
      />
      <DismissDialog open={dismissOpen} onClose={() => setDismissOpen(false)} />
      <RemoveDialog open={removeOpen} onClose={() => setRemoveOpen(false)} />
      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
