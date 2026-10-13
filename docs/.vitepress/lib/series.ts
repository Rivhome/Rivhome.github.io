import { allSeries } from '../taxonomy'
import type { Post, SeriesRef } from './types'

/** 一个合集的有序篇章与汇总信息 */
export interface SeriesInfo {
  name: string
  slug: string
  description?: string
  cover?: string
  /** 按 seriesOrder 升序（缺失者排末尾，同序号按日期） */
  posts: Post[]
  totalWords: number
  totalReadingTime: number
}

/**
 * 按受控词表构建合集（顺序稳定）。
 *
 * 本模块保持纯函数：合集页在客户端也要按同样规则分组，
 * 因此这里不能引入 node 依赖（校验逻辑在 lib/posts.ts 的 validateSeries）。
 *
 * 未声明的合集不会生成页面，故不在结果中——文章页会把它的徽标渲染成纯文本。
 */
export function buildSeries(posts: Post[]): SeriesInfo[] {
  const published = posts.filter((post) => !post.hidden)
  const infos: SeriesInfo[] = []

  for (const def of allSeries()) {
    const list = published.filter((post) => post.series === def.name)
    if (list.length === 0) continue

    const ordered = sortBySeriesOrder(list)

    infos.push({
      name: def.name,
      slug: def.slug,
      description: def.description,
      cover: def.cover,
      posts: ordered,
      totalWords: ordered.reduce((sum, post) => sum + post.wordCount, 0),
      totalReadingTime: ordered.reduce((sum, post) => sum + post.readingTime, 0),
    })
  }

  return infos
}

/** 合集内排序：seriesOrder 升序，缺失者排末尾，同序号按日期升序 */
export function sortBySeriesOrder(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const ao = a.seriesOrder ?? Number.MAX_SAFE_INTEGER
    const bo = b.seriesOrder ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}

/** 文章在合集内的位置：第 N/M 篇 + 合集内相邻篇章 */
export function seriesRefOf(
  post: Post,
  series: SeriesInfo[],
): { ref: SeriesRef; info: SeriesInfo } | undefined {
  const info = series.find((item) => item.name === post.series)
  if (!info) return undefined

  const index = info.posts.findIndex((item) => item.url === post.url)
  if (index < 0) return undefined

  const prev = index > 0 ? info.posts[index - 1] : undefined
  const next = index + 1 < info.posts.length ? info.posts[index + 1] : undefined

  return {
    info,
    ref: {
      name: info.name,
      slug: info.slug,
      index: index + 1,
      total: info.posts.length,
      prev: prev ? { title: prev.title, url: prev.url } : undefined,
      next: next ? { title: next.title, url: next.url } : undefined,
      totalReadingTime: info.totalReadingTime,
    },
  }
}
