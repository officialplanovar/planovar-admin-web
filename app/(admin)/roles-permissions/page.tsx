"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function RolesPermissionsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<Admin[]>("/admin/team")
      .then((list) => {
        if (active) setAdmins(list);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Could not load admins");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const promote = async () => {
    if (!email.trim()) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const list = await apiFetch<Admin[]>("/admin/team/promote", {
        method: "POST",
        body: { email: email.trim() },
      });
      setAdmins(list);
      setEmail("");
      setNotice("Admin added.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add admin");
    } finally {
      setBusy(false);
    }
  };

  const demote = async (id: string) => {
    if (!confirm("Remove this person's admin access?")) return;
    setError("");
    setNotice("");
    try {
      await apiFetch(`/admin/team/${id}/role`, {
        method: "PATCH",
        body: { role: "CLIENT" },
      });
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setNotice("Admin removed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove admin");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-text-primary mb-1">Admin Team</h1>
      <p className="text-sm text-text-secondary mb-6">
        Manage who has admin access to the console. Promote an existing Planovar
        account by email, or remove admin access.
      </p>

      {/* Add admin */}
      <div className="flex gap-3 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email of an existing user"
          className="flex-1 h-11 px-4 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={promote}
          disabled={busy}
          className="h-11 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add admin"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {notice && <p className="text-sm text-green-600 mb-4">{notice}</p>}

      {/* Admin list */}
      {loading ? (
        <div className="text-sm text-text-secondary py-6">Loading team…</div>
      ) : admins.length === 0 ? (
        <div className="text-sm text-text-secondary py-6">No admins yet.</div>
      ) : (
        <div className="rounded-xl border border-border divide-y divide-border">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {a.name || a.email}
                </div>
                <div className="text-xs text-text-secondary">{a.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#EEEEFF] text-primary">
                  {a.role}
                </span>
                <button
                  onClick={() => demote(a.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-text-hint mt-6">
        Fine-grained roles &amp; permissions aren&apos;t configured — access is all
        or nothing (admin). Ask engineering if you need a permissions matrix.
      </p>
    </div>
  );
}
