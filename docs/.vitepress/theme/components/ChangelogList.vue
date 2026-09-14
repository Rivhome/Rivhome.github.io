<script setup lang="ts">
import type { Post } from '../../posts.data'
import { formatDate } from '../utils/format-date'

defineProps<{
  posts: Post[]
}>()
</script>

<template>
  <div class="changelog">
    <div class="timeline">
      <div v-for="post in posts" :key="post.url" class="timeline-item">
        <span class="timeline-dot" />
        <div class="timeline-content">
          <time>{{ formatDate(post.updated || post.date) }}</time>
          <a :href="post.url" class="timeline-title">{{ post.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  padding-left: 24px;
}

/* 竖向细线 */
.timeline::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--bl-divider);
}

.timeline-item {
  position: relative;
  padding-bottom: 1.25rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

/* 空心圆点，与竖线同心 */
.timeline-dot {
  position: absolute;
  left: -24px;
  top: 7px;
  width: 7px;
  height: 7px;
  border-radius: var(--bl-radius-full);
  background: var(--bl-bg);
  border: 1.5px solid var(--bl-accent);
  box-sizing: border-box;
}

.timeline-content {
  display: flex;
  align-items: baseline;
  gap: var(--bl-space-4);
}

.timeline-content time {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
}

.timeline-title {
  color: var(--bl-text-1);
  text-decoration: none;
  font-size: var(--bl-text-body);
  line-height: 1.6;
  transition: color 0.2s;
}

.timeline-title:hover {
  color: var(--bl-accent);
}
</style>
