"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useMapStore } from "@/lib/store";
import { geocodeAddress } from "@/lib/geocoding";
import { Toast } from "@/components/ui/Toast";

export function FriendInput() {
  const { setFriendLocation } = useMapStore();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await geocodeAddress(address);
      if (result) {
        setFriendLocation({
          lat: result.lat,
          lng: result.lng,
          address: result.displayName || address,
        });
        setAddress("");
      } else {
        setError("Could not find that address. Please try again.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Failed to geocode address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1D1D1F] mb-2">
              Where is your friend?
            </h2>
            <p className="text-sm text-[#86868B]">
              Enter their address to find a meetup spot
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter an address..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !address.trim()}
              className="shrink-0"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>

      <Toast
        message={error || ""}
        variant="error"
        visible={!!error}
        onDismiss={() => setError(null)}
      />
    </>
  );
}
