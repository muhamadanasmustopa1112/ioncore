/** @type {import('next').NextConfig} */
const nextConfig = {
  // Base path for production deployment behind nginx proxy
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  experimental: {
    optimizePackageImports: ["@/components/ui"],
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.ionlabs.dev" },
      { protocol: "https", hostname: "*.s3.ionlabs.dev" },
    ],
  },

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

    // Maps short proxy alias → full backend service path (including version)
    const ionServices = {
      "ion-user-service/api/v1": "user",
      "ion-branch-service/api/v1": "branch",
      "ion-networking-service/api/v1": "networking",
      "ion-order-service/api/v1": "order",
      "ion-rule-scheme-service/api/v1": "rule-scheme",
      "ion-product-service/api/v1": "product",
      "ion-sales-service/api/v1": "sales",
      "ion-customer-service/api/v1": "customer",
      "ion-technical-service/api/v1": "technical",
    };

    const useProxyMode =
      publicApiUrl === "/api-proxy" ||
      Boolean(publicApiUrl?.startsWith("/api-proxy/"));

    if (useProxyMode) {
      // /api-proxy/user/:path* → ${apiBaseUrl}/ion-user-service/api/v1/:path*
      const rewrites = Object.entries(ionServices).map(([fullPath, alias]) => ({
        source: `/api-proxy/${alias}/:path*`,
        destination: `${normalizedBaseUrl}/${fullPath}/:path*`,
      }));
      // Generic fallback for any path not matched above
      rewrites.push({
        source: "/api-proxy/:path*",
        destination: `${normalizedBaseUrl}/:path*`,
      });
      return rewrites;
    }

    // Non-proxy mode: /user/:path* → ${apiBaseUrl}/ion-user-service/api/v1/:path*
    return Object.entries(ionServices).map(([fullPath, alias]) => ({
      source: `/${alias}/:path*`,
      destination: `${normalizedBaseUrl}/${fullPath}/:path*`,
    }));
  },
};

export default nextConfig;
// Trigger Build: 10