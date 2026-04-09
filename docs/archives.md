---
layout: page
title: 归档
---

<script setup>
import { data as posts } from '.vitepress/posts.data'

const grouped = posts.reduce((acc, post) => {
  const year = new Date(post.date).getFullYear()
  if (!acc[year]) acc[year] = []
  acc[year].push(post)
  return acc
}, {})

const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<div class="archives-page">
  <h1>归档</h1>
  <p class="archive-summary">共 {{ posts.length }} 篇文章</p>
  <div v-for="year in years" :key="year" class="archive-year">
    <h2>{{ year }}</h2>
    <ul>
      <li v-for="post in grouped[year]" :key="post.url">
        <time>{{ formatDate(post.date) }}</time>
        <a :href="post.url">{{ post.title }}</a>
      </li>
    </ul>
  </div>
</div>

<style scoped>
.archive-summary {
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}
</style>
