#!/usr/bin/env node
/**
 * 把一篇 VitePress 文章导出成「平台通用 Markdown」，用于一稿多投
 * （掘金 / CSDN / 知乎 / 微信公众号排版工具等）。
 *
 * 它会做这些事：
 *   1. 去掉 front matter 与 <script setup>，并把 Vue 组件标签（<PostList /> 之类）移除；
 *   2. 站内路径绝对化：`/images/...` 与其它的 `](/...)` 换成站点绝对 URL
 *      （微信公众号不显示外链图片，仍需在编辑器里重新上传）；
 *   3. 降级 VitePress 专有语法：
 *      - 代码块 ` ```ts [file.ts] {1,3-5} :line-numbers ` → 文件名提到代码块上方 + 只保留语言
 *      - 代码内的 `// [!code ++]`、`# [!code focus]` 等标记清除
 *      - `::: info/tip/warning/danger` → 引用块 + 粗体标签；`::: details` → <details> HTML
 *      - 标题自定义锚点 `## 标题 {#id}` → 去掉锚点
 *      - `[[toc]]`、`<!-- @include -->` 等移除；
 *   4. 默认在开头补 `# 标题`（平台编辑器另有标题栏时可用 --no-title 去掉），
 *      结尾附「本文首发于 …」回链（--no-canonical 可去掉）；
 *   5. 输出到 exports/<文件名>.md，并打印改写了多少图片/链接、移除了哪些组件，
 *      以及仍然可能不兼容的语法提示（数学公式、<kbd>、原始 HTML 等）。
 *
 * 用法：
 *   npm run export:post -- docs/posts/算法通关/1.递归与Master公式.md
 *   npm run export:post -- /posts/算法通关/1.递归与Master公式 --stdout
 *   npm run export:post -- 1.递归与Master公式 --images https://cdn.example.com/blog
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = path.join(ROOT, 'docs')
const POSTS = path.join(DOCS, 'posts')

/* ------------------------------------------------------------------ *
 * 参数
 * ------------------------------------------------------------------ */

function parseArgs(argv) {
  const options = {
    input: '',
    outDir: 'exports',
    site: '',
    images: '',
    title: true,
    canonical: true,
    stdout: false,
    siteBase: '',
  }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--out') options.outDir = argv[++i] ?? options.outDir
    else if (arg === '--site') options.site = argv[++i] ?? ''
    else if (arg === '--images') options.images = argv[++i] ?? ''
    else if (arg === '--no-title') options.title = false
    else if (arg === '--no-canonical') options.canonical = false
    else if (arg === '--stdout') options.stdout = true
    else if (arg === '-h' || arg === '--help') options.help = true
    else if (!arg.startsWith('-')) options.input = arg
  }
  return options
}

const HELP = `用法: npm run export:post -- <文章文件或站内路径> [选项]

  <文章文件或站内路径>   例如 docs/posts/生活/我的第一篇博客.md、/posts/生活/我的第一篇博客，或只给文件名
  --out <目录>          导出目录（默认 exports/）
  --site <URL>          站点根地址（默认读取 docs/.vitepress/site.ts）
  --images <前缀>       图片前缀；将来换图床/对象存储时改这里即可
  --no-title            不在正文开头补 "# 标题"
  --no-canonical        不在结尾附「本文首发于 …」回链
  --stdout              只输出到标准输出，不写文件
`

/* ------------------------------------------------------------------ *
 * 站点常量：优先读 site.ts，避免出现第二份事实来源
 * ------------------------------------------------------------------ */

function readSiteConfig() {
  const fallback = { url: 'https://rivhome.github.io', base: '/' }
  try {
    const src = fs.readFileSync(path.join(DOCS, '.vitepress', 'site.ts'), 'utf-8')
    const url = /url:\s*'([^']+)'/.exec(src)?.[1]
    const base = /base:\s*'([^']+)'/.exec(src)?.[1]
    return { url: url ?? fallback.url, base: base ?? fallback.base }
  } catch {
    return fallback
  }
}

function withBase(siteUrl, base, target) {
  const root = siteUrl.replace(/\/$/, '')
  const prefix = base === '/' ? '' : base.replace(/\/$/, '')
  const pathname = target ? (target.startsWith('/') ? target : `/${target}`) : ''
  return encodeURI(`${root}${prefix}${pathname}`)
}

