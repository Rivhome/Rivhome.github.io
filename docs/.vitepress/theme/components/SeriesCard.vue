<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '../../lib/date'
import type { SeriesInfo } from '../../lib/series'

const props = defineProps<{
  series: SeriesInfo
}>()

const latest = computed(() => {
  const posts = props.series.posts
  return posts.length > 0 ? posts[posts.length - 1] : undefined
})

const preview = computed(() => props.series.posts.slice(0, 3))
</script>

<template>
  <article class="series-card">
    <h2 class="series-title">
      <a :href="`/series/${series.slug}`">{{ series.name }}</a>
    </h2>

    <p v-if="series.description" class="series-description">{{ series.description }}</p>

    <p class="series-meta">
      <span>{{ series.posts.length }} 篇</span>
      <span class="sep">·</span>
      <span>共 {{ series.totalWords.toLocaleString('zh-CN') }} 字</span>
      <span class="sep">·</span>
      <span>约 {{ series.totalReadingTime }} 分钟</span>
      <template v-if="latest">
        <span class="sep">·</span>
        <span>最近一篇 {{ formatDate(latest.date) }}</span>
      </template>
    </p>

    <ol class="series-preview">
      <li v-for="post in preview" :key="post.url">
        <a :href="post.url">{{ post.title }}</a>
      </li>
      <li v-if="series.posts.length > preview.length" class="more">
        <a :href="`/series/${series.slug}`">…… 查看全部 {{ series.posts.length }} 篇</a>
      </li>
    </ol>
  </article>
</template>

<style scoped>
.series-card {
  padding: var(--bl-space-6) 0;
  border-bottom: 1px solid var(--bl-divider);
}

.series-card:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.series-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: var(--bl-tracking-tight);
  border: none;
  padding: 0;
}

.series-title a {
  color: var(--bl-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.series-title a:hover {
  color: var(--bl-accent);
}

.series-description {
  margin: 6px 0 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--bl-text-2);
}

.series-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5em;
  margin: 8px 0 0;
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
}

.sep {
  opacity: 0.7;
}

.series-preview {
  list-style: none;
  margin: var(--bl-space-4) 0 0;
  padding: 0 0 0 var(--bl-space-4);
  border-left: 1px solid var(--bl-divider);
}

.series-preview li {
  padding: 3px 0;
}

.series-preview a {
  color: var(--bl-text-2);
  text-decoration: none;
  font-size: var(--bl-text-small);
  line-height: 1.7;
  transition: color 0.2s;
}

.series-preview a:hover {
  color: var(--bl-accent);
}

.more a {
  color: var(--bl-text-3);
}
</style>
