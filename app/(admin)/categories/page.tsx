'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SearchInput from '@/components/ui/SearchInput';
import FormField, { Input } from '@/components/ui/FormField';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  slugify,
  type AdminCategory,
  type CategoryInput,
} from '@/lib/admin-api';

const PRESET_COLORS = ['#5B50F0', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#EC4899', '#14B8A6', '#D9A441'];

function StatIcon({ path, color, bg }: { path: string; color: string; bg: string }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={color}><path d={path} /></svg>
    </div>
  );
}
const ICON_TAG = 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z';
const ICON_CHECK = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';
const ICON_STAR = 'M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21.4 8 14 2 9.4h7.6z';
const ICON_LIST = 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z';

/* ── chip (tag/keyword) input ─────────────────────────────────────────────── */
function ChipInput({
  values, onChange, placeholder, accent = '#5B50F0',
}: { values: string[]; onChange: (v: string[]) => void; placeholder: string; accent?: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim().replace(/,$/, '');
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ color: accent, backgroundColor: `${accent}1A` }}>
            {t}
            <button onClick={() => onChange(values.filter((x) => x !== t))} style={{ lineHeight: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-text-hint">None yet</span>}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
          else if (e.key === 'Backspace' && !draft && values.length) onChange(values.slice(0, -1));
        }}
        onBlur={add}
        placeholder={placeholder}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-primary bg-white"
      />
    </div>
  );
}

