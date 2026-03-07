"use client";

import { useEffect, useRef, useCallback } from "react";
import { calculateCenter, calculateBounds } from "@/lib/geo-utils";
import type { Location, Coordinates } from "@/lib/types";
import type { MapboxMapHandle } from "@/components/Map/MapboxMap";

export interface UseMapCenterOptions {
  userLocation: Location | null;
  friendLocation: Location | null;
  onCenterCalculated: (center: Location) => void;
  mapRef: React.RefObject<MapboxMapHandle | null>;
}

export function useMapCenter({
  userLocation,
  friendLocation,
  onCenterCalculated,
  mapRef,
}: UseMapCenterOptions): void {
  const prevUserRef = useRef<Coordinates | null>(null);
  const prevFriendRef = useRef<Coordinates | null>(null);

  const fitMapBounds = useCallback(
    (user: Coordinates, friend: Coordinates, center: Coordinates) => {
      const bounds = calculateBounds([user, friend, center], 20);
      mapRef.current?.fitBounds(bounds.sw, bounds.ne, {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80,
      });
    },
    [mapRef]
  );

  useEffect(() => {
    if (!userLocation || !friendLocation) return;

    const userCoords = userLocation.coordinates;
    const friendCoords = friendLocation.coordinates;

    // Skip if coordinates haven't changed
    if (
      prevUserRef.current?.lat === userCoords.lat &&
      prevUserRef.current?.lng === userCoords.lng &&
      prevFriendRef.current?.lat === friendCoords.lat &&
      prevFriendRef.current?.lng === friendCoords.lng
    ) {
      return;
    }

    prevUserRef.current = userCoords;
    prevFriendRef.current = friendCoords;

    const centerCoords = calculateCenter([userCoords, friendCoords]);

    const centerLocation: Location = {
      id: "center",
      coordinates: centerCoords,
      address: "Meeting point",
      label: "Meet Here",
    };

    onCenterCalculated(centerLocation);
    fitMapBounds(userCoords, friendCoords, centerCoords);
  }, [userLocation, friendLocation, onCenterCalculated, fitMapBounds]);
}
