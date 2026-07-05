# Rivhome's Blog

基于 [VitePress](https://vitepress.dev/) + [Giscus](https://giscus.app/) 构建的个人技术博客。

## 功能

- 📝 Markdown 写作，Git 管理
- 🏷️ 文章分类 & 标签筛选
- 📊 写作日历热力图 & 统计数据
- 📅 按年份归档 & 更新日志时间轴
- 👤 关于页面（博客数据统计）
- 💬 Giscus 评论系统
- 🔍 本地全文搜索
- 🌗 明暗主题切换
- 📱 响应式布局

---

## 本地开发

```bash
npm install
npm run docs:dev
```

浏览器打开 `http://localhost:5173` 预览。

## 构建 & 预览

```bash
npm run docs:build    # 构建到 docs/.vitepress/dist
npm run docs:preview  # 预览构建结果（需先 build）
```

---

## 项目结构

```
docs/
├── index.md                          # 首页
├── about.md                          # 关于页面
├── archives.md                       # 归档页面
├── tags.md                           # 标签页面
├── categories.md                     # 分类页面
├── stats.md                          # 统计页面
├── changelog.md                      # 更新日志
├── posts/                            # 博客文章
│   ├── 如何搭建个人博客-hexo-githubpages.md
│   ├── markdown-写作最佳实践.md
│   └── ...
├── .vitepress/
│   ├── config.ts                     # VitePress 配置（导航/侧边栏/搜索等）
│   ├── posts.data.ts                 # 文章数据加载器
│   ├── stats.data.ts                 # 统计数据加载器
│   ├── categories.data.ts            # 分类数据加载器
│   └── theme/                        # 自定义主题
│       ├── index.ts                  # 主题入口 & 全局组件注册
│       ├── BlogLayout.vue            # 全局布局（含 Giscus 评论）
│       ├── HomePage.vue              # 首页内容组件
│       ├── PostList.vue              # 文章列表组件
│       ├── AboutPage.vue             # 关于页面组件
│       ├── BackToTop.vue             # 返回顶部
│       ├── GiscusComment.vue         # Giscus 评论组件
│       ├── ReadingProgress.vue       # 阅读进度条
│       ├── components/               # 子组件目录
│       │   ├── CategoryList.vue      #   分类列表
│       │   ├── ChangelogList.vue     #   更新日志列表
│       │   ├── Pagination.vue        #   分页
│       │   ├── ProfileCard.vue       #   个人卡片
│       │   ├── StatsCalendar.vue     #   统计日历
│       │   └── TagCloud.vue          #   标签云
│       ├── composables/              # 组合式函数
│       │   ├── useMediumZoom.ts      #   图片缩放
│       │   └── usePagination.ts      #   分页逻辑
│       └── styles/
│           └── index.css             # 全局样式
└── .vitepress/dist/                  # 构建输出（部署用）
```

---

## 写文章

在 `docs/posts/` 下创建 `.md` 文件，文件名即文章 slug：

```yaml
---
title: 文章标题
date: 2026-01-01 12:00:00
updated: 2026-01-02 12:00:00    # 可选，用于"最后更新"
tags: [标签1, 标签2]
categories: [分类1, 分类2]
pinned: false                    # 是否置顶
archived: false                  # 是否归档（不显示在首页）
---

文章正文（Markdown 格式）...
```

**注意事项：**
- `date` 用于排序和归档，格式 `YYYY-MM-DD HH:mm:ss`
- `tags` 和 `categories` 会**自动收集**，无需手动配置
- `pinned: true` 的文章会在首页置顶
- 文件名不要包含特殊字符，建议用中文或英文连字符命名

---

## 添加新页面

1. 在 `docs/` 下创建 `.md` 文件，设置 `layout: doc`
2. 如需自定义内容，在 `theme/` 下创建对应的 `.vue` 组件
3. 在 `theme/index.ts` 中注册全局组件
4. 在 `config.ts` 的 `nav` 中添加导航链接

```yaml
---
layout: doc
title: 页面标题
aside: false    # 如不需要右侧大纲可关闭
---
```

---

## 自定义样式

全局样式在 `docs/.vitepress/theme/styles/index.css`，CSS 变量定义在 `:root` 中：

```css
:root {
  --vp-c-brand-1: #3b5fc0;           /* 主题色 */
  --vp-c-brand-2: #5470d6;           /* 悬停色 */
  --vp-font-family-base: ...;        /* 中文字体栈 */
}
```

---

## 部署

推送 `main` 分支到 GitHub 自动触发 GitHub Actions 部署到 GitHub Pages。

部署目标：`https://rivhome.github.io`

---

## 技术栈

| 技术 | 用途 |
|------|------|
| VitePress 1.x | 静态站点生成器 |
| Vue 3 | UI 组件框架 |
| TypeScript | 数据加载器 |
| Giscus | 评论系统（基于 GitHub Discussions） |
| GitHub Pages | 静态托管 |
