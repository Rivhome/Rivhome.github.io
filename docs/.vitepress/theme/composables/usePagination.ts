import { computed, ref, type Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]>, pageSize: number = 10) {
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(items.value.length / pageSize))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  const hasPrev = computed(() => currentPage.value > 1)
  const hasNext = computed(() => currentPage.value < totalPages.value)

  function goTo(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function nextPage() {
    if (hasNext.value) goTo(currentPage.value + 1)
  }

  function prevPage() {
    if (hasPrev.value) goTo(currentPage.value - 1)
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    hasPrev,
    hasNext,
    goTo,
    nextPage,
    prevPage,
  }
}
