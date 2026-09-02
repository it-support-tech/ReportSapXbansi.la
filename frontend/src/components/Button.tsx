import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-600 focus-visible:ring-primary-300 shadow-sm",
  secondary: "bg-secondary text-white hover:bg-secondary-600 focus-visible:ring-secondary-300 shadow-sm",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost: "text-secondary hover:bg-secondary-50 focus-visible:ring-secondary-200",
};

export const Button = ({ variant = "primary", isLoading, disabled, children, className = "", ...rest }: ButtonProps) => (
  <button
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
      transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    {...rest}
  >
    {isLoading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
    )}
    {children}
  </button>
);
