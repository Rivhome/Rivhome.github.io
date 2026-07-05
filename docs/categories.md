---
layout: doc
title: 分类
aside: false
---

<script setup lang="ts">
import { data as categories } from '.vitepress/categories.data'
import { ref, computed } from 'vue'

const activeCategory = ref('')

const filteredCategories = computed(() => {
  if (!activeCategory.value) return categories
  const result: typeof categories = {}
  result[activeCategory.value] = categories[activeCategory.value]
  return result
})

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<div class="categories-page">
  <div class="page-header">
    <h1>分类</h1>
    <p class="page-summary">共 {{ Object.keys(categories).length }} 个分类</p>
  </div>

  <div class="category-grid-wrapper">
    <CategoryList :categories="categories" :active-category="activeCategory" @select-category="(c) => activeCategory = c" />
  </div>

  <div class="category-detail" v-if="Object.keys(filteredCategories).length > 0">
    <div v-for="(posts, cat) in filteredCategories" :key="cat" class="category-section">
      <h2>
        <span class="cat-name">{{ cat }}</span>
        <span class="cat-count">{{ posts.length }} 篇</span>
      </h2>
      <ul class="cat-posts">
        <li v-for="post in posts" :key="post.url">
          <time>{{ formatDate(post.date) }}</time>
          <a :href="post.url">{{ post.title }}</a>
          <div class="cat-tags">
            <span v-for="tag in post.tags" :key="tag" class="cat-tag">{{ tag }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div v-if="Object.keys(categories).length === 0" class="empty-state">
    <p>暂无分类数据</p>
  </div>
</div>

<style scoped>
.categories-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.page-summary {
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
  margin: 0;
}

.category-grid-wrapper {
  margin-bottom: 2.5rem;
}

.category-detail {
  margin-top: 1rem;
}

.category-section {
  margin-bottom: 2.5rem;
}

.category-section h2 {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 1.3rem;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  margin-bottom: 0.75rem;
}

.cat-name {
  color: var(--vp-c-text-1);
}

.cat-count {
  font-size: 0.75em;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.cat-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cat-posts li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.cat-posts li:last-child {
  border-bottom: none;
}

.cat-posts time {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 6rem;
}

.cat-posts a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  flex: 1;
}

.cat-posts a:hover {
  color: var(--vp-c-brand-1);
}

.cat-tags {
  display: flex;
  gap: 0.35rem;
}

.cat-tag {
  font-size: 0.75rem;
  padding: 0.1em 0.5em;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .categories-page {
    padding: 1rem 1rem 3rem;
  }
  .cat-posts li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
}
</style>
