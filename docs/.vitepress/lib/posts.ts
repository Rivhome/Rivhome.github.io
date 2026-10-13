import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader, type ContentData } from 'vitepress'
import { formatDate, resolveDate } from './date'
import { countWordsOf, readingTimeOf, stripHtml, truncate } from './text'
import { findSeries, findTag, allSeries, TAXONOMY_ISSUES } from '../taxonomy'
import { sortBySeriesOrder } from './series'
import type { Post, Revision } from './types'

/** docs 目录（本文件位于 docs/.vitepress/lib/ 下） */
export const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/* ------------------------------------------------------------------ *
 * 构建期告警
 * ------------------------------------------------------------------ */

const issues = new Set<string>()

/** 打印一次构建期告警（去重）；同时收集起来供 buildEnd 输出摘要 */
export function report(message: string): void {
  if (issues.has(message)) return
  issues.add(message)
  console.warn(`[blog] ${message}`)
}

export function issuesSummary(): string[] {
  return [...issues]
}

export function resetIssues(): void {
  issues.clear()
}

/* ------------------------------------------------------------------ *
 * 文件定位
 * ------------------------------------------------------------------ */

/** 站点 url → 源文件绝对路径（url 形如 `/posts/算法通关/1.递归与Master公式`） */
export function postFile(url: string): string {
  return path.join(srcDir, `${url}.md`)
}

function mtimeOf(url: string): Date {
  try {
    return fs.statSync(postFile(url)).mtime
  } catch {
    return new Date()
  }
}

function readSource(url: string): string {
  try {
    return fs.readFileSync(postFile(url), 'utf-8')
  } catch {
    report(`无法读取源文件：${postFile(url)}`)
    return ''
  }
}

