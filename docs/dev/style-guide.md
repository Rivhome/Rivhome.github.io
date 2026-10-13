---
layout: doc
title: 排版与写作示例
aside: false
search: false
---

# 排版与写作示例

本文汇总本站的全部排版元素与写作约定，用于写作时对照、以及重构后的视觉验收。
它位于 `docs/dev/` 下（不在 `posts/` 里），因此不会出现在文章列表、合集、RSS 与站点地图中。

## 标题层级

### 三级标题

正文段落：中文排版以「字为骨架」，正文 16px、行高 1.85、段间距 1.375em。移动端字号不缩小，保证可读性。

#### 四级标题

四级及以下标题用于更细的结构划分。

## 行内元素

普通文字中可以包含 **加粗**、*斜体*、~~删除线~~、[链接](https://vitepress.dev/)、行内代码 `const answer = 42`，以及键盘按键 <kbd>Ctrl</kbd> + <kbd>K</kbd>。

## 引用

> 引用块使用左侧品牌色细线加文字缩进。
>
> 可以包含多段内容，用于摘录或补充说明。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套项
- 第三项

有序列表：

1. 克制
2. 留白
3. 排版

## 代码块

带文件名的代码块：在语言后面用方括号写文件名，会自动成为代码块左上角的标签。

```ts [count-words.ts]
// 中文按字符、英文按词统计字数
export function countWords(md: string): number {
  const cjk = md.match(/[\u4e00-\u9fff]/g)?.length ?? 0
  const latin = md.match(/[A-Za-z][A-Za-z0-9'_-]*/g)?.length ?? 0
  return cjk + latin
}
```

行高亮与聚焦（`{1,3-5}` / `// [!code focus]`）：

```cpp {2,5-6}
int f(const vector<int>& arr, int l, int r) {
  if (l == r) return arr[l];        // 高亮行
  int mid = l + ((r - l) >> 1);
  int left = f(arr, l, mid);
  int right = f(arr, mid + 1, r);   // 高亮行
  return max(left, right);          // 高亮行
}
```

差异标记（`// [!code ++]` 与 `// [!code --]`）：

```ts
const timeout = 3000 // [!code --]
const timeout = 5000 // [!code ++]
```

长代码可以折叠进 `details` 容器：

::: details 展开查看：Master 公式三种情形
设递归关系为 $T(n) = aT(n/b) + O(n^d)$，则

- $\log_b a < d$：$T(n) = O(n^d)$
- $\log_b a = d$：$T(n) = O(n^d \log n)$
- $\log_b a > d$：$T(n) = O(n^{\log_b a})$
:::

```bash
# 本地开发与构建
npm run docs:dev
npm run docs:build
```

```css
/* 组件样式只允许引用 --bl-* 变量 */
.post-title a {
  color: var(--bl-text-1);
  transition: color 0.2s;
}
```

## 表格

| 断点 | 宽度 | 行为 |
| ---- | ---- | ---- |
| 移动端 | < 768px | 单列、汉堡菜单 |
| 平板 | 768–959px | 横向菜单 |
| 桌面 | ≥ 960px | 单栏内容列 |

## 提示容器

::: info 信息
普通信息说明。
:::

::: tip 提示
推荐的做法或技巧。
:::

::: warning 注意
需要留意的地方。
:::

::: danger 警告
可能导致问题的操作。
:::

## 数学公式

行内公式 $E = mc^2$，以及块级公式：

$$
T(n) = aT\left(\frac{n}{b}\right) + O(n^d)
$$

## 图片与图注

给图片写 `title`（Markdown 里图片路径后面的引号内容），就会渲染成带回退图注的 `figure`：

![递归调用示意图](/images/algomaster/recursion-tree.webp "图注：递归求数组最大值的调用过程，图片点击可放大")

不带 `title` 的图片仍是普通居中的图片，行为和以前一致：

![递归调用示意图](/images/algomaster/recursion-tree.webp)

### 图片规范速查

| 项 | 约定 |
| --- | --- |
| 存放 | `docs/public/images/<合集或文章短名>/<描述名>.webp`，文件名为 ASCII 短横线 |
| 引用 | `![说明](/images/<目录>/<文件>.webp "可选图注")`；根路径不会自动加 `base`，换子路径部署时需批量替换 |
| 体积 | 示意图 / 截图 ≤ 200 KB 且宽 ≤ 1600px；优先 WebP（示例图由 1188 KB 压到 58.6 KB） |
| 图注 | 写 `title` 即渲染 `<figure>` + `<figcaption>`；点击可放大 |
| 跨平台搬运 | 正文写站内路径，导出时把 `](/images/` 替换为 `](https://rivhome.github.io/images/`；微信公众号不显示外链图片，需在编辑器里重新上传 |

## 分隔线

---

## 写作约定速查

### 文章 front matter

```yaml
---
title: 文章标题
date: 2026-09-15 22:46:00      # 必填，YYYY-MM-DD HH:mm:ss（月日补零）
updated: 2026-10-02 10:00:00   # 可选，改动正文后更新
tags: [递归, 复杂度分析]        # 必须已在 taxonomy.ts 声明
series: 算法通关               # 可选：所属合集
seriesOrder: 1                 # 属于合集时必填，正整数
description: 一句话摘要         # 可选，SEO 用；缺省从摘要截断
cover: /images/xxx.png         # 可选，文章页顶部配图
pinned: false                  # 可选，首页置顶
hidden: false                  # 可选，不进列表/搜索/订阅/站点地图（页面仍可直接访问）
search: false                  # 可选，单独控制本地搜索索引（工具页常用）
revisions:                     # 可选，修订记录（article:modified_time 取 updated）
  - date: 2026-10-02
    note: 补充 Master 公式推导
---
第一段写在开头，并在其后单独写一行 `---`，这段文字就会作为列表摘要。
```

### 合集与标签

- 合集名与标签名都必须在 `docs/.vitepress/taxonomy.ts` 中声明：
  未声明时会正常渲染，但构建期会打印告警并给出可粘贴的条目模板，
  且该合集/标签不会生成独立页面（文章页上以纯文本展示，不产生死链）。
- 合集内顺序由 `seriesOrder` 决定；序号缺失或重复时构建期告警。
- 标签路由为 `/tags/<slug>`、合集路由为 `/series/<slug>`，
  slug 由名称归一化得到（小写、空白转 `-`、剔除 URL 不安全字符）。
