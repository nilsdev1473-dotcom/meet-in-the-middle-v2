"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useGeolocation } from "@/hooks/useGeolocation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Location } from "@/lib/types";

export interface LocationDetectorProps {
  onLocationFound: (location: Location) => void;
}

export function LocationDetector({ onLocationFound }: LocationDetectorProps) {
  const { coordinates, status, error, retry } = useGeolocation();
  const prefersReducedMotion = useReducedMotion();
  const [manualAddress, setManualAddress] = useState("");
  const notifiedRef = useRef(false);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -8 },
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30 };

  // Notify parent when location is found (once only)
  useEffect(() => {
    if (status === "success" && coordinates && !notifiedRef.current) {
      notifiedRef.current = true;
      const location: Location = {
        id: "user",
        coordinates,
        address: "Your location",
        label: "You",
      };
      onLocationFound(location);
    }
  }, [status, coordinates, onLocationFound]);

  const handleManualConfirm = () => {
    if (!manualAddress.trim()) return;
    const location: Location = {
      id: "user-manual",
      coordinates: { lat: 0, lng: 0 }, // will be geocoded by parent if needed
      address: manualAddress,
      label: manualAddress,
    };
    onLocationFound(location);
  };

  return (
    <AnimatePresence mode="wait">
      {status === "loading" || status === "idle" ? (
        <motion.div
          key="loading"
          className="flex items-center gap-3 text-sm text-[var(--muted)]"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <LoadingSpinner size="md" color="var(--ios-blue)" />
          <span>Finding your location...</span>
        </motion.div>
      ) : status === "success" ? null : status === "denied" ? (
        <motion.div
          key="denied"
          className="flex flex-col gap-3"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <Input
            label="Enter your location"
            placeholder="123 Main St, New York, NY"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleManualConfirm();
            }}
          />
          <Button onClick={handleManualConfirm} disabled={!manualAddress.trim()}>
            Confirm
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="error"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <ErrorBanner
            message={error ?? "An error occurred"}
            onRetry={retry}
            visible
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
