<script setup lang="ts">
defineProps<{
  posts: Array<{
    title: string
    url: string
    date: Date
    excerpt: string
    tags: string[]
    categories?: string[]
    pinned?: boolean
    cover?: string
  }>
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
  <div class="post-list">
    <article v-for="post in posts" :key="post.url" class="post-item" :class="{ pinned: post.pinned }">
      <div class="post-title-row">
        <span v-if="post.pinned" class="pin-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7 7.5 1.5-5.5 5.5L18 22l-6-3-6 3 1-6-5.5-5.5L9 9z"/></svg>
          置顶
        </span>
        <a :href="post.url" class="post-title">{{ post.title }}</a>
      </div>
      <div class="post-meta">
        <time>{{ formatDate(post.date) }}</time>
        <span v-if="post.categories?.length" class="post-categories">
          <span v-for="cat in post.categories" :key="cat" class="post-category">{{ cat }}</span>
        </span>
      </div>
      <div v-if="post.tags.length" class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
      </div>
      <p v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt" />
    </article>
  </div>
</template>

<style scoped>
.post-list {
  width: 100%;
}

.post-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.post-item:last-child {
  border-bottom: none;
}

.post-item.pinned {
  padding-left: 1rem;
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  margin-left: -1rem;
  padding-right: 1rem;
  border-radius: 0 6px 6px 0;
}

.post-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.4;
}

.post-title:hover {
  color: var(--vp-c-brand-1);
}

.pin-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--vp-c-brand-1);
  color: #fff;
  border-radius: 4px;
  padding: 0.15em 0.5em;
  opacity: 0.88;
  white-space: nowrap;
  flex-shrink: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.4rem;
}

.post-categories {
  display: flex;
  gap: 0.4rem;
}

.post-category {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.1em 0.5em;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 500;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.post-tag {
  background: var(--vp-c-default-soft);
  padding: 0.15em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
  color: var(--vp-c-text-2);
}

.post-excerpt {
  margin-top: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.93rem;
  line-height: 1.65;
}
</style>
