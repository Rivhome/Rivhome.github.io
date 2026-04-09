---
layout: page
title: 标签
---

<script setup>
import { data as tags } from '.vitepress/tags.data'

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<div class="archives-page">
  <h1>标签</h1>
  <div class="tag-groups">
    <div v-for="(posts, tag) in tags" :key="tag" class="tag-section">
      <h2>
        <span class="tag-name">{{ tag }}</span>
        <span class="tag-count">{{ posts.length }} 篇</span>
      </h2>
      <ul>
        <li v-for="post in posts" :key="post.url">
          <time>{{ formatDate(post.date) }}</time>
          <a :href="post.url">{{ post.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</div>
