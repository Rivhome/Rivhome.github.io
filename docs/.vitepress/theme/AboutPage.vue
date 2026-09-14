<script setup lang="ts">
import { data as stats } from '../stats.data'
</script>

<template>
  <div class="about-page">
    <div class="page-header">
      <h1>关于</h1>
    </div>

    <section class="about-section">
      <h2>关于我</h2>
      <p>我是 <strong>Rivhome</strong>，这是我的第三次博客——前两次总把博客看得太“高大上”，迟迟不下笔，都不了了之。这一次心态简单了很多：只是写，只是输出。</p>
      <p>这里主要记录我正在接触的领域：网络安全、算法与数学。我现在还是个蒟蒻，但我信费曼学习法——把学到的写出来，即使文章质量并不高，也能夯实所学、分享所想。只要不停地学、不停地写，总有一天，至少会有那么一个机会，让我变得很强。</p>
      <p>至于梦想嘛——想工作时工作，想玩耍时玩耍，不为金钱烦恼，做一条无忧无虑的咸鱼。</p>
    </section>

    <section class="about-section">
      <h2>博客数据</h2>
      <div class="blog-stats">
        <div class="blog-stat">
          <span class="stat-value">{{ stats.totalPosts }}</span>
          <span class="stat-desc">篇文章</span>
        </div>
        <div class="blog-stat">
          <span class="stat-value">{{ stats.totalWords.toLocaleString('zh-CN') }}</span>
          <span class="stat-desc">总字数</span>
        </div>
        <div class="blog-stat">
          <span class="stat-value">{{ stats.totalTags }}</span>
          <span class="stat-desc">个标签</span>
        </div>
        <div class="blog-stat">
          <span class="stat-value">{{ stats.totalCategories }}</span>
          <span class="stat-desc">个分类</span>
        </div>
      </div>
      <p v-if="stats.firstPostDate" class="stat-note">最早文章发布于 {{ stats.firstPostDate }}</p>
      <p v-if="stats.latestPostDate" class="stat-note">最近更新于 {{ stats.latestPostDate }}</p>
    </section>

    <section class="about-section">
      <h2>联系方式</h2>
      <a href="https://github.com/Rivhome" target="_blank" rel="noopener" class="contact-link">
        GitHub @Rivhome
      </a>
    </section>

    <section class="about-section">
      <h2>本站</h2>
      <ul class="site-links">
        <li><a href="/archives">归档</a> — 按年份浏览全部文章</li>
        <li><a href="/stats">统计</a> — 写作日历与发布趋势</li>
        <li><a href="/changelog">更新日志</a> — 文章的创建与更新记录</li>
      </ul>
    </section>

    <section class="about-section">
      <h2>技术栈</h2>
      <p>本站基于以下技术构建：</p>
      <div class="tech-list">
        <span class="tech-badge">VitePress</span>
        <span class="tech-badge">Vue 3</span>
        <span class="tech-badge">TypeScript</span>
        <span class="tech-badge">Markdown</span>
        <span class="tech-badge">Giscus</span>
        <span class="tech-badge">GitHub Pages</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  padding: var(--bl-space-10) 0 0;
}

.page-header h1 {
  margin: 0;
}

.about-section {
  margin-top: 2.5rem;
}

.about-section:first-of-type {
  margin-top: 0;
}

/* 覆盖全局 prose h2 的章节节奏：页面内小节更紧凑 */
.about-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: var(--bl-text-h3);
}

.about-section p {
  line-height: var(--bl-leading-body);
  color: var(--bl-text-2);
  margin: 0 0 0.75rem;
}

/* 博客数据：纯排版数字，无卡片 */
.blog-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bl-space-4) var(--bl-space-8);
  margin: 1rem 0 0.75rem;
}

.blog-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--bl-text-1);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.stat-desc {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.stat-note {
  font-size: var(--bl-text-meta) !important;
  color: var(--bl-text-3) !important;
  margin-bottom: 0.25rem !important;
}

.contact-link {
  color: var(--bl-accent);
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.site-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.site-links li {
  padding: 6px 0;
  font-size: var(--bl-text-small);
  color: var(--bl-text-2);
  line-height: 1.6;
}

.site-links a {
  color: var(--bl-text-1);
  text-decoration: none;
  font-weight: 500;
}

.site-links a:hover {
  color: var(--bl-accent);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bl-space-2);
  margin-top: 0.5rem;
}

.tech-badge {
  font-size: var(--bl-text-small);
  padding: 0.2em 0.6em;
  border-radius: var(--bl-radius-sm);
  background: var(--bl-bg-soft);
  color: var(--bl-text-2);
  font-weight: 500;
}
</style>
