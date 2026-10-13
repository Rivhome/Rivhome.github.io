import { createContentLoader, type ContentData } from 'vitepress'
import { publishedOnly, sortForList, toPosts } from './lib/posts'
import type { Post } from './lib/types'

export type { Post }

declare const data: Post[]
export { data }

/**
 * 列表页（首页 / 标签页 / 合集页）使用的文章数据：
 * 排除 hidden，并保持「置顶优先 + 日期倒序」的顺序。
 */
export default createContentLoader<Post[]>('posts/**/*.md', {
  includeSrc: true,
  excerpt: true,
  transform(raw): Post[] {
    return sortForList(publishedOnly(toPosts(raw as ContentData[])))
  },
})
