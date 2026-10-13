<script setup lang="ts">
import { computed, ref } from 'vue'
import { SITE } from '../../site'
import { formatDate } from '../../lib/date'
import type { PostView } from '../../lib/types'

const props = defineProps<{
  posts: PostView[]
}>()

const mode = ref<'published' | 'updated'>('published')

const recentPublished = computed(() => props.posts.slice(0, SITE.recentCount))

const recentUpdated = computed(() =>
  props.posts
    .filter((post) => post.updated)
    .slice()
    .sort(
      (a, b) =>
        new Date(String(b.updated)).getTime() - new Date(String(a.updated)).getTime(),
    )
    .slice(0, SITE.recentCount),
)

const rows = computed(() =>
  mode.value === 'updated' ? recentUpdated.value : recentPublished.value,
)

const hasUpdated = computed(() => recentUpdated.value.length > 0)

function dateOf(post: PostView): string | Date {
  return mode.value === 'updated' && post.updated ? post.updated : post.date
}
</script>

<template>
  <div class="recent">
    <div class="recent-tabs">
      <button
        type="button"
        class="recent-tab"
        :class="{ active: mode === 'published' }"
        @click="mode = 'published'"
      >
        最近发表
      </button>
      <button
        v-if="hasUpdated"
        type="button"
        class="recent-tab"
        :class="{ active: mode === 'updated' }"
        @click="mode = 'updated'"
      >
        最近更新
      </button>
    </div>

    <ul class="recent-list">
      <li v-for="post in rows" :key="post.url">
        <time>{{ formatDate(dateOf(post)) }}</time>
        <a :href="post.url">{{ post.title }}</a>
      </li>
    </ul>

    <p v-if="rows.length === 0" class="blog-empty">暂无内容。</p>
  </div>
</template>

<style scoped>
.recent-tabs {
  display: flex;
  gap: var(--bl-space-4);
  margin-bottom: var(--bl-space-2);
}

.recent-tab {
  appearance: none;
  border: none;
  background: none;
  padding: 2px 0;
  font-family: inherit;
  font-size: var(--bl-text-small);
  color: var(--bl-text-2);
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.recent-tab:hover {
  color: var(--bl-accent);
}

.recent-tab.active {
  color: var(--bl-accent);
  border-bottom-color: var(--bl-accent);
}

.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.recent-list li {
  display: flex;
  align-items: baseline;
  gap: var(--bl-space-4);
  padding: 10px 0;
  border-bottom: 1px solid var(--bl-divider);
}

.recent-list li:last-child {
  border-bottom: none;
}

.recent-list time {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
}

.recent-list a {
  color: var(--bl-text-1);
  text-decoration: none;
  font-size: var(--bl-text-body);
  line-height: 1.6;
  transition: color 0.2s;
}

.recent-list a:hover {
  color: var(--bl-accent);
}
</style>
