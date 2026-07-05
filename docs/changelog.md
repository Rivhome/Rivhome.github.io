---
layout: doc
title: 更新日志
aside: false
---

<script setup lang="ts">
import { data as posts } from '.vitepress/posts.data'

// Show posts sorted by updated date or creation date
const changelogPosts = posts
  .map(p => ({
    ...p,
    sortDate: new Date(p.updated || p.date),
  }))
  .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
</script>

<div class="changelog-page">
  <div class="page-header">
    <h1>更新日志</h1>
    <p class="page-summary">共 {{ posts.length }} 篇文章的更新记录</p>
  </div>

  <ChangelogList :posts="changelogPosts" />

  <div v-if="posts.length === 0" class="empty-state">
    <p>暂无更新记录</p>
  </div>
</div>

<style scoped>
.changelog-page {
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

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .changelog-page {
    padding: 1rem 1rem 3rem;
  }
}
</style>
