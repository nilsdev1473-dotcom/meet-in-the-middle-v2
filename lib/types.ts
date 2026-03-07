export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  coordinates: Coordinates;
  address: string;
  label: string;
}

export interface Venue {
  id: string;
  name: string;
  type: "bar" | "cafe" | "restaurant";
  coordinates: Coordinates;
  distance: number;
  address: string;
}

export interface MapState {
  userLocation: Location | null;
  friendLocation: Location | null;
  centerLocation: Location | null;
  venues: Venue[];
}
