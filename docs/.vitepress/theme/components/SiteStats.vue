<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { SiteStats } from '../../lib/types'

const { frontmatter } = useData()

// 构建期由 config.ts 的 transformPageData 注入
const stats = computed(() => frontmatter.value.stats as SiteStats | undefined)

const numbers = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { value: s.posts.toLocaleString('zh-CN'), label: '篇文章' },
    { value: s.words.toLocaleString('zh-CN'), label: '总字数' },
    { value: s.series.toLocaleString('zh-CN'), label: '个合集' },
    { value: s.tags.toLocaleString('zh-CN'), label: '个标签' },
  ]
})
</script>

<template>
  <div v-if="stats" class="site-stats">
    <div class="stats-row">
      <div v-for="item in numbers" :key="item.label" class="stat">
        <span class="stat-value">{{ item.value }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>
    <p v-if="stats.firstDate" class="stats-note">最早的文章发布于 {{ stats.firstDate }}</p>
    <p v-if="stats.latestDate" class="stats-note">最近一次更新在 {{ stats.latestDate }}</p>
  </div>
</template>

<style scoped>
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bl-space-4) var(--bl-space-8);
  margin: var(--bl-space-4) 0 0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--bl-text-1);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.stats-note {
  margin: var(--bl-space-3) 0 0;
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}
</style>
