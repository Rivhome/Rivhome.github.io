<script setup lang="ts">
import type { PostLink } from '../../lib/types'

defineProps<{
  items: PostLink[]
}>()
</script>

<template>
  <section v-if="items.length > 0" class="related">
    <h2 class="related-heading">相关文章</h2>
    <ul class="related-list">
      <li v-for="item in items" :key="item.url">
        <a :href="item.url">{{ item.title }}</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.related {
  margin-top: var(--bl-space-10);
}

.related-heading {
  font-size: var(--bl-text-meta);
  font-weight: 500;
  color: var(--bl-text-3);
  letter-spacing: 0.02em;
  margin: 0 0 var(--bl-space-2);
  border: none;
  padding: 0;
}

.related-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.related-list li {
  padding: 6px 0;
  border-bottom: 1px solid var(--bl-divider);
}

.related-list li:last-child {
  border-bottom: none;
}

.related-list a {
  color: var(--bl-text-1);
  text-decoration: none;
  font-size: var(--bl-text-body);
  line-height: 1.6;
  transition: color 0.2s;
}

.related-list a:hover {
  color: var(--bl-accent);
}
</style>
