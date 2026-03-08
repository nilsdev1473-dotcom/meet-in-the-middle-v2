"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapStore } from "@/lib/store";

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom markers with iOS/Arc styling
const createUserIcon = () =>
  L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: #007AFF;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      "></div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createFriendIcon = () =>
  L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      "></div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createCenterIcon = () =>
  L.divIcon({
    html: `
      <div style="
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
      </style>
    `,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

// Auto-fit bounds when locations change
function AutoFitBounds() {
  const map = useMap();
  const { userLocation, friendLocation, center } = useMapStore();
  const prevBoundsRef = useRef<string>("");

  useEffect(() => {
    const locations = [userLocation, friendLocation, center].filter(Boolean);
    if (locations.length === 0) return;

    const boundsKey = JSON.stringify(locations);
    if (boundsKey === prevBoundsRef.current) return;
    prevBoundsRef.current = boundsKey;

    const bounds = L.latLngBounds(locations.map((loc) => [loc!.lat, loc!.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [map, userLocation, friendLocation, center]);

  return null;
}

export default function MapViewInner() {
  const { userLocation, friendLocation, center } = useMapStore();

  return (
    <MapContainer
      center={[48.8566, 2.3522]} // Paris default
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
    >
      {/* 2GIS Tiles - Clean, modern, no auth required */}
      <TileLayer
        url="https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}"
        attribution='&copy; <a href="https://2gis.com">2GIS</a>'
        maxZoom={18}
      />

      <AutoFitBounds />

      {/* User marker (blue) */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
          <Popup>
            <div className="text-sm font-medium">Your location</div>
          </Popup>
        </Marker>
      )}

      {/* Friend marker (purple-pink gradient) */}
      {friendLocation && (
        <Marker position={[friendLocation.lat, friendLocation.lng]} icon={createFriendIcon()}>
          <Popup>
            <div className="text-sm font-medium">{friendLocation.address || "Friend's location"}</div>
          </Popup>
        </Marker>
      )}

      {/* Center marker (gold, pulsing) */}
      {center && (
        <Marker position={[center.lat, center.lng]} icon={createCenterIcon()}>
          <Popup>
            <div className="text-sm font-medium">🎯 Meet here</div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
