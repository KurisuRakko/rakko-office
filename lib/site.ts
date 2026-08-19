// 站点对外基址（用于 canonical/OG/sitemap/robots 等场景）。
//
// 本项目尚未确定正式域名，且发行方式仅为 Docker 自托管——不同自托管者的
// 实际访问域名各不相同，因此不能像上游那样硬编码单一域名。构建时通过
// NEXT_PUBLIC_SITE_URL 注入实际域名；未设置时兜底为本地开发地址，
// 避免生产构建产物里出现指向他人域名的绝对链接。
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
