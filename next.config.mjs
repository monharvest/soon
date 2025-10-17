import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Resolve R2 public host from env so remotePatterns is accurate and not a wildcard
const R2_HOST = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    if (!url) return 'soon.udaxgui.com'
    return new URL(url).hostname
  } catch (e) {
    return 'soon.udaxgui.com'
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Ensure Next's file-tracing root is the project directory so it doesn't infer the user's home
  // (fixes workspace-root inference warnings and places `out` in the repo root).
  outputFileTracingRoot: __dirname,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: R2_HOST,
      },
    ],
  },
}

export default nextConfig
