<script setup lang="ts">
import { data as posts } from '../../posts.data'
import { buildSeries } from '../../lib/series'
import Greeting from './Greeting.vue'
import RecentPosts from './RecentPosts.vue'
import SeriesCard from './SeriesCard.vue'
import PostList from './PostList.vue'
import PostListRow from './PostListRow.vue'

const pinned = posts.filter((post) => post.pinned)
const series = buildSeries(posts)

// 按年分组（年份倒序，组内保持 posts.data 的「置顶优先 + 日期倒序」顺序）
const byYear = (() => {
  const map = new Map<number, typeof posts>()
  for (const post of posts) {
    const year = new Date(post.date).getFullYear()
    const list = map.get(year) ?? []
    list.push(post)
    map.set(year, list)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})()
</script>

<template>
  <div class="blog-home">
    <Greeting />

    <section v-if="pinned.length > 0" class="home-section">
      <h2 class="blog-section-heading">置顶</h2>
      <PostList :posts="pinned" />
    </section>

    <section class="home-section">
      <h2 class="blog-section-heading">最近</h2>
      <RecentPosts :posts="posts" />
    </section>

    <section v-if="series.length > 0" class="home-section">
      <h2 class="blog-section-heading">合集</h2>
      <SeriesCard v-for="item in series" :key="item.slug" :series="item" />
      <p class="section-more"><a href="/series/">全部合集 →</a></p>
    </section>

    <section class="home-section">
      <h2 class="blog-section-heading">全部文章</h2>

      <div v-for="[year, list] in byYear" :key="year" class="year-group">
        <h3 class="year-heading">
          {{ year }}
          <span class="year-count">{{ list.length }} 篇</span>
        </h3>
        <ul class="post-rows">
          <PostListRow v-for="post in list" :key="post.url" :post="post" short />
        </ul>
      </div>

      <p v-if="posts.length === 0" class="blog-empty">还没有文章。</p>
    </section>
  </div>
</template>

<style scoped>
.blog-home {
  max-width: var(--bl-width-content);
  margin: 0 auto;
  padding: var(--bl-space-14) 24px 0;
}

.home-section {
  margin-bottom: var(--bl-space-14);
}

.home-section:last-child {
  margin-bottom: 0;
}

.section-more {
  margin: var(--bl-space-3) 0 0;
  font-size: var(--bl-text-small);
}

.section-more a {
  color: var(--bl-text-3);
  text-decoration: none;
}

.section-more a:hover {
  color: var(--bl-accent);
}

.year-group {
  margin-bottom: var(--bl-space-6);
}

.year-group:last-child {
  margin-bottom: 0;
}

.year-heading {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 var(--bl-space-2);
  font-size: var(--bl-text-meta);
  font-weight: 500;
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.year-count {
  font-weight: 400;
}

.post-rows {
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .blog-home {
    padding: var(--bl-space-8) 20px 0;
  }
}
</style>
