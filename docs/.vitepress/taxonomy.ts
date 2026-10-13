import { slugify } from './lib/slug'

/**
 * 受控词表 —— 标签与合集名的唯一事实来源。
 *
 * 为什么要手写词表而不是从文章里自动收集：
 * 1. 动态路由（/tags/<slug>、/series/<slug>）的 `.paths.ts` 在
 *    VitePress 完成配置解析之前执行，此时不能调用 createContentLoader，
 *    只能 import 纯模块来获得路由参数；
 * 2. 统一词形（避免 "Master公式" / "Master 公式" 这类同义标签分裂）；
 * 3. 为标签页提供可索引的说明文字。
 *
 * 文章里出现未声明的标签/合集时，构建期会打印告警并给出可粘贴的条目模板。
 */
export interface TagDef {
  name: string
  /** 缺省由 name 归一化得到 */
  slug?: string
  description?: string
  /** 旧写法，命中时按 name 处理（用于改名后兼容） */
  aliases?: string[]
}

export interface SeriesDef {
  name: string
  slug?: string
  description?: string
  cover?: string
}

export const TAGS: TagDef[] = [
  {
    name: '随笔',
    description: '想到哪写到哪的零散记录。',
  },
  {
    name: '博客',
    description: '关于这个站点本身的搭建、写作与折腾记录。',
  },
  {
    name: '递归',
    description: '递归的思维方式、系统栈本质与常见题型。',
  },
  {
    name: 'Master 公式',
    aliases: ['Master公式', 'master公式'],
    description: '用主定理快速推导分治递归的时间复杂度。',
  },
  {
    name: '复杂度分析',
    description: '时间与空间复杂度的估算方法。',
  },
]

export const SERIES: SeriesDef[] = [
  {
    name: '算法通关',
    description: '从零开始把算法题过一遍：每个知识点一篇，讲清直觉、模板与复杂度。',
  },
]

const tagByName = new Map<string, TagDef>()
const tagBySlugMap = new Map<string, TagDef>()
const seriesByName = new Map<string, SeriesDef>()
const seriesBySlugMap = new Map<string, SeriesDef>()

/** 声明期自检：slug 冲突会让两个词条争用同一路由，必须暴露出来 */
export const TAXONOMY_ISSUES: string[] = []

for (const tag of TAGS) {
  const slug = tag.slug ?? slugify(tag.name)
  const existing = tagBySlugMap.get(slug)
  if (existing) {
    TAXONOMY_ISSUES.push(`标签 slug 冲突：「${existing.name}」与「${tag.name}」都归一化为 "${slug}"`)
  }
  tagBySlugMap.set(slug, tag)
  tagByName.set(tag.name, tag)
  for (const alias of tag.aliases ?? []) tagByName.set(alias, tag)
}

for (const s of SERIES) {
  const slug = s.slug ?? slugify(s.name)
  const existing = seriesBySlugMap.get(slug)
  if (existing) {
    TAXONOMY_ISSUES.push(`合集 slug 冲突：「${existing.name}」与「${s.name}」都归一化为 "${slug}"`)
  }
  seriesBySlugMap.set(slug, s)
  seriesByName.set(s.name, s)
}

export function tagSlugOf(tag: TagDef): string {
  return tag.slug ?? slugify(tag.name)
}

export function seriesSlugOf(series: SeriesDef): string {
  return series.slug ?? slugify(series.name)
}

/** 按名称或别名查标签；未声明时返回 undefined */
export function findTag(name: string): TagDef | undefined {
  return tagByName.get(name.trim())
}

/** 按路由 slug 查标签 */
export function tagBySlug(slug: string): TagDef | undefined {
  return tagBySlugMap.get(slug)
}

/** 合集按名称查询（不支持别名） */
export function findSeries(name: string): SeriesDef | undefined {
  return seriesByName.get(name.trim())
}

export function seriesBySlug(slug: string): SeriesDef | undefined {
  return seriesBySlugMap.get(slug)
}

/** 已声明标签 → 路由 slug；未声明返回 undefined（调用方应转为纯文本） */
export function slugForTag(name: string): string | undefined {
  const tag = findTag(name)
  return tag ? tagSlugOf(tag) : undefined
}

/** 已声明合集 → 路由 slug；未声明返回 undefined */
export function slugForSeries(name: string): string | undefined {
  const s = findSeries(name)
  return s ? seriesSlugOf(s) : undefined
}

/** 词表全部标签（去重后的规范名 + slug + 说明） */
export function allTags(): Array<{ name: string; slug: string; description?: string }> {
  return TAGS.map((t) => ({ name: t.name, slug: tagSlugOf(t), description: t.description }))
}

/** 词表全部合集 */
export function allSeries(): Array<{ name: string; slug: string; description?: string; cover?: string }> {
  return SERIES.map((s) => ({
    name: s.name,
    slug: seriesSlugOf(s),
    description: s.description,
    cover: s.cover,
  }))
}
