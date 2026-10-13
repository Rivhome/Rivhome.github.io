<script setup lang="ts">
import type { SeriesRef } from '../../lib/types'

defineProps<{
  series: SeriesRef
}>()
</script>

<template>
  <nav class="series-nav" aria-label="合集内导航">
    <a class="series-home" :href="`/series/${series.slug}`">
      <span class="series-name">合集《{{ series.name }}》</span>
      <span class="series-progress">
        第 {{ series.index }} / {{ series.total }} 篇 · 合集约 {{ series.totalReadingTime }} 分钟
      </span>
    </a>

    <div class="series-neighbors">
      <a v-if="series.prev" class="neighbor" :href="series.prev.url">
        <span class="neighbor-label">合集内上一篇</span>
        <span class="neighbor-title">← {{ series.prev.title }}</span>
      </a>
      <span v-else class="neighbor disabled">
        <span class="neighbor-label">合集内上一篇</span>
        <span class="neighbor-title">已经是第一篇</span>
      </span>

      <a v-if="series.next" class="neighbor neighbor-right" :href="series.next.url">
        <span class="neighbor-label">合集内下一篇</span>
        <span class="neighbor-title">{{ series.next.title }} →</span>
      </a>
      <span v-else class="neighbor neighbor-right disabled">
        <span class="neighbor-label">合集内下一篇</span>
        <span class="neighbor-title">已经是最后一篇</span>
      </span>
    </div>
  </nav>
</template>

<style scoped>
.series-nav {
  margin-top: var(--bl-space-10);
  padding-top: var(--bl-space-6);
  border-top: 1px solid var(--bl-divider);
}

.series-home {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5em;
  text-decoration: none;
}

.series-name {
  font-size: var(--bl-text-body);
  font-weight: 600;
  color: var(--bl-text-1);
}

.series-home:hover .series-name {
  color: var(--bl-accent);
}

.series-progress {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.series-neighbors {
  display: flex;
  justify-content: space-between;
  gap: var(--bl-space-4);
  margin-top: var(--bl-space-4);
}

.neighbor {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  text-decoration: none;
}

.neighbor-right {
  text-align: right;
  align-items: flex-end;
}

.neighbor-label {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.neighbor-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--bl-text-1);
  transition: color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

a.neighbor:hover .neighbor-title {
  color: var(--bl-accent);
}

.neighbor.disabled .neighbor-title {
  color: var(--bl-text-3);
  font-weight: 400;
}
</style>
