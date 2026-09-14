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
</script>

<div class="archives-page">
  <div class="page-header">
    <h1>归档</h1>
    <p class="page-summary">共 {{ posts.length }} 篇文章</p>
  </div>

  <div v-for="year in years" :key="year" :id="`year-${year}`" class="archive-year">
    <h2 class="year-heading">
      {{ year }}
      <span class="year-count">{{ grouped[year].length }} 篇</span>
    </h2>
    <ul class="post-rows">
      <PostRow
        v-for="post in grouped[year]"
        :key="post.url"
        :url="post.url"
        :title="post.title"
        :date="post.date"
        short
      />
    </ul>
  </div>

  <div v-if="posts.length === 0" class="empty-state">
    <p>暂无文章</p>
  </div>
</div>

<style scoped>
.archives-page {
  padding: var(--bl-space-10) 0 0;
}

.page-header h1 {
  margin: 0;
}

.page-summary {
  color: var(--bl-text-3);
  font-size: var(--bl-text-meta);
  margin: 4px 0 0;
}

.archive-year {
  margin-top: 2.5rem;
}

.year-heading {
  font-size: var(--bl-text-meta);
  font-weight: 500;
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 var(--bl-space-2);
}

.year-count {
  font-weight: 400;
}

.post-rows {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: var(--bl-space-20) 0;
  color: var(--bl-text-3);
}
</style>
