'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormField from '@/components/ui/FormField';
import { Input, Select } from '@/components/ui/FormField';

// ── Types ─────────────────────────────────────────────────────────────────────

type NavItem =
  | 'General'
  | 'Categories & Tags'
  | 'Trust & Safety'
  | 'Notifications';

// ── Shared primitives ─────────────────────────────────────────────────────────

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: on ? '#5B50F0' : '#D1D5DB' }}
    >
      <span
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-text-primary mb-1.5">
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  description,
  on,
  onChange,
  warn,
}: {
  label: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
  warn?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        warn && on
          ? 'border-amber-200 bg-amber-50'
          : 'border-border bg-white'
      }`}
    >
      <div>
        <p className={`text-sm font-semibold ${warn && on ? 'text-amber-700' : 'text-text-primary'}`}>
          {label}
        </p>
        <p className={`text-xs mt-0.5 ${warn && on ? 'text-amber-600' : 'text-text-secondary'}`}>
          {description}
        </p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

// ── Section: General ──────────────────────────────────────────────────────────

function GeneralSection() {
  const [platformName, setPlatformName] = useState('Planovar');
  const [supportEmail, setSupportEmail] = useState('support@planovar.com');
  const [currency, setCurrency] = useState('NGN');
  const [region, setRegion] = useState('Nigeria');
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Record<string, unknown>>('/admin/settings')
      .then((s) => {
        setPlatformName((s.platformName as string) ?? 'Planovar');
        setSupportEmail((s.supportEmail as string) ?? '');
        setCurrency((s.currency as string) ?? 'NGN');
        setRegion((s.region as string) ?? 'Nigeria');
        setMaintenance((s.maintenanceMode as boolean) ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await apiFetch('/admin/settings', {
        method: 'PATCH',
        body: { platformName, supportEmail, currency, region, maintenanceMode: maintenance },
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-text-secondary py-6">Loading settings…</div>;
  }

  return (
    <div className="space-y-5">
      <FormField label="Platform Name">
        <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
      </FormField>
      <FormField label="Support Email">
        <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
      </FormField>
      <FormField label="Default Currency">
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {[
            ['NGN', 'NGN — Nigerian Naira'],
            ['USD', 'USD — US Dollar'],
            ['GBP', 'GBP — British Pound'],
            ['EUR', 'EUR — Euro'],
          ].map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Default Region">
        <Select value={region} onChange={(e) => setRegion(e.target.value)}>
          {['Nigeria', 'Ghana', 'Kenya', 'South Africa'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </Select>
      </FormField>
      <ToggleRow
        label="Maintenance Mode"
        description="Put the platform in maintenance mode"
        on={maintenance}
        onChange={setMaintenance}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Settings saved.</p>}
      <button
        onClick={save}
        disabled={saving}
        className="h-11 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}

// ── Section: Categories & Tags ────────────────────────────────────────────────

interface Category {
  name: string;
  gradient: string;
}

const defaultCategories: Category[] = [
  { name: 'Cakes & Desserts', gradient: 'linear-gradient(135deg, #FF6B9D, #FF9EBB)' },
  { name: 'Photography', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  { name: 'Catering', gradient: 'linear-gradient(135deg, #F97316, #FDBA74)' },
  { name: 'Decoration', gradient: 'linear-gradient(135deg, #10B981, #6EE7B7)' },
  { name: 'DJ & Music', gradient: 'linear-gradient(135deg, #8B5CF6, #C4B5FD)' },
  { name: 'Hair & Makeup', gradient: 'linear-gradient(135deg, #F43F5E, #FDA4AF)' },
];

const PRESET_COLORS = ['#5B50F0', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  function handleSave() {
    if (!newName.trim()) return;
    setCategories([
      ...categories,
      { name: newName.trim(), gradient: `linear-gradient(135deg, ${newColor}, ${newColor}CC)` },
    ]);
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
    setShowAdd(false);
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center gap-2">
            <div
              className="w-full aspect-square rounded-2xl shadow-sm"
              style={{ background: cat.gradient }}
            />
            <span className="text-xs font-semibold text-text-primary text-center">{cat.name}</span>
          </div>
        ))}
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => setShowAdd(true)}
        >
          <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#9CA3AF" className="group-hover:fill-primary transition-colors">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-text-secondary group-hover:text-primary transition-colors">Add Category</span>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Category">
        <div className="space-y-4">
          <FormField label="Category Name">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Florists" />
          </FormField>
          <div>
            <Label>Category Color</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    outline: newColor === c ? `3px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
          <Button variant="primary" fullWidth onClick={handleSave}>Save Category</Button>
        </div>
      </Modal>
    </>
  );
}

