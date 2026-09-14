<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../../posts.data'

const route = useRoute()

// posts.data 已按 pinned 优先 + 日期倒序排列；
// 下一篇 = 更新的一篇，上一篇 = 更旧的一篇
const index = computed(() => {
  const path = decodeURIComponent(route.path.replace(/\.html$/, ''))
  return posts.findIndex((p) => p.url === path)
})

const newer = computed(() => (index.value > 0 ? posts[index.value - 1] : undefined))
const older = computed(() => (index.value >= 0 ? posts[index.value + 1] : undefined))
</script>

<template>
  <nav v-if="newer || older" class="post-neighbors" aria-label="相邻文章">
    <div class="neighbor">
      <a v-if="newer" :href="newer.url" class="neighbor-link">
        <span class="neighbor-label">较新的一篇</span>
        <span class="neighbor-title">{{ newer.title }}</span>
      </a>
    </div>
    <div class="neighbor neighbor-right">
      <a v-if="older" :href="older.url" class="neighbor-link">
        <span class="neighbor-label">较旧的一篇</span>
        <span class="neighbor-title">{{ older.title }}</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.post-neighbors {
  display: flex;
  justify-content: space-between;
  gap: var(--bl-space-4);
  margin-top: var(--bl-space-10);
  padding-top: var(--bl-space-6);
  border-top: 1px solid var(--bl-divider);
}

.neighbor {
  flex: 1;
  min-width: 0;
}

.neighbor-right {
  text-align: right;
}

.neighbor-link {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  max-width: 100%;
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
}

.neighbor-link:hover .neighbor-title {
  color: var(--bl-accent);
}

.neighbor-right .neighbor-link {
  align-items: flex-end;
}
</style>
