import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: Date
  excerpt: string
  tags: string[]
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
        excerpt: excerpt || '',
        tags: frontmatter.tags
          ? Array.isArray(frontmatter.tags)
            ? (frontmatter.tags as string[])
            : [frontmatter.tags as string]
          : [],
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  },
})
