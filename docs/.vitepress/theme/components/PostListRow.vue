<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '../../lib/date'
import { slugForTag } from '../../taxonomy'
import type { PostView } from '../../lib/types'

const props = defineProps<{
  post: PostView
  /** true 时日期只显示 MM-DD（所在分组已表达年份） */
  short?: boolean
}>()

const label = computed(() => formatDate(props.post.date, !props.short))
const datetime = computed(() => {
  const d = new Date(props.post.date)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
})
</script>

<template>
  <li class="post-row">
    <time :datetime="datetime">{{ label }}</time>
    <div class="post-row-main">
      <a :href="post.url">{{ post.title }}</a>
      <ul v-if="post.tags.length > 0" class="row-tags">
        <li v-for="tag in post.tags" :key="tag">
          <a v-if="slugForTag(tag)" :href="`/tags/${slugForTag(tag)}`" class="row-tag">#{{ tag }}</a>
          <span v-else class="row-tag undeclared">#{{ tag }}</span>
        </li>
      </ul>
    </div>
  </li>
</template>

<style scoped>
.post-row {
  display: flex;
  align-items: baseline;
  gap: var(--bl-space-4);
  padding: 10px 0;
  border-bottom: 1px solid var(--bl-divider);
}

.post-row:last-child {
  border-bottom: none;
}

time {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
}

.post-row-main {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25em 0.75em;
  min-width: 0;
}

.post-row-main > a {
  color: var(--bl-text-1);
  text-decoration: none;
  font-size: var(--bl-text-body);
  line-height: 1.6;
  transition: color 0.2s;
}

.post-row-main > a:hover {
  color: var(--bl-accent);
}

.row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  list-style: none;
  margin: 0;
  padding: 0;
}

.row-tag {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.row-tag:hover {
  color: var(--bl-accent);
}

.undeclared {
  opacity: 0.7;
}
</style>
