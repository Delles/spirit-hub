"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook that returns true only after the component has mounted on the client.
 * Returns false during SSR to prevent hydration mismatches.
 * 
 * Useful for safely accessing browser-only APIs (localStorage, window, etc.)
 * without causing SSR hydration errors.
 * 
 * @returns true if running on client, false during SSR
 * 
 * @example
 * ```tsx
 * const isClient = useClientOnly();
 * 
 * useEffect(() => {
 *   if (isClient) {
 *     // Safe to access localStorage, window, etc.
 *     const saved = localStorage.getItem("key");
 *   }
 * }, [isClient]);
 * ```
 * 
 * @example
 * ```tsx
 * const isClient = useClientOnly();
 * 
 * if (!isClient) {
 *   return <div>Loading...</div>;
 * }
 * 
 * return <div>{window.innerWidth}</div>;
 * ```
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect only runs on the client after hydration
    setIsClient(true);
  }, []);

  return isClient;
}