/* ------------------------------------------------------------------ *
 * 定位源文件
 * ------------------------------------------------------------------ */

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else if (entry.name.endsWith('.md')) acc.push(full)
  }
  return acc
}

function resolveSource(input) {
  const normalized = input.replace(/\\/g, '/').replace(/\.md$/i, '')
  const candidates = []

  if (path.isAbsolute(normalized)) candidates.push(normalized)
  else {
    candidates.push(path.resolve(ROOT, normalized))
    if (normalized.startsWith('/')) {
      candidates.push(path.join(DOCS, normalized.replace(/^\//, '')))
    } else {
      candidates.push(path.join(ROOT, 'docs', normalized))
      candidates.push(path.join(POSTS, normalized))
    }
  }

  for (const candidate of candidates) {
    for (const withExt of [candidate, `${candidate}.md`]) {
      if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) return withExt
    }
  }

  // 兜底：按文件名匹配（忽略开头的序号前缀）
  const needle = path.basename(normalized).replace(/^\d+[.\-_]/, '')
  const hits = walk(POSTS).filter(
    (file) => path.basename(file, '.md').replace(/^\d+[.\-_]/, '') === needle,
  )
  if (hits.length === 1) return hits[0]
  if (hits.length > 1) {
    throw new Error(`文件名匹配到多篇文章，请给出完整路径：\n  ${hits.join('\n  ')}`)
  }
  throw new Error(`找不到文章：${input}`)
}

/* ------------------------------------------------------------------ *
 * 转换
 * ------------------------------------------------------------------ */

const FRONTMATTER = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const CONTAINER_OPEN = /^(\s*):::\s*([A-Za-z]+)?\s*(.*)$/
const CONTAINER_CLOSE = /^(\s*):::\s*$/
const FENCE_OPEN = /^(\s*)(`{3,}|~{3,})(.*)$/
const FENCE_CLOSE = /^\s*(?:`{3,}|~{3,})\s*$/
const HEADING_ANCHOR = /^(\s*#{1,6}\s+.*?)\s*\{#[^}]*\}\s*$/

const CONTAINER_LABEL = { info: '信息', tip: '提示', warning: '注意', danger: '警告', details: '详情' }

function stripCodeMarkers(code) {
  return code
    .replace(/\/\/\s*\[!code[^\]]*\]/g, '')
    .replace(/#\s*\[!code[^\]]*\]/g, '')
    .replace(/\/\*\s*\[!code[^\]]*\]\s*\*\//g, '')
    .replace(/[ \t]+$/, '')
}

export function convert(markdown, config) {
  const stats = {
    images: 0,
    links: 0,
    components: new Set(),
    containers: {},
    codeMarkers: 0,
    codeLabels: 0,
    removedScripts: 0,
  }
  const risky = new Set()

  // --- 1) 去掉 front matter / <script> / Vue 组件 ---
  const fmMatch = FRONTMATTER.exec(markdown)
  const frontmatter = fmMatch?.[1] ?? ''
  let body = fmMatch ? markdown.slice(fmMatch[0].length) : markdown

  const titleRaw = /^title:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim().replace(/^["']|["']$/g, '')
  const frontmatterSeries = /^series:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim().replace(/^["']|["']$/g, '')

  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/g, () => {
    stats.removedScripts++
    return ''
  })
  body = body.replace(/<([A-Z][\w.]*)\b[^>]*\/>/g, (_, name) => {
    stats.components.add(name)
    return ''
  })
  body = body.replace(/<([A-Z][\w.]*)\b[^>]*>[\s\S]*?<\/\1>/g, (_, name) => {
    stats.components.add(name)
    return ''
  })

  // --- 2) 逐行处理（代码围栏 / 容器 / 链接与图片）---
  const lines = body.split(/\r?\n/)
  const output = []
  const stack = []
  let inFence = false
  let fenceMarker = ''
  let fenceBody = []

  const INLINE_CODE = /(`+)([^`]*?)\1/g

  const rewriteTargets = (line) => {
    // 先把行内代码遮起来：`/images/x.png` 这类「路径说明」不该被绝对化
    const masks = []
    let result = line.replace(INLINE_CODE, (match) => {
      masks.push(match)
      return `\u0000${masks.length - 1}\u0000`
    })

    // 图片：![alt](/images/x.webp "title")
    result = result.replace(/!\[([^\]]*)\]\((\/[^\s)]+)(\s+"[^"]*")?\)/g, (match, alt, target, title) => {
      if (target.startsWith('//') || target.startsWith('/#')) return match
      stats.images++
      return `![${alt}](${config.imagesPrefix}${target}${title ?? ''})`
    })
    // 其它站内链接：](/posts/...)、(/series/...) 等
    result = result.replace(/(?<!!)\[([^\]]*)\]\((\/[^\s)]+)(\s+"[^"]*")?\)/g, (match, text, target, title) => {
      if (target.startsWith('//') || target.startsWith('/#')) return match
      stats.links++
      return `[${text}](${withBase(config.site, config.base, target)}${title ?? ''})`
    })
    // 原始 <img src="/images/...">
    result = result.replace(/(<img\b[^>]*\bsrc=)(["'])(\/[^"']+)\2/g, (match, head, quote, target) => {
      if (target.startsWith('//') || !target.startsWith('/')) return match
      stats.images++
      return `${head}${quote}${config.imagesPrefix}${target}${quote}`
    })
    // 标题自定义锚点
    result = result.replace(HEADING_ANCHOR, '$1')

    return result.replace(/\u0000(\d+)\u0000/g, (_, index) => masks[Number(index)])
  }

  const pushContainer = (container) => {
    const type = container.type || 'info'
    const title = container.title || CONTAINER_LABEL[type] || type
    const content = container.lines.join('\n').trim()
    stats.containers[type] = (stats.containers[type] ?? 0) + 1

    if (type === 'details') {
      if (content.includes('<details')) risky.add('嵌套的 details 容器')
      output.push(`<details>`, `<summary>${title}</summary>`, '', content, '', `</details>`, '')
      risky.add('<details> 折叠块（部分平台会清除 HTML）')
      return
    }

    const label = CONTAINER_LABEL[type] || type
    output.push(`> **${title === label ? label : `${label}：${title}`}**`, '>')
    for (const contentLine of content.split('\n')) {
      output.push(contentLine ? `> ${contentLine}` : '>')
    }
    output.push('')
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (inFence) {
      if (FENCE_CLOSE.test(line)) {
        output.push(...fenceBody, fenceMarker, '')
        inFence = false
        fenceBody = []
        fenceMarker = ''
        continue
      }
      const cleaned = stripCodeMarkers(line)
      if (cleaned !== line) stats.codeMarkers++
      fenceBody.push(cleaned)
      continue
    }

    const fence = FENCE_OPEN.exec(line)
    if (fence) {
      const [, indent, marker, rawInfo] = fence
      const info = rawInfo.trim()
      const lang = /^[A-Za-z0-9+#._-]+/.exec(info)?.[0] ?? ''
      const label = /\[([^\]]+)\]/.exec(info)?.[1]
      if (label) {
        output.push(`**${label}**`, '')
        stats.codeLabels++
      }
      inFence = true
      fenceMarker = `${indent}${marker}`
      fenceBody = []
      output.push(`${indent}${marker}${lang}`)
      continue
    }

    const open = CONTAINER_OPEN.exec(line)
    if (open && open[2]) {
      if (stack.length > 0) risky.add('嵌套的 ::: 容器（已按扁平处理）')
      stack.push({ type: open[2].toLowerCase(), title: open[3].trim(), lines: [] })
      continue
    }
    if (CONTAINER_CLOSE.test(line) && stack.length > 0) {
      pushContainer(stack.pop())
      continue
    }
    if (stack.length > 0) {
      stack[stack.length - 1].lines.push(rewriteTargets(line))
      continue
    }

    if (/^\s*\[\[toc\]\]\s*$/i.test(line)) continue
    if (/<!--\s*@include/.test(line)) {
      risky.add('@include 片段未展开')
      continue
    }
    if (line.includes('[!code')) {
      risky.add('代码块高亮/diff 标记已清除，视觉效果会丢失')
      stats.codeMarkers++
    }

    output.push(rewriteTargets(line))
  }

  if (inFence) output.push(...fenceBody, fenceMarker)
  while (stack.length > 0) pushContainer(stack.pop())

  // --- 3) 折叠多余空行（仅代码块之外）---
  const collapsed = []
  let inFenceOut = false
  let blankRun = 0
  for (const line of output) {
    if (FENCE_OPEN.test(line)) inFenceOut = true
    else if (inFenceOut && FENCE_CLOSE.test(line)) inFenceOut = false
    if (!inFenceOut && line.trim() === '') {
      blankRun++
      if (blankRun > 1) continue
    } else {
      blankRun = 0
    }
    collapsed.push(line)
  }

  const head = []
  if (config.title && titleRaw) head.push(`# ${titleRaw}`, '')
  const tail = []
  if (config.canonical) {
    tail.push('', '---', '', `> 本文首发于 [Rivhome's Blog](${config.canonicalUrl})${frontmatterSeries ? `，收录于合集《${frontmatterSeries}》` : ''}。`)
  }

  const result = [...head, ...collapsed, ...tail].join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'

  // 仍然可能不兼容的语法，提示作者人工确认
  if (/\$\$?[^$]+\$\$?/.test(result)) risky.add('数学公式：掘金/CSDN 支持 $$…$$，部分平台的 $…$ 行内公式需要手改')
  if (/<kbd>/.test(result)) risky.add('<kbd> 标签：多数平台支持，个别会剥掉样式')

  return { markdown: result, stats, risky: [...risky], title: titleRaw }
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help || !options.input) {
    process.stdout.write(HELP)
    process.exit(options.help ? 0 : 1)
  }

  const siteConfig = readSiteConfig()
  const site = options.site || siteConfig.url
  const base = siteConfig.base
  const source = resolveSource(options.input)
  const raw = fs.readFileSync(source, 'utf-8')

  const urlPath = `/${path.relative(DOCS, source).replace(/\\/g, '/').replace(/\.md$/, '')}`
  const config = {
    site,
    base,
    imagesPrefix: options.images || withBase(site, base, ''),
    title: options.title,
    canonical: options.canonical,
    canonicalUrl: withBase(site, base, urlPath),
  }

  const { markdown, stats, risky, title } = convert(raw, config)

  const outName = `${path.basename(source, '.md').replace(/^\d+[.\-_]/, '')}.md`
  let outPath = ''
  let writeError = ''
  if (!options.stdout) {
    const outDir = path.resolve(ROOT, options.outDir)
    try {
      fs.mkdirSync(outDir, { recursive: true })
      outPath = path.join(outDir, outName)
      fs.writeFileSync(outPath, markdown, 'utf-8')
    } catch (error) {
      writeError = error.message
    }
  } else {
    process.stdout.write(markdown)
  }

  const summary = [
    '',
    '── 导出摘要 ────────────────────────────────',
    `源文件   : ${path.relative(ROOT, source)}`,
    outPath
      ? `输出文件 : ${path.relative(ROOT, outPath)}（${(Buffer.byteLength(markdown) / 1024).toFixed(1)} KB）`
      : options.stdout
        ? '输出     : 仅标准输出'
        : `输出     : 写入失败 —— ${writeError}\n           可改用 --stdout，或用 --out <可写目录> 指定别的目录`,
    `标题     : ${title ?? '（front matter 中没有 title）'}`,
    `图片绝对化: ${stats.images} 处（前缀 ${config.imagesPrefix}）`,
    `站内链接 : ${stats.links} 处 → ${site}`,
    `容器转换 : ${Object.entries(stats.containers).map(([k, v]) => `${k}×${v}`).join('、') || '无'}`,
    `代码块   : 文件名标签 ${stats.codeLabels} 个、[!code] 标记清除 ${stats.codeMarkers} 处`,
    `移除组件 : ${stats.components.size > 0 ? [...stats.components].map((n) => `<${n}>`).join('、') : '无'}${stats.removedScripts > 0 ? '（含 <script setup>）' : ''}`,
  ]
  if (risky.length > 0) {
    summary.push('需人工确认：')
    for (const item of risky) summary.push(`  - ${item}`)
  }
  summary.push('────────────────────────────────────────────', '')
  process.stderr.write(`${summary.join('\n')}\n`)
  if (writeError) process.exitCode = 1
}

main()
