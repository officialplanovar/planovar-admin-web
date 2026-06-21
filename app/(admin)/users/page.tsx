'use client';

import { useState, useRef, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import StatusChip, { RoleChip } from '@/components/ui/StatusChip';
import Modal from '@/components/ui/Modal';
import UserAvatar from '@/components/ui/UserAvatar';
import { listUsers, setUserActive } from '@/lib/admin-api';
import type { AdminUser, AdminListing } from '@/types';
import Button from '@/components/ui/Button';
import FilterTabs from '@/components/ui/FilterTabs';
import FormField, { Input, Select } from '@/components/ui/FormField';

/* ─── helpers ─────────────────────────────────────────── */
function fmt(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

/* ─── icons ────────────────────────────────────────────── */
function UsersIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEEEFF' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#5B50F0">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </div>
  );
}
function ActiveIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981">
        <circle cx="12" cy="12" r="8" />
      </svg>
    </div>
  );
}
function SuspendedIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFF7ED' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#F97316">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    </div>
  );
}
function BannedIcon() {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.68L5.68 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.68L18.32 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
      </svg>
    </div>
  );
}
function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

/* ─── Invite Dialog ─────────────────────────────────────── */
function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('client');
  return (
    <Modal open={open} onClose={onClose} title="Invite User" subtitle="Send an invitation to join Planovar">
      <div className="flex flex-col gap-4 mt-2">
        <FormField label="Email Address">
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </FormField>
        <FormField label="Account Type">
          <Select
            value={accountType}
            onChange={e => setAccountType(e.target.value)}
          >
            <option value="vendor">Vendor</option>
            <option value="client">Client</option>
          </Select>
        </FormField>
        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" fullWidth onClick={onClose}>Send Invite</Button>
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Suspend Dialog ────────────────────────────────────── */
function SuspendDialog({ open, onClose, user, onConfirm }: { open: boolean; onClose: () => void; user: AdminUser | null; onConfirm: (reason: string) => void }) {
  const [period, setPeriod] = useState('7days');
  const [reason, setReason] = useState('spam');
  const [notes, setNotes] = useState('');
  const [notify, setNotify] = useState(true);
  if (!user) return null;
  const isSuspended = user.status !== 'active';
  return (
    <Modal open={open} onClose={onClose} title="Suspend User" subtitle={`Suspend ${user.name}'s account access`}>
      <div className="flex flex-col gap-4 mt-2">
        <FormField label="Suspension Period">
          <Select
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            <option value="24h">24 Hours</option>
            <option value="7days">7 Days</option>
            <option value="30days">30 Days</option>
            <option value="permanent">Permanent</option>
          </Select>
        </FormField>
        <FormField label="Violation Reason">
          <Select
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            <option value="spam">Spam</option>
            <option value="fraud">Fraud</option>
            <option value="inappropriate">Inappropriate Content</option>
            <option value="terms">Terms Violation</option>
            <option value="other">Other</option>
          </Select>
        </FormField>
        <FormField label="Internal Notes" hint="optional">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes for the admin team..."
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none resize-none"
          />
        </FormField>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-text-primary">Notify user via email</span>
          <button
            onClick={() => setNotify(v => !v)}
            className="w-11 h-6 rounded-full transition-colors relative"
            style={{ background: notify ? '#5B50F0' : '#E5E7EB' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              style={{ left: notify ? '22px' : '2px' }}
            />
          </button>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          {isSuspended ? (
            <Button variant="success" fullWidth onClick={() => onConfirm('reactivate')}>Reactivate User</Button>
          ) : (
            <Button
              variant="warning"
              fullWidth
              onClick={() => onConfirm([reason, period, notes].filter(Boolean).join(' · '))}
            >
              Suspend User
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ─── Delete Listing Dialog ─────────────────────────────── */
function DeleteListingDialog({ open, onClose, listing }: { open: boolean; onClose: () => void; listing: AdminListing | null }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Listing">
      <div className="flex flex-col gap-5 mt-2">
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete <span className="font-semibold text-text-primary">{listing?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={onClose}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Listing Card ──────────────────────────────────────── */
function ListingCard({ listing, label, onDelete }: { listing: AdminListing; label: string; onDelete: () => void }) {
  return (
    <div className="border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="w-full h-28 rounded-lg flex items-center justify-center text-text-hint text-xs font-medium" style={{ background: '#F3F4F6' }}>
        Image placeholder
      </div>
      <p className="font-semibold text-sm text-text-primary">{listing.name}</p>
      <p className="text-xs text-text-secondary">{fmt(listing.minPrice)} – {fmt(listing.maxPrice)}</p>
      <p className="text-xs text-text-hint">★ {listing.rating}</p>
      <button
        onClick={onDelete}
        className="mt-1 w-full py-1.5 rounded-lg text-xs font-semibold border"
        style={{ color: '#EF4444', borderColor: '#EF4444' }}
      >
        Delete {label}
      </button>
    </div>
  );
}

/* ─── Profile Dialog ────────────────────────────────────── */
function ProfileDialog({
  open, onClose, user, onSuspend,
}: {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSuspend: () => void;
}) {
  const [tab, setTab] = useState<'services' | 'products'>('services');
  const [deleteTarget, setDeleteTarget] = useState<AdminListing | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  if (!user) return null;
  const isVendor = user.role === 'vendor';

  return (
    <>
      <Modal open={open} onClose={onClose} title="User Profile" width="max-w-2xl">
        {/* avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar text={user.avatarText} color={user.avatarColor} size={64} />
          <div>
            <p className="text-xl font-bold text-text-primary">{user.name}</p>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>

        {/* info grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Role', value: <RoleChip role={user.role} /> },
            { label: 'Status', value: <StatusChip status={user.status} /> },
            { label: 'Member Since', value: user.joinedDate },
            { label: 'Last Active', value: user.lastActive },
            { label: 'Bookings', value: String(user.ordersCount) },
            { label: 'Phone', value: user.phone },
          ].map(({ label, value }) => (
            <div key={label} className="bg-page-bg rounded-xl p-3">
              <p className="text-xs text-text-hint mb-1">{label}</p>
              <div className="text-sm font-semibold text-text-primary">{value}</div>
            </div>
          ))}
        </div>

        {/* listings (vendor only) */}
        {isVendor && (user.services.length > 0 || user.products.length > 0) && (
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTab('services')}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
                style={tab === 'services' ? { background: '#5B50F0', color: '#fff' } : { background: '#F3F4F6', color: '#6B7280' }}
              >
                Services ({user.services.length})
              </button>
              <button
                onClick={() => setTab('products')}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
                style={tab === 'products' ? { background: '#5B50F0', color: '#fff' } : { background: '#F3F4F6', color: '#6B7280' }}
              >
                Products ({user.products.length})
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(tab === 'services' ? user.services : user.products).map((item, i) => (
                <ListingCard
                  key={i}
                  listing={item}
                  label={tab === 'services' ? 'Service' : 'Product'}
                  onDelete={() => { setDeleteTarget(item); setShowDelete(true); }}
                />
              ))}
            </div>
          </div>
        )}

        {/* actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="warning" size="sm" onClick={onSuspend}>Suspend User</Button>
          <Button variant="danger" size="sm">Ban Forever</Button>
        </div>
      </Modal>

      <DeleteListingDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        listing={deleteTarget}
      />
    </>
  );
}

/* ─── 3-dot dropdown ────────────────────────────────────── */
function ActionMenu({
  user,
  onViewProfile,
  onSuspend,
}: {
  user: AdminUser;
  onViewProfile: () => void;
  onSuspend: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-page-bg hover:text-text-primary transition-colors"
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[180px]">
          <button
            onClick={() => { setOpen(false); onViewProfile(); }}
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-page-bg"
          >
            View Profile
          </button>
          <button
            onClick={() => { setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-page-bg"
          >
            Send Password Reset
          </button>
          <button
            onClick={() => { setOpen(false); onSuspend(); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-page-bg"
            style={{ color: '#F97316' }}
          >
            Suspend User
          </button>
          <button
            onClick={() => { setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-page-bg"
            style={{ color: '#EF4444' }}
          >
            Ban Forever
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'vendors' | 'clients'>('all');
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [profileUser, setProfileUser] = useState<AdminUser | null>(null);
  const [suspendUser, setSuspendUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    setLoading(true);
    setError(null);
    listUsers()
      .then(setUsers)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(reload, []);

  const handleSuspendConfirm = async (reason: string) => {
    if (!suspendUser) return;
    const target = suspendUser;
    const makeActive = target.status !== 'active';
    try {
      await setUserActive(target.id, makeActive, reason);
      setUsers(prev =>
        prev.map(u => (u.id === target.id ? { ...u, status: makeActive ? 'active' : 'suspended' } : u))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setSuspendUser(null);
    }
  };

  const vendorCount = users.filter(u => u.role === 'vendor').length;
  const clientCount = users.filter(u => u.role === 'client').length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const suspendedCount = users.filter(u => u.status === 'suspended').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;

  const filtered = users.filter(u => {
    if (activeTab === 'vendors' && u.role !== 'vendor') return false;
    if (activeTab === 'clients' && u.role !== 'client') return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const tabs: { key: 'all' | 'vendors' | 'clients'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: users.length },
    { key: 'vendors', label: 'Vendors', count: vendorCount },
    { key: 'clients', label: 'Clients', count: clientCount },
  ];

  return (
    <div className="min-h-screen p-6 pb-10 flex flex-col gap-8" style={{ backgroundColor: '#F5F4FA' }}>
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <p className="text-sm text-text-secondary mt-1">Manage platform users and their access</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<UsersIcon />} value={loading ? '—' : String(users.length)} label="Total Users" />
        <StatCard
          icon={<ActiveIcon />}
          value={String(activeCount)}
          label="Active Users"
          delta="Active"
          deltaPositive={true}
          deltaColor="#10B981"
        />
        <StatCard icon={<SuspendedIcon />} value={String(suspendedCount)} label="Suspended" />
        <StatCard icon={<BannedIcon />} value={String(bannedCount)} label="Banned" />
      </div>

      {/* filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* pill tabs */}
        <FilterTabs
          tabs={tabs}
          active={activeTab}
          onChange={(key) => setActiveTab(key as 'all' | 'vendors' | 'clients')}
        />

        {/* search + invite */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg outline-none focus:border-primary bg-white text-text-primary w-56"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<PlusIcon />}
            onClick={() => setShowInvite(true)}
          >
            Invite User
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left w-10">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">User</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Role</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Bookings</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Joined</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-secondary text-sm">Loading users…</td>
                </tr>
              )}
              {error && !loading && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#DC2626' }}>
                    {error} · <button className="font-semibold underline" onClick={reload}>Retry</button>
                  </td>
                </tr>
              )}
              {!loading && !error && filtered.map(user => (
                <tr key={user.id} className="hover:bg-page-bg transition-colors" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td className="px-4 py-5">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <UserAvatar text={user.avatarText} color={user.avatarColor} size={36} />
                      <div>
                        <p className="font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <RoleChip role={user.role} />
                  </td>
                  <td className="px-4 py-5">
                    <StatusChip status={user.status} />
                  </td>
                  <td className="px-4 py-3.5 text-text-primary font-medium">{user.ordersCount}</td>
                  <td className="px-4 py-3.5 text-text-secondary">{user.joinedDate}</td>
                  <td className="px-4 py-5">
                    <ActionMenu
                      user={user}
                      onViewProfile={() => setProfileUser(user)}
                      onSuspend={() => setSuspendUser(user)}
                    />
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-secondary text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* dialogs */}
      <InviteDialog open={showInvite} onClose={() => setShowInvite(false)} />
      <ProfileDialog
        open={!!profileUser}
        onClose={() => setProfileUser(null)}
        user={profileUser}
        onSuspend={() => { setSuspendUser(profileUser); setProfileUser(null); }}
      />
      <SuspendDialog
        open={!!suspendUser}
        onClose={() => setSuspendUser(null)}
        user={suspendUser}
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}
