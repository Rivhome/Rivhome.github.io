import { defineConfig } from 'vitepress'

/** CJK 逐字 + 拉丁单词的分词（索引与查询共用同一函数） */
function cjkTokenize(text: string): string[] {
  return text.toLowerCase().match(/[一-鿿]|[a-z0-9]+/g) ?? []
}

export default defineConfig({
  base: '/',
  lang: 'zh-CN',
  title: "Rivhome's Blog",
  description: 'changing world, one line of code at a time',

  cleanUrls: true,
  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://rivhome.github.io',
  },

  // 关闭内置 lastUpdated：它取 md 文件的 git 提交时间，
  // 对关于/归档等页面无意义且数值误导；文章更新时间改由
  // front-matter 的 updated 字段驱动（见 PostMeta 组件）
  lastUpdated: false,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
    ['meta', { name: 'theme-color', content: '#3b5fc0' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'author', content: 'Rivhome' }],
  ],

  themeConfig: {
    logo: '/images/my-avatar.jpg',
    siteTitle: "Rivhome's Blog",

    // 精简导航：统计 / 更新日志入口移至页脚与关于页
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/archives' },
      { text: '分类', link: '/categories' },
      { text: '标签', link: '/tags' },
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Rivhome' },
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
        // 默认的索引切分会丢弃第一个锚点标题之前的全部内容，
        // 没有 markdown 标题的页面（纯组件页、无标题草稿）几乎不被索引。
        // 这里在渲染索引 HTML 前于 front-matter 之后补一个带锚点的 H1，
        // 使整页内容都可被搜索。仅影响搜索索引，不影响页面本身。
        // 注意：env.frontmatter 要到 md.render 之后才可用，需自行解析。
        _render: (mdSrc, env, md) => {
          const fmBlock = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.exec(mdSrc)
          const titleLine = fmBlock
            ? /^[ \t]*title:[ \t]*(.+?)[ \t]*$/m.exec(fmBlock[0])?.[1]
            : undefined
          const title = titleLine?.replace(/^["']|["']$/g, '')
          const heading = title ? `# ${title}\n\n` : ''
          const src = fmBlock
            ? mdSrc.slice(0, fmBlock[0].length) + heading + mdSrc.slice(fmBlock[0].length)
            : heading + mdSrc
          const html = md.render(src, env)
          return env.frontmatter?.search === false ? '' : html
        },
        // miniSearch 默认按空白/标点分词，中文整句会成为单个 token，
        // 导致任意中文子串查询无法命中。这里把 CJK 逐字切分、拉丁按词保留。
        miniSearch: {
          options: { tokenize: cjkTokenize },
          searchOptions: { tokenize: cjkTokenize },
        },
      },
    },

    outline: {
      level: [2, 6],
      label: '目录',
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
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
  },
})
