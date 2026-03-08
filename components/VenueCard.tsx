"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Coffee, Beer, UtensilsCrossed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Venue } from "@/lib/store";

export interface VenueCardProps {
  venue: Venue;
}

const typeIcons = {
  cafe: Coffee,
  bar: Beer,
  pub: Beer,
  restaurant: UtensilsCrossed,
} as const;

export function VenueCard({ venue }: VenueCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = typeIcons[venue.type];

  const handleDirections = () => {
    const { lat, lng } = venue;
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/i.test(ua);
    const url = isApple
      ? `maps.apple.com/?daddr=${lat},${lng}`
      : `https://maps.google.com/?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return "";
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#007AFF]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#1D1D1F] text-sm truncate">
            {venue.name}
          </h3>
          <p className="text-xs text-[#86868B] mt-0.5">
            {formatDistance(venue.distance)}
          </p>
        </div>

        <Button
          onClick={handleDirections}
          size="sm"
          variant="ghost"
          className="shrink-0"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
