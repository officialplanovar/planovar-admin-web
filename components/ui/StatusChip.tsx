const statusMap: Record<string, { color: string; bg: string; label: string }> = {
  active:        { color: "#10B981", bg: "#ECFDF5", label: "Active" },
  pending:       { color: "#F59E0B", bg: "#FFFBEB", label: "Pending" },
  approved:      { color: "#10B981", bg: "#ECFDF5", label: "Approved" },
  rejected:      { color: "#EF4444", bg: "#FEF2F2", label: "Rejected" },
  "rejected - awaiting response": { color: "#EF4444", bg: "#FEF2F2", label: "Rejected - Awaiting Response" },
  suspended:     { color: "#F97316", bg: "#FFF7ED", label: "Suspended" },
  banned:        { color: "#EF4444", bg: "#FEF2F2", label: "Banned" },
  investigating: { color: "#8B5CF6", bg: "#F5F3FF", label: "Investigating" },
  resolved:      { color: "#10B981", bg: "#ECFDF5", label: "Resolved" },
  open:          { color: "#EF4444", bg: "#FEF2F2", label: "Open" },
  completed:     { color: "#10B981", bg: "#ECFDF5", label: "Completed" },
  cancelled:     { color: "#EF4444", bg: "#FEF2F2", label: "Cancelled" },
  "in mediation":{ color: "#8B5CF6", bg: "#F5F3FF", label: "In Mediation" },
};

export default function StatusChip({ status, size = "sm" }: { status: string; size?: "sm" | "xs" }) {
  const s = statusMap[status.toLowerCase()] ?? { color: "#6B7280", bg: "#F3F4F6", label: status };
  const px = size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${px}`}
      style={{ color: s.color, backgroundColor: s.bg }}>
      {s.label}
    </span>
  );
}

export function SeverityChip({ severity }: { severity: string }) {
  const m: Record<string, { c: string; bg: string }> = {
    high:   { c: "#EF4444", bg: "#FEF2F2" },
    medium: { c: "#F59E0B", bg: "#FFFBEB" },
    low:    { c: "#6B7280", bg: "#F3F4F6" },
  };
  const { c, bg } = m[severity.toLowerCase()] ?? m.low;
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: c, backgroundColor: bg }}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function TypeChip({ type }: { type: string }) {
  const typeColors: Record<string, { c: string; bg: string }> = {
    listing: { c: "#5B50F0", bg: "#EEEEFF" },
    review:  { c: "#8B5CF6", bg: "#F5F3FF" },
    message: { c: "#6B7280", bg: "#F3F4F6" },
    profile: { c: "#5B50F0", bg: "#EEEEFF" },
    service: { c: "#8B5CF6", bg: "#F5F3FF" },
    product: { c: "#3B82F6", bg: "#EFF6FF" },
  };
  const { c, bg } = typeColors[type.toLowerCase()] ?? typeColors.listing;
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: c, backgroundColor: bg }}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

export function RoleChip({ role }: { role: string }) {
  const m: Record<string, { c: string; bg: string }> = {
    vendor:      { c: "#8B5CF6", bg: "#F5F3FF" },
    client:      { c: "#6B7280", bg: "#F3F4F6" },
    "super admin": { c: "#5B50F0", bg: "#EEEEFF" },
    admin:       { c: "#5B50F0", bg: "#EEEEFF" },
    moderator:   { c: "#5B50F0", bg: "#EEEEFF" },
    support:     { c: "#5B50F0", bg: "#EEEEFF" },
    finance:     { c: "#5B50F0", bg: "#EEEEFF" },
  };
  const { c, bg } = m[role.toLowerCase()] ?? m.admin;
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: c, backgroundColor: bg }}>
      {role}
    </span>
  );
}
