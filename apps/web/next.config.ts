import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare CI can miss lightningcss native optional binary.
  // Disable it to avoid native module load failures during build.
  experimental: {
    useLightningcss: false,
  },
};

export default nextConfig;

// ── Cloudflare (OpenNext) ──────────────────────────────────────────────
// Efter `npm install` (som drar in @opennextjs/cloudflare), avkommentera
// raderna nedan för att exponera Cloudflare-bindningar i `next dev`.
// (Krävs inte för den här appen som läser process.env direkt, men skadar inte.)
//
// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
// initOpenNextCloudflareForDev();
