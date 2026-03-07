"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import Map, {
  NavigationControl,
  type MapRef,
} from "react-map-gl";
import type { Coordinates } from "@/lib/types";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapboxMapHandle {
  flyTo: (coords: Coordinates, zoom?: number) => void;
  fitBounds: (
    sw: Coordinates,
    ne: Coordinates,
    padding?: { top: number; bottom: number; left: number; right: number }
  ) => void;
}

export interface MapboxMapProps {
  markers?: ReactNode;
  onMapClick?: (coords: Coordinates) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MapboxMapInner = forwardRef<MapboxMapHandle, MapboxMapProps>(
  function MapboxMapInner({ markers, onMapClick }, ref) {
    const mapRef = useRef<MapRef>(null);

    useImperativeHandle(ref, () => ({
      flyTo(coords: Coordinates, zoom = 14) {
        mapRef.current?.flyTo({
          center: [coords.lng, coords.lat],
          zoom,
          speed: 1.2,
          curve: 1.42,
          essential: true,
        });
      },
      fitBounds(
        sw: Coordinates,
        ne: Coordinates,
        padding = { top: 80, bottom: 80, left: 80, right: 80 }
      ) {
        mapRef.current?.fitBounds(
          [
            [sw.lng, sw.lat],
            [ne.lng, ne.lat],
          ],
          { padding, speed: 1.2, curve: 1.42, essential: true }
        );
      },
    }));

    if (!MAPBOX_TOKEN) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-[var(--card-bg)] p-6">
          <ErrorBanner
            message="Map token missing — add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local"
            visible
          />
        </div>
      );
    }

    return (
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        onClick={(e) => {
          if (onMapClick) {
            onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          }
        }}
      >
        <NavigationControl position="top-right" />
        {markers}
      </Map>
    );
  }
);
