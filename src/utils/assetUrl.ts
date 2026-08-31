/** 拼接 public 静态资源路径，兼容 GitHub Pages 等子路径部署 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
