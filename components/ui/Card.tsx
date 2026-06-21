import React from "react";

// ── Card ──────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export default function Card({ children, className = "", padding = "p-6" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}

export { Card };

// ── CardHeader ────────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function CardHeader({ title, subtitle, actions }: CardHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              margin: "4px 0 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
