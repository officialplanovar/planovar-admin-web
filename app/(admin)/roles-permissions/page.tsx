'use client';

import { useState } from 'react';
import { teamMembers } from '@/data/mockData';
import type { TeamMember } from '@/types';
import UserAvatar from '@/components/ui/UserAvatar';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { Input, Select } from '@/components/ui/FormField';

// ── Role chip ─────────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<string, { color: string; bg: string }> = {
  'Super Admin': { color: '#5B50F0', bg: '#EEEEFF' },
  Admin:         { color: '#7B6BFF', bg: '#EEEEFF' },
  Moderator:     { color: '#3B82F6', bg: '#EFF6FF' },
  Support:       { color: '#10B981', bg: '#ECFDF5' },
  Finance:       { color: '#F59E0B', bg: '#FFFBEB' },
};

function RoleChip({ role }: { role: string }) {
  const s = ROLE_STYLES[role] ?? { color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {role}
    </span>
  );
}

// ── Role cards data ───────────────────────────────────────────────────────────

interface RoleCard {
  name: string;
  count: string;
  description: string;
}

const ROLE_CARDS: RoleCard[] = [
  { name: 'Super Admin', count: '1 User',  description: 'Full platform access and configuration control.' },
  { name: 'Admin',       count: '3 Users', description: 'Manage vendors, disputes, and platform content.' },
  { name: 'Moderator',   count: '1 User',  description: 'Review and moderate content flags and listings.' },
  { name: 'Support',     count: '1 User',  description: 'Handle user queries and dispute messaging.' },
];

// ── Permissions matrix data ───────────────────────────────────────────────────

interface Permission {
  group: string;
  label: string;
  superAdmin: boolean;
  admin: boolean;
  moderator: boolean;
  support: boolean;
  finance: boolean;
}

const PERMISSIONS: Permission[] = [
  // Vendor Management
  { group: 'Vendor Management',  label: 'View Vendors',       superAdmin: true, admin: true,  moderator: true,  support: true,  finance: true  },
  { group: 'Vendor Management',  label: 'Approve / Reject',   superAdmin: true, admin: true,  moderator: false, support: false, finance: false },
  { group: 'Vendor Management',  label: 'Edit Vendor',        superAdmin: true, admin: true,  moderator: false, support: false, finance: false },
  // Dispute Management
  { group: 'Dispute Management', label: 'View Disputes',      superAdmin: true, admin: true,  moderator: true,  support: true,  finance: false },
  { group: 'Dispute Management', label: 'Resolve Disputes',   superAdmin: true, admin: true,  moderator: false, support: false, finance: false },
  { group: 'Dispute Management', label: 'Add Notes',          superAdmin: true, admin: true,  moderator: true,  support: true,  finance: false },
  // Content Moderation
  { group: 'Content Moderation', label: 'View Flags',         superAdmin: true, admin: true,  moderator: true,  support: true,  finance: false },
  { group: 'Content Moderation', label: 'Remove Content',     superAdmin: true, admin: true,  moderator: true,  support: false, finance: false },
  { group: 'Content Moderation', label: 'Dismiss Reports',    superAdmin: true, admin: true,  moderator: true,  support: false, finance: false },
  // Administration
  { group: 'Administration',     label: 'Manage Users',       superAdmin: true, admin: true,  moderator: false, support: false, finance: false },
  { group: 'Administration',     label: 'Platform Settings',  superAdmin: true, admin: true,  moderator: false, support: false, finance: false },
  { group: 'Administration',     label: 'View Audit Trail',   superAdmin: true, admin: true,  moderator: false, support: false, finance: false },
  { group: 'Administration',     label: 'Manage Roles',       superAdmin: true, admin: false, moderator: false, support: false, finance: false },
];

type RoleKey = 'superAdmin' | 'admin' | 'moderator' | 'support' | 'finance';

