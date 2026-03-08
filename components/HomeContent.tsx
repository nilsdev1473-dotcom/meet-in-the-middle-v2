"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapView } from "@/components/Map/MapView";
import { LocationDetector } from "@/components/LocationDetector";
import { FriendInput } from "@/components/FriendInput";
import { VenueList } from "@/components/VenueList";
import { ShareButton } from "@/components/ShareButton";
import { useMapStore } from "@/lib/store";
import { fetchNearbyVenues } from "@/lib/venues";
import { PAGE_CONTAINER_VARIANTS, PAGE_ITEM_VARIANTS } from "@/lib/motion";

export interface HomeContentProps {
  initialLat?: number;
  initialLng?: number;
}

export function HomeContent({ initialLat, initialLng }: HomeContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const { userLocation, friendLocation, center, venues, setCenter, setVenues } = useMapStore();
  const [venuesLoading, setVenuesLoading] = useState(false);

  // Calculate center when both locations exist
  useEffect(() => {
    if (userLocation && friendLocation) {
      const centerLat = (userLocation.lat + friendLocation.lat) / 2;
      const centerLng = (userLocation.lng + friendLocation.lng) / 2;
      setCenter({ lat: centerLat, lng: centerLng });
    } else {
      setCenter(null);
    }
  }, [userLocation, friendLocation, setCenter]);

  // Fetch venues when center changes
  useEffect(() => {
    if (!center) {
      setVenues([]);
      return;
    }

    setVenuesLoading(true);
    fetchNearbyVenues(center.lat, center.lng, 500)
      .then((venues) => {
        setVenues(venues);
      })
      .catch((error) => {
        console.error("Failed to fetch venues:", error);
        setVenues([]);
      })
      .finally(() => {
        setVenuesLoading(false);
      });
  }, [center, setVenues]);

  return (
    <motion.div
      className="relative h-screen w-full bg-[#FAFAFA] overflow-hidden"
      variants={prefersReducedMotion ? undefined : PAGE_CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {/* Map */}
      <div className="absolute inset-0">
        <MapView />
      </div>

      {/* Location Detector */}
      <LocationDetector />

      {/* Desktop Layout */}
      <div className="hidden lg:flex absolute inset-0 pointer-events-none">
        {/* Left Panel */}
        <motion.div
          className="w-[400px] h-full p-6 space-y-6 pointer-events-auto"
          variants={prefersReducedMotion ? undefined : PAGE_ITEM_VARIANTS}
        >
          <FriendInput />
          <VenueList venues={venues} loading={venuesLoading} />
        </motion.div>

        {/* Top Right */}
        <div className="absolute top-6 right-6 pointer-events-auto">
          <ShareButton centerLocation={center} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden absolute inset-x-0 top-0 p-4 pointer-events-none">
        <motion.div
          className="pointer-events-auto"
          variants={prefersReducedMotion ? undefined : PAGE_ITEM_VARIANTS}
        >
          <FriendInput />
        </motion.div>
      </div>

      <div className="lg:hidden absolute top-4 right-4 pointer-events-none">
        <div className="pointer-events-auto">
          <ShareButton centerLocation={center} />
        </div>
      </div>

      <div className="lg:hidden absolute inset-x-0 bottom-0 p-4 pointer-events-none">
        <motion.div
          className="pointer-events-auto"
          variants={prefersReducedMotion ? undefined : PAGE_ITEM_VARIANTS}
        >
          <VenueList venues={venues} loading={venuesLoading} />
        </motion.div>
      </div>
    </motion.div>
  );
}
