/**
 * 站点级常量：部署地址、作者信息、各处使用的数量阈值。
 * 纯模块（无 node 依赖），构建期与客户端组件共用。
 */
export const SITE = {
  /** 部署根地址，用于 RSS / sitemap / og:url 的绝对链接 */
  url: 'https://rivhome.github.io',
  base: '/',
  title: "Rivhome's Blog",
  description: 'changing world, one line of code at a time',
  author: 'Rivhome',
  github: 'https://github.com/Rivhome',
  lang: 'zh-CN',
  /** 文章超过该月数未更新时，文章页显示「内容可能已过时」提示 */
  staleMonths: 6,
  /** 文章页推荐的相关文章数量 */
  relatedCount: 3,
  /** 首页「最近发表 / 最近更新」列表长度 */
  recentCount: 5,
  /** RSS 输出文件名（放在 public 根路径下） */
  feedFile: 'feed.xml',
} as const
