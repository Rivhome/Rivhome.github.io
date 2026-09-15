# Rivhome's Blog

基于 [VitePress](https://vitepress.dev/) + [Giscus](https://giscus.app/) 构建的个人技术博客。

## 功能

- 📝 Markdown 写作，Git 管理
- 🎨 杂志编辑风设计系统（统一色彩/字体/间距 design tokens）
- 🔤 自托管 Inter / JetBrains Mono 变量字体（拉丁字符）
- 🏷️ 文章分类 & 标签筛选（支持 `?id=` 深链）
- 📅 按年份归档 & 首页年分组列表
- 📊 写作日历热力图 & 统计数据
- 💬 Giscus 评论系统
- 🔍 本地全文搜索
- 🌗 明暗主题切换（vitesse 代码高亮）
- 📱 响应式布局（跟随 VitePress 断点，无全局侧栏）

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
├── posts/                            # 博客文章（一个分类一个文件夹）
│   ├── 算法通关/                      #   分类：算法通关
│   │   └── 1.递归与Master公式.md
│   ├── 生活/                          #   分类：生活
│   │   └── 我的第一篇博客.md
│   └── 站点/                          #   分类：站点
│       └── 排版与写作示例.md
├── .vitepress/
│   ├── config.ts                     # VitePress 配置（导航/侧边栏/搜索等）
│   ├── posts.data.ts                 # 文章数据加载器
│   ├── stats.data.ts                 # 统计数据加载器
│   ├── categories.data.ts            # 分类数据加载器
│   └── theme/                        # 自定义主题
│       ├── index.ts                  # 主题入口 & 全局组件注册
│       ├── BlogLayout.vue            # 全局布局（插槽注入：进度条/文章头部/评论/页脚）
│       ├── HomePage.vue              # 首页内容组件（问候区 + 年分组列表 + 筛选）
│       ├── PostList.vue              # 文章列表组件（标题/日期/摘要）
│       ├── AboutPage.vue             # 关于页面组件
│       ├── BackToTop.vue             # 返回顶部
│       ├── GiscusComment.vue         # Giscus 评论组件
│       ├── ReadingProgress.vue       # 阅读进度条（仅文章页）
│       ├── components/               # 子组件目录
│       │   ├── CategoryList.vue      #   分类筛选行
│       │   ├── ChangelogList.vue     #   更新日志时间轴
│       │   ├── Greeting.vue          #   首页问候区
│       │   ├── PostMeta.vue          #   文章头部 meta（日期/字数/阅读时长/分类/标签）
│       │   ├── PostRow.vue           #   紧凑文章行（归档/分类/标签页共用）
│       │   ├── SiteFooter.vue        #   全站页脚（统计/更新日志入口）
│       │   ├── StatsCalendar.vue     #   写作日历热力图（品牌蓝阶）
│       │   └── TagCloud.vue          #   标签筛选行
│       ├── composables/              # 组合式函数
│       │   └── useMediumZoom.ts      #   图片缩放
│       └── styles/
│           ├── index.css             #   入口：导入下面三个文件 + VitePress 结构覆盖
│           ├── tokens.css            #   design tokens（--bl-* 变量 + VitePress 变量映射）
│           ├── base.css              #   全局基础样式（选区/焦点/滚动条）
│           └── prose.css             #   文章正文排版（.vp-doc）
└── .vitepress/dist/                  # 构建输出（部署用）
```

---

## 写文章

在 `docs/posts/<分类>/` 下创建 `.md` 文件（**一个分类一个文件夹**，文件夹名 = 主分类；front-matter 的 `categories` 仍是网站展示的依据），文件名即文章 slug：

```yaml
---
title: 文章标题
date: 2026-01-01 12:00:00       # 必填，格式 YYYY-MM-DD HH:mm:ss（月/日补零）
updated: 2026-01-02 12:00:00    # 可选，用于"最后更新"
tags: [标签1, 标签2]
categories: [分类1, 分类2]
pinned: false                    # 是否置顶
archived: false                  # 是否归档（true = 不出现在首页/归档/标签/分类/统计中）
---

写在开头的第一段会作为文章摘要显示在列表中。
用一行 `---` 将摘要与正文分隔...

正文其余部分（Markdown 格式）...
```

**注意事项：**
- `date` 用于排序和归档，格式 `YYYY-MM-DD HH:mm:ss`（**月和日必须补零**，如 `2026-07-05`）
- 首段之后加一行 `---` 可将之前的文字作为列表摘要（excerpt）
- `tags` 和 `categories` 会**自动收集**，无需手动配置
- `pinned: true` 的文章会在首页置顶
- `archived: true` 的文章从所有列表隐藏，但仍可通过链接直接访问
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

设计系统定义在 `docs/.vitepress/theme/styles/tokens.css`：自有 token 以 `--bl-*` 为前缀（品牌蓝阶、中性灰、字号阶梯、间距、圆角等，明暗两套），并在同文件末尾映射到 `--vp-c-*` 等 VitePress 变量。组件样式只允许引用 `--bl-*`，不要写裸 hex。

```css
:root {
  --bl-brand-500: #3b5fc0;   /* 品牌主色 */
  --bl-text-body: 1rem;      /* 正文 16px（移动端不缩小） */
  --bl-width-content: 42rem; /* 内容列 672px */
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
