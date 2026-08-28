"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import SyncButton from "./SyncButton";

function initials(name?: string | null) {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function TopBar() {
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-[72px] bg-white shadow-sm flex items-center px-7 gap-4 flex-shrink-0 z-10">
      {/* Search */}
      <div className="relative w-[340px]">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          placeholder="Search for vendors, users, disputes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F9F9FF] border border-[#E8E6FF] text-sm text-text-primary placeholder:text-text-hint focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          aria-label="Notifications"
          className="w-10 h-10 rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary-light/50 transition-colors cursor-pointer"
        >
          <svg className="text-text-secondary" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C8.64 5.36 7 7.92 7 11v5l-2 2v1h14v-1l-2-2z" />
          </svg>
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-12 z-20 bg-white border border-border rounded-xl shadow-lg w-[300px] overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-text-primary">Notifications</p>
            </div>
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-text-secondary">You&apos;re all caught up</p>
              <p className="text-xs text-text-hint mt-1">No new notifications</p>
            </div>
          </div>
        )}
      </div>

      {/* User card + menu */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 border border-primary/30 rounded-full px-3 py-2 cursor-pointer hover:bg-primary-light/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials(user?.name)}</span>
          </div>
          <div className="text-left">
            <p className="text-[13px] font-semibold text-text-primary leading-tight">{user?.name ?? "Admin"}</p>
            <p className="text-[11px] text-text-secondary leading-tight">{user?.email ?? "Administrator"}</p>
          </div>
          <svg className="text-text-secondary" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-12 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-page-bg"
              style={{ color: "#EF4444" }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Search index sync */}
      <SyncButton />

      {/* Notification */}
      <div className="relative">
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg className="text-text-secondary" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </button>
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      </div>
    </header>
  );
}