/** 校验 docs/public 下的资源是否存在（cover 等） */
export function publicFileExists(publicPath: string): boolean {
  if (!publicPath.startsWith('/')) return false
  return fs.existsSync(path.join(srcDir, 'public', publicPath.replace(/^\//, '')))
}

/* ------------------------------------------------------------------ *
 * front matter 归一化
 * ------------------------------------------------------------------ */

function toArray(v: unknown): string[] {
  if (!v) return []
  return (Array.isArray(v) ? v : [v]).map((x) => String(x).trim()).filter(Boolean)
}

/**
 * 修订记录支持两种写法：
 *   1. `- date: 2026-10-02` / `  note: 补充推导`
 *   2. `- 2026-10-02 补充推导`
 */
function parseRevisions(v: unknown, label: string): Revision[] {
  if (!v) return []
  if (!Array.isArray(v)) {
    report(`${label}: revisions 应为数组`)
    return []
  }
  return v.flatMap((item) => {
    if (item && typeof item === 'object') {
      const raw = item as Record<string, unknown>
      if (raw.date == null) {
        report(`${label}: revisions 条目缺少 date`)
        return []
      }
      const date =
        raw.date instanceof Date ? formatDate(raw.date) : String(raw.date).trim()
      return [{ date, note: raw.note == null ? '' : String(raw.note) }]
    }
    const text = String(item).trim()
    const matched = /^(\d{4}-\d{2}-\d{2})\s*(.*)$/.exec(text)
    if (!matched) {
      report(`${label}: revisions 条目无法解析（应为 "YYYY-MM-DD 说明"）：${text}`)
      return []
    }
    return [{ date: matched[1], note: matched[2] }]
  })
}

/** 单篇 front matter → Post，同时完成全部逐篇校验 */
export function toPost(raw: ContentData): Post {
  const fm = raw.frontmatter ?? {}
  const url = raw.url
  const relativePath = `${url.replace(/^\//, '')}.md`
  const mtime = mtimeOf(url)

  const resolved = resolveDate(fm.date, mtime)
  if (!resolved.ok) report(`${relativePath}: date 缺失或非法，已回退为文件修改时间`)

  let updated: Date | undefined
  if (fm.updated != null) {
    const r = resolveDate(fm.updated, mtime)
    if (r.ok) updated = r.date
    else report(`${relativePath}: updated 非法，已忽略`)
  }

  const src = raw.src ?? readSource(url)
  const wordCount = countWordsOf(src)
  const excerpt = raw.excerpt ?? ''
  const description =
    typeof fm.description === 'string' && fm.description.trim()
      ? fm.description.trim()
      : truncate(stripHtml(excerpt), 120)

  const tags = toArray(fm.tags)
  for (const tag of tags) {
    if (!findTag(tag)) {
      report(
        `未声明的标签「${tag}」（来自 ${relativePath}）。请在 docs/.vitepress/taxonomy.ts 的 TAGS 中添加：\n` +
          `    { name: '${tag}', description: '' },`,
      )
    }
  }

  const series =
    typeof fm.series === 'string' && fm.series.trim() ? fm.series.trim() : undefined
  if (series && !findSeries(series)) {
    report(
      `未声明的合集「${series}」（来自 ${relativePath}）。请在 docs/.vitepress/taxonomy.ts 的 SERIES 中添加：\n` +
        `    { name: '${series}', description: '' },`,
    )
  }

  let seriesOrder: number | undefined
  if (series) {
    const parsed =
      typeof fm.seriesOrder === 'number'
        ? fm.seriesOrder
        : Number.parseInt(String(fm.seriesOrder ?? ''), 10)
    if (Number.isFinite(parsed) && parsed > 0) seriesOrder = parsed
    else report(`${relativePath}: 属于合集「${series}」但缺少合法的 seriesOrder，已排在合集末尾`)
  }

  const cover =
    typeof fm.cover === 'string' && fm.cover.trim() ? fm.cover.trim() : undefined
  if (cover && !publicFileExists(cover)) {
    report(`${relativePath}: cover 指向的图片不存在于 docs/public：${cover}`)
  }

  return {
    title: typeof fm.title === 'string' && fm.title.trim() ? fm.title.trim() : url,
    url,
    relativePath,
    date: resolved.date,
    updated,
    excerpt,
    description,
    tags,
    series,
    seriesOrder,
    pinned: fm.pinned === true,
    hidden: fm.hidden === true,
    cover,
    wordCount,
    readingTime: readingTimeOf(wordCount),
    revisions: parseRevisions(fm.revisions, relativePath),
  }
}

export function toPosts(raw: ContentData[]): Post[] {
  for (const issue of TAXONOMY_ISSUES) report(issue)

  const posts = raw.map(toPost)
  validateSeries(posts)
  return posts
}

/**
 * 合集相关的整体校验（需要看到全部文章，故不放在 toPost 里）：
 * 合集封面是否存在、同一合集内 seriesOrder 是否重复。
 */
function validateSeries(posts: Post[]): void {
  const published = posts.filter((post) => !post.hidden)

  for (const def of allSeries()) {
    if (def.cover && !publicFileExists(def.cover)) {
      report(`合集「${def.name}」的 cover 不存在于 docs/public：${def.cover}`)
    }

    const seen = new Map<number, string>()
    for (const post of sortBySeriesOrder(published.filter((p) => p.series === def.name))) {
      if (post.seriesOrder == null) continue
      const previous = seen.get(post.seriesOrder)
      if (previous) {
        report(
          `合集「${def.name}」中 seriesOrder=${post.seriesOrder} 重复：${previous} 与 ${post.relativePath}`,
        )
      } else {
        seen.set(post.seriesOrder, post.relativePath)
      }
    }
  }
}

/** 列表 / RSS / sitemap 使用的集合：排除 hidden */
export function publishedOnly(posts: Post[]): Post[] {
  return posts.filter((post) => !post.hidden)
}

/** 列表默认排序：置顶优先，其次日期倒序 */
export function sortForList(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.date.getTime() - a.date.getTime()
  })
}

/* ------------------------------------------------------------------ *
 * 构建期入口
 * ------------------------------------------------------------------ */

interface PostsLoader {
  watch: string | string[]
  load: () => Promise<Post[]>
}

// 缓存 loader 实例（而非 load 结果）：createContentLoader 内部按文件 mtime
// 缓存，因此重复调用代价很低，且 dev 下修改文章能自然失效。
let loader: PostsLoader | null = null

function getLoader(): PostsLoader {
  if (!loader) {
    loader = createContentLoader<Post[]>('posts/**/*.md', {
      includeSrc: true,
      excerpt: true,
      transform: (raw) => toPosts(raw as ContentData[]),
    })
  }
  return loader
}

/**
 * 构建期读取全部文章（含 hidden）。
 * 只能在 VitePress 配置解析完成后调用：transformPageData / buildEnd / 数据加载器。
 * 不要在 config.ts 模块顶层或 .paths.ts 里调用。
 */
export function loadPosts(): Promise<Post[]> {
  return getLoader().load()
}
