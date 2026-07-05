<script setup lang="ts">
import { data as posts } from '../posts.data'
import { ref, computed } from 'vue'
import { usePagination } from './composables/usePagination'
import PostList from './PostList.vue'
import ProfileCard from './components/ProfileCard.vue'
import Pagination from './components/Pagination.vue'

const PAGE_SIZE = 10
const selectedTag = ref('')
const selectedCategory = ref('')

const filteredPosts = computed(() => {
  let result = posts
  if (selectedTag.value) {
    result = result.filter(p => p.tags.includes(selectedTag.value))
  }
  if (selectedCategory.value) {
    result = result.filter(p => p.categories.includes(selectedCategory.value))
  }
  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems,
  hasPrev,
  hasNext,
  goTo,
  nextPage,
  prevPage,
} = usePagination(filteredPosts, PAGE_SIZE)
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <ProfileCard />
    </section>

    <section class="posts-section">
      <div class="section-header">
        <h2>
          <span v-if="selectedTag || selectedCategory" class="filter-indicator">
            <span v-if="selectedTag">#{{ selectedTag }}</span>
            <span v-if="selectedCategory">{{ selectedCategory }}</span>
          </span>
          <span v-else>最新文章</span>
        </h2>
        <span
          v-if="selectedTag || selectedCategory"
          class="clear-filter"
          @click="selectedTag = ''; selectedCategory = ''"
        >清除筛选</span>
        <span class="post-count">{{ filteredPosts.length }} 篇文章</span>
      </div>

      <PostList :posts="paginatedItems" />

      <div v-if="filteredPosts.length === 0" class="empty-state">
        <p>暂无匹配的文章</p>
      </div>

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :has-prev="hasPrev"
        :has-next="hasNext"
        @go-to="goTo"
        @prev="prevPage"
        @next="nextPage"
      />
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.hero-section {
  margin-bottom: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
}

.posts-section {
  margin-top: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.section-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.15em 0.6em;
  border-radius: 6px;
  font-size: 0.85em;
}

.clear-filter {
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  text-decoration: underline;
}

.clear-filter:hover {
  opacity: 0.7;
}

.post-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .home-page {
    padding: 1rem 1rem 3rem;
  }
}
</style>
