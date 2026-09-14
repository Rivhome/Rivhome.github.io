import { createContentLoader } from 'vitepress'
import { countWordsOf, readPostFile, readingTimeOf, resolveDate } from './lib/postfile'

export interface Post {
  title: string
  url: string
  date: Date
  updated?: Date
  excerpt: string
  tags: string[]
  categories: string[]
  pinned: boolean
  /** 正文字数（中文按字符、英文按单词） */
  wordCount: number
  /** 预计阅读时长（分钟） */
  readingTime: number
  cover?: string
}

declare const data: Post[]
export { data }

function toArray(v: unknown): string[] {
  if (!v) return []
  return Array.isArray(v) ? (v as string[]) : [v as string]
}

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      // archived: true 的文章不进入任何列表数据（页面本身仍可直接访问）
      .filter((r) => r.frontmatter.archived !== true)
      .map(({ url, frontmatter, excerpt }) => {
        const file = readPostFile(url)
        const wordCount = file ? countWordsOf(file.content) : 0

        return {
          title: (frontmatter.title as string) || url,
          url,
          date: resolveDate(frontmatter.date, file?.mtime ?? new Date(), url),
          updated: frontmatter.updated
            ? resolveDate(frontmatter.updated, file?.mtime ?? new Date(), url)
            : undefined,
          excerpt: excerpt || '',
          tags: toArray(frontmatter.tags),
          categories: toArray(frontmatter.categories),
          pinned: frontmatter.pinned === true,
          wordCount,
          readingTime: readingTimeOf(wordCount),
          cover: (frontmatter.cover as string) || undefined,
        }
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.date.getTime() - a.date.getTime()
      })
  },
})
