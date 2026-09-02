import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ children, className = "", ...rest }: CardProps) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-card ${className}`} {...rest}>
    {children}
  </div>
);
