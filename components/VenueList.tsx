"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { VenueCard } from "./VenueCard";
import type { Venue } from "@/lib/types";
import {
  LIST_CONTAINER_VARIANTS,
  LIST_ITEM_VARIANTS,
} from "@/lib/motion";

export interface VenueListProps {
  venues: Venue[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[var(--card-bg)] p-6 min-w-[240px] flex flex-col gap-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-9 bg-gray-200 rounded-lg" />
    </div>
  );
}

export function VenueList({ venues, loading = false }: VenueListProps) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:overflow-x-visible md:pb-0">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-[var(--muted)]">
        <MapPin className="w-8 h-8" />
        <p className="text-base">No venues found nearby</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex gap-4 overflow-x-auto pb-4 md:flex-col md:overflow-x-visible md:pb-0"
      variants={LIST_CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {venues.map((venue) => (
        <motion.div key={venue.id} variants={LIST_ITEM_VARIANTS}>
          <VenueCard venue={venue} />
        </motion.div>
      ))}
    </motion.div>
  );
}
