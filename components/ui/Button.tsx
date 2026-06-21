import React from "react";

type Variant = "primary" | "outline" | "danger" | "warning" | "success" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const sizeStyles: Record<Size, React.CSSProperties & { className: string }> = {
  sm: {
    height: 32,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 12,
    fontWeight: 600,
    className: "text-xs font-semibold",
  },
  md: {
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 14,
    fontWeight: 600,
    className: "text-sm font-semibold",
  },
  lg: {
    height: 48,
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 14,
    fontWeight: 700,
    className: "text-sm font-bold",
  },
};

function getVariantStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        background: "linear-gradient(135deg, #7B6BFF 0%, #5B50F0 55%, #4A3FE5 100%)",
        color: "#FFFFFF",
        borderRadius: 9999,
        border: "none",
        boxShadow: "0 4px 16px rgba(91,80,240,0.35)",
      };
    case "outline":
      return {
        background: "#FFFFFF",
        color: "#374151",
        border: "1.5px solid #E5E7EB",
        borderRadius: 12,
      };
    case "danger":
      return {
        background: "#EF4444",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 12,
      };
    case "warning":
      return {
        background: "#F59E0B",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 12,
      };
    case "success":
      return {
        background: "linear-gradient(135deg, #10B981, #059669)",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 12,
      };
    case "ghost":
      return {
        background: "transparent",
        color: "#5B50F0",
        border: "none",
        borderRadius: 12,
      };
  }
}

function getVariantClassName(variant: Variant): string {
  switch (variant) {
    case "primary":
      return "btn-glossy";
    case "danger":
    case "warning":
    case "success":
      return "btn-glossy";
    case "outline":
      return "hover:bg-gray-50";
    case "ghost":
      return "";
    default:
      return "";
  }
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  fullWidth,
  icon,
}: ButtonProps) {
  const sizeConfig = sizeStyles[size];
  const variantStyle = getVariantStyle(variant);
  const variantClass = getVariantClassName(variant);

  const buttonStyle: React.CSSProperties = {
    ...variantStyle,
    height: sizeConfig.height,
    paddingLeft: sizeConfig.paddingLeft,
    paddingRight: sizeConfig.paddingRight,
    fontSize: sizeConfig.fontSize,
    fontWeight: sizeConfig.fontWeight,
    width: fullWidth ? "100%" : undefined,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: icon ? 8 : 0,
    transition: "opacity 0.15s, background 0.15s",
    whiteSpace: "nowrap",
  };

  const hoverStyle =
    variant === "ghost"
      ? {
          onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#EEEEFF";
          },
          onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          },
        }
      : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${className}`.trim()}
      style={buttonStyle}
      {...hoverStyle}
    >
      {icon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>}
      {children}
    </button>
  );
}

export { Button };
