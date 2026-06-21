import React from "react";

interface Props {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
  deltaColor?: string;
}

export default function StatCard({ icon, value, label, delta, deltaPositive = true, deltaColor }: Props) {
  const dColor = deltaColor ?? (deltaPositive ? "#10B981" : "#EF4444");
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5 min-h-[130px] shadow-sm">
      <div className="flex items-start justify-between">
        <div>{icon}</div>
        {delta && (
          <div className="flex items-center gap-1" style={{ color: dColor }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d={deltaPositive ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} />
            </svg>
            <span className="text-xs font-medium">{delta}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary mt-1">{label}</p>
      </div>
    </div>
  );
}
