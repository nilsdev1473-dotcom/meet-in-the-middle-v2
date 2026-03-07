"use client";

import dynamic from "next/dynamic";
import type { MapboxMapHandle, MapboxMapProps } from "./MapboxMapInner";
import { forwardRef } from "react";

// Dynamic import with SSR disabled to prevent hydration mismatch from mapbox-gl
const MapboxMapInner = dynamic(
  () =>
    import("./MapboxMapInner").then((mod) => ({
      default: forwardRef<MapboxMapHandle, MapboxMapProps>(
        function DynamicMapboxMapInner(props, ref) {
          return <mod.MapboxMapInner {...props} ref={ref} />;
        }
      ),
    })),
  { ssr: false }
);

export type { MapboxMapHandle, MapboxMapProps };

export const MapboxMap = forwardRef<MapboxMapHandle, MapboxMapProps>(
  function MapboxMap(props, ref) {
    return <MapboxMapInner {...props} ref={ref} />;
  }
);
