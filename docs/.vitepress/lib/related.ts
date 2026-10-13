import type { Post } from './types'

/**
 * 相关文章打分（构建期计算，零运行时开销）：
 * - 同一合集：+3
 * - 每命中一个共享标签：+1/该标签的文章数（稀有标签更值钱）
 *
 * 仅返回得分 > 0 的文章，按得分降序、日期降序取前 count 篇。
 */
export function relatedPosts(post: Post, all: Post[], count: number): Post[] {
  const candidates = all.filter((item) => !item.hidden && item.url !== post.url)
  if (candidates.length === 0) return []

  const tagFrequency = new Map<string, number>()
  for (const item of candidates) {
    for (const tag of item.tags) {
      tagFrequency.set(tag, (tagFrequency.get(tag) ?? 0) + 1)
    }
  }

  const ownTags = new Set(post.tags)

  return candidates
    .map((item) => {
      let score = post.series && item.series === post.series ? 3 : 0
      for (const tag of item.tags) {
        if (ownTags.has(tag)) score += 1 / (tagFrequency.get(tag) ?? 1)
      }
      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || b.item.date.getTime() - a.item.date.getTime(),
    )
    .slice(0, count)
    .map((entry) => entry.item)
}
