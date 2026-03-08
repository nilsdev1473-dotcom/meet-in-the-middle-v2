"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store";
import { Toast } from "@/components/ui/Toast";

export function LocationDetector() {
  const { setUserLocation } = useMapStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Your location",
        });
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Could not detect your location. Please enable location services.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [setUserLocation]);

  return (
    <Toast
      message={error || ""}
      variant="error"
      visible={!!error}
      onDismiss={() => setError(null)}
    />
  );
}
