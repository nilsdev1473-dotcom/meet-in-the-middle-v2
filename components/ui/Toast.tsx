"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "border-l-4 border-l-green-500",
  error: "border-l-4 border-l-red-500",
  info: "border-l-4 border-l-[#007AFF]",
};

export function Toast({
  message,
  variant = "info",
  visible,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 35 };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={[
            "fixed top-4 left-1/2 z-50",
            "rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[var(--foreground)]",
            "min-w-[200px] max-w-sm",
            variantStyles[variant],
          ].join(" ")}
          style={{
            boxShadow: "var(--ios-shadow-lg)",
            translateX: "-50%",
          }}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={springConfig}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
