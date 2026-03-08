"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Dynamic import to avoid SSR issues with Leaflet
const MapViewInner = dynamic(
  () => import("./MapViewInner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-[#F5F5F7]">
        <LoadingSpinner />
      </div>
    ),
  }
);

export function MapView() {
  return <MapViewInner />;
}