// ── Section: Trust & Safety ───────────────────────────────────────────────────

function TrustSafetySection() {
  const [emailVerif, setEmailVerif] = useState(true);
  const [idVerif, setIdVerif] = useState(true);
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="space-y-6">
      <ToggleRow
        label="Email Verification Required"
        description="All new users must verify their email"
        on={emailVerif}
        onChange={setEmailVerif}
      />
      <ToggleRow
        label="ID Verification for Vendors"
        description="Vendors must submit ID before approval"
        on={idVerif}
        onChange={setIdVerif}
      />
      <ToggleRow
        label="Two-Factor Authentication"
        description="Require 2FA for admin accounts"
        on={twoFa}
        onChange={setTwoFa}
      />
    </div>
  );
}

// ── Section: Notifications ────────────────────────────────────────────────────

type Channel = 'None' | 'Push' | 'Email' | 'Both';
const CHANNELS: Channel[] = ['None', 'Push', 'Email', 'Both'];

interface NotifEvent {
  key: string;
  label: string;
}

const NOTIF_EVENTS: NotifEvent[] = [
  { key: 'newVendor', label: 'New Vendor Registration' },
  { key: 'dispute', label: 'Dispute Opened' },
  { key: 'contentFlag', label: 'High Severity Content Flag' },
  { key: 'userReport', label: 'New User Report' },
];

function NotificationsSection() {
  const [channel, setChannel] = useState<Channel>('Both');
  const [events, setEvents] = useState<Record<string, boolean>>({
    newVendor: true,
    dispute: true,
    contentFlag: true,
    userReport: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>Admin Notification Channel</Label>
        <div className="grid grid-cols-4 gap-3 mt-1">
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className="py-3 rounded-xl border-2 text-sm font-semibold transition-all"
              style={{
                borderColor: channel === ch ? '#5B50F0' : '#E5E7EB',
                color: channel === ch ? '#5B50F0' : '#6B7280',
                backgroundColor: channel === ch ? '#EEEEFF' : '#FFFFFF',
              }}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Event Notifications</h3>
        {NOTIF_EVENTS.map((ev) => (
          <div key={ev.key} className="flex items-center justify-between py-3 px-4 bg-white border border-border rounded-xl">
            <span className="text-sm font-medium text-text-primary">{ev.label}</span>
            <Toggle
              on={events[ev.key]}
              onChange={(v) => setEvents({ ...events, [ev.key]: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  'General',
  'Categories & Tags',
  'Trust & Safety',
  'Notifications',
];

export default function PlatformSettingsPage() {
  const [active, setActive] = useState<NavItem>('General');

  function renderContent() {
    switch (active) {
      case 'General':           return <GeneralSection />;
      case 'Categories & Tags': return <CategoriesSection />;
      case 'Trust & Safety':    return <TrustSafetySection />;
      case 'Notifications':     return <NotificationsSection />;
    }
  }

  return (
    <div className="min-h-screen bg-page-bg p-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-text-primary">Platform Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Configure global platform behaviour and policies</p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left nav */}
        <nav className="w-52 flex-shrink-0 bg-white rounded-2xl shadow-sm p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item === active;
            return (
              <button
                key={item}
                onClick={() => setActive(item)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? '#5B50F0' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#6B7280',
                }}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <Card padding="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-text-primary">{active}</h2>
            </div>
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
}
