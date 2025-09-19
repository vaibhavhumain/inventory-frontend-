/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://192.168.1.12:3000",
      "https://invetrack.netlify.app"
    ]
  }
};

export default nextConfig;