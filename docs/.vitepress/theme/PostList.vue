<script setup lang="ts">
defineProps<{
  posts: Array<{
    title: string
    url: string
    date: Date
    excerpt: string
    tags: string[]
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
    <article v-for="post in posts" :key="post.url" class="post-item">
      <a :href="post.url" class="post-title">{{ post.title }}</a>
      <div class="post-meta">
        <time>{{ formatDate(post.date) }}</time>
        <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
      </div>
      <p v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt" />
    </article>
  </div>
</template>
