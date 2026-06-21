import React from "react";

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              border: isActive ? "none" : "1.5px solid #E5E7EB",
              background: isActive ? "#5B50F0" : "#FFFFFF",
              color: isActive ? "#FFFFFF" : "#6B7280",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
              }
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 20,
                  height: 20,
                  paddingLeft: 6,
                  paddingRight: 6,
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 700,
                  background: isActive ? "#FFFFFF" : "#F3F4F6",
                  color: isActive ? "#5B50F0" : "#6B7280",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { FilterTabs };
