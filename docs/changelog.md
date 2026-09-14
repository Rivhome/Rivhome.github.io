---
layout: doc
title: 更新日志
aside: false
---

<script setup lang="ts">
import { data as posts } from '.vitepress/posts.data'

// Show posts sorted by updated date or creation date
const changelogPosts = posts
  .map((p) => ({
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

  <div class="changelog-body">
    <ChangelogList :posts="changelogPosts" />
  </div>

  <div v-if="posts.length === 0" class="empty-state">
    <p>暂无更新记录</p>
  </div>
</div>

<style scoped>
.changelog-page {
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

.changelog-body {
  margin-top: 2.5rem;
}

.empty-state {
  text-align: center;
  padding: var(--bl-space-20) 0;
  color: var(--bl-text-3);
}
</style>
