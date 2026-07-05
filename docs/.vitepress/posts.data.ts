import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: Date
  updated?: Date
  excerpt: string
  tags: string[]
  categories: string[]
  pinned: boolean
  cover?: string
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title as string,
        url,
        date: new Date(frontmatter.date as string),
        updated: frontmatter.updated
          ? new Date(frontmatter.updated as string)
          : undefined,
        excerpt: excerpt || '',
        tags: frontmatter.tags
          ? Array.isArray(frontmatter.tags)
            ? (frontmatter.tags as string[])
            : [frontmatter.tags as string]
          : [],
        categories: frontmatter.categories
          ? Array.isArray(frontmatter.categories)
            ? (frontmatter.categories as string[])
            : [frontmatter.categories as string]
          : [],
        pinned: frontmatter.pinned === true,
        cover: (frontmatter.cover as string) || undefined,
      }))
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.date.getTime() - a.date.getTime()
      })
  },
})
