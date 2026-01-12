import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 使用 @opennextjs/cloudflare 时需要 standalone 模式
  // 移除 output: 'export' 以支持服务器端功能（API 路由等）
  output: 'standalone',
  // 禁用图片优化（Cloudflare Workers 环境限制）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
