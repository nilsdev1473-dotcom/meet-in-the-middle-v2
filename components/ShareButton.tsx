"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import type { Location } from "@/lib/store";

export interface ShareButtonProps {
  centerLocation: Location | null;
}

export function ShareButton({ centerLocation }: ShareButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("info");

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30 };

  const handleShare = async () => {
    if (!centerLocation) return;

    const { lat, lng } = centerLocation;
    const url = `${window.location.origin}${window.location.pathname}?lat=${lat}&lng=${lng}&zoom=14`;

    try {
      await navigator.clipboard.writeText(url);
      setToastVariant("info");
      setToastMessage("Link copied to clipboard!");
    } catch {
      setToastVariant("error");
      setToastMessage("Could not copy link");
    }
    setToastVisible(true);
  };

  return (
    <>
      <AnimatePresence>
        {centerLocation && (
          <motion.button
            type="button"
            aria-label="Share meetup link"
            className="fixed top-4 right-4 z-10 rounded-xl bg-white p-3 cursor-pointer
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
            style={{ boxShadow: "var(--ios-shadow)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={springConfig}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 text-[var(--foreground)]" />
          </motion.button>
        )}
      </AnimatePresence>

      {typeof document !== "undefined" &&
        createPortal(
          <Toast
            message={toastMessage}
            variant={toastVariant}
            visible={toastVisible}
            onDismiss={() => setToastVisible(false)}
          />,
          document.body
        )}
    </>
  );
}
