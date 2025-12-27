// scripts/generate-pwa-icons.ts
// Run with: bun run scripts/generate-pwa-icons.ts

import sharp from "sharp";
import { join } from "path";

const sourceImage =
    "C:/Users/cfmar/.gemini/antigravity/brain/4e81e4ad-8ecb-4006-8c68-0b65ceebd2de/pwa_icon_1766829429416.png";

const outputDir = join(import.meta.dir, "..", "public");
const appDir = join(import.meta.dir, "..", "app");

async function generateIcons() {
    console.log("Generating PWA icons and favicons...");

    // Generate 192x192 PWA icon
    await sharp(sourceImage)
        .resize(192, 192, { fit: "cover" })
        .png()
        .toFile(join(outputDir, "icon-192.png"));
    console.log("✓ Created icon-192.png");

    // Generate 512x512 PWA icon
    await sharp(sourceImage)
        .resize(512, 512, { fit: "cover" })
        .png()
        .toFile(join(outputDir, "icon-512.png"));
    console.log("✓ Created icon-512.png");

    // Generate favicon.ico (32x32 - Next.js convention in app dir)
    await sharp(sourceImage)
        .resize(32, 32, { fit: "cover" })
        .toFile(join(appDir, "favicon.ico"));
    console.log("✓ Created app/favicon.ico (32x32)");

    // Generate apple-touch-icon (180x180 - for iOS home screen)
    await sharp(sourceImage)
        .resize(180, 180, { fit: "cover" })
        .png()
        .toFile(join(appDir, "apple-icon.png"));
    console.log("✓ Created app/apple-icon.png (180x180)");

    // Generate icon.png for Next.js (used as default)
    await sharp(sourceImage)
        .resize(32, 32, { fit: "cover" })
        .png()
        .toFile(join(appDir, "icon.png"));
    console.log("✓ Created app/icon.png (32x32)");

    console.log("\nDone! All icons generated.");
}

generateIcons().catch(console.error);
