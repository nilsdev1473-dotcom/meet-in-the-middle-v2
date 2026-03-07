import type { Location, Coordinates } from "./types";

const GEOCODING_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";

interface MapboxFeature {
  id: string;
  place_name: string;
  text: string;
  center: [number, number]; // [lng, lat]
}

interface MapboxGeocodeResponse {
  features: MapboxFeature[];
  message?: string;
}

function getToken(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    throw new Error(
      "NEXT_PUBLIC_MAPBOX_TOKEN is not set. Add it to your .env.local file."
    );
  }
  return token;
}

/**
 * Geocode an address query using the Mapbox Geocoding API.
 * Returns up to 5 results typed as Location[].
 */
export async function geocodeAddress(
  query: string,
  proximity?: Coordinates
): Promise<Location[]> {
  const token = getToken();
  const encoded = encodeURIComponent(query);

  const params = new URLSearchParams({
    access_token: token,
    limit: "5",
    types: "place,address,poi",
  });

  if (proximity) {
    params.set("proximity", `${proximity.lng},${proximity.lat}`);
  }

  const url = `${GEOCODING_BASE}/${encoded}.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(
      body.message ?? `Geocoding request failed with status ${response.status}`
    );
  }

  const data = (await response.json()) as MapboxGeocodeResponse;

  return data.features.map((feature) => ({
    id: feature.id,
    coordinates: {
      lat: feature.center[1],
      lng: feature.center[0],
    },
    address: feature.place_name,
    label: feature.text,
  }));
}

/**
 * Reverse geocode coordinates to a place name string.
 */
export async function reverseGeocode(coords: Coordinates): Promise<string> {
  const token = getToken();

  const params = new URLSearchParams({
    access_token: token,
    types: "place,address,poi",
    limit: "1",
  });

  const url = `${GEOCODING_BASE}/${coords.lng},${coords.lat}.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(
      body.message ??
        `Reverse geocoding request failed with status ${response.status}`
    );
  }

  const data = (await response.json()) as MapboxGeocodeResponse;

  if (data.features.length === 0) {
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  }

  return data.features[0].place_name;
}
