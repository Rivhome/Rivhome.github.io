---
layout: page
---

<script setup>
import { data as posts } from '.vitepress/posts.data'
import PostList from '.vitepress/theme/PostList.vue'
</script>

<div class="blog-home">
  <h1 class="blog-title">Rivhome's Blog</h1>
  <p class="blog-subtitle">changing world, one line of code at a time</p>
  <PostList :posts="posts" />
</div>
