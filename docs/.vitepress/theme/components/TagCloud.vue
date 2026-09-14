<script setup lang="ts">
import { computed } from 'vue'

interface TagInfo {
  name: string
  count: number
}

const props = defineProps<{
  tags: Record<string, Array<{ title: string; url: string; date: Date }>>
  activeTag?: string
}>()

const emit = defineEmits<{
  'select-tag': [tag: string]
}>()

const tagList = computed<TagInfo[]>(() => {
  return Object.entries(props.tags)
    .map(([name, posts]) => ({ name, count: posts.length }))
    .sort((a, b) => b.count - a.count)
})

function selectTag(tag: string) {
  emit('select-tag', props.activeTag === tag ? '' : tag)
}
</script>

<template>
  <nav class="tag-filters" aria-label="标签筛选" v-if="tagList.length > 0">
    <button
      class="filter-item"
      :class="{ active: !activeTag }"
      @click="emit('select-tag', '')"
    >
      全部
    </button>
    <button
      v-for="tag in tagList"
      :key="tag.name"
      class="filter-item"
      :class="{ active: activeTag === tag.name }"
      @click="selectTag(tag.name)"
    >
      #{{ tag.name }} <sup class="count">{{ tag.count }}</sup>
    </button>
  </nav>
</template>

<style scoped>
.tag-filters {
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
