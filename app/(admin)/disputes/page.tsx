'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';
import StatusChip from '@/components/ui/StatusChip';
import { listDisputes, resolveDispute, setDisputeStatus } from '@/lib/admin-api';
import type { AdminDispute } from '@/types';
import Button from '@/components/ui/Button';
import FilterTabs from '@/components/ui/FilterTabs';
import FormField from '@/components/ui/FormField';

// ── Icons ─────────────────────────────────────────────────────────────────────

function FlagIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
      </svg>
    </div>
  );
}

function MediationIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ECFDF5' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#8B5CF6">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

// ── Resolve Dialog ────────────────────────────────────────────────────────────

function ResolveDialog({
  open,
  onClose,
  dispute,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  dispute: AdminDispute | null;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState('');

  if (!dispute) return null;

  return (
    <Modal open={open} onClose={onClose} title="Resolve Dispute" width="max-w-lg">
      {/* Order summary card */}
      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Order Ref</span>
          <span className="text-xs font-mono font-bold" style={{ color: '#5B50F0' }}>{dispute.refNumber}</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-text-secondary">Raised by</span>
          <span className="text-sm font-medium text-text-primary">{dispute.clientName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Booking</span>
          <span className="text-sm font-medium text-text-primary">{dispute.vendorName}</span>
        </div>
      </div>

      {/* Resolution Notes */}
      <div className="mb-4">
        <FormField label="Resolution Notes" required>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the resolution outcome and any actions taken..."
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
      </div>

      {/* File upload zone */}
      <div
        className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-1.5 mb-6 cursor-pointer hover:bg-gray-50 transition-colors"
        style={{ borderColor: '#D1D5DB' }}
      >
        <PaperclipIcon />
        <p className="text-sm text-text-secondary font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-text-hint">PDF, JPG, PNG — max 10MB</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        </div>
        <div className="flex-1">
          <Button variant="success" fullWidth disabled={!notes.trim()} onClick={() => onConfirm(notes)}>Mark as Resolved</Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type TabFilter = 'open' | 'investigating' | 'resolved';

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('open');
  const [selectedId, setSelectedId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [resolveOpen, setResolveOpen] = useState(false);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listDisputes()
      .then((rows) => {
        if (!active) return;
        setDisputes(rows);
        const first = rows.find((d) => d.status === 'open') ?? rows[0];
        if (first) setSelectedId(first.id);
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load disputes'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = disputes.filter((d) => d.status === activeTab);
  const selected = disputes.find((d) => d.id === selectedId) ?? null;

  const openCount = disputes.filter((d) => d.status === 'open').length;
  const investigatingCount = disputes.filter((d) => d.status === 'investigating').length;
  const resolvedCount = disputes.filter((d) => d.status === 'resolved').length;

  function handleTabChange(tab: string) {
    setActiveTab(tab as TabFilter);
    const first = disputes.find((d) => d.status === tab);
    setSelectedId(first?.id ?? '');
  }

  async function handleStartInvestigation() {
    if (!selected) return;
    const id = selected.id;
    try {
      await setDisputeStatus(id, 'UNDER_REVIEW');
      setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'investigating' } : d)));
      setActiveTab('investigating');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  }

  async function handleResolve(notes: string) {
    if (!selected) return;
    const id = selected.id;
    try {
      await resolveDispute(id, notes);
      setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d)));
      setResolveOpen(false);
      setActiveTab('resolved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resolve failed');
    }
  }

  return (
    <div className="min-h-screen bg-page-bg p-6">
      {/* Header */}
      <PageHeader title="Disputes" subtitle="Manage and resolve platform disputes" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<FlagIcon />} value={loading ? '—' : String(openCount)} label="Open Disputes" />
        <StatCard icon={<MediationIcon />} value={loading ? '—' : String(investigatingCount)} label="In Mediation" />
        <StatCard icon={<CheckIcon />} value={loading ? '—' : String(resolvedCount)} label="Resolved" />
        <StatCard icon={<ClockIcon />} value={loading ? '—' : String(disputes.length)} label="Total" />
      </div>
      {error && (
        <div className="rounded-xl px-4 py-3 mb-5 text-sm font-medium" style={{ background: '#FEF2F2', color: '#DC2626' }}>{error}</div>
      )}

      {/* Split panel */}
      <div className="flex gap-5" style={{ minHeight: '600px' }}>
        {/* Left Panel — Dispute List */}
        <div className="w-2/5 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="p-3 border-b" style={{ borderColor: '#E5E7EB' }}>
            <FilterTabs
              tabs={[
                { key: 'open', label: 'Open' },
                { key: 'investigating', label: 'Investigating' },
                { key: 'resolved', label: 'Resolved' },
              ]}
              active={activeTab}
              onChange={handleTabChange}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-text-secondary">
                No {activeTab} disputes
              </div>
            ) : (
              filtered.map((dispute) => {
                const isSelected = dispute.id === selectedId;
                return (
                  <button
                    key={dispute.id}
                    onClick={() => setSelectedId(dispute.id)}
                    className="w-full text-left p-5 border-b transition-colors hover:bg-gray-50"
                    style={{
                      borderColor: '#F3F4F6',
                      borderLeft: isSelected ? '3px solid #5B50F0' : '3px solid transparent',
                      backgroundColor: isSelected ? '#F5F4FF' : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: '#5B50F0' }}
                      >
                        {dispute.refNumber}
                      </span>
                      <StatusChip status={dispute.status} size="xs" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mb-1 leading-snug">
                      {dispute.title}
                    </p>
                    <p className="text-xs text-text-secondary mb-1">
                      {dispute.clientName}{' '}
                      <span style={{ color: '#9CA3AF' }}>→</span>{' '}
                      {dispute.vendorName}
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      {dispute.createdAt}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel — Dispute Detail */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          {selected ? (
            <>
              {/* Detail Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold" style={{ color: '#5B50F0' }}>
                    {selected.refNumber}
                  </span>
                  <StatusChip status={selected.status} size="xs" />
                </div>
                <span className="text-sm font-medium text-text-secondary">
                  {selected.createdAt}
                </span>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Info grid */}
                <div
                  className="grid grid-cols-3 gap-5 rounded-xl p-4"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  {[
                    { label: 'Ref', value: selected.refNumber },
                    { label: 'Status', value: <StatusChip status={selected.status} size="xs" /> },
                    { label: 'Submitted', value: selected.createdAt },
                    { label: 'Raised by', value: selected.clientName },
                    { label: 'Booking', value: selected.vendorName },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-text-secondary font-medium mb-0.5">{label}</p>
                      {typeof value === 'string' ? (
                        <p className="text-sm font-semibold text-text-primary">{value}</p>
                      ) : (
                        value
                      )}
                    </div>
                  ))}
                </div>

                {/* Resolved banner */}
                {selected.status === 'resolved' && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{ backgroundColor: '#ECFDF5' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#10B981">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                      This dispute has been resolved
                    </span>
                  </div>
                )}

                {/* Messages */}
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-4 mt-4">Messages</h3>
                  <div className="space-y-4">
                    {selected.messages.map((msg, idx) => {
                      const isRight = msg.senderRole === 'admin';
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${isRight ? 'items-end' : 'items-start'}`}
                        >
                          <p className="text-xs text-text-secondary mb-1.5 px-1">{msg.senderName}</p>
                          <div
                            className="max-w-[80%] rounded-2xl px-4 py-3.5"
                            style={{
                              backgroundColor: isRight ? '#5B50F0' : '#F3F4F6',
                              color: isRight ? '#fff' : '#0F172A',
                            }}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                          </div>
                          <p className="text-xs mt-1 px-1" style={{ color: '#9CA3AF' }}>
                            {msg.timestamp}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Evidence Files */}
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-3 mt-3">Evidence Files</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selected.evidenceFiles.map((file) => (
                      <span
                        key={file}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border"
                        style={{
                          borderColor: '#E5E7EB',
                          color: '#5B50F0',
                          backgroundColor: '#F5F4FF',
                        }}
                      >
                        <PaperclipIcon />
                        {file}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                {selected.status === 'open' && (
                  <div className="mt-6">
                    <Button variant="outline" onClick={handleStartInvestigation}>Start Investigation</Button>
                  </div>
                )}
                {selected.status === 'investigating' && (
                  <div className="flex gap-3 mt-6">
                    <Button variant="success" onClick={() => setResolveOpen(true)}>Mark as Resolved</Button>
                  </div>
                )}
              </div>

              {/* Send Message — sticky footer */}
              {selected.status !== 'resolved' && (
                <div className="px-6 py-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl border text-sm px-3 py-2.5 outline-none"
                      style={{ borderColor: '#E5E7EB' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setMessage('');
                      }}
                    />
                    <Button variant="primary" size="sm" onClick={() => setMessage('')} icon={<SendIcon />}>
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-text-secondary">
              Select a dispute to view details
            </div>
          )}
        </div>
      </div>

      {/* Resolve Dialog */}
      <ResolveDialog
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        dispute={selected}
        onConfirm={handleResolve}
      />
    </div>
  );
}
