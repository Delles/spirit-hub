"use client";

import { useState, useEffect, useRef } from "react";

export type ShareContentType =
    | 'calea-vietii'
    | 'destin'
    | 'numar-zilnic'
    | 'compatibilitate'
    | 'energia-zilei'
    | 'mesaj-zilnic';

/** Single image format for all social sharing (Story 9:16 for Instagram/TikTok) */
const SHARE_IMAGE_FORMAT = 'story';

interface UsePrefetchShareImageOptions {
    contentType?: ShareContentType;
    contentId?: string | number;
}

interface PrefetchResult {
    imageBlob: Blob | null;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Hook to prefetch share image when component mounts.
 * This starts loading the OG image immediately so it's ready when user wants to share.
 */
export function usePrefetchShareImage({
    contentType,
    contentId
}: UsePrefetchShareImageOptions): PrefetchResult {
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        // Skip if no content type/id or already fetched
        if (!contentType || !contentId || fetchedRef.current) return;

        // Prevent duplicate fetches
        fetchedRef.current = true;

        const fetchImage = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const imageUrl = `/api/og/${contentType}/${contentId}?format=${SHARE_IMAGE_FORMAT}`;
                const response = await fetch(imageUrl);

                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status}`);
                }

                const blob = await response.blob();
                setImageBlob(blob);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
                console.error('Failed to prefetch share image:', err);
            } finally {
                setIsLoading(false);
            }
        };

        // Start prefetching after a short delay to not block initial render
        const timeoutId = setTimeout(fetchImage, 500);

        return () => clearTimeout(timeoutId);
    }, [contentType, contentId]);

    return { imageBlob, isLoading, error };
}
