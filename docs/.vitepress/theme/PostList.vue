<script setup lang="ts">
import { formatDate } from './utils/format-date'

defineProps<{
  posts: Array<{
    title: string
    url: string
    /** 数据加载器产物经序列化后到达客户端时是 ISO 字符串 */
    date: Date | string
    excerpt: string
    tags: string[]
    categories?: string[]
    pinned?: boolean
    cover?: string
  }>
}>()
</script>

<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post.url" class="post-item">
      <h3 class="post-title">
        <a :href="post.url">{{ post.title }}</a>
        <svg
          v-if="post.pinned"
          class="pin-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-label="置顶"
        ><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z" /></svg>
      </h3>
      <div class="post-meta">
        <time>{{ formatDate(post.date) }}</time>
        <template v-if="post.categories?.length">
          <span class="sep">·</span>
          <span v-for="cat in post.categories" :key="cat">{{ cat }}</span>
        </template>
      </div>
      <p v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt" />
    </article>
  </div>
</template>

<style scoped>
.post-list {
  width: 100%;
}

.post-item {
  padding: var(--bl-space-6) 0;
  border-bottom: 1px solid var(--bl-divider);
}

.post-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.post-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: var(--bl-tracking-tight);
}

.post-title a {
  color: var(--bl-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.post-title a:hover {
  color: var(--bl-accent);
}

.pin-icon {
  color: var(--bl-text-3);
  margin-left: 6px;
  vertical-align: -1px;
}

.post-meta {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  margin-top: 4px;
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
}

.sep {
  opacity: 0.7;
}

.post-excerpt {
  margin: 10px 0 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--bl-text-2);
}

/* 摘要来自 v-html，限制其内部元素不留额外边距 */
.post-excerpt :deep(p) {
  margin: 0;
}

.post-excerpt :deep(a) {
  color: inherit;
  pointer-events: none;
}
</style>
