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

const maxCount = computed(() => {
  if (tagList.value.length === 0) return 1
  return Math.max(...tagList.value.map(t => t.count))
})

function fontSize(count: number): string {
  const min = 0.75
  const max = 1.5
  if (maxCount.value <= 1) return `${max}rem`
  return `${min + ((count - 1) / (maxCount.value - 1)) * (max - min)}rem`
}

function isActive(tag: string): boolean {
  return props.activeTag === tag
}

function selectTag(tag: string) {
  if (props.activeTag === tag) {
    emit('select-tag', '')
  } else {
    emit('select-tag', tag)
  }
}
</script>

<template>
  <div class="tag-cloud" v-if="tagList.length > 0">
    <span
      v-for="tag in tagList"
      :key="tag.name"
      class="tag-item"
      :class="{ active: isActive(tag.name) }"
      :style="{ fontSize: fontSize(tag.count) }"
      @click="selectTag(tag.name)"
    >
      {{ tag.name }}
      <sup class="tag-count">{{ tag.count }}</sup>
    </span>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 0.25rem;
  justify-content: center;
  padding: 0.5rem 0;
}

.tag-item {
  display: inline-flex;
  align-items: flex-start;
  padding: 0.2em 0.6em;
  border-radius: 6px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  white-space: nowrap;
  line-height: 1.5;
}

.tag-item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}

.tag-item.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.tag-count {
  font-size: 0.6em;
  opacity: 0.7;
  margin-left: 1px;
}
</style>
