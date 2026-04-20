/** @type {import('next').NextConfig} */
const nextConfig = {
  // Base path for production deployment behind nginx proxy
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  // Asset prefix for static assets
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",

  async rewrites() {
    const publicApiUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!apiBaseUrl) {
      return [];
    }

    const parsed = new URL(apiBaseUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("NEXT_PUBLIC_API_URL must use http or https protocol");
    }
    const normalizedBaseUrl = parsed.toString().replace(/\/$/, "");

    const ionServices = [
      "ion-user-service",
      "ion-branch-service",
      "ion-order-service",
      "ion-networking-service",
      "ion-rule-scheme-service",
    ];

    const serviceRewrites = ionServices.map((svc) => ({
      source: `/${svc}/:path*`,
      destination: `${normalizedBaseUrl}/${svc}/:path*`,
    }));

    const useProxyMode =
      publicApiUrl === "/api-proxy" ||
      Boolean(publicApiUrl?.startsWith("/api-proxy/"));

    if (useProxyMode) {
      serviceRewrites.push({
        source: "/api-proxy/:path*",
        destination: `${normalizedBaseUrl}/:path*`,
      });
    }

    return serviceRewrites;
  },
};

export default nextConfig;
// Trigger Build: 0