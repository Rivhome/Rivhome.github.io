<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  categories: Record<string, Array<{ title: string; url: string; date: Date; tags: string[] }>>
  activeCategory?: string
}>()

const emit = defineEmits<{
  'select-category': [category: string]
}>()

const sortedCategories = computed(() =>
  Object.entries(props.categories).sort((a, b) => b[1].length - a[1].length),
)
</script>

<template>
  <nav class="category-filters" aria-label="分类筛选">
    <button
      class="filter-item"
      :class="{ active: !activeCategory }"
      @click="emit('select-category', '')"
    >
      全部
    </button>
    <button
      v-for="[name, list] in sortedCategories"
      :key="name"
      class="filter-item"
      :class="{ active: activeCategory === name }"
      @click="emit('select-category', activeCategory === name ? '' : name)"
    >
      {{ name }} <sup class="count">{{ list.length }}</sup>
    </button>
  </nav>
</template>

<style scoped>
.category-filters {
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

.count {
  font-size: 0.75em;
  color: var(--bl-text-3);
  margin-left: 2px;
}

.filter-item.active .count {
  color: var(--bl-accent);
  opacity: 0.75;
}
</style>
