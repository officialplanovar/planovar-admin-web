import React from "react";

// ── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}

export default function FormField({ label, children, required, hint }: FormFieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-text-primary mb-1.5 block">
        {label}
        {required && (
          <span style={{ color: "#EF4444" }}>*</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-text-secondary mt-1">{hint}</p>
      )}
    </div>
  );
}

export { FormField };

// ── Input ─────────────────────────────────────────────────────────────────────

interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Input({ type = "text", value, onChange, placeholder, disabled, icon }: InputProps) {
  const [focused, setFocused] = React.useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    paddingLeft: icon ? 40 : 16,
    paddingRight: 16,
    borderRadius: 12,
    border: `1.5px solid ${focused ? "#5B50F0" : "#E5E7EB"}`,
    background: "#FAFAFA",
    fontSize: 14,
    color: "#0F172A",
    outline: "none",
    transition: "border-color 0.15s",
    opacity: disabled ? 0.6 : 1,
  };

  if (icon) {
    return (
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            color: "#9CA3AF",
          }}
        >
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={inputStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ── Select ────────────────────────────────────────────────────────────────────

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value, onChange, children, disabled }: SelectProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: "100%",
        height: 44,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 12,
        border: `1.5px solid ${focused ? "#5B50F0" : "#E5E7EB"}`,
        background: "#FAFAFA",
        fontSize: 14,
        color: "#0F172A",
        outline: "none",
        transition: "border-color 0.15s",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
}
