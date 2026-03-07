"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export function Card({ children, className = "", onClick, animate = true }: CardProps) {
  const prefersReducedMotion = useReducedMotion();

  const hoverAnimation = animate && !prefersReducedMotion
    ? {
        scale: 1.01,
        boxShadow: "var(--ios-shadow-lg)",
      }
    : {};

  const hoverTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.15, ease: "easeOut" };

  return (
    <motion.div
      className={`rounded-2xl bg-[var(--card-bg)] p-6 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ boxShadow: "var(--ios-shadow)" }}
      whileHover={hoverAnimation}
      transition={hoverTransition}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
