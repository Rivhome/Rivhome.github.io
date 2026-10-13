import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vitepress'

import { SITE } from './site'
import { seriesBySlug, tagBySlug } from './taxonomy'
import { daysBetween, formatDate, toIso } from './lib/date'
import { buildRssFeed } from './lib/feed'
import { figurePlugin } from './lib/markdown-figure'
import { issuesSummary, loadPosts, publishedOnly, report, sortForList } from './lib/posts'
import { relatedPosts } from './lib/related'
import { listingHeadEntries, postHeadEntries, siteHeadEntries } from './lib/seo'
import { buildSeries, seriesRefOf } from './lib/series'
import type { Post, PostLink, PostPageMeta, SiteStats } from './lib/types'

/** CJK 逐字 + 拉丁单词的分词（索引与查询共用同一函数） */
function cjkTokenize(text: string): string[] {
  return text.toLowerCase().match(/[\u4e00-\u9fff]|[a-z0-9]+/g) ?? []
}

export default defineConfig({
  base: SITE.base,
  lang: SITE.lang,
  title: SITE.title,
  description: SITE.description,

  cleanUrls: true,
  // 订阅源不是页面，链接检查需要放行；其余内部链接一律严格校验
  ignoreDeadLinks: [`/${SITE.feedFile}`],

  sitemap: {
    hostname: SITE.url,
    async transformItems(items) {
      const posts = await loadPosts()
      const byUrl = new Map(posts.map((post) => [post.url, post]))
      const hidden = new Set(posts.filter((post) => post.hidden).map((post) => post.url))
      /** sitemap 里的 url 不带前导斜杠（`404`、`dev/style-guide`、根为 ``），统一成站点路径 */
      const toPath = (url: unknown) => {
        const raw = String(url).replace(/\/$/, '')
        return raw.startsWith('/') ? raw : `/${raw}`
      }

      return items
        .filter((item) => {
          const path = toPath(item.url)
          if (path.startsWith('/dev/')) return false
          if (path === '/404') return false
          if (hidden.has(path)) return false
          return true
        })
        .map((item) => {
          const post = byUrl.get(toPath(item.url))
          return post
            ? { ...item, lastmod: (post.updated ?? post.date).toISOString() }
            : item
        })
    },
  },

  // 关闭内置 lastUpdated：它取 md 文件的 git 提交时间，对关于/合集等页面无意义；
  // 文章更新时间改由 front-matter 的 updated 驱动（见 lib/posts.ts）
  lastUpdated: false,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['meta', { name: 'theme-color', content: '#3b5fc0' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'author', content: SITE.author }],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: SITE.title,
        href: `/${SITE.feedFile}`,
      },
    ],
  ],

  themeConfig: {
    siteTitle: SITE.title,

    nav: [
      { text: '首页', link: '/' },
      { text: '合集', link: '/series/' },
      { text: '标签', link: '/tags/' },
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: SITE.github },
      { icon: 'rss', link: `/${SITE.feedFile}` },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
        // miniSearch 默认按空白/标点分词，中文整句会成为单个 token，
        // 导致任意中文子串查询无法命中。这里把 CJK 逐字切分、拉丁按词保留。
        miniSearch: {
          options: { tokenize: cjkTokenize },
          searchOptions: { tokenize: cjkTokenize },
        },
        // 默认的索引切分会丢弃第一个带锚点的标题之前的全部内容。
        // 文章页的标题由 front-matter 提供、正文从二级标题开始，因此渲染后
        // 若无 H1 就在 front-matter 之后补一个（走 markdown 渲染以获得锚点），
        // 使整篇文章可被搜索、结果标题为文章标题，且不把 front-matter 混入索引。
        // 默认的索引切分会丢弃第一个带锚点的标题之前的全部内容。
        // 文章页的标题由 front-matter 提供、正文从二级标题开始，因此渲染后
        // 若无 H1 就在 front-matter 之后补一个（走 markdown 渲染以获得锚点），
        // 使整篇文章可被搜索、结果标题为文章标题，且不把 front-matter 混入索引。
        _render: (src, env, md) => {
          const html = md.render(src, env) // 同时填充 env.frontmatter
          // search: false 用于列表/工具页；hidden 的文章同样不应被搜索到
          if (env.frontmatter?.search === false || env.frontmatter?.hidden === true) return ''
          if (/<h1[\s>]/i.test(html)) return html

          const title = env.frontmatter?.title
          if (!title) return html

          const safeTitle = String(title)
            .replace(/\r?\n/g, ' ')
            .replace(/([\\`*_[\]<>])/g, '\\$1')
          const heading = `# ${safeTitle}\n\n`
          const frontmatter = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.exec(src)
          const patched = frontmatter
            ? src.slice(0, frontmatter[0].length) + heading + src.slice(frontmatter[0].length)
            : heading + src

          return md.render(patched, env)
        },
      },
    },

    outline: {
      level: [2, 6],
      label: '目录',
    },

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },

  markdown: {
    math: true,
    image: {
      lazyLoading: true,
    },
    // 编辑风代码高亮（随 VitePress 内置 shiki 提供）
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config: (md) => {
      md.use(figurePlugin)
    },
  },

  /**
   * 构建期把文章元信息注入 front matter：
   * 文章页因此不再需要 import 整份 posts 索引，元信息与 SEO 全部静态产出。
   */
  async transformPageData(pageData, ctx) {
    const base = ctx.siteConfig.site.base
    const params = (pageData.params ?? {}) as Record<string, string>
    const withHead = (entries: unknown[]) => {
      pageData.frontmatter.head = [
        ...((pageData.frontmatter.head as unknown[]) ?? []),
        ...entries,
      ]
    }

    // 动态路由页（/series/<slug>、/tags/<slug>）：标题与描述来自词表
    if (params.series) {
      const def = seriesBySlug(params.series)
      if (def) {
        const url = `/series/${def.slug ?? params.series}`
        const description = def.description ?? `「${def.name}」合集下的全部文章。`
        pageData.title = def.name
        pageData.description = description
        withHead(listingHeadEntries({ title: def.name, description, url }, base))
      }
      return
    }

    if (params.tag) {
      const def = tagBySlug(params.tag)
      if (def) {
        const url = `/tags/${def.slug ?? params.tag}`
        const title = `${def.name} · 标签`
        const description = def.description ?? `标签「${def.name}」下的全部文章。`
        pageData.title = title
        pageData.description = description
        withHead(listingHeadEntries({ title, description, url }, base))
      }
      return
    }

    if (pageData.relativePath === 'index.md') {
      pageData.description = SITE.description
      withHead(siteHeadEntries(base))
      return
    }

    if (pageData.relativePath === 'about.md') {
      const visible = publishedOnly(await loadPosts())
      const byDate = [...visible].sort((a, b) => a.date.getTime() - b.date.getTime())
      const latest = byDate[byDate.length - 1]
      const stats: SiteStats = {
        posts: visible.length,
        words: visible.reduce((sum, post) => sum + post.wordCount, 0),
        series: new Set(visible.map((post) => post.series).filter(Boolean)).size,
        tags: new Set(visible.flatMap((post) => post.tags)).size,
        firstDate: byDate[0] ? formatDate(byDate[0].date) : undefined,
        latestDate: latest ? formatDate(latest.updated ?? latest.date) : undefined,
      }
      pageData.frontmatter.stats = stats
      withHead(
        listingHeadEntries(
          {
            title: '关于',
            description: '关于 Rivhome 与这个博客：写作动机、站点数据与联系方式。',
            url: '/about',
          },
          base,
        ),
      )
      return
    }

    // 其余静态列表页
    const listingPages: Record<string, { title: string; description: string; url: string }> = {
      'series/index.md': {
        title: '合集',
        description: '把一个主题下的内容按顺序排成系列，可以从头读到尾。',
        url: '/series/',
      },
      'tags/index.md': {
        title: '标签',
        description: '按主题横向索引全部文章。',
        url: '/tags/',
      },
      'dev/style-guide.md': {
        title: '排版与写作示例',
        description: '本站全部排版元素与写作约定（开发用验收页）。',
        url: '/dev/style-guide',
      },
    }
    const listing = listingPages[pageData.relativePath]
    if (listing) {
      pageData.description = listing.description
      withHead(listingHeadEntries(listing, base))
      return
    }

    if (!pageData.relativePath.startsWith('posts/')) return

    const posts = await loadPosts()
    const post = posts.find((item) => item.relativePath === pageData.relativePath)
    if (!post) return

    const series = buildSeries(posts)
    const seriesMatch = seriesRefOf(post, series)
    const related = relatedPosts(post, posts, SITE.relatedCount)

    // 全站相邻文章同样在构建期算好，文章页因此无需加载整份文章索引
    const listed = sortForList(publishedOnly(posts))
    const listIndex = listed.findIndex((item) => item.url === post.url)
    const toLink = (item: Post | undefined): PostLink | undefined =>
      item ? { title: item.title, url: item.url } : undefined

    const staleDays = daysBetween(post.updated ?? post.date, new Date())
    const meta: PostPageMeta = {
      title: post.title,
      url: post.url,
      date: toIso(post.date),
      updated: post.updated ? toIso(post.updated) : undefined,
      wordCount: post.wordCount,
      readingTime: post.readingTime,
      tags: post.tags,
      series: seriesMatch?.ref,
      undeclaredSeries: post.series && !seriesMatch ? post.series : undefined,
      related: related.map((item) => ({ title: item.title, url: item.url })),
      prev: listIndex > 0 ? toLink(listed[listIndex - 1]) : undefined,
      next: listIndex >= 0 ? toLink(listed[listIndex + 1]) : undefined,
      staleDays: staleDays > SITE.staleMonths * 30 ? staleDays : undefined,
      revisions: post.revisions,
      cover: post.cover,
      description: post.description,
    }

    pageData.frontmatter.post = meta
    pageData.description = post.description
    withHead(postHeadEntries(post, { base, seriesName: seriesMatch?.info.name }))
  },

  /** 构建收尾：输出 RSS 与构建期校验摘要 */
  async buildEnd(siteConfig) {
    const posts = await loadPosts()
    const visible = publishedOnly(posts)
    const feed = buildRssFeed(posts, { base: siteConfig.site.base })
    fs.writeFileSync(path.join(siteConfig.outDir, SITE.feedFile), feed, 'utf-8')

    const issues = issuesSummary()
    console.log(`[blog] 已生成 ${SITE.feedFile}（${visible.length} 篇文章）`)
    console.log(
      issues.length === 0
        ? '[blog] 构建期校验：无告警'
        : `[blog] 构建期校验：${issues.length} 条告警（见上方 [blog] 输出）`,
    )
  },
})
