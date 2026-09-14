import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** docs 目录（本文件位于 docs/.vitepress/lib/ 下） */
const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * 按站点 url 读取文章源文件（仅限 build 期在 .data.ts 中使用，不可导入 .vue 组件）。
 * url 形如 `/posts/我的考研计划`，对应 docs/posts/我的考研计划.md。
 */
export function readPostFile(url: string): { content: string; mtime: Date } | null {
  const file = path.join(srcDir, `${url}.md`)
  try {
    return {
      content: fs.readFileSync(file, 'utf-8'),
      mtime: fs.statSync(file).mtime,
    }
  } catch {
    console.warn(`[postfile] 无法读取文章文件: ${file}`)
    return null
  }
}

/**
 * 统计正文字数：中文按字符数、英文/数字按单词数，
 * 剔除 front-matter、代码块与 HTML 标签。
 */
export function countWordsOf(md: string): number {
  const body = md
    .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  const cjk = body.match(/[一-鿿㐀-䶿]/g)?.length ?? 0
  const latin = body.match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g)?.length ?? 0
  return cjk + latin
}

/** 中文阅读速度按 400 字/分钟估算 */
export function readingTimeOf(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 400))
}

/**
 * 解析 front-matter 日期：YAML 会把合法时间戳直接解析成 Date 对象
 * （无时区时按 UTC 解析，这里还原为"墙上时间"，避免文章日期在
 * UTC+8 等时区被偏移到第二天）；字符串则统一转 ISO 形式解析；
 * 无效时回退 fallback 并告警。
 */
export function resolveDate(v: unknown, fallback: Date, label: string): Date {
  if (v instanceof Date) {
    if (!Number.isNaN(v.getTime())) {
      return new Date(
        v.getUTCFullYear(),
        v.getUTCMonth(),
        v.getUTCDate(),
        v.getUTCHours(),
        v.getUTCMinutes(),
        v.getUTCSeconds(),
      )
    }
  } else if (typeof v === 'string' && v.trim()) {
    const d = new Date(v.trim().replace(' ', 'T'))
    if (!Number.isNaN(d.getTime())) return d
  }
  console.warn(`[postfile] 无效日期，回退为文件修改时间: ${label}`)
  return fallback
}
