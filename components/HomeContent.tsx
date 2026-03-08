"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MapboxMap, type MapboxMapHandle } from "@/components/Map/MapboxMap";
import { UserMarker } from "@/components/Map/UserMarker";
import { FriendMarker } from "@/components/Map/FriendMarker";
import { CenterMarker } from "@/components/Map/CenterMarker";
import { LocationDetector } from "@/components/LocationDetector";
import { FriendInput } from "@/components/FriendInput";
import { VenueList } from "@/components/VenueList";
import { ShareButton } from "@/components/ShareButton";
import { useMapCenter } from "@/hooks/useMapCenter";
import { fetchNearbyVenues } from "@/lib/venues";
import { reverseGeocode } from "@/lib/mapbox-geocoding";
import type { MapState, Location, Venue } from "@/lib/types";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_ITEM_VARIANTS,
  SPRING_CONFIG,
} from "@/lib/motion";

export interface HomeContentProps {
  initialLat?: number;
  initialLng?: number;
}

export function HomeContent({ initialLat, initialLng }: HomeContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const mapRef = useRef<MapboxMapHandle | null>(null);

  const [mapState, setMapState] = useState<MapState>({
    userLocation: null,
    friendLocation: null,
    centerLocation: null,
    venues: [],
  });
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [friendLocated, setFriendLocated] = useState(false);

  const setUserLocation = useCallback((loc: Location) => {
    setMapState((prev) => ({ ...prev, userLocation: loc }));
  }, []);

  const setFriendLocation = useCallback((loc: Location) => {
    setFriendLocated(true);
    setMapState((prev) => ({ ...prev, friendLocation: loc }));
  }, []);

  const setCenterLocation = useCallback((loc: Location) => {
    setMapState((prev) => ({ ...prev, centerLocation: loc }));
  }, []);

  const setVenues = useCallback((venues: Venue[]) => {
    setMapState((prev) => ({ ...prev, venues }));
  }, []);

  // Fly to shared link coords on mount
  useEffect(() => {
    if (initialLat !== undefined && initialLng !== undefined) {
      const centerLoc: Location = {
        id: "shared-center",
        coordinates: { lat: initialLat, lng: initialLng },
        address: "Shared meetup point",
        label: "Meet Here",
      };
      setCenterLocation(centerLoc);
      // Fly map after it mounts
      const timer = setTimeout(() => {
        mapRef.current?.flyTo({ lat: initialLat, lng: initialLng }, 14);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialLat, initialLng, setCenterLocation]);

  // Auto-calculate center and fit bounds when both locations set
  useMapCenter({
    userLocation: mapState.userLocation,
    friendLocation: mapState.friendLocation,
    onCenterCalculated: setCenterLocation,
    mapRef,
  });

  // Fetch venues when center is calculated
  useEffect(() => {
    if (!mapState.centerLocation) return;
    const { coordinates } = mapState.centerLocation;

    setVenuesLoading(true);
    fetchNearbyVenues(coordinates)
      .then(setVenues)
      .catch(() => setVenues([]))
      .finally(() => setVenuesLoading(false));
  }, [mapState.centerLocation, setVenues]);

  // Geocode user location address after success
  const userLat = mapState.userLocation?.coordinates.lat;
  const userLng = mapState.userLocation?.coordinates.lng;
  const userAddress = mapState.userLocation?.address;
  useEffect(() => {
    if (!userLat || !userLng || userAddress !== "Your location") return;
    if (userLat === 0 && userLng === 0) return;

    reverseGeocode({ lat: userLat, lng: userLng })
      .then((address) => {
        setMapState((prev) => ({
          ...prev,
          userLocation: prev.userLocation
            ? { ...prev.userLocation, address, label: address }
            : null,
        }));
      })
      .catch(() => {});
  }, [userLat, userLng, userAddress]);

  const springConfig = prefersReducedMotion ? { duration: 0 } : SPRING_CONFIG;

  const markers = (
    <>
      <AnimatePresence>
        {mapState.userLocation && (
          <UserMarker
            key="user"
            coordinates={mapState.userLocation.coordinates}
            label={mapState.userLocation.address}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mapState.friendLocation && (
          <FriendMarker
            key="friend"
            coordinates={mapState.friendLocation.coordinates}
            label={mapState.friendLocation.address}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mapState.centerLocation && (
          <CenterMarker
            key="center"
            coordinates={mapState.centerLocation.coordinates}
            label={mapState.centerLocation.address}
          />
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {/* Mobile Layout (<1024px) */}
      <div className="lg:hidden relative h-screen w-screen overflow-hidden">
        {/* Full-screen map */}
        <div className="absolute inset-0">
          <MapboxMap ref={mapRef} markers={markers} />
        </div>

        {/* Location detection overlay (top) */}
        {!mapState.userLocation && (
          <div className="absolute top-4 left-4 right-16 z-10">
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-4"
              style={{ boxShadow: "var(--ios-shadow-lg)" }}>
              <LocationDetector onLocationFound={setUserLocation} />
            </div>
          </div>
        )}

        {/* Friend input (bottom floating) */}
        <AnimatePresence>
          {!friendLocated && (
            <FriendInput
              key="friend-input"
              onFriendLocated={setFriendLocation}
              userCoordinates={mapState.userLocation?.coordinates}
            />
          )}
        </AnimatePresence>

        {/* Venue panel (slides up from bottom after center found) */}
        <AnimatePresence>
          {mapState.centerLocation && (
            <motion.div
              key="venue-panel"
              className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl p-4"
              style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.12)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={springConfig}
            >
              <div className="w-10 h-1 bg-[var(--muted)] rounded-full mx-auto mb-4 opacity-40" />
              <h3 className="font-semibold text-base text-[var(--foreground)] mb-3">
                Nearby Venues
              </h3>
              <VenueList venues={mapState.venues} loading={venuesLoading} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share button */}
        <ShareButton centerLocation={mapState.centerLocation} />
      </div>

      {/* Desktop Layout (≥1024px) */}
      <div className="hidden lg:flex h-screen w-screen overflow-hidden">
        {/* Left panel */}
        <motion.div
          className="w-[400px] flex-shrink-0 overflow-y-auto p-8 bg-[var(--background)] border-r border-[#E5E5EA]"
          variants={PAGE_CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.h1
            className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent"
            variants={prefersReducedMotion ? {} : PAGE_ITEM_VARIANTS}
          >
            Meet in the Middle
          </motion.h1>

          {/* Location detector */}
          <motion.div
            className="mb-6"
            variants={prefersReducedMotion ? {} : PAGE_ITEM_VARIANTS}
          >
            <p className="text-sm font-medium text-[var(--muted)] mb-2 uppercase tracking-wide text-xs">
              Your Location
            </p>
            {mapState.userLocation ? (
              <div className="rounded-xl bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--foreground)]"
                style={{ boxShadow: "var(--ios-shadow-sm)" }}>
                <p className="font-medium truncate">{mapState.userLocation.label}</p>
              </div>
            ) : (
              <LocationDetector onLocationFound={setUserLocation} />
            )}
          </motion.div>

          {/* Friend input inline */}
          <motion.div
            className="mb-6"
            variants={prefersReducedMotion ? {} : PAGE_ITEM_VARIANTS}
          >
            <AnimatePresence mode="wait">
              {!friendLocated ? (
                <FriendInput
                  key="friend-input-desktop"
                  onFriendLocated={setFriendLocation}
                  userCoordinates={mapState.userLocation?.coordinates}
                  inline
                />
              ) : (
                mapState.friendLocation && (
                  <motion.div
                    key="friend-confirmed"
                    className="rounded-xl bg-[var(--card-bg)] px-4 py-3 text-sm"
                    style={{ boxShadow: "var(--ios-shadow-sm)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  >
                    <p className="text-xs text-[var(--muted)] mb-0.5">Friend&apos;s location</p>
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {mapState.friendLocation.label}
                    </p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>

          {/* Venue list */}
          <AnimatePresence>
            {mapState.centerLocation && (
              <motion.div
                key="venues-desktop"
                variants={prefersReducedMotion ? {} : PAGE_ITEM_VARIANTS}
                initial="hidden"
                animate="visible"
              >
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">
                  Nearby Venues
                </p>
                <VenueList venues={mapState.venues} loading={venuesLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapboxMap ref={mapRef} markers={markers} />
          <ShareButton centerLocation={mapState.centerLocation} />
        </div>
      </div>
    </>
  );
}
