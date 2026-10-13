import { SITE } from '../site'
import { absoluteUrl } from './seo'
import type { Post } from './types'

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char] as string,
  )
}

/**
 * 生成 RSS 2.0 订阅源（纯函数，无外部依赖）。
 * 只包含非 hidden 文章，按发表时间倒序。
 */
export function buildRssFeed(posts: Post[], options: { base?: string } = {}): string {
  const base = options.base ?? SITE.base
  const visible = posts
    .filter((post) => !post.hidden)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  // lastBuildDate 反映「最近一次内容变化」，而不是最新发表时间
  const lastBuildDate = visible.reduce<Date>(
    (latest, post) => {
      const changed = post.updated ?? post.date
      return changed.getTime() > latest.getTime() ? changed : latest
    },
    visible.length > 0 ? (visible[0].updated ?? visible[0].date) : new Date(),
  ).toUTCString()

  const items = visible
    .map((post) => {
      const url = absoluteUrl(post.url, base)
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${post.date.toUTCString()}</pubDate>`,
        categories,
        `      <description>${escapeXml(post.description)}</description>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${absoluteUrl('/', base)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.lang}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${absoluteUrl(`/${SITE.feedFile}`, base)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
