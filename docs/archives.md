---
layout: doc
title: 归档
aside: false
---

<script setup lang="ts">
import { data as posts } from '.vitepress/posts.data'

const grouped = posts.reduce((acc, post) => {
  const year = new Date(post.date).getFullYear()
  if (!acc[year]) acc[year] = []
  acc[year].push(post)
  return acc
}, {} as Record<number, typeof posts>)

const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<div class="archives-page">
  <div class="page-header">
    <h1>归档</h1>
    <p class="page-summary">共 {{ posts.length }} 篇文章</p>
  </div>

  <div class="year-nav" v-if="years.length > 0">
    <a v-for="year in years" :key="year" :href="`#year-${year}`" class="year-nav-link">{{ year }}</a>
  </div>

  <div v-for="year in years" :key="year" :id="`year-${year}`" class="archive-year">
    <h2 class="year-heading">
      {{ year }}
      <span class="year-count">{{ grouped[year].length }} 篇</span>
    </h2>
    <ul class="year-posts">
      <li v-for="post in grouped[year]" :key="post.url" class="year-post">
        <time :datetime="post.date.toString()">{{ formatDate(post.date) }}</time>
        <a :href="post.url" class="year-post-title">{{ post.title }}</a>
      </li>
    </ul>
  </div>

  <div v-if="posts.length === 0" class="empty-state">
    <p>暂无文章</p>
  </div>
</div>

<style scoped>
.archives-page {
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
  margin: 0 0 0.5rem;
}

.page-summary {
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
  margin: 0;
}

.year-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.year-nav-link {
  font-size: 0.85rem;
  padding: 0.3em 0.8em;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.2s;
}

.year-nav-link:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.archive-year {
  margin-bottom: 2.5rem;
}

.year-heading {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.year-count {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.year-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.year-post {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.year-post:last-child {
  border-bottom: none;
}

.year-post time {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 5rem;
}

.year-post-title {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}

.year-post-title:hover {
  color: var(--vp-c-brand-1);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .archives-page {
    padding: 1rem 1rem 3rem;
  }
  .year-post {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
