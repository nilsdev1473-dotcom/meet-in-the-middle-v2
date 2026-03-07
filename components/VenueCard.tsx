"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Coffee, Beer, UtensilsCrossed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDistance } from "@/lib/geo-utils";
import type { Venue } from "@/lib/types";

export interface VenueCardProps {
  venue: Venue;
}

const typeIcons = {
  cafe: Coffee,
  bar: Beer,
  restaurant: UtensilsCrossed,
} as const;

export function VenueCard({ venue }: VenueCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = typeIcons[venue.type];

  const handleDirections = () => {
    const { lat, lng } = venue.coordinates;
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/i.test(ua);
    const url = isApple
      ? `maps.apple.com/?daddr=${lat},${lng}`
      : `https://maps.google.com/?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className="rounded-2xl bg-[var(--card-bg)] p-6 min-w-[240px] flex flex-col gap-3"
      style={{ boxShadow: "var(--ios-shadow)" }}
      whileHover={
        prefersReducedMotion
          ? {}
          : { scale: 1.02, boxShadow: "var(--ios-shadow-lg)" }
      }
      transition={
        prefersReducedMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }
      }
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white" style={{ boxShadow: "var(--ios-shadow-sm)" }}>
          <Icon className="w-5 h-5 text-[var(--ios-blue)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[var(--foreground)] truncate">
            {venue.name}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {formatDistance(venue.distance)}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleDirections}>
        Directions
      </Button>
    </motion.div>
  );
}
