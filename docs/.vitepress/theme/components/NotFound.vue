<script setup lang="ts">
/**
 * 自定义 404。
 *
 * 为什么不用 docs/404.md：VitePress 对未知路径的路由数据是
 * notFoundPageData（见 client/app/router.js），渲染的是主题的
 * not-found 插槽，而不是名为 404.md 的页面。因此自定义 404 必须
 * 通过插槽覆盖；dist/404.html 仍由 VitePress 生成（GitHub Pages 用它兜底）。
 */
</script>

<template>
  <div class="blog-page not-found">
    <h1>404 · 页面不存在</h1>
    <p>这里没有你要找的内容，可能是链接过期，也可能是地址拼写有误。</p>

    <ul class="not-found-links">
      <li><a href="/">回到首页</a></li>
      <li><a href="/series/">浏览合集</a></li>
      <li><a href="/tags/">按标签查找</a></li>
    </ul>

    <p class="not-found-hint">
      提示：按 <kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> 可以直接搜索全站文章。
    </p>
  </div>
</template>

<style scoped>
.not-found-links {
  list-style: none;
  margin: 0 0 var(--bl-space-6);
  padding: 0;
}

.not-found-links li {
  padding: 6px 0;
}

.not-found-links a {
  color: var(--bl-text-1);
  text-decoration: none;
  font-weight: 500;
}

.not-found-links a:hover {
  color: var(--bl-accent);
}

.not-found-hint {
  margin: 0;
  font-size: var(--bl-text-small);
  color: var(--bl-text-3);
}

kbd {
  font-family: var(--bl-font-mono);
  font-size: 0.8125em;
  padding: 0.15em 0.4em;
  border: 1px solid var(--bl-border-strong);
  border-radius: var(--bl-radius-sm);
  background: var(--bl-bg-soft);
  color: var(--bl-text-2);
}
</style>
