---
layout: doc
title: 分类
aside: false
---

<script setup lang="ts">
import { data as categories } from '.vitepress/categories.data'
import { ref, computed, onMounted } from 'vue'

const activeCategory = ref('')

// 支持 /categories?id=xxx 深链（文章详情页的分类链接会带此参数）
onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id')
  if (id && categories[id]) {
    activeCategory.value = id
  }
})

const filteredCategories = computed(() => {
  if (!activeCategory.value) return categories
  const result: typeof categories = {}
  result[activeCategory.value] = categories[activeCategory.value]
  return result
})
</script>

<div class="categories-page">
  <div class="page-header">
    <h1>分类</h1>
    <p class="page-summary">共 {{ Object.keys(categories).length }} 个分类</p>
  </div>

  <CategoryList
    :categories="categories"
    :active-category="activeCategory"
    @select-category="(c) => (activeCategory = c)"
  />

  <div class="category-detail" v-if="Object.keys(filteredCategories).length > 0">
    <div v-for="(posts, cat) in filteredCategories" :key="cat" class="category-section">
      <h2 class="section-heading">
        {{ cat }}
        <span class="section-count">{{ posts.length }} 篇</span>
      </h2>
      <ul class="post-rows">
        <PostRow
          v-for="post in posts"
          :key="post.url"
          :url="post.url"
          :title="post.title"
          :date="post.date"
        />
      </ul>
    </div>
  </div>

  <div v-if="Object.keys(categories).length === 0" class="empty-state">
    <p>暂无分类数据</p>
  </div>
</div>

<style scoped>
.categories-page {
  padding: var(--bl-space-10) 0 0;
}

.page-header h1 {
  margin: 0;
}

.page-summary {
  color: var(--bl-text-3);
  font-size: var(--bl-text-meta);
  margin: 4px 0 0;
}

.category-section {
  margin-top: 2.5rem;
}

.section-heading {
  font-size: var(--bl-text-meta);
  font-weight: 500;
  color: var(--bl-text-3);
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 var(--bl-space-2);
}

.section-count {
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

.post-rows {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: var(--bl-space-20) 0;
  color: var(--bl-text-3);
}
</style>
