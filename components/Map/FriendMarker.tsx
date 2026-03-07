"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Marker, Popup } from "react-map-gl";
import type { Coordinates } from "@/lib/types";

export interface FriendMarkerProps {
  coordinates: Coordinates;
  label: string;
}

export function FriendMarker({ coordinates, label }: FriendMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 25 };

  return (
    <>
      <Marker longitude={coordinates.lng} latitude={coordinates.lat} anchor="bottom">
        <motion.button
          type="button"
          aria-label={`Friend location: ${label}`}
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-full"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springConfig}
          onClick={() => setShowPopup((v) => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="friendGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="url(#friendGradient)"
              stroke="white"
              strokeWidth="3"
              filter="drop-shadow(0 2px 8px rgba(0,0,0,0.2))"
            />
          </svg>
        </motion.button>
      </Marker>

      {showPopup && (
        <Popup
          longitude={coordinates.lng}
          latitude={coordinates.lat}
          anchor="bottom"
          offset={[0, -48]}
          onClose={() => setShowPopup(false)}
          closeButton={false}
        >
          <motion.div
            className="rounded-xl bg-white p-4 text-sm min-w-[140px]"
            style={{ boxShadow: "var(--ios-shadow)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
          >
            <p className="font-semibold text-[var(--foreground)]">Friend</p>
            <p className="text-[var(--muted)] mt-0.5 text-xs">{label}</p>
          </motion.div>
        </Popup>
      )}
    </>
  );
}
