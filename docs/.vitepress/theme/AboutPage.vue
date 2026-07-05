<script setup lang="ts">
import { data as stats } from '../stats.data'
</script>

<template>
  <div class="about-page">
    <div class="page-header">
      <h1>关于</h1>
    </div>

    <div class="about-content">
      <section class="about-section">
        <h2>关于我</h2>
        <p>我是 <strong>Rivhome</strong>，一名热爱技术的开发者。</p>
        <p>这个博客用于记录我的学习笔记、技术分享和个人思考。专注于 Web 开发、编程语言、工具效率等领域。</p>
      </section>

      <section class="about-section">
        <h2>博客数据</h2>
        <div class="blog-stats">
          <div class="blog-stat">
            <span class="stat-value">{{ stats.totalPosts }}</span>
            <span class="stat-desc">篇文章已发布</span>
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
        <div class="contact-links">
          <a href="https://github.com/Rivhome" target="_blank" rel="noopener" class="contact-link">
            GitHub
          </a>
          <a href="mailto:rivhome@example.com" class="contact-link">
            Email
          </a>
        </div>
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
  </div>
</template>

<style scoped>
.about-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.about-section {
  margin-bottom: 2.5rem;
}

.about-section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.about-section p {
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}

.blog-stats {
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0 0.5rem;
}

.blog-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}

.stat-desc {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-top: 0.15rem;
}

.stat-note {
  font-size: 0.85rem !important;
  color: var(--vp-c-text-3) !important;
  margin-bottom: 0.25rem !important;
}

.contact-links {
  display: flex;
  gap: 1rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6em 1.2em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.contact-link:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tech-badge {
  font-size: 0.85rem;
  padding: 0.3em 0.8em;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-weight: 500;
}

@media (max-width: 768px) {
  .about-page {
    padding: 1rem 1rem 3rem;
  }
  .blog-stats {
    gap: 0.75rem;
  }
}
</style>
