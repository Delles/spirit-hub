import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "SpiritHub.ro - Numerologie și Bioritm",
        short_name: "SpiritHub",
        description:
            "Platformă spirituală românească pentru numerologie și bioritm. Descoperă-ți numărul destinului.",
        start_url: "/",
        display: "standalone",
        background_color: "#0C0B10",
        theme_color: "#9F2BFF",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}
