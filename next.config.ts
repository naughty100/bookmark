import type { NextConfig } from "next";

const repositoryName = 'squidmark'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repositoryName}` : '', // 添加 basePath
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repositoryName}/` : '', // 可选，但推荐添加 assetPrefix
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
