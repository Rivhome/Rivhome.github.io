import { createContentLoader } from 'vitepress'
import { readPostFile, resolveDate } from './lib/postfile'

interface TagMap {
  [tag: string]: Array<{
    title: string
    url: string
    date: Date
  }>
}

declare const data: TagMap
export { data }

export default createContentLoader('posts/**/*.md', {
  transform(raw): TagMap {
    const tagMap: TagMap = {}
    raw
      .filter((r) => r.frontmatter.archived !== true)
      .forEach(({ url, frontmatter }) => {
        const tags = frontmatter.tags
          ? Array.isArray(frontmatter.tags)
            ? (frontmatter.tags as string[])
            : [frontmatter.tags as string]
          : []
        tags.forEach((tag: string) => {
          if (!tagMap[tag]) tagMap[tag] = []
          tagMap[tag].push({
            title: frontmatter.title as string,
            url,
            date: resolveDate(frontmatter.date, readPostFile(url)?.mtime ?? new Date(), url),
          })
        })
      })
    Object.values(tagMap).forEach((posts) =>
      posts.sort((a, b) => b.date.getTime() - a.date.getTime()),
    )
    return tagMap
  },
})
