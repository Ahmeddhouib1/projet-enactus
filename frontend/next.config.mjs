/** @type {import('next').NextConfig} */
const backendOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").hostname;
  } catch {
    return "localhost";
  }
})();

const nextConfig = {
  output: "standalone",
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: backendOrigin,
      },
      {
        protocol: "https",
        hostname: backendOrigin,
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
