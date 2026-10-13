# Rivhome's Blog

基于 [VitePress 1.x](https://vitepress.dev/) + Vue 3 + TypeScript 的个人技术博客：
**合集驱动的信息架构**、构建期注入的 SEO/相关文章/订阅源，以及一套自足的编辑风设计系统。

部署目标：`https://rivhome.github.io`（GitHub Actions → GitHub Pages）

---

## 快速开始

```bash
npm install
npm run docs:dev        # 本地开发，http://localhost:5173
npm run docs:build      # 构建到 docs/.vitepress/dist
npm run docs:preview    # 预览构建产物，http://localhost:4173
npm run typecheck       # tsc --noEmit（只检查 .ts；.vue 由 vite 编译）
npm run export:post -- <文章>   # 导出「平台通用 Markdown」用于一稿多投（见「图片」一节）
```

> **改过 `.vitepress/config.ts` 的 markdown / 搜索相关配置后**，请先删除
> `docs/.vitepress/cache` 再构建：VitePress 的 markdown 转换缓存不会因配置变更而失效，
> 复用旧缓存可能得到过期产物（极端情况下会让 esbuild 崩溃）。

---

## 信息架构

| 路由 | 来源文件 | 说明 |
| --- | --- | --- |
| `/` | `docs/index.md` | 首页：问候 → 置顶 → 最近发表/最近更新 → 合集 → 全部文章（按年分组） |
| `/posts/<目录>/<文件>` | `docs/posts/**/*.md` | 文章；目录仅用于组织文件，分类由 front matter 决定 |
| `/series/` | `docs/series/index.md` | 合集总览 |
| `/series/<slug>` | `docs/series/[series].md` + `[series].paths.ts` | 合集详情：简介、有序篇章、总阅读时长 |
| `/tags/` | `docs/tags/index.md` | 全部标签与计数 |
| `/tags/<slug>` | `docs/tags/[tag].md` + `[tag].paths.ts` | 单标签文章列表 |
| `/about` | `docs/about.md` | 关于（正文以 Markdown 为主 + 构建期注入的站点数据） |
| `/dev/style-guide` | `docs/dev/style-guide.md` | 排版与写作示例（开发用验收页，不进搜索/站点地图） |
| `/feed.xml` | 构建期生成 | RSS 2.0 订阅源 |
| `/404.html` | VitePress 生成 | 默认空壳；实际内容由主题 `not-found` 插槽渲染（见 `components/NotFound.vue`） |

---

## 写作

### front matter 契约

```yaml
---
title: 递归与 Master 公式
date: 2026-09-15 22:46:00        # 必填，YYYY-MM-DD HH:mm:ss（月日补零）
updated: 2026-10-02 10:00:00     # 可选，驱动「更新于」、RSS、sitemap lastmod、最近更新
tags: [递归, 复杂度分析]          # 必须在 taxonomy.ts 中声明
series: 算法通关                 # 可选：所属合集，同样必须在 taxonomy.ts 中声明
seriesOrder: 1                   # 属于合集时必填，正整数，决定合集内顺序
description: 一句话摘要           # 可选，SEO 用；缺省由摘要截断生成
cover: /images/xxx.png           # 可选，文章页顶部配图，文件放在 docs/public 下
pinned: false                    # 可选，首页置顶
hidden: false                    # 可选，不进列表/搜索/订阅/站点地图（页面仍可访问）
search: false                    # 可选，单独关闭本地搜索索引（工具页常用）
revisions:                       # 可选，修订记录（两种写法都支持）
  - date: 2026-10-02
    note: 补充 Master 公式推导
  - 2026-10-01 修正一处笔误
---
第一段写在开头，随后单独写一行 `---`，这段文字就会成为列表摘要（excerpt）。
```

### 合集与标签：受控词表

合集名与标签名统一在 **`docs/.vitepress/taxonomy.ts`** 中声明，它是标签/合集的唯一事实来源：

```ts
export const TAGS = [
  { name: '递归', description: '递归的思维方式、系统栈本质与常见题型。' },
  { name: 'Master 公式', aliases: ['Master公式'], description: '…' },
]
export const SERIES = [
  { name: '算法通关', description: '从零开始把算法题过一遍……' },
]
```

为什么要手写词表，而不是从文章里自动收集：

1. 动态路由的 `[*.paths.ts]` 在 VitePress 完成配置解析**之前**执行，此时不能调用
   `createContentLoader`（会报 `content loader invoked without an active vitepress process`），
   只能 import 纯模块来获得路由参数；
2. 统一词形，避免「Master公式 / Master 公式」这类同义标签分裂；
3. 为标签页/合集页提供可索引的说明文字。

文章里出现**未声明**的标签或合集时：页面照常渲染（标签/合集以纯文本展示、不产生死链），
构建期会打印告警并给出可直接粘贴的条目模板。

### 构建期校验（只告警，不中断构建）

| 情况 | 行为 |
| --- | --- |
| `date` 缺失/非法 | 告警 + 回退为文件修改时间 |
| `updated` 非法 | 告警 + 忽略 |
| `series` 有值但 `seriesOrder` 缺失/非法 | 告警，排序落到合集末尾 |
| 同一合集内 `seriesOrder` 重复 | 告警，重复者按日期打破平局 |
| 标签/合集未声明 | 告警 + 输出词表条目模板 |
| `cover` 指向的文件不存在 | 告警 |
| 词表内 slug 冲突 | 告警 |

构建结束会打印一行摘要（`[blog] 构建期校验：无告警` 或告警条数）。

### 排版能力速查

- 代码块：` ```ts [file.ts] `（文件名标签）、`{1,3-5}`（行高亮）、`// [!code ++]` / `[!code --]`（diff）、
  `// [!code focus]`（聚焦）、`::: details 标题`（折叠长代码）
- 图注：`![替代文本](/images/a.png "图注文字")` → `<figure>` + `<figcaption>`（由 `lib/markdown-figure.ts` 实现）
- 数学公式：`$...$` 与 `$$...$$`（VitePress 内置 MathJax）
- 提示容器：`::: info|tip|warning|danger`
- 完整示例见 `docs/dev/style-guide.md`

---

## 图片

### 存放与引用

- 统一放在 `docs/public/images/` 下，按「合集 / 文章短名」分目录：`docs/public/images/<短名>/<描述名>.webp`
- 文件名用 **ASCII 短横线**（如 `recursion-tree.webp`），不要用中文、空格与下划线混排——这样在跨平台搬运、CDN、命令行里都不会出现编码或转义问题
- 正文用**根路径**引用：`![说明](/images/algomaster/recursion-tree.webp "可选图注")`
  - VitePress **不会**为 `public/` 下的根路径图片自动加 `base` 前缀（已核对源码）。因此若将来把站点部署到子路径，需要批量替换这些路径
  - 想让图片「跟着文章走 + 自动加 base + 自动哈希」，可把图片与文章同目录、用相对路径引用（Vite 会按资源处理）；代价是文件名被哈希、图片分散在各文章目录
- 图片的 `title` 会渲染成图注（`<figure>` + `<figcaption>`，见 `lib/markdown-figure.ts`）；点击可放大（medium-zoom）

### 体积约定

| 类型 | 目标 | 说明 |
| --- | --- | --- |
| 示意图 / 截图 | ≤ 200 KB，宽 ≤ 1600px | 内容列 672px，1600px 相当于 2.4× 高分屏，再大只是浪费 |
| 照片 | ≤ 300 KB，宽 ≤ 1600px | WebP 质量 80–85 |
| 头像 / 图标 | ≤ 50 KB | —— |
| 单篇文章图片总量 | 建议 ≤ 1.5 MB | 移动端阅读体验 |

优先 WebP。本仓库的 `images/algomaster/recursion-tree.webp` 就是由 2848×1600 / 1188 KB 的 RGBA PNG 转成 1600×899 / 58.6 KB（**20.3 倍**）。

```bash
# Pillow
python -c "from PIL import Image; im=Image.open('src.png').convert('RGB'); im.thumbnail((1600,10000)); im.save('dst.webp','WEBP',quality=90,method=6)"
# 或 cwebp（线条/文字图可加 -near_lossless 100）
cwebp -q 90 -resize 1600 0 -m 6 src.png -o dst.webp
```

> **先压缩再入库。** 图片一旦提交，Git 历史里就永久保留旧版本，之后删除也不会让仓库变小。

### 跨平台搬运（一稿多投）

正文里的 `/images/...` 是站内根路径，**其他平台无法解析**，搬运时必须换成绝对公开地址：

| 目标平台 | 处理方式 |
| --- | --- |
| 掘金 / CSDN | 编辑器会自动抓取并转存外链图片：把 `/images/x.webp` 换成 `https://rivhome.github.io/images/x.webp` 后直接粘贴 Markdown 即可 |
| 知乎 | 同上（会转存到自己的 CDN）；对外链域名较敏感，转存失败就手动上传 |
| 微信公众号 | **不显示任何外链图片**，必须把图片重新上传到公众号编辑器（或用第三方排版工具导出后再上传） |

推荐的搬运流程：

1. 正文**始终写站内路径** `/images/...`（开发时离线可预览，部署后站点正常）
2. 提交并部署后，图片就有稳定公开地址 `https://rivhome.github.io/images/...`
3. 用导出脚本生成「平台通用 Markdown」，再粘贴到目标平台：

```bash
npm run export:post -- docs/posts/算法通关/1.递归与Master公式.md
# 也可以只给站内路径或文件名：
npm run export:post -- /posts/算法通关/1.递归与Master公式
npm run export:post -- 我的第一篇博客 --stdout
```

产物写到 `exports/<文章名>.md`（`exports/` 已在 `.gitignore` 中）。脚本会做：

- 去掉 front matter 与 `<script setup>`，移除 Vue 组件标签（`<PostList />` 之类）
- **绝对化图片与站内链接**（`/images/...` → `https://rivhome.github.io/images/...`）；行内代码里的路径示例不会被误改
- 降级 VitePress 专有语法：代码块的文件名标签（提到代码块上方）、行高亮 `{1,3-5}`、`// [!code ++]` 等标记、`:line-numbers`
- `::: tip / warning / danger` → 加粗引用块；`::: details` → `<details>` HTML
- 标题自定义锚点 `## 标题 {#id}`、`[[toc]]`、`<!-- @include -->` 一并清理
- 默认在开头补 `# 标题`、结尾附「本文首发于 …」回链
- 打印摘要：改写了多少图片/链接、移除了哪些组件，以及**仍需人工确认**的语法（数学公式、`<kbd>`、原始 HTML、`<details>` 折叠块）

| 选项 | 用途 |
| --- | --- |
| `--stdout` | 不写文件，直接输出到终端（便于管道处理） |
| `--images <前缀>` | 图片地址前缀——**将来换图床或对象存储只改这里** |
| `--out <目录>` | 导出目录（默认 `exports/`） |
| `--no-title` | 不在正文开头补 `# 标题`（目标平台自带标题栏时） |
| `--no-canonical` | 不附「本文首发于 …」回链 |
| `--site <URL>` | 覆盖站点根地址（默认读 `docs/.vitepress/site.ts`，保持单一事实来源） |

微信公众号仍是例外：把导出的 Markdown 粘贴进排版工具后，图片需要在编辑器里重新上传（微信不显示外链图片）。

**不要把绝对 URL 直接写进正文**：新图片在部署前无法本地预览（会 404），将来换域名或换图床还得全文再改一遍。

---

## 项目结构

```
scripts/
└── export-post.mjs                   # 一稿多投导出脚本（见「图片 → 跨平台搬运」）
exports/                              # 导出产物（已在 .gitignore 中）

docs/
├── index.md / about.md
├── posts/                            # 文章（目录仅作组织）
├── series/                           # 合集总览 + 动态路由模板
│   ├── index.md
│   ├── [series].md
│   └── [series].paths.ts
├── tags/                             # 标签总览 + 动态路由模板
├── dev/style-guide.md                # 排版验收页
├── public/                           # 图片、favicon、robots.txt
└── .vitepress/
    ├── config.ts                     # 站点配置 + 构建期管线（transformPageData / buildEnd / sitemap）
    ├── site.ts                       # 站点常量（URL、作者、阈值口径）
    ├── taxonomy.ts                   # 标签与合集词表
    ├── posts.data.ts                 # 列表页数据加载器
    ├── shims.d.ts                    # .vue / .css 模块声明（tsc 用）
    ├── lib/                          # 构建期与纯函数工具
    │   ├── posts.ts                  #   文章采集、front matter 归一化、校验、loadPosts()
    │   ├── series.ts                 #   合集分组/排序/合集内相邻篇章（纯函数，客户端也用）
    │   ├── related.ts                #   相关文章打分
    │   ├── seo.ts                    #   canonical / Open Graph / JSON-LD
    │   ├── feed.ts                   #   RSS 2.0 生成
    │   ├── markdown-figure.ts        #   图注 markdown-it 插件
    │   └── date.ts / text.ts / slug.ts / types.ts
    └── theme/
        ├── index.ts                  # 主题入口（不再做全局组件注册）
        ├── BlogLayout.vue            # 布局分派：文章头部/导航/相关文章/评论/页脚
        ├── components/               # BlogHome、PostHeader、PostList、Series*、Tag*、NotFound…
        ├── composables/useMediumZoom.ts
        └── styles/
            ├── tokens.css            # design tokens（--bl-* + VitePress 变量映射）
            ├── base.css              # 全局元素级样式
            ├── prose.css             # .vp-doc 正文排版（含 figure / details）
            ├── components.css        # 组件驱动页面（layout: page）与首页共用排版
            └── index.css             # 入口 + VitePress 结构覆盖
```

---

## 构建期管线

- **`transformPageData`**：给文章页注入 `frontmatter.post`（标题/日期/字数/阅读时长/标签/合集进度/
  相关文章/全站相邻文章/修订记录/久未更新天数）并生成 SEO head；
  给 `/about` 注入 `frontmatter.stats`；给列表页与动态路由页设置标题与描述。
  因此**文章页不需要加载整份文章索引**，元信息都是静态产物。
- **`buildEnd`**：输出 `feed.xml`（RSS 2.0）并打印构建期校验摘要。
- **`sitemap.transformItems`**：剔除 `/dev/*`、`/404` 与 hidden 文章，并用 `updated || date` 写入 `lastmod`。
- **`search.options._render`**：文章页标题在 front matter、正文从二级标题开始，
  而默认索引切分会丢弃第一个带锚点标题之前的内容；这里在 front matter **之后**补一个
  markdown H1（保留锚点、不把 front matter 混入索引），使整篇文章可被搜索、结果标题为文章标题。
  同时尊重 `search: false` 与 `hidden: true`。
- **动态路由**：`[series].paths.ts` / `[tag].paths.ts` 只依赖 `taxonomy.ts`（纯模块），
  生成真正的静态页 `/series/算法通关`、`/tags/递归`，无查询参数深链。

---

## 设计系统

唯一事实来源是 `styles/tokens.css` 里的 `--bl-*`（品牌蓝阶、中性色、字号阶梯、间距、圆角），
并在同文件末尾映射到 `--vp-c-*` 等 VitePress 变量，让 outline / 搜索弹窗 / 提示容器免费继承。

**组件样式只允许引用 `--bl-*`，不要写裸 hex。** 组件驱动页面（`layout: page`）不在 `.vp-doc` 内，
因此页面级排版放在 `components.css`；文章正文排版放在 `prose.css`。

---

## 已知限制

- **动态路由页不进本地搜索索引**：VitePress 按 `.md` 文件路径建立索引，而
  `/series/算法通关`、`/tags/递归` 在磁盘上没有对应文件。可发现性由 `/series/`、`/tags/`
  两个静态总览页承担；文章本身始终被索引。
- **评论与 URL 绑定**：Giscus 使用 `mapping: pathname`，改动文章 URL 会让已有评论与文章脱钩。
- **搜索索引里的 front matter**：已通过「在 front matter 之后插入 H1」避免污染；若新增
  需要在搜索中排除的页面，请用 `search: false` 或 `hidden: true`。
- **`@types/node` 为类型检查所需**（`npm run typecheck`），构建本身不依赖它。

---

## 部署

推送到 `main` 触发 `.github/workflows/deploy.yml`：`npm ci` → `npm run docs:build` →
上传 `docs/.vitepress/dist` → 发布到 GitHub Pages。

变更域名或子路径时只需改 `docs/.vitepress/site.ts` 的 `SITE.url` / `SITE.base`
（`config.ts` 的 sitemap 已引用 `SITE.url`），以及 `docs/public/robots.txt` 中的 sitemap 地址。

---

## 技术栈

| 技术 | 用途 |
| --- | --- |
| VitePress 1.x | 静态站点生成器（含本地搜索、MathJax、Shiki 代码高亮） |
| Vue 3 | UI 组件框架 |
| TypeScript | 构建期数据管线与类型检查 |
| Giscus | 评论系统（基于 GitHub Discussions） |
| GitHub Pages | 静态托管 |
