"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

export interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  visible?: boolean;
}

export function ErrorBanner({ message, onRetry, visible = true }: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 35 };

  const isVisible = visible && !dismissed;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="rounded-2xl bg-white border border-red-100 p-4 flex items-start gap-3"
          style={{ boxShadow: "var(--ios-shadow)" }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={springConfig}
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--foreground)]">{message}</p>
            {onRetry && (
              <div className="mt-2">
                <Button variant="ghost" size="sm" onClick={onRetry}>
                  Try again
                </Button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] rounded-lg p-0.5"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
