import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "orange";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const sizeMap = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-md",
    md: "px-4 py-2 text-sm font-medium rounded-lg",
    lg: "px-6 py-2.5 text-base font-medium rounded-lg",
  };

  const variantMap = {
    primary:
      "bg-brand-green text-white hover:bg-brand-darkgreen focus:ring-2 focus:ring-brand-green/30 active:scale-[0.99] shadow-sm",
    secondary:
      "bg-brand-teal text-white hover:bg-[#0D2E2A] focus:ring-2 focus:ring-brand-teal/30 active:scale-[0.99]",
    outline:
      "border border-brand-border bg-white text-brand-text hover:bg-brand-ivory hover:border-gray-300 focus:ring-2 focus:ring-brand-green/20",
    ghost:
      "bg-transparent text-brand-slate hover:bg-gray-100 hover:text-brand-text",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-2 focus:ring-rose-500/30",
    orange:
      "bg-brand-orange text-white hover:bg-[#EA580C] focus:ring-2 focus:ring-brand-orange/30 active:scale-[0.99]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
