import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix: Playwright spawns a real Chromium process and cannot be bundled by Next.js.
  // Without this, `playwright` import fails silently at runtime in API routes.
  serverExternalPackages: ["playwright", "playwright-core"],
};

export default nextConfig;
