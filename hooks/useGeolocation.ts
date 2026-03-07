"use client";

import { useState, useEffect, useCallback } from "react";
import type { Coordinates } from "@/lib/types";

export type GeolocationStatus = "idle" | "loading" | "success" | "error" | "denied";

export interface GeolocationState {
  coordinates: Coordinates | null;
  address: string | null;
  status: GeolocationStatus;
  error: string | null;
  retry: () => void;
}

export function useGeolocation(): GeolocationState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by your browser");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoordinates(coords);
        setStatus("success");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setError("Location access was denied. Please enter your location manually.");
        } else if (err.code === err.TIMEOUT) {
          setStatus("error");
          setError("Location request timed out. Please try again.");
        } else {
          setStatus("error");
          setError("Unable to determine your location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    coordinates,
    address,
    status,
    error,
    retry: requestLocation,
  };
}
