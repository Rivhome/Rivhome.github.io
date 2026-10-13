/** 全站共享的数据结构（构建期与客户端都会用到，保持纯类型）。 */

export interface Revision {
  /** `YYYY-MM-DD` */
  date: string
  note: string
}

export interface Post {
  title: string
  url: string
  /** docs 目录相对路径，用于在构建期定位源文件 */
  relativePath: string
  date: Date
  updated?: Date
  /** 渲染后的摘要 HTML */
  excerpt: string
  /** SEO 描述（front matter 优先，否则由摘要截断） */
  description: string
  tags: string[]
  series?: string
  seriesOrder?: number
  pinned: boolean
  /** 不进入列表 / RSS / sitemap，页面仍可直接访问 */
  hidden: boolean
  cover?: string
  wordCount: number
  readingTime: number
  revisions: Revision[]
}

/**
 * 组件消费的文章视图：数据加载器会把数据 JSON 往返一次，
 * 因此客户端拿到的日期是 ISO 字符串而不是 Date 实例。
 */
export type PostView = Omit<Post, 'date' | 'updated'> & {
  date: string | Date
  updated?: string | Date
}

export interface PostLink {
  title: string
  url: string
}

export interface SeriesRef {
  name: string
  slug: string
  /** 从 1 开始的篇序号 */
  index: number
  total: number
  prev?: PostLink
  next?: PostLink
  totalReadingTime: number
}

/** 构建期注入到文章页 front matter 的元信息（`frontmatter.post`） */
export interface PostPageMeta {
  title: string
  url: string
  date: string
  updated?: string
  wordCount: number
  readingTime: number
  /** 标签名（是否可链接由 lib/taxonomy 决定，组件侧统一解析 slug） */
  tags: string[]
  series?: SeriesRef
  /** 未声明的合集名（无对应页面，只作文本展示） */
  undeclaredSeries?: string
  related: PostLink[]
  /** 全站相邻文章：prev = 较新的一篇，next = 较旧的一篇（合集内文章另有 series.prev/next） */
  prev?: PostLink
  next?: PostLink
  /** 距今未更新的天数，仅在超过阈值时给出 */
  staleDays?: number
  revisions: Revision[]
  cover?: string
  description: string
}

/** 构建期注入到关于页的统计（`frontmatter.stats`） */
export interface SiteStats {
  posts: number
  words: number
  series: number
  tags: number
  firstDate?: string
  latestDate?: string
}
