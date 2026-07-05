<script setup lang="ts">
const props = defineProps<{
  categories: Record<string, Array<{ title: string; url: string; date: Date; tags: string[] }>>
  activeCategory?: string
}>()

const emit = defineEmits<{
  'select-category': [category: string]
}>()

const sortedCategories = Object.entries(props.categories).sort((a, b) => b[1].length - a[1].length)

const colors = ['#3b5998', '#e74c3c', '#27ae60', '#f39c12', '#8e44ad', '#16a085', '#d35400', '#2980b9']

function categoryColor(index: number): string {
  return colors[index % colors.length]
}

function selectCategory(cat: string) {
  emit('select-category', props.activeCategory === cat ? '' : cat)
}
</script>

<template>
  <div class="category-grid">
    <div
      v-for="(entry, index) in sortedCategories"
      :key="entry[0]"
      class="category-card"
      :class="{ active: activeCategory === entry[0] }"
      @click="selectCategory(entry[0])"
    >
      <div class="category-accent" :style="{ background: categoryColor(index) }" />
      <div class="category-content">
        <span class="category-name">{{ entry[0] }}</span>
        <span class="category-count">{{ entry[1].length }} 篇</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.category-card {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.category-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-card.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.category-accent {
  width: 4px;
  flex-shrink: 0;
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
}

.category-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.category-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}
</style>
