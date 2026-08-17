/** @type {import('next').NextConfig} */

function hostnameFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** Hostnames allowed for next/image (API storage + optional env extras). */
function getImageRemotePatterns() {
  const hostnames = new Set([
    "marketplace.aibit.services",
    "marketplace.aibitsoft.cloud",
    "testmarketplace.aibitsoft.cloud",
    "localhost",
    "127.0.0.1",
    "172.31.3.97",
  ]);

  const fromEnv = hostnameFromUrl(process.env.NEXT_PUBLIC_BASE_URL);
  if (fromEnv) hostnames.add(fromEnv);

  const extra = process.env.NEXT_PUBLIC_IMAGE_HOSTS || "";
  extra.split(",").forEach((h) => {
    const trimmed = h.trim();
    if (trimmed) hostnames.add(trimmed);
  });

  const patterns = [];
  for (const hostname of hostnames) {
    patterns.push(
      { protocol: "https", hostname, pathname: "/**" },
      { protocol: "http", hostname, pathname: "/**" }
    );
  }

  // Object storage when admin enables S3 (full URLs in API responses)
  for (const hostname of [
    "**.amazonaws.com",
    "**.digitaloceanspaces.com",
    "**.cloudflarestorage.com",
  ]) {
    patterns.push({ protocol: "https", hostname, pathname: "/**" });
  }

  return patterns;
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["172.31.3.97:3000", "localhost:3000"],
  // Stable Turbopack config (Next.js 15+). Pins project root so Windows /
  // multi-lockfile setups don't pick the wrong workspace root.
  turbopack: {
    root: __dirname,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: getImageRemotePatterns(),
  },
  async rewrites() {
    const apiBase = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://marketplace.aibit.services"
    ).replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${apiBase}/storage/:path*`,
      },
      {
        source: "/payment-mobile",
        destination: `${apiBase}/payment-mobile`,
      },
      {
        source: "/payment-mobile/:path*",
        destination: `${apiBase}/payment-mobile/:path*`,
      },
      {
        source: "/refund",
        destination: `${apiBase}/refund`,
      },
      {
        source: "/refund/:path*",
        destination: `${apiBase}/refund/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
