import { createContentLoader } from 'vitepress'

export interface PostStats {
  totalPosts: number
  totalWords: number
  totalTags: number
  totalCategories: number
  categoriesCount: Record<string, number>
  tagsCount: Record<string, number>
  postsByDate: Record<string, number> // "YYYY-MM-DD": count
  postsByMonth: Record<string, number> // "YYYY-MM": count
  postsByYear: Record<string, number> // "YYYY": count
  firstPostDate: string | null
  latestPostDate: string | null
  streakDays: number
  dailyPosts: Array<{ date: string; count: number; level: number }>
}

declare const data: PostStats
export { data }

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): PostStats {
    const categoriesCount: Record<string, number> = {}
    const tagsCount: Record<string, number> = {}
    const postsByDate: Record<string, number> = {}
    const postsByMonth: Record<string, number> = {}
    const postsByYear: Record<string, number> = {}
    let totalWords = 0

    const sorted = raw
      .map((r) => {
        // Count words in excerpt + content (rough estimate from raw)
        const words = (r.excerpt || '').replace(/<[^>]*>/g, '').length
        totalWords += words

        const date = new Date(r.frontmatter.date as string)
        const dateKey = date.toISOString().slice(0, 10) // YYYY-MM-DD
        const monthKey = dateKey.slice(0, 7) // YYYY-MM
        const yearKey = dateKey.slice(0, 4) // YYYY

        postsByDate[dateKey] = (postsByDate[dateKey] || 0) + 1
        postsByMonth[monthKey] = (postsByMonth[monthKey] || 0) + 1
        postsByYear[yearKey] = (postsByYear[yearKey] || 0) + 1

        const categories = r.frontmatter.categories
          ? Array.isArray(r.frontmatter.categories)
            ? (r.frontmatter.categories as string[])
            : [r.frontmatter.categories as string]
          : []
        categories.forEach((c) => {
          categoriesCount[c] = (categoriesCount[c] || 0) + 1
        })

        const tags = r.frontmatter.tags
          ? Array.isArray(r.frontmatter.tags)
            ? (r.frontmatter.tags as string[])
            : [r.frontmatter.tags as string]
          : []
        tags.forEach((t) => {
          tagsCount[t] = (tagsCount[t] || 0) + 1
        })

        return { date, dateKey }
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    // Calculate streak days
    let streakDays = 0
    if (sorted.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dateSet = new Set(Object.keys(postsByDate))
      let checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - 1) // Start from yesterday
      while (dateSet.has(checkDate.toISOString().slice(0, 10))) {
        streakDays++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }

    // Generate calendar heatmap data (last 365 days)
    const dailyPosts: Array<{ date: string; count: number; level: number }> = []
    const today = new Date()
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const count = postsByDate[key] || 0
      let level = 0
      if (count >= 4) level = 4
      else if (count >= 3) level = 3
      else if (count >= 2) level = 2
      else if (count >= 1) level = 1
      dailyPosts.push({ date: key, count, level })
    }

    return {
      totalPosts: raw.length,
      totalWords,
      totalTags: Object.keys(tagsCount).length,
      totalCategories: Object.keys(categoriesCount).length,
      categoriesCount,
      tagsCount,
      postsByDate,
      postsByMonth,
      postsByYear,
      firstPostDate: sorted.length > 0 ? sorted[0].dateKey : null,
      latestPostDate: sorted.length > 0 ? sorted[sorted.length - 1].dateKey : null,
      streakDays,
      dailyPosts,
    }
  },
})
