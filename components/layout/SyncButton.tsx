"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  getSearchHealth,
  runSearchSync,
  type SearchHealth,
} from "@/lib/admin-api";

export default function SyncButton() {
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState<SearchHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setHealth(await getSearchHealth());
    } catch {
      setHealth({ status: "unreachable", reachable: false, collections: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function doSync() {
    setSyncing(true);
    setMsg(null);
    try {
      const r = await runSearchSync();
      setMsg(r.message || "Sync complete");
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  const dot =
    health?.status === "ok"
      ? "#22C55E"
      : health?.status === "degraded"
        ? "#F59E0B"
        : "#EF4444";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Search index sync"
        className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <svg
          className={"text-text-secondary" + (syncing ? " animate-spin" : "")}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.65 6.35A7.958 7.958 0 0012 4a8 8 0 108 8h-2a6 6 0 11-6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
        </svg>
        {health && (
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: dot }}
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-20 bg-white border border-border rounded-xl shadow-lg p-4 w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-text-primary">
              Search index
            </p>
            <span className="text-[11px] font-semibold" style={{ color: dot }}>
              {loading ? "CHECKING…" : (health?.status ?? "unknown").toUpperCase()}
            </span>
          </div>

          {health && !health.reachable && (
            <p className="text-[12px] text-text-secondary mb-3">
              Typesense is unreachable — check the API&apos;s TYPESENSE_HOST /
              that the service is running.
            </p>
          )}

          {health && health.reachable && (
            <div className="space-y-2 mb-3">
              {health.collections.map((c) => (
                <div
                  key={c.collection}
                  className="flex items-center justify-between text-[12px]"
                >
                  <span className="text-text-primary capitalize">
                    {c.collection}
                  </span>
                  <span className="text-text-secondary">
                    {c.exists ? `${c.numDocuments} docs` : "missing"}
                    {c.exists && !c.inSync
                      ? ` · drift (${c.missingFields.length} field${
                          c.missingFields.length === 1 ? "" : "s"
                        })`
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          )}

          {msg && <p className="text-[12px] text-primary mb-2">{msg}</p>}

          <button
            onClick={doSync}
            disabled={syncing}
            className="w-full h-9 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {syncing ? "Syncing…" : "Run full sync"}
          </button>
          <p className="text-[11px] text-text-hint mt-2">
            Re-indexes all listings &amp; vendors into Typesense.
          </p>
        </div>
      )}
    </div>
  );
}