/* ── toggle ───────────────────────────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0"
      style={{ background: on ? '#5B50F0' : '#E5E7EB' }}>
      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: on ? '22px' : '2px' }} />
    </button>
  );
}

/* ── thumbnail ────────────────────────────────────────────────────────────── */
function Thumb({ cat, size = 40 }: { cat: AdminCategory; size?: number }) {
  const color = cat.color ?? '#5B50F0';
  if (cat.imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={cat.imageUrl} alt={cat.name} width={size} height={size} className="rounded-xl object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-xl flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}CC)` }}>
      {cat.name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ── image upload field ───────────────────────────────────────────────────── */
function ImageUpload({
  label, hint, value, onChange, variant = 'card',
}: { label: string; hint?: string; value: string; onChange: (url: string) => void; variant?: 'card' | 'icon' }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isIcon = variant === 'icon';
  const box: React.CSSProperties = { height: isIcon ? 88 : 128, width: isIcon ? 88 : '100%' };

  const pick = (e: React.MouseEvent) => { e.preventDefault(); ref.current?.click(); };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { setErr('Please choose an image file'); return; }
    setBusy(true); setErr(null);
    try { onChange(await uploadCategoryImage(f)); }
    catch (ex) { setErr(ex instanceof Error ? ex.message : 'Upload failed'); }
    finally { setBusy(false); }
  };

  return (
    <FormField label={label} hint={hint}>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border group" style={box}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={pick} className="text-[11px] font-semibold text-white px-2 py-1 rounded-md bg-white/25 hover:bg-white/40">Replace</button>
            <button type="button" onClick={() => onChange('')} className="text-[11px] font-semibold text-white px-2 py-1 rounded-md bg-white/25 hover:bg-white/40">Remove</button>
          </div>
          {busy && <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-semibold text-text-secondary">Uploading…</div>}
        </div>
      ) : (
        <button type="button" onClick={pick} disabled={busy}
          className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 text-text-secondary hover:border-primary hover:text-primary transition-colors"
          style={box}>
          {busy ? (
            <span className="text-xs font-medium">Uploading…</span>
          ) : (
            <>
              <svg width={isIcon ? 18 : 22} height={isIcon ? 18 : 22} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" opacity="0" />
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
              </svg>
              <span className="text-[11px] font-medium">{isIcon ? 'Upload icon' : 'Click to upload'}</span>
            </>
          )}
        </button>
      )}
      {err && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{err}</p>}
    </FormField>
  );
}

/* ── editor modal ─────────────────────────────────────────────────────────── */
type EditorState = Partial<AdminCategory> & { _isNew?: boolean };

function CategoryEditor({
  cat, onClose, onSave,
}: { cat: EditorState; onClose: () => void; onSave: (input: CategoryInput, id?: string) => Promise<void> }) {
  const [name, setName] = useState(cat.name ?? '');
  const [slug, setSlug] = useState(cat.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!cat._isNew);
  const [description, setDescription] = useState(cat.description ?? '');
  const [imageUrl, setImageUrl] = useState(cat.imageUrl ?? '');
  const [iconUrl, setIconUrl] = useState(cat.iconUrl ?? '');
  const [color, setColor] = useState(cat.color ?? PRESET_COLORS[0]);
  const [tags, setTags] = useState<string[]>(cat.tags ?? []);
  const [keywords, setKeywords] = useState<string[]>(cat.keywords ?? []);
  const [featured, setFeatured] = useState(cat.featured ?? false);
  const [popularityScore, setPopularityScore] = useState(cat.popularityScore ?? 0);
  const [sortOrder, setSortOrder] = useState(cat.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = slugTouched ? slug : slugify(name);

  const submit = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError(null);
    try {
      await onSave({
        name: name.trim(),
        slug: effectiveSlug || slugify(name),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        iconUrl: iconUrl.trim() || undefined,
        color,
        tags, keywords, featured,
        popularityScore: Number(popularityScore) || 0,
        sortOrder: Number(sortOrder) || 0,
      }, cat.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={cat._isNew ? 'New Category' : 'Edit Category'}
      subtitle="Presentation, taxonomy & discovery settings" width="max-w-2xl">
      <div className="space-y-4 mt-1">
        {/* preview row */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F9FAFB' }}>
          <Thumb cat={{ ...(cat as AdminCategory), name: name || 'New', color, imageUrl } as AdminCategory} size={48} />
          <div>
            <p className="font-bold text-text-primary">{name || 'New Category'}</p>
            <p className="text-xs text-text-secondary font-mono">/{effectiveSlug || 'slug'}</p>
          </div>
          {featured && <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: '#D9A441', background: '#FFFBEB' }}>★ Featured</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Photography" />
          </FormField>
          <FormField label="Slug" hint="URL identifier">
            <Input value={effectiveSlug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} placeholder="photography" />
          </FormField>
        </div>

        <FormField label="Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            placeholder="Short description shown to users…"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-primary resize-none" />
        </FormField>

        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
          <ImageUpload label="Card image" hint="JPG, PNG or WebP — up to 8 MB" value={imageUrl} onChange={setImageUrl} variant="card" />
          <ImageUpload label="Icon" hint="optional" value={iconUrl} onChange={setIconUrl} variant="icon" />
        </div>

        {/* color */}
        <div>
          <p className="text-sm font-semibold text-text-primary mb-1.5">Accent colour</p>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: c, outline: color.toLowerCase() === c.toLowerCase() ? `3px solid ${c}` : 'none', outlineOffset: 2 }} />
            ))}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-border" />
            <span className="text-xs font-mono text-text-secondary">{color}</span>
          </div>
        </div>

        {/* tags + keywords */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tags" hint="browse / editorial">
            <ChipInput values={tags} onChange={setTags} placeholder="Type a tag, press Enter" accent={color} />
          </FormField>
          <FormField label="Search keywords" hint="synonyms / aliases">
            <ChipInput values={keywords} onChange={setKeywords} placeholder="e.g. photographer, photo" accent="#0EA5E9" />
          </FormField>
        </div>

        {/* numbers + featured — three controls share one baseline (all 44px tall) */}
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Sort order">
            <Input type="number" value={String(sortOrder)} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </FormField>
          <FormField label="Popularity boost">
            <Input type="number" value={String(popularityScore)} onChange={(e) => setPopularityScore(Number(e.target.value))} />
          </FormField>
          <FormField label="Featured">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setFeatured((v) => !v)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFeatured((v) => !v); } }}
              className="w-full flex items-center justify-between rounded-xl px-3 cursor-pointer select-none transition-colors"
              style={{
                height: 44,
                border: `1.5px solid ${featured ? '#5B50F0' : '#E5E7EB'}`,
                background: featured ? '#F5F4FF' : '#FAFAFA',
              }}
            >
              <span className="text-sm font-medium" style={{ color: featured ? '#5B50F0' : '#6B7280' }}>
                {featured ? 'Featured' : 'Off'}
              </span>
              {/* visual only — the wrapper handles the click to avoid double-toggle */}
              <Toggle on={featured} onChange={() => {}} />
            </div>
          </FormField>
        </div>

        {error && <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" fullWidth disabled={saving} onClick={submit}>
            {saving ? 'Saving…' : cat._isNew ? 'Create Category' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── page ─────────────────────────────────────────────────────────────────── */
export default function CategoriesPage() {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);

  const reload = () => {
    setLoading(true); setError(null);
    listCategories()
      .then(setCats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load categories'))
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return cats;
    const q = search.toLowerCase();
    return cats.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.keywords.some((k) => k.toLowerCase().includes(q)));
  }, [cats, search]);

  const totalListings = cats.reduce((n, c) => n + c.listingCount, 0);
  const activeCount = cats.filter((c) => c.isActive).length;
  const featuredCount = cats.filter((c) => c.featured).length;

  const handleSave = async (input: CategoryInput, id?: string) => {
    if (id) await updateCategory(id, input);
    else await createCategory(input);
    setEditor(null);
    reload();
  };

  const toggleActive = async (c: AdminCategory) => {
    if (c.isActive) {
      await deleteCategory(c.id); // soft-delete = deactivate
    } else {
      await updateCategory(c.id, { isActive: true });
    }
    reload();
  };

  return (
    <div className="min-h-screen p-6 pb-10 flex flex-col gap-8" style={{ backgroundColor: '#F5F4FA' }}>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Categories" subtitle="Manage event categories, their look, and discovery signals" />
        <Button variant="primary" onClick={() => setEditor({ _isNew: true })}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<StatIcon path={ICON_TAG} color="#5B50F0" bg="#EEEEFF" />} value={loading ? '—' : String(cats.length)} label="Total Categories" />
        <StatCard icon={<StatIcon path={ICON_CHECK} color="#10B981" bg="#ECFDF5" />} value={loading ? '—' : String(activeCount)} label="Active" />
        <StatCard icon={<StatIcon path={ICON_STAR} color="#D9A441" bg="#FFFBEB" />} value={loading ? '—' : String(featuredCount)} label="Featured" />
        <StatCard icon={<StatIcon path={ICON_LIST} color="#3B82F6" bg="#EFF6FF" />} value={loading ? '—' : totalListings.toLocaleString()} label="Listings Categorised" />
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#FEF2F2', color: '#DC2626' }}>
          {error} · <button className="font-semibold underline" onClick={reload}>Retry</button>
        </div>
      )}

      <div className="sm:w-72">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, slug, tags…" />
      </div>

      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Category</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Tags</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Keywords</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Listings</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Featured</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}><td colSpan={7} className="px-5 py-10 text-center text-text-secondary text-sm">Loading categories…</td></tr>
              )}
              {!loading && filtered.map((c) => (
                <tr key={c.id} className="hover:bg-page-bg transition-colors" style={{ borderBottom: '1px solid #F3F4F6', opacity: c.isActive ? 1 : 0.55 }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Thumb cat={c} />
                      <div>
                        <p className="font-semibold text-text-primary">{c.name}</p>
                        <p className="text-xs text-text-secondary font-mono">/{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ color: c.color ?? '#5B50F0', background: `${c.color ?? '#5B50F0'}14` }}>{t}</span>
                      ))}
                      {c.tags.length > 3 && <span className="text-[11px] text-text-hint">+{c.tags.length - 3}</span>}
                      {c.tags.length === 0 && <span className="text-xs text-text-hint">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary text-xs">{c.keywords.length || '—'}</td>
                  <td className="px-5 py-4 text-text-primary font-semibold">{c.listingCount}</td>
                  <td className="px-5 py-4">
                    {c.featured
                      ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: '#D9A441', background: '#FFFBEB' }}>★ Yes</span>
                      : <span className="text-xs text-text-hint">No</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={c.isActive ? { color: '#10B981', background: '#ECFDF5' } : { color: '#6B7280', background: '#F3F4F6' }}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditor(c)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleActive(c)}>
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}><td colSpan={7} className="px-5 py-10 text-center text-text-secondary text-sm">No categories found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editor && <CategoryEditor cat={editor} onClose={() => setEditor(null)} onSave={handleSave} />}
    </div>
  );
}
