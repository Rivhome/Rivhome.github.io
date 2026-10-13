<script setup lang="ts">
import type { PostLink } from '../../lib/types'

// 相邻文章在构建期算好并随 front matter 注入，
// 因此文章页不需要 import 整份 posts 索引（见 config.ts 的 transformPageData）
defineProps<{
  newer?: PostLink
  older?: PostLink
}>()
</script>

<template>
  <nav v-if="newer || older" class="post-nav" aria-label="相邻文章">
    <div class="neighbor">
      <a v-if="newer" class="neighbor-link" :href="newer.url">
        <span class="neighbor-label">较新的一篇</span>
        <span class="neighbor-title">{{ newer.title }}</span>
      </a>
    </div>
    <div class="neighbor neighbor-right">
      <a v-if="older" class="neighbor-link" :href="older.url">
        <span class="neighbor-label">较旧的一篇</span>
        <span class="neighbor-title">{{ older.title }}</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.post-nav {
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
