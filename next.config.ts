import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置静态导出以支持 Cloudflare Pages
  output: 'export',
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
