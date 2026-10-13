<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data'
import { buildSeries } from '../../lib/series'
import PostList from './PostList.vue'

const props = defineProps<{
  /** 由动态路由参数传入（/series/<slug>） */
  slug: string
}>()

const series = computed(() => buildSeries(posts).find((item) => item.slug === props.slug))

const totalWords = computed(() =>
  (series.value?.totalWords ?? 0).toLocaleString('zh-CN'),
)
</script>

<template>
  <div v-if="series">
    <header class="series-header">
      <h1 class="series-name">{{ series.name }}</h1>
      <p v-if="series.description" class="series-description">{{ series.description }}</p>
      <p class="series-meta">
        <span>{{ series.posts.length }} 篇</span>
        <span class="sep">·</span>
        <span>共 {{ totalWords }} 字</span>
        <span class="sep">·</span>
        <span>约 {{ series.totalReadingTime }} 分钟</span>
      </p>
    </header>

    <PostList class="series-posts" :posts="series.posts" ordered :show-series="false" />

    <p class="back-link"><a href="/series/">← 全部合集</a></p>
  </div>

  <div v-else>
    <div class="blog-empty">
      <p>没有找到这个合集，可能链接已经过期。</p>
      <p><a href="/series">查看全部合集</a></p>
    </div>
  </div>
</template>

<style scoped>
.series-name {
  font-size: var(--bl-text-h1);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: var(--bl-tracking-tight);
  margin: 0;
  color: var(--bl-text-1);
}

.series-description {
  margin: var(--bl-space-3) 0 0;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--bl-text-2);
}

.series-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5em;
  margin: var(--bl-space-3) 0 0;
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
}

.sep {
  opacity: 0.7;
}

.series-posts {
  margin-top: var(--bl-space-8);
}

.back-link {
  margin-top: var(--bl-space-8);
  font-size: var(--bl-text-small);
}

.back-link a {
  color: var(--bl-text-3);
  text-decoration: none;
}

.back-link a:hover {
  color: var(--bl-accent);
}
</style>
