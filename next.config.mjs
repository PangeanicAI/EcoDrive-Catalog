/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CATALOG_API_URL:
      process.env.CATALOG_API_URL || "http://ecodrive.pangeanic.com:19193",
  },
  // Enable standalone output for Docker
  output: "standalone",
};

export default nextConfig;
