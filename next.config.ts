import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.hashnode.com" },
      { protocol: "https", hostname: "kodenops.hashnode.dev" },
	  { protocol: "https", hostname: "kodenops.hashnode.dev" }
    ],
  },
};

export default nextConfig;
