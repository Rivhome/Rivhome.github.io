---
layout: doc
title: 标签
aside: false
---

<script setup lang="ts">
import { data as tags } from '.vitepress/tags.data'
import { ref, computed, onMounted } from 'vue'

const activeTag = ref('')

// 支持 /tags?id=xxx 深链（文章详情页的标签链接会带此参数）
onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id')
  if (id && tags[id]) {
    activeTag.value = id
  }
})

const filteredTags = computed(() => {
  if (!activeTag.value) return tags
  const result: typeof tags = {}
  result[activeTag.value] = tags[activeTag.value]
  return result
})
</script>

<div class="tags-page">
  <div class="page-header">
    <h1>标签</h1>
    <p class="page-summary">共 {{ Object.keys(tags).length }} 个标签</p>
  </div>

  <TagCloud :tags="tags" :active-tag="activeTag" @select-tag="(t) => (activeTag = t)" />

  <div class="tag-groups" v-if="Object.keys(filteredTags).length > 0">
    <div v-for="(posts, tag) in filteredTags" :key="tag" class="tag-section">
      <h2 class="section-heading">
        # {{ tag }}
        <span class="section-count">{{ posts.length }} 篇</span>
      </h2>
      <ul class="post-rows">
        <PostRow
          v-for="post in posts"
          :key="post.url"
          :url="post.url"
          :title="post.title"
          :date="post.date"
        />
      </ul>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>暂无标签数据</p>
  </div>
</div>

<style scoped>
.tags-page {
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

.tag-section {
  margin-top: 2.5rem;
}

.section-heading {
  font-size: var(--bl-text-meta);
  font-weight: 500;
  color: var(--bl-text-3);
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 var(--bl-space-2);
}

.section-count {
  font-weight: 400;
  font-variant-numeric: tabular-nums;
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
