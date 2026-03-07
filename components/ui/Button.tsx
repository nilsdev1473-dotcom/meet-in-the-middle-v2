"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, type MouseEventHandler } from "react";

export type ButtonVariant = "primary" | "gradient" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#007AFF] text-white hover:brightness-110 focus-visible:ring-[#007AFF]",
  gradient:
    "text-white focus-visible:ring-purple-500",
  ghost:
    "bg-transparent border border-[#E5E5EA] text-[var(--foreground)] hover:bg-[var(--card-bg)] focus-visible:ring-[#007AFF]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-6 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30 };

  const gradientStyle =
    variant === "gradient"
      ? { background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)" }
      : {};

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={gradientStyle}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={springConfig}
    >
      {children}
    </motion.button>
  );
}
