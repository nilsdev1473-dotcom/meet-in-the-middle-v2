import type { Venue, Coordinates } from "./types";
import { calculateDistance, formatDistance } from "./geo-utils";
import { reverseGeocode } from "./mapbox-geocoding";

const GEOCODING_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const VENUE_TYPES = ["bar", "cafe", "restaurant"] as const;

function getToken(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
  return token;
}

interface MapboxPoiFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  properties: {
    category?: string;
    maki?: string;
  };
}

interface MapboxPoiResponse {
  features: MapboxPoiFeature[];
}

function guessVenueType(
  feature: MapboxPoiFeature
): "bar" | "cafe" | "restaurant" {
  const category = (feature.properties.category ?? "").toLowerCase();
  const maki = (feature.properties.maki ?? "").toLowerCase();
  const name = feature.text.toLowerCase();

  if (
    category.includes("bar") ||
    category.includes("pub") ||
    maki.includes("bar") ||
    name.includes("bar") ||
    name.includes("pub")
  ) {
    return "bar";
  }
  if (
    category.includes("cafe") ||
    category.includes("coffee") ||
    maki.includes("cafe") ||
    maki.includes("coffee") ||
    name.includes("cafe") ||
    name.includes("coffee")
  ) {
    return "cafe";
  }
  return "restaurant";
}

/**
 * Fetch nearby venues (bars, cafes, restaurants) within radiusMeters of center.
 * Uses Mapbox Geocoding API POI search. Returns max 10 results.
 */
export async function fetchNearbyVenues(
  center: Coordinates,
  radiusMeters: number = 500
): Promise<Venue[]> {
  const token = getToken();
  const results: Venue[] = [];

  // Fetch each category and merge
  for (const type of VENUE_TYPES) {
    const params = new URLSearchParams({
      access_token: token,
      limit: "5",
      types: "poi",
      proximity: `${center.lng},${center.lat}`,
    });

    const query = encodeURIComponent(type);
    const url = `${GEOCODING_BASE}/${query}.json?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      const data = (await response.json()) as MapboxPoiResponse;

      for (const feature of data.features) {
        const coords: Coordinates = {
          lat: feature.center[1],
          lng: feature.center[0],
        };

        const distMeters = calculateDistance(center, coords);
        if (distMeters > radiusMeters) continue;

        // Avoid duplicates
        if (results.some((v) => v.id === feature.id)) continue;

        results.push({
          id: feature.id,
          name: feature.text,
          type: guessVenueType(feature),
          coordinates: coords,
          distance: distMeters,
          address: feature.place_name,
        });
      }
    } catch {
      // Silently skip failed category fetches
    }
  }

  // Sort by distance, limit to 10
  results.sort((a, b) => a.distance - b.distance);
  return results.slice(0, 10);
}

export { formatDistance };
export type { Venue };
