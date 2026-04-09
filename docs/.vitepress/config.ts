import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    base: '/',
    lang: 'zh-CN',
    title: "Rivhome's Blog",
    description: 'changing world, one line of code at a time',

    cleanUrls: true,

    sitemap: {
      hostname: 'https://rivhome.github.io',
    },

    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
      ['meta', { name: 'theme-color', content: '#ffffff' }],
    ],

    themeConfig: {
      logo: '/images/my-avatar.jpg',
      siteTitle: "Rivhome's Blog",

      nav: [
        { text: '首页', link: '/' },
        { text: '归档', link: '/archives' },
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
                button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
                modal: {
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                  footer: { selectText: '选择', navigateText: '切换' },
                },
              },
            },
          },
        },
      },

      outline: {
        level: [2, 6],
        label: '目录',
      },

      docFooter: { prev: '上一篇', next: '下一篇' },
      lastUpdated: { text: '最后更新于' },
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
    },
  }),
)
