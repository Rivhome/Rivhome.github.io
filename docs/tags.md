---
layout: doc
title: 标签
aside: false
---

<script setup lang="ts">
import { data as tags } from '.vitepress/tags.data'
import { ref, computed } from 'vue'

const activeTag = ref('')

const filteredTags = computed(() => {
  if (!activeTag.value) return tags
  const result: typeof tags = {}
  result[activeTag.value] = tags[activeTag.value]
  return result
})

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<div class="tags-page">
  <div class="page-header">
    <h1>标签</h1>
    <p class="page-summary">共 {{ Object.keys(tags).length }} 个标签</p>
  </div>

  <div class="tag-cloud-wrapper">
    <TagCloud :tags="tags" :active-tag="activeTag" @select-tag="(t) => activeTag = t" />
  </div>

  <div class="tag-groups" v-if="Object.keys(filteredTags).length > 0">
    <div v-for="(posts, tag) in filteredTags" :key="tag" class="tag-section">
      <h2>
        <span class="tag-name"># {{ tag }}</span>
        <span class="tag-count">{{ posts.length }} 篇</span>
      </h2>
      <ul class="tag-posts">
        <li v-for="post in posts" :key="post.url">
          <time>{{ formatDate(post.date) }}</time>
          <a :href="post.url">{{ post.title }}</a>
        </li>
      </ul>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>暂无标签数据</p>
  </div>
</div>

<style scoped>
.tags-page {
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

.tag-cloud-wrapper {
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.tag-groups {
  margin-top: 1rem;
}

.tag-section {
  margin-bottom: 2rem;
}

.tag-section h2 {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0.75rem;
}

.tag-name {
  color: var(--vp-c-brand-1);
}

.tag-count {
  font-size: 0.75em;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.tag-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-posts li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tag-posts li:last-child {
  border-bottom: none;
}

.tag-posts time {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 6rem;
}

.tag-posts a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.tag-posts a:hover {
  color: var(--vp-c-brand-1);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .tags-page {
    padding: 1rem 1rem 3rem;
  }
  .tag-posts li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }
}
</style>
