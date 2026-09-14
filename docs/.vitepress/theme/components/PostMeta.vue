<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../../posts.data'
import { formatDate } from '../utils/format-date'

const route = useRoute()
const { frontmatter } = useData()

const post = computed(() => {
  const path = decodeURIComponent(route.path.replace(/\.html$/, ''))
  return posts.find((p) => p.url === path)
})

// 标题兜底用 frontmatter（archived 文章不在 posts 数据中，但仍可直接访问）
const title = computed(() => post.value?.title ?? (frontmatter.value.title as string) ?? '')
</script>

<template>
  <header class="post-header">
    <h1 class="post-title">{{ title }}</h1>
    <div v-if="post" class="post-meta">
      <time>{{ formatDate(post.date) }}</time>
      <template v-if="post.wordCount > 0">
        <span class="sep">·</span>
        <span>{{ post.wordCount.toLocaleString('zh-CN') }} 字</span>
        <span class="sep">·</span>
        <span>{{ post.readingTime }} 分钟</span>
      </template>

      <template v-if="post.categories.length">
        <span class="sep">·</span>
        <a
          v-for="cat in post.categories"
          :key="cat"
          class="meta-link"
          :href="`/categories?id=${encodeURIComponent(cat)}`"
        >{{ cat }}</a>
      </template>

      <template v-if="post.tags.length">
        <span class="sep">·</span>
        <a
          v-for="tag in post.tags"
          :key="tag"
          class="meta-link"
          :href="`/tags?id=${encodeURIComponent(tag)}`"
        >#{{ tag }}</a>
      </template>
    </div>
  </header>
</template>

<style scoped>
.post-header {
  margin-bottom: var(--bl-space-8);
}

/* PostMeta 渲染在 .vp-doc 之外，标题样式在此自足 */
.post-title {
  font-size: var(--bl-text-h1);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: var(--bl-tracking-tight);
  margin: 0 0 var(--bl-space-4);
  color: var(--bl-text-1);
}

.post-meta {
  font-size: var(--bl-text-meta);
  line-height: 1.5;
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.5em;
  row-gap: 0.25em;
}

.sep {
  opacity: 0.7;
}

.meta-link {
  color: var(--bl-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.meta-link:hover {
  color: var(--bl-accent);
}
</style>
