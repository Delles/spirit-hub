"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a value, updating the debounced value
 * only after the specified delay has passed since the last change.
 * 
 * Useful for search inputs to prevent excessive API calls or computations.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState("");
 * const debouncedQuery = useDebouncedValue(searchQuery, 300);
 * 
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     // Perform search with debouncedQuery
 *   }
 * }, [debouncedQuery]);
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay completes
    // or if component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}






