/** @type {import('next').NextConfig} */
const nextConfig = {
  // Base path for production deployment behind nginx proxy
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  // Asset prefix for static assets
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",

  async rewrites() {
    const publicApiUrl = process.env.NEXT_PUBLIC_APP_URL.trim();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL.trim();
    const useProxyMode =
      publicApiUrl === "/api-proxy" ||
      Boolean(publicApiUrl?.startsWith("/api-proxy/"));

    if (!useProxyMode) {
      return [];
    }

    if (!apiBaseUrl) {
      throw new Error(
        "Missing NEXT_PUBLIC_API_URL: set NEXT_PUBLIC_API_URL when NEXT_PUBLIC_APP_URL uses /api-proxy"
      );
    }

    const parsed = new URL(apiBaseUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("NEXT_PUBLIC_API_URL must use http or https protocol");
    }
    const normalizedBaseUrl = parsed.toString().replace(/\/$/, "");

    return [
      {
        source: "/api-proxy/:path*",
        destination: `${normalizedBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
// Trigger Build: 0