import type { Coordinates } from "./types";

/**
 * Calculate the geographic midpoint (average lat/lng) of an array of coordinates.
 * Throws if the array is empty.
 */
export function calculateCenter(locations: Coordinates[]): Coordinates {
  if (locations.length === 0) {
    throw new Error("calculateCenter requires at least one coordinate");
  }
  const sum = locations.reduce(
    (acc, loc) => ({ lat: acc.lat + loc.lat, lng: acc.lng + loc.lng }),
    { lat: 0, lng: 0 }
  );
  return {
    lat: sum.lat / locations.length,
    lng: sum.lng / locations.length,
  };
}

/**
 * Calculate the SW/NE bounding box for an array of coordinates with optional padding.
 */
export function calculateBounds(
  locations: Coordinates[],
  paddingPercent: number = 20
): { sw: Coordinates; ne: Coordinates } {
  if (locations.length === 0) {
    throw new Error("calculateBounds requires at least one coordinate");
  }

  const lats = locations.map((l) => l.lat);
  const lngs = locations.map((l) => l.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latPad = ((maxLat - minLat) * paddingPercent) / 100;
  const lngPad = ((maxLng - minLng) * paddingPercent) / 100;

  return {
    sw: { lat: minLat - latPad, lng: minLng - lngPad },
    ne: { lat: maxLat + latPad, lng: maxLng + lngPad },
  };
}

const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate the distance between two coordinates using the Haversine formula.
 * Returns distance in meters.
 */
export function calculateDistance(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

/**
 * Format a distance in meters to a human-readable string.
 * Returns '250m' under 1000m, '1.2km' above.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
