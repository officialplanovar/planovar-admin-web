"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "OPERATIONS", type: "section" },
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Vendor Verification", href: "/vendors", icon: "shield", badge: "12" },
  { label: "Users", href: "/users", icon: "users" },
  { label: "Categories", href: "/categories", icon: "tag" },
  { label: "Earnings", href: "/earnings", icon: "bar-chart" },
  { label: "Disputes", href: "/disputes", icon: "scale", badge: "10" },
  { label: "Content Moderation", href: "/content-moderation", icon: "flag", badge: "23" },
  { label: "Platform Settings", href: "/platform-settings", icon: "settings" },
  { label: "ADMINISTRATION", type: "section" },
  { label: "Audit Trail", href: "/audit-trail", icon: "receipt" },
  { label: "Roles & Permissions", href: "/roles-permissions", icon: "admin" },
];

const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    grid: "M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z",
    shield: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    "bar-chart": "M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zM16.2 13h2.8v6h-2.8v-6z",
    tag: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z",
    scale: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-7 7.91L12 7l7 3.91-7 3.82-7-3.82z",
    flag: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    receipt: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
    admin: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d={icons[name] || icons.grid} />
    </svg>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[270px] min-h-screen bg-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-lg leading-none">P</span>
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-tight">Planovar</p>
          <p className="text-sidebar-label text-[11px] leading-tight">Admin Console</p>
        </div>
      </div>
      <div className="h-px bg-sidebar-badge mx-0" />

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => {
          if (item.type === "section") {
            return (
              <div key={i}>
                {i > 0 && <div className="h-px bg-sidebar-badge my-3" />}
                <p className="text-sidebar-label text-[10px] font-semibold tracking-widest uppercase px-3 py-2">{item.label}</p>
              </div>
            );
          }
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive ? "bg-sidebar-active text-white" : "text-sidebar-text hover:bg-sidebar-hover"
              }`}>
              <span className={isActive ? "text-white" : "text-sidebar-icon group-hover:text-white"}>
                <Icon name={item.icon!} />
              </span>
              <span className={`flex-1 text-[13.5px] ${isActive ? "font-semibold" : "font-normal"}`}>{item.label}</span>
              {item.badge && (
                <span className="bg-sidebar-badge text-[#94A3B8] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Orb decoration */}
      <div className="p-4">
        <div className="relative h-28 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
          <div className="w-20 h-20 rounded-full"
            style={{
              background: "radial-gradient(circle at 40% 40%, #8B80FF, #5B50F0 50%, #2A1F6F)",
              boxShadow: "0 0 30px rgba(91,80,240,0.5)",
            }}
          />
        </div>
      </div>
    </aside>
  );
}
