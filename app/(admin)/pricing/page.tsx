"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// API contract (see /admin/plans in the API repo):
//   GET   /admin/plans        → Plan[]
//   PATCH /admin/plans/:tier  → Plan   (body: all fields optional)
interface Plan {
  tier: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  listingLimit: number | null;
  features: string[];
}

// Editable, string-backed copy so decimals ("19." mid-typing) and a cleared
// listing limit ("" = unlimited/null) stay stable in the inputs.
interface PlanDraft {
  tier: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  currency: string;
  listingLimit: string;
  features: string[];
}

function toDraft(p: Plan): PlanDraft {
  return {
    tier: p.tier,
    name: p.name ?? "",
    priceMonthly: Number.isFinite(p.priceMonthly) ? String(p.priceMonthly) : "",
    priceYearly: Number.isFinite(p.priceYearly) ? String(p.priceYearly) : "",
    currency: p.currency || "USD",
    listingLimit: p.listingLimit == null ? "" : String(p.listingLimit),
    features: Array.isArray(p.features) ? p.features : [],
  };
}

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-[#FAFAFA]";

export default function PricingPage() {
  const [drafts, setDrafts] = useState<PlanDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingTier, setSavingTier] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notices, setNotices] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    apiFetch<Plan[]>("/admin/plans")
      .then((plans) => {
        if (active) setDrafts(plans.map(toDraft));
      })
      .catch((e) => {
        if (active) setLoadError(e instanceof Error ? e.message : "Could not load plans");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const update = (tier: string, patch: Partial<PlanDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.tier === tier ? { ...d, ...patch } : d)));
  };

  const save = async (draft: PlanDraft) => {
    setSavingTier(draft.tier);
    setErrors((prev) => ({ ...prev, [draft.tier]: "" }));
    setNotices((prev) => ({ ...prev, [draft.tier]: "" }));
    try {
      const body = {
        name: draft.name.trim(),
        priceMonthly: Number(draft.priceMonthly),
        priceYearly: Number(draft.priceYearly),
        currency: draft.currency.trim() || "USD",
        listingLimit: draft.listingLimit.trim() === "" ? null : Number(draft.listingLimit),
        features: draft.features,
      };
      const updated = await apiFetch<Plan>(`/admin/plans/${encodeURIComponent(draft.tier)}`, {
        method: "PATCH",
        body,
      });
      setDrafts((prev) => prev.map((d) => (d.tier === updated.tier ? toDraft(updated) : d)));
      setNotices((prev) => ({ ...prev, [draft.tier]: "Saved." }));
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        [draft.tier]: e instanceof Error ? e.message : "Could not save plan",
      }));
    } finally {
      setSavingTier(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Subscription Plans</h1>
      <p className="text-sm text-text-secondary mb-6">
        View and edit vendor subscription tier pricing. Prices are per-cycle amounts in the
        plan&apos;s currency (defaults to USD).
      </p>

      {loadError && <p className="text-sm text-red-600 mb-4">{loadError}</p>}

      {loading ? (
        <div className="text-sm text-text-secondary py-6">Loading plans…</div>
      ) : drafts.length === 0 ? (
        <div className="text-sm text-text-secondary py-6">No plans configured.</div>
      ) : (
        <div className="space-y-5">
          {drafts.map((d) => {
            const busy = savingTier === d.tier;
            const currency = d.currency || "USD";
            return (
              <div key={d.tier} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-text-primary">{d.name || d.tier}</h2>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#EEEEFF] text-primary inline-block mt-1.5">
                      {d.tier}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={d.name}
                      onChange={(e) => update(d.tier, { name: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={d.currency}
                      onChange={(e) => update(d.tier, { currency: e.target.value.toUpperCase() })}
                      placeholder="USD"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      Monthly Price ({currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={d.priceMonthly}
                      onChange={(e) => update(d.tier, { priceMonthly: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      Yearly Price ({currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={d.priceYearly}
                      onChange={(e) => update(d.tier, { priceYearly: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      Listing Limit
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={d.listingLimit}
                      onChange={(e) => update(d.tier, { listingLimit: e.target.value })}
                      placeholder="Unlimited"
                      className={inputClass}
                    />
                    <p className="text-xs text-text-secondary mt-1">Leave blank for unlimited.</p>
                  </div>
                </div>

                {d.features.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-text-primary mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {d.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F1F5F9] text-text-secondary"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-5">
                  <button
                    onClick={() => save(d)}
                    disabled={busy}
                    className="h-11 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
                  >
                    {busy ? "Saving…" : "Save"}
                  </button>
                  {errors[d.tier] && <p className="text-sm text-red-600">{errors[d.tier]}</p>}
                  {notices[d.tier] && <p className="text-sm text-green-600">{notices[d.tier]}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
