<script setup lang="ts">
import { slugForTag } from '../../taxonomy'

defineProps<{
  tags: string[]
}>()
</script>

<template>
  <ul v-if="tags.length > 0" class="tag-chips">
    <li v-for="tag in tags" :key="tag">
      <a v-if="slugForTag(tag)" class="tag-chip" :href="`/tags/${slugForTag(tag)}`">#{{ tag }}</a>
      <span v-else class="tag-chip undeclared" :title="`标签「${tag}」尚未在 taxonomy.ts 中声明`">
        #{{ tag }}
      </span>
    </li>
  </ul>
</template>

<style scoped>
.tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bl-space-2) var(--bl-space-3);
  list-style: none;
  margin: 0;
  padding: 0;
}

.tag-chip {
  font-size: var(--bl-text-small);
  color: var(--bl-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.tag-chip:hover {
  color: var(--bl-accent);
}

.undeclared {
  color: var(--bl-text-3);
  cursor: help;
}
</style>
