"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
    title: string;
    text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
    return (
        <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
            onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({
                        title,
                        text,
                        url: window.location.href
                    }).catch(() => { });
                } else {
                    // Fallback for desktop or browsers without share API
                    // For now just copy to clipboard
                    navigator.clipboard.writeText(`"${text}" ${window.location.href}`);
                    alert("Mesaj copiat în clipboard!");
                }
            }}
        >
            <Share2 className="w-4 h-4" />
            <span>Deschide inima și dă mai departe</span>
        </button>
    );
}
