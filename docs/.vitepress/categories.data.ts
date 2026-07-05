import { createContentLoader } from 'vitepress'

interface CategoryMap {
  [category: string]: Array<{
    title: string
    url: string
    date: Date
    tags: string[]
  }>
}

declare const data: CategoryMap
export { data }

export default createContentLoader('posts/*.md', {
  transform(raw): CategoryMap {
    const catMap: CategoryMap = {}
    raw.forEach(({ url, frontmatter }) => {
      const categories = frontmatter.categories
        ? Array.isArray(frontmatter.categories)
          ? (frontmatter.categories as string[])
          : [frontmatter.categories as string]
        : []
      categories.forEach((cat: string) => {
        if (!catMap[cat]) catMap[cat] = []
        catMap[cat].push({
          title: frontmatter.title as string,
          url,
          date: new Date(frontmatter.date as string),
          tags: frontmatter.tags
            ? Array.isArray(frontmatter.tags)
              ? (frontmatter.tags as string[])
              : [frontmatter.tags as string]
            : [],
        })
      })
    })
    Object.values(catMap).forEach((posts) =>
      posts.sort((a, b) => b.date.getTime() - a.date.getTime()),
    )
    return catMap
  },
})