const ROLE_KEYS: { key: RoleKey; label: string }[] = [
  { key: 'superAdmin', label: 'Super Admin' },
  { key: 'admin',      label: 'Admin' },
  { key: 'moderator',  label: 'Moderator' },
  { key: 'support',    label: 'Support' },
  { key: 'finance',    label: 'Finance' },
];

// ── Checkbox ─────────────────────────────────────────────────────────────────

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
      style={{
        backgroundColor: checked ? '#5B50F0' : '#F3F4F6',
        border: checked ? 'none' : '2px solid #D1D5DB',
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      )}
    </div>
  );
}

// ── 3-dot menu ────────────────────────────────────────────────────────────────

function ThreeDotMenu({
  onEditRole,
  onDelete,
}: {
  onEditRole: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-secondary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 bg-white rounded-xl shadow-lg border border-border py-1 min-w-36">
            <button
              onClick={() => { setOpen(false); onEditRole(); }}
              className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
            >
              Edit Role
            </button>
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors"
              style={{ color: '#EF4444' }}
            >
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const ALL_ROLES = ['Super Admin', 'Admin', 'Moderator', 'Support', 'Finance'];

// ── Permissions Matrix Modal ──────────────────────────────────────────────────

function PermissionsMatrixModal({ onClose }: { onClose: () => void }) {
  const groups = Array.from(new Set(PERMISSIONS.map((p) => p.group)));

  return (
    <Modal open onClose={onClose} title="Permissions Matrix" width="max-w-4xl">
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 border-y border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold text-text-secondary w-44">Group</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-text-secondary">Capability</th>
              {ROLE_KEYS.map((r) => (
                <th key={r.key} className="px-5 py-3 text-center text-xs font-semibold text-text-secondary whitespace-nowrap">
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const rows = PERMISSIONS.filter((p) => p.group === group);
              return rows.map((perm, idx) => (
                <tr
                  key={perm.label}
                  className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {idx === 0 ? (
                    <td
                      className="px-5 py-3 align-top"
                      rowSpan={rows.length}
                    >
                      <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                        {group}
                      </span>
                    </td>
                  ) : null}
                  <td className="px-5 py-3 text-text-secondary">{perm.label}</td>
                  {ROLE_KEYS.map((r) => (
                    <td key={r.key} className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox checked={perm[r.key]} />
                      </div>
                    </td>
                  ))}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ModalType =
  | { kind: 'none' }
  | { kind: 'createRole' }
  | { kind: 'editRole'; member: TeamMember }
  | { kind: 'invite' }
  | { kind: 'remove'; member: TeamMember }
  | { kind: 'matrix' };

export default function RolesPermissionsPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [modal, setModal] = useState<ModalType>({ kind: 'none' });

  // Create role form
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Edit role form
  const [editRoleValue, setEditRoleValue] = useState('');

  // Invite form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Admin');

  function openEditRole(member: TeamMember) {
    setEditRoleValue(member.role);
    setModal({ kind: 'editRole', member });
  }

  function handleUpdateRole() {
    if (modal.kind !== 'editRole') return;
    setMembers(members.map((m) =>
      m.id === modal.member.id ? { ...m, role: editRoleValue } : m,
    ));
    setModal({ kind: 'none' });
  }

  function handleRemoveMember() {
    if (modal.kind !== 'remove') return;
    setMembers(members.filter((m) => m.id !== modal.member.id));
    setModal({ kind: 'none' });
  }

  function handleSendInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const initials = inviteName.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#5B50F0', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B'];
    const newMember: TeamMember = {
      id: `tm${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'active',
      lastActive: 'Just now',
      avatarText: initials,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };
    setMembers([...members, newMember]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Admin');
    setModal({ kind: 'none' });
  }

  function handleCreateRole() {
    setNewRoleName('');
    setNewRoleDesc('');
    setModal({ kind: 'none' });
  }

  return (
    <div className="min-h-screen bg-page-bg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Roles &amp; Permissions</h1>
          <p className="text-sm text-text-secondary mt-1">Manage team access and capabilities</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setModal({ kind: 'matrix' })}>Permission Matrix</Button>
          <Button variant="outline" onClick={() => setModal({ kind: 'createRole' })}>Create Role</Button>
          <Button variant="primary" onClick={() => setModal({ kind: 'invite' })}>Invite Member</Button>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {ROLE_CARDS.map((card) => (
          <div
            key={card.name}
            className="rounded-2xl p-6 flex flex-col gap-3"
            style={{ backgroundColor: '#0F0D2E' }}
          >
            <div>
              <p className="text-base font-bold text-white">{card.name}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: '#7B6BFF' }}>
                {card.count}
              </p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-4">{card.description}</p>
            <button
              className="self-start px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Manage
            </button>
          </div>
        ))}
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <h2 className="text-base font-bold text-text-primary">Team Members</h2>
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#EEEEFF', color: '#5B50F0' }}
          >
            {members.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Member</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary hidden md:table-cell">Last Active</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <UserAvatar text={member.avatarText} color={member.avatarColor} size={36} />
                      <div>
                        <p className="font-semibold text-text-primary">{member.name}</p>
                        <p className="text-xs text-text-secondary">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <RoleChip role={member.role} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                      <span className="text-sm text-text-primary">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-text-secondary hidden md:table-cell">
                    {member.lastActive}
                  </td>
                  <td className="px-6 py-5">
                    <ThreeDotMenu
                      onEditRole={() => openEditRole(member)}
                      onDelete={() => setModal({ kind: 'remove', member })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Create Role */}
      {modal.kind === 'createRole' && (
        <Modal open onClose={() => setModal({ kind: 'none' })} title="Create New Role">
          <div className="space-y-4">
            <FormField label="Role Name" required>
              <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Finance Manager" />
            </FormField>
            <FormField label="Description">
              <textarea
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                placeholder="Describe what this role can do..."
                rows={3}
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
            <Button variant="primary" fullWidth onClick={handleCreateRole}>Create Role</Button>
          </div>
        </Modal>
      )}

      {/* Edit Role */}
      {modal.kind === 'editRole' && (
        <Modal open onClose={() => setModal({ kind: 'none' })} title="Edit Role">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <UserAvatar text={modal.member.avatarText} color={modal.member.avatarColor} size={36} />
              <div>
                <p className="font-semibold text-text-primary">{modal.member.name}</p>
                <p className="text-xs text-text-secondary">Current role: {modal.member.role}</p>
              </div>
            </div>
            <FormField label="New Role">
              <Select value={editRoleValue} onChange={(e) => setEditRoleValue(e.target.value)}>
                {ALL_ROLES.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </FormField>
            <Button variant="primary" fullWidth onClick={handleUpdateRole}>Update Role</Button>
          </div>
        </Modal>
      )}

      {/* Invite Member */}
      {modal.kind === 'invite' && (
        <Modal open onClose={() => setModal({ kind: 'none' })} title="Invite Team Member">
          <div className="space-y-4">
            <FormField label="Full Name">
              <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g. Jane Doe" />
            </FormField>
            <FormField label="Email Address">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="jane@planovar.ng"
              />
            </FormField>
            <FormField label="Role">
              <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                {ALL_ROLES.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </FormField>
            <Button variant="primary" fullWidth onClick={handleSendInvite}>Send Invitation</Button>
          </div>
        </Modal>
      )}

      {/* Remove Member */}
      {modal.kind === 'remove' && (
        <Modal open onClose={() => setModal({ kind: 'none' })} title="Remove Team Member">
          <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 leading-relaxed">
              Are you sure you want to remove{' '}
              <span className="font-bold">{modal.member.name}</span> from the team? This action cannot be
              undone.
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Button variant="outline" fullWidth onClick={() => setModal({ kind: 'none' })}>Cancel</Button>
              </div>
              <div className="flex-1">
                <Button variant="danger" fullWidth onClick={handleRemoveMember}>Remove Member</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Permissions Matrix */}
      {modal.kind === 'matrix' && (
        <PermissionsMatrixModal onClose={() => setModal({ kind: 'none' })} />
      )}
    </div>
  );
}
