import { SITE } from '../site'
import type { Post } from './types'

/** VitePress head 配置项（与 HeadConfig 结构一致，避免额外类型依赖） */
export type HeadEntry = [string, Record<string, string>, string?]

/** 站内路径 → 绝对 URL（非 ASCII 路径按 percent-encoding 输出，保证 RSS/og 严格合法） */
export function absoluteUrl(pathname: string, base: string = SITE.base): string {
  const root = SITE.url.replace(/\/$/, '')
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const prefix = base === '/' ? '' : base.replace(/\/$/, '')
  return `${root}${encodeURI(prefix + path)}`
}

function meta(name: string, content: string): HeadEntry {
  return ['meta', { name, content }]
}

function property(prop: string, content: string): HeadEntry {
  return ['meta', { property: prop, content }]
}

function withoutUndefined<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as T
}

/**
 * 文章页 SEO head：canonical、Open Graph、Twitter Card、JSON-LD。
 * 描述本身由 VitePress 依据 pageData.description 输出，这里不重复生成。
 */
export function postHeadEntries(
  post: Post,
  options: { base?: string; seriesName?: string } = {},
): HeadEntry[] {
  const url = absoluteUrl(post.url, options.base)
  const published = post.date.toISOString()
  const modified = (post.updated ?? post.date).toISOString()
  const image = post.cover ? absoluteUrl(post.cover, options.base) : undefined

  const entries: HeadEntry[] = [
    ['link', { rel: 'canonical', href: url }],
    property('og:type', 'article'),
    property('og:title', post.title),
    property('og:description', post.description),
    property('og:url', url),
    property('og:site_name', SITE.title),
    property('og:locale', 'zh_CN'),
    property('article:published_time', published),
    property('article:modified_time', modified),
    meta('twitter:card', image ? 'summary_large_image' : 'summary'),
    meta('twitter:title', post.title),
    meta('twitter:description', post.description),
  ]

  if (image) {
    entries.push(property('og:image', image), meta('twitter:image', image))
  }

  for (const tag of post.tags) {
    entries.push(property('article:tag', tag))
  }

  const jsonLd = withoutUndefined({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: published,
    dateModified: modified,
    inLanguage: SITE.lang,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: SITE.author, url: SITE.github },
    publisher: { '@type': 'Person', name: SITE.author, url: SITE.github },
    image: image ? [image] : undefined,
    keywords: post.tags.length > 0 ? post.tags.join(', ') : undefined,
    isPartOf: options.seriesName
      ? { '@type': 'CreativeWorkSeries', name: options.seriesName }
      : undefined,
  })

  entries.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(jsonLd),
  ])

  return entries
}

/**
 * 列表类页面（合集总览/合集详情/标签总览/标签详情/关于）的 SEO head：
 * canonical + Open Graph，无文章级时间与结构化数据。
 */
export function listingHeadEntries(
  options: { title: string; description: string; url: string },
  base: string = SITE.base,
): HeadEntry[] {
  const url = absoluteUrl(options.url, base)
  return [
    ['link', { rel: 'canonical', href: url }],
    property('og:type', 'website'),
    property('og:title', options.title),
    property('og:description', options.description),
    property('og:url', url),
    property('og:site_name', SITE.title),
    property('og:locale', 'zh_CN'),
    meta('twitter:card', 'summary'),
    meta('twitter:title', options.title),
    meta('twitter:description', options.description),
  ]
}

/** 首页 WebSite + 站内搜索入口的结构化数据 */
export function siteHeadEntries(base: string = SITE.base): HeadEntry[] {
  const url = absoluteUrl('/', base)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.title,
    description: SITE.description,
    url,
    inLanguage: SITE.lang,
    author: { '@type': 'Person', name: SITE.author, url: SITE.github },
  }

  return [
    ['link', { rel: 'canonical', href: url }],
    property('og:type', 'website'),
    property('og:title', SITE.title),
    property('og:description', SITE.description),
    property('og:url', url),
    property('og:site_name', SITE.title),
    meta('twitter:card', 'summary'),
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)],
  ]
}
