<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as posts } from '../posts.data'
import PostList from './PostList.vue'
import Greeting from './components/Greeting.vue'

const selectedTag = ref('')
const selectedCategory = ref('')

// 筛选选项：分类 + 标签（按篇数排序）
const categoryOptions = computed(() => {
  const counts = new Map<string, number>()
  for (const p of posts) {
    for (const c of p.categories) counts.set(c, (counts.get(c) || 0) + 1)
  }
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!)
})

const tagOptions = computed(() => {
  const counts = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1)
  }
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!).slice(0, 8)
})

const filteredPosts = computed(() => {
  let result = posts
  if (selectedTag.value) {
    result = result.filter((p) => p.tags.includes(selectedTag.value))
  }
  if (selectedCategory.value) {
    result = result.filter((p) => p.categories.includes(selectedCategory.value))
  }
  return result
})

// 按年分组（年份倒序）
const grouped = computed(() => {
  const map = new Map<number, typeof posts>()
  for (const p of filteredPosts.value) {
    const year = new Date(p.date).getFullYear()
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(p)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})
</script>

<template>
  <div class="home-page">
    <Greeting />

    <!-- 筛选行：文字链接，激活项品牌色下划线 -->
    <nav
      v-if="categoryOptions.length > 0 || tagOptions.length > 0"
      class="filters"
      aria-label="文章筛选"
    >
      <button class="filter-item" :class="{ active: !selectedTag && !selectedCategory }" @click="selectedTag = ''; selectedCategory = ''">
        全部
      </button>
      <button
        v-for="cat in categoryOptions"
        :key="`c-${cat}`"
        class="filter-item"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = selectedCategory === cat ? '' : cat; selectedTag = ''"
      >
        {{ cat }}
      </button>
      <button
        v-for="tag in tagOptions"
        :key="`t-${tag}`"
        class="filter-item"
        :class="{ active: selectedTag === tag }"
        @click="selectedTag = selectedTag === tag ? '' : tag; selectedCategory = ''"
      >
        #{{ tag }}
      </button>
    </nav>

    <template v-if="grouped.length > 0">
      <section v-for="[year, yearPosts] in grouped" :key="year" class="year-section">
        <h2 class="year-heading">{{ year }}</h2>
        <PostList :posts="yearPosts" />
      </section>
    </template>

    <div v-else class="empty-state">
      <p>暂无文章</p>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: var(--bl-width-content);
  margin: 0 auto;
  padding: var(--bl-space-14) 24px 0;
}

/* --- 筛选行 --- */

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 2px var(--bl-space-4);
  margin-bottom: var(--bl-space-8);
}

.filter-item {
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

.filter-item:hover {
  color: var(--bl-accent);
}

.filter-item.active {
  color: var(--bl-accent);
  border-bottom-color: var(--bl-accent);
}

/* --- 年分组 --- */

.year-section {
  margin-bottom: var(--bl-space-10);
}

.year-section:last-child {
  margin-bottom: 0;
}

.year-heading {
  font-size: var(--bl-text-meta);
  font-weight: 500;
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  margin: 0 0 var(--bl-space-2);
}

.empty-state {
  text-align: center;
  padding: var(--bl-space-20) 0;
  color: var(--bl-text-3);
}

@media (max-width: 768px) {
  .home-page {
    padding: var(--bl-space-6) 20px 0;
  }
}
</style>
