import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let basePath = '';
let assetPrefix = '';

if (isGithubActions) {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'PS-3-Pages-Client-Only';
  basePath = `/${repoName}`;
  assetPrefix = `/${repoName}/`;
}

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(isGithubActions && { basePath, assetPrefix }),
};

export default nextConfig;
