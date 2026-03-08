import type { Venue } from "./store";

export async function fetchNearbyVenues(
  lat: number,
  lng: number,
  radiusMeters: number = 500
): Promise<Venue[]> {
  try {
    // Overpass API query for bars, cafes, restaurants
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"bar|cafe|restaurant|pub"](around:${radiusMeters},${lat},${lng});
        way["amenity"~"bar|cafe|restaurant|pub"](around:${radiusMeters},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch venues from Overpass API");
    }

    const data = await response.json();

    const venues: Venue[] = data.elements
      .filter((el: any) => el.tags && el.tags.name && (el.lat || el.center))
      .map((el: any) => {
        const venueLat = el.lat || el.center?.lat || lat;
        const venueLng = el.lon || el.center?.lon || lng;
        const distance = calculateDistance(lat, lng, venueLat, venueLng);
        const amenityType = el.tags.amenity as "bar" | "cafe" | "restaurant" | "pub";

        return {
          id: `${el.type}-${el.id}`,
          name: el.tags.name,
          lat: venueLat,
          lng: venueLng,
          type: amenityType,
          distance,
          address: el.tags["addr:full"] || "",
          coordinates: { lat: venueLat, lng: venueLng },
        };
      })
      .sort((a: Venue, b: Venue) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 10); // Limit to 10 results

    return venues;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return [];
  }
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
