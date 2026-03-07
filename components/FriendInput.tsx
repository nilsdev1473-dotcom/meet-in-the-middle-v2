"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { geocodeAddress } from "@/lib/mapbox-geocoding";
import type { Location } from "@/lib/types";

export interface FriendInputProps {
  onFriendLocated: (location: Location) => void;
  userCoordinates?: { lat: number; lng: number };
  /** When true, renders inline (not fixed-positioned floating) */
  inline?: boolean;
}

export function FriendInput({
  onFriendLocated,
  userCoordinates,
  inline = false,
}: FriendInputProps) {
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 30 };

  const fetchSuggestions = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results = await geocodeAddress(q, userCoordinates);
        setSuggestions(results);
      } catch {
        setError("Failed to load suggestions");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [userCoordinates]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  const selectLocation = useCallback(
    async (location: Location) => {
      setLoading(true);
      setError(null);
      setSuggestions([]);
      setQuery(location.label);
      try {
        setDone(true);
        onFriendLocated(location);
      } catch {
        setError("Could not confirm location. Please try again.");
        setLoading(false);
        setDone(false);
      }
    },
    [onFriendLocated]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      setSuggestions([]);
      setHighlightedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        selectLocation(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0 && suggestions[0]) {
        selectLocation(suggestions[0]);
      }
    }
  };

  const gradientBorderStyle = {
    background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    padding: "1px",
    borderRadius: "16px",
  };

  const cardStyle = {
    borderRadius: "15px",
    background: "white",
  };

  const containerClass = inline
    ? "w-full"
    : "fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={containerClass}
          initial={inline ? false : { y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: inline ? 0 : 120, opacity: 0 }}
          transition={springConfig}
        >
          <div style={gradientBorderStyle}>
            <div style={cardStyle} className="p-5">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] mb-4">
                Where is your friend?
              </h2>
              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder="Enter friend's address..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  rightSlot={
                    loading ? (
                      <LoadingSpinner size="sm" color="var(--ios-blue)" />
                    ) : null
                  }
                  autoComplete="off"
                />

                {/* Autocomplete dropdown */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.ul
                      className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-xl overflow-hidden"
                      style={{ boxShadow: "var(--ios-shadow-lg)" }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
                    >
                      {suggestions.map((loc, idx) => (
                        <li key={loc.id}>
                          <button
                            type="button"
                            className={[
                              "w-full text-left px-4 py-3 cursor-pointer min-h-[44px]",
                              "flex flex-col gap-0.5 transition-colors",
                              idx === highlightedIndex
                                ? "bg-[#F5F5F7]"
                                : "hover:bg-[#F5F5F7]",
                            ].join(" ")}
                            onClick={() => selectLocation(loc)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                          >
                            <span className="font-semibold text-sm text-[var(--foreground)] truncate">
                              {loc.label}
                            </span>
                            <span className="text-xs text-[var(--muted)] truncate">
                              {loc.address}
                            </span>
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
