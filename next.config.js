/** @type {import('next').NextConfig} */

/*
 * Static export para Cloudflare Pages (genera ./out con HTML estático).
 * Los security headers viven en public/_headers (Next no soporta headers()
 * junto con output: 'export'; Cloudflare Pages los aplica desde ese archivo).
 */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
