import { execSync } from "node:child_process"

import type { NextConfig } from "next"

// Build-time git context, surfaced to the client via NEXT_PUBLIC_* below.
// Prefers Vercel's injected vars on the deploy host, falls back to local git,
// and degrades to "unknown" when neither is available (no build failure).
function git(args: string, fallback = "unknown") {
  try {
    return (
      execSync(`git ${args}`, {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim() || fallback
    )
  } catch {
    return fallback
  }
}

const GIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF || git("rev-parse --abbrev-ref HEAD")
const GIT_COMMIT = (
  process.env.VERCEL_GIT_COMMIT_SHA || git("rev-parse --short HEAD")
).slice(0, 7)
const GIT_COMMIT_SUBJECT = git("log -1 --pretty=%s")
const GIT_COMMIT_DATE =
  process.env.VERCEL_GIT_COMMIT_TIMESTAMP || git("show -s --format=%cI HEAD")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  // Next dev blocks cross-origin requests to dev-only assets (HMR, the dev
  // runtime chunks) unless the origin is listed. Opening the app over the LAN
  // or a Tailscale IP is exactly that case, so the private ranges and the
  // Tailscale CGNAT range are allowed here. Dev only - no effect on builds.
  allowedDevOrigins: [
    "100.79.39.66",
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "*.ts.net",
  ],
  env: {
    NEXT_PUBLIC_GIT_BRANCH: GIT_BRANCH,
    NEXT_PUBLIC_GIT_COMMIT: GIT_COMMIT,
    NEXT_PUBLIC_GIT_COMMIT_SUBJECT: GIT_COMMIT_SUBJECT,
    NEXT_PUBLIC_GIT_COMMIT_DATE: GIT_COMMIT_DATE,
  },
  // Tree-shake heavy icon/markdown libs - directly reduces initial JS / TBT
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@phosphor-icons/react",
      "date-fns",
      "react-markdown",
    ],
  },
  images: {
    qualities: [75, 85, 90],
    formats: ["image/avif", "image/webp"],
    // Optimised variants are addressed by source path, and every source path
    // under /image, /projects, /logos and /icons is already served
    // `immutable`, so the derived files can be cached just as long. The
    // default (4h) had browsers re-validating every image on a repeat visit.
    minimumCacheTTL: 31536000,
    // No source in /public is wider than 1920, so 2048 and 3840 only ever
    // produced srcset entries that resolve back to the same file; 1440 is
    // added so a 2x desktop banner can request its exact width.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "github-contributions-api.jogruber.de",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
    ],
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
  async headers() {
    // Security headers for every response. CSP is intentionally omitted: the
    // app relies on Next.js inline scripts (flight data, theme bootstrap,
    // JSON-LD) and a strict CSP would need nonce plumbing for little real
    // protection here - the other four headers cover the common baseline
    // (MIME sniffing, clickjacking, referrer leakage, and feature abuse).
    const securityHeaders = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ]

    return [
      {
        source: "/bannerfield.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path(ascii-footer.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path((?:fonts|icons|projects|logos|image)/.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
