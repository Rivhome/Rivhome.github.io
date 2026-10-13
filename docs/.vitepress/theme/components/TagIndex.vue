<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../posts.data'
import { allTags, slugForTag } from '../../taxonomy'

interface TagRow {
  name: string
  slug: string
  description?: string
  count: number
}

const rows = computed<TagRow[]>(() => {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = slugForTag(tag)
      if (!slug) continue
      counts.set(slug, (counts.get(slug) ?? 0) + 1)
    }
  }

  return allTags()
    .map((tag) => ({ ...tag, count: counts.get(tag.slug) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
})

const undeclared = computed(() => {
  const names = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!slugForTag(tag)) names.add(tag)
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

const totalUses = computed(() => rows.value.reduce((sum, row) => sum + row.count, 0))
</script>

<template>
  <div>
    <p class="tag-summary">
      共 {{ rows.length }} 个标签、{{ totalUses }} 次使用。
    </p>

    <ul class="tag-list">
      <li v-for="row in rows" :key="row.slug" class="tag-item">
        <a class="tag-name" :href="`/tags/${row.slug}`">#{{ row.name }}</a>
        <span class="tag-count">{{ row.count }} 篇</span>
        <span v-if="row.description" class="tag-description">{{ row.description }}</span>
      </li>
    </ul>

    <p v-if="undeclared.length > 0" class="undeclared-note">
      以下标签尚未在 <code>taxonomy.ts</code> 中声明，因此没有独立页面：
      {{ undeclared.map((name) => `#${name}`).join('、') }}
    </p>
  </div>
</template>

<style scoped>
.tag-summary {
  margin: 0 0 var(--bl-space-4);
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
}

.tag-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tag-item {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5em var(--bl-space-3);
  padding: 10px 0;
  border-bottom: 1px solid var(--bl-divider);
}

.tag-item:last-child {
  border-bottom: none;
}

.tag-name {
  font-size: var(--bl-text-body);
  color: var(--bl-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.tag-name:hover {
  color: var(--bl-accent);
}

.tag-count {
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  font-variant-numeric: tabular-nums;
}

.tag-description {
  flex-basis: 100%;
  font-size: var(--bl-text-small);
  color: var(--bl-text-2);
  line-height: 1.7;
}

.undeclared-note {
  margin: var(--bl-space-6) 0 0;
  font-size: var(--bl-text-meta);
  color: var(--bl-text-3);
  line-height: 1.7;
}
</style>
