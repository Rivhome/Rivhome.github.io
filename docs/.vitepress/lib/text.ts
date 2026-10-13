/** 文本统计工具：中文字符按字、拉丁按词。 */

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/
const CODE_FENCE_RE = /```[\s\S]*?```/g
const HTML_TAG_RE = /<[^>]+>/g

/** 正文字数（剔除 front matter、代码块与 HTML 标签） */
export function countWordsOf(md: string): number {
  const body = md
    .replace(FRONTMATTER_RE, '')
    .replace(CODE_FENCE_RE, ' ')
    .replace(HTML_TAG_RE, ' ')
  const cjk = body.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)?.length ?? 0
  const latin = body.match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g)?.length ?? 0
  return cjk + latin
}

/** 中文阅读速度按 400 字/分钟估算，最少 1 分钟 */
export function readingTimeOf(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 400))
}

/** 去标签 + 折叠空白，用于从渲染后的摘要生成纯文本描述 */
export function stripHtml(html: string): string {
  return html
    .replace(HTML_TAG_RE, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** 按字符数截断，尽量不在词中间断开 */
export function truncate(text: string, max = 120): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max).replace(/[\s,，。;；:：、]+$/, '')}…`
}
