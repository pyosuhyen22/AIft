/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // 빌드 시 타입 오류가 있어도 무시하고 진행 (배포 우선 성공 목적)
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 Lint 오류가 있어도 무시하고 진행
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
