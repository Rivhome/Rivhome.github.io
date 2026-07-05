<script setup lang="ts">
import type { Post } from '../../posts.data'

defineProps<{
  posts: Post[]
}>()

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div class="changelog">
    <div class="timeline">
      <div v-for="post in posts" :key="post.url" class="timeline-item">
        <div class="timeline-dot" />
        <div class="timeline-content">
          <time>{{ formatDate(post.date) }}</time>
          <a :href="post.url" class="timeline-title">{{ post.title }}</a>
          <span v-if="post.categories.length" class="timeline-cat">
            {{ post.categories.join(' / ') }}
          </span>
          <div class="timeline-tags">
            <span v-for="tag in post.tags" :key="tag" class="timeline-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.changelog {
  max-width: 720px;
  margin: 0 auto;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--vp-c-divider);
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 3px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.timeline-content time {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.timeline-title:hover {
  color: var(--vp-c-brand-1);
}

.timeline-cat {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.timeline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.timeline-tag {
  font-size: 0.75rem;
  padding: 0.1em 0.5em;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
</style>
