import { create } from "zustand";

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Venue {
  id: string;
  name: string;
  type: "bar" | "cafe" | "restaurant" | "pub";
  lat: number;
  lng: number;
  distance: number;
  address?: string;
  coordinates: { lat: number; lng: number };
}

interface MapStore {
  userLocation: Location | null;
  friendLocation: Location | null;
  center: Location | null;
  venues: Venue[];
  setUserLocation: (location: Location | null) => void;
  setFriendLocation: (location: Location | null) => void;
  setCenter: (location: Location | null) => void;
  setVenues: (venues: Venue[]) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  userLocation: null,
  friendLocation: null,
  center: null,
  venues: [],
  setUserLocation: (location) => set({ userLocation: location }),
  setFriendLocation: (location) => set({ friendLocation: location }),
  setCenter: (location) => set({ center: location }),
  setVenues: (venues) => set({ venues }),
}));
