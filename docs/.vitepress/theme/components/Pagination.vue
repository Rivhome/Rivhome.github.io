<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}>()

const emit = defineEmits<{
  'go-to': [page: number]
  prev: []
  next: []
}>()

function visiblePages(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: number[] = [1]
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)
  if (current <= 3) end = Math.min(5, total - 1)
  if (current >= total - 2) start = Math.max(total - 4, 2)
  if (start > 2) pages.push(-1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push(-2)
  pages.push(total)
  return pages
}
</script>

<template>
  <div class="pagination" v-if="totalPages > 1">
    <button class="page-btn" :disabled="!hasPrev" @click="emit('prev')" title="上一页">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <template v-for="page in visiblePages(currentPage, totalPages)" :key="page">
      <span v-if="page < 0" class="page-ellipsis">&hellip;</span>
      <button
        v-else
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="emit('go-to', page)"
      >{{ page }}</button>
    </template>
    <button class="page-btn" :disabled="!hasNext" @click="emit('next')" title="下一页">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 2rem 0;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.page-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-ellipsis {
  padding: 0 0.25rem;
  color: var(--vp-c-text-3);
  user-select: none;
}
</style>
